const { app, screen, nativeImage, Tray, Menu } = require('electron');
const { exec } = require('child_process');

const os = require('os');
const si = require('systeminformation');
const path = require('path');
const fs = require('fs');

async function onGetSystemInfo() {
    
  const hostname = os.hostname();
  const net = os.networkInterfaces();
  const cpu = await si.cpu();
  const temp = await si.cpuTemperature();
  const mem = await si.mem();
  const disk = await si.fsSize();
  const osInfo = await si.osInfo();
  const system = await si.system();
  const display = screen.getPrimaryDisplay();
  const graphics = await si.graphics();

  return {
    hostname,
    ip: Object.values(net)
      .flat()
      .filter(i => i.family === 'IPv4' && !i.internal)[0]?.address || 'N/A',
    cpu: cpu.manufacturer + ' ' + cpu.brand,
    cpuTemp: temp.main,
    ram: (mem.total / 1e9).toFixed(2) + ' GB',
    disk: disk.map(d => ({ mount: d.mount, size: (d.size / 1e9).toFixed(1) + ' GB' })),
    os: osInfo.distro + ' ' + osInfo.release,
    serial: system.uuid,
    browserVersion: process.versions.chrome,
    screen: {
      width: display.size.width,
      height: display.size.height
    },
    graphics: graphics,
    coords: null, // placeholder, will be filled by renderer
    appVersion: app.getVersion()
  };
}

async function onSystemCommand(action, appName) {
    const commands = {
        shutdown: "shutdown -s -t 0",
        restart: "shutdown -r -t 0",
        open: `start ${appName}`,
        close: `taskkill /IM ${appName}.exe /F`,
    };
    return new Promise((resolve, reject) => {
        exec(commands[action], (err) => {
            if (err) reject("Failed");
            else resolve("OK");
        });
    });
}

function onCreateTray(window) {
    return new Promise((resolve, reject) => {
        try {
            const icon = path.join(__dirname, '../assets/favicon.png');
            const trayIcon = nativeImage.createFromPath(icon);
            const tray = new Tray(trayIcon);

            const contextMenu = Menu.buildFromTemplate([
                {
                    label: 'Show App',
                    click: () => window.show()
                },
                {
                    label: 'Exit App',
                    click: () => {
                        app.isQuiting = true;
                        tray.destroy();
                        app.quit();
                    }
                }
            ])

            tray.setToolTip('VCastPlay');
            tray.setContextMenu(contextMenu);

            resolve(tray);

        } catch (error) {
            reject(error);
        }
    })
}


async function onTakeScreenShot() {
  const sources = await desktopCapturer.getSources({ types: ['window', 'screen'] });

  for (const source of sources) {
    if (source.name === 'Entire Screen' || source.name === 'Screen 1') {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: {
          mandatory: {
            chromeMediaSource: 'desktop',
            chromeMediaSourceId: source.id
          }
        }
      });

      const video = document.createElement('video');
      video.srcObject = stream;
      await video.play();

      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      const image = canvas.toDataURL('image/png');
      stream.getTracks()[0].stop();

      console.log(image);
      
      return image;
    }
  }
}

function onDeleteFolder(folderName) {
  return new Promise((resolve, reject) => {
    const downloadDir = path.join(app.getPath("downloads"), folderName);
    fs.stat(downloadDir, (err, stats) => {
      if (err && err.code === 'ENOENT') {
        resolve(`${downloadDir} does not exist`);
      } else if (err) {
        reject(err);
      } else {
        fs.rm(downloadDir, { recursive: true, force: true }, (err) => {
          if (err) reject(err);
          else resolve(`${downloadDir} deleted successfully`);
        });
      }
    });
  })
}

module.exports = { onGetSystemInfo, onSystemCommand, onCreateTray, onTakeScreenShot, onDeleteFolder };