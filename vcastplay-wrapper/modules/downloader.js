const { app, net } = require('electron');
const fs = require("fs");
const path = require('path');
const https = require("https");

/**
 * Handles download of files from the given list.
 * Creates a downloads directory named "vcastplay" if it does not exist.
 * Downloads each file from the list and sends a "downloadProgress" event to the main process.
 * If a file already exists, it sends a "downloadProgress" event with the status "exists" and does not download the file.
 * After all files have been downloaded, it returns the path to the downloads directory.
 * @param {Event} event The event object sent from the main process.
 * @param {Object[]} files A list of objects containing information about the files to download.
 * @returns {string} The path to the downloads directory.
 */
async function onHandleDownloadFiles(event, filesToDownload) {
    const downloadResults = [];
    const downloadsDirectory = path.join(app.getPath("downloads"), "vcastplay");

    if (!fs.existsSync(downloadsDirectory)) {
        fs.mkdirSync(downloadsDirectory, { recursive: true });
    }

    for (const fileToDownload of filesToDownload) {
        const filePath = path.join(downloadsDirectory, fileToDownload.name);

        if (fs.existsSync(filePath)) {
            event.sender.send('downloadProgress', {
                file: fileToDownload.name,
                status: 'exists'
            });
            continue;
        }

        await onDownloadFile(fileToDownload.link, filePath, (percentageComplete) => {
            event.sender.send('downloadProgress', {
                file: fileToDownload.name,
                status: 'downloading',
                percentage: percentageComplete
            });
        });

        event.sender.send('downloadProgress', {
            file: fileToDownload.name,
            status: 'done'
        });
        downloadResults.push(filePath);
    }

    return { info: 'All files downloaded', files: downloadResults };
}

/**
 * Downloads a file from the given url and saves it to the given destination.
 * @param {string} url The url of the file to download.
 * @param {string} destination The path to save the downloaded file to.
 * @param {function} onProgressCallback An optional callback to receive progress updates.
 * @returns {Promise} A promise that resolves when the file has been downloaded, or rejects with an error if the download fails.
 */
function onDownloadFile(url, destination, onProgressCallback) {
    return new Promise((resolve, reject) => {
        try {
            const fileStream = fs.createWriteStream(destination);
            
            https.get(url, (response) => {
                if (response.statusCode !== 200) {
                    reject(new Error(`Failed to download file, status code: ${response.statusCode}`));
                    return;
                }

                const contentLength = parseInt(response.headers["content-length"], 10);
                let totalBytesReceived = 0;

                response.on("data", (chunk) => {
                    totalBytesReceived += chunk.length;
                    if (contentLength && onProgressCallback) {
                        const percentageComplete = Math.round((totalBytesReceived / contentLength) * 100);
                        onProgressCallback(percentageComplete);
                    }
                });

                response.pipe(fileStream);
                fileStream.on("finish", () => {
                    fileStream.close(resolve);
                }).on("error", (error) => {
                    fs.unlink(destination, () => reject(error));
                });
            });
        } catch (error) {
            reject('onDownLoadFile: 2 ' + error);
        }
    });
}

module.exports = { onHandleDownloadFiles, onDownloadFile };