const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('system', {
  control: (action, appName) => ipcRenderer.invoke('control', action, appName),
  getSystemInfo: () => ipcRenderer.invoke('getSystemInfo'),
});
