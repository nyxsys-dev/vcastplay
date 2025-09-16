const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld('system', {
  control: (action, appName) => ipcRenderer.invoke('control', action, appName),
  getSystemInfo: () => ipcRenderer.invoke('getSystemInfo'),
  checkForUpdates: () => ipcRenderer.send('check-for-updates'),
  // onUpdateAvailable: (callback) => ipcRenderer.on('update_available', callback),
  // onUpdateDownloaded: (callback) => ipcRenderer.on('update_downloaded', callback),
  restartApp: () => ipcRenderer.send('restart_app'),
  takeScreenshot: () => ipcRenderer.invoke('takeScreenshot'),
  downloadFiles: (files) => ipcRenderer.invoke('downloadFiles', files),
  onDownloadProgress: (callback) => ipcRenderer.on('downloadProgress', (_, data) => callback(data)),
  onDeleteFolder: (filePath) => ipcRenderer.invoke('onDeleteFolder', filePath),
  isElectron: true
});
