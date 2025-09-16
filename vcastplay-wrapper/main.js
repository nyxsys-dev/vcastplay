const { app, BrowserWindow, ipcMain, Menu, session } = require('electron');
const { autoUpdater } = require('electron-updater');
const log = require('electron-log');
const path = require('path');

const systemFunc = require('./modules/system')
const updater = require('./modules/autoUpdater');
const downloader = require("./modules/downloader");

const isDev = !app.isPackaged;

let win;

/**
 * Creates a new browser window with the specified configuration.
 * The window is initialized in fullscreen mode and uses a preload script.
 * In production, it loads the built Angular app from the local filesystem.
 * In development, it connects to the Angular live server at localhost:4200.
 */

function createWindow() {
  win = new BrowserWindow({
    fullscreen: !isDev,
    contextIsolation: false,
    autoHideMenuBar: true,
    icon: path.join(__dirname, 'assets/favicon.png'),
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  if (isDev) {
    // 🟢 DEV: Use Angular live server
    win.loadURL('http://localhost:4200');
    win.webContents.openDevTools();
  } else {
    // 🟢 PROD: Use built Angular app
    win.loadFile('dist/player/browser/index.html');
    
    // Disable dev tools
    win.webContents.on('devtools-opened', () => {
      win.webContents.closeDevTools();
    });

    // Disable menu
    Menu.setApplicationMenu(null);

    updater.onSetupAutoUpdate();
  }

  win.on('close', (event) => {
    if (!app.isQuiting) {
      event.preventDefault();
      win.hide();
    }
  })

  systemFunc.onCreateTray(win).then(tray => {
    tray.on('click', () => {
      win.isVisible() ? win.hide() : win.show();
    });
  });
}

ipcMain.handle('control', async (_event, action, appName) => {
  return await systemFunc.onSystemCommand(action, appName);
});

ipcMain.handle('getSystemInfo', async () => {
  return await systemFunc.onGetSystemInfo();
});

ipcMain.handle('takeScreenshot', async () => {
  return await systemFunc.onTakeScreenShot();
});

ipcMain.handle('downloadFiles', (event, files) => {
  return downloader.onHandleDownloadFiles(event, files);
})

ipcMain.handle('onDeleteFolder', async (event, filePath) => {
  return await systemFunc.onDeleteFolder(filePath);
})

ipcMain.on('restart_app', () => {
  autoUpdater.quitAndInstall();
});

// Check for updates when Angular asks
ipcMain.on('check-for-updates', () => {
  log.info('Manual update check triggered');
  autoUpdater.checkForUpdatesAndNotify();
});

app.whenReady().then(async () => {
  await session.defaultSession.setProxy({ mode: "system" });
  createWindow();
});
app.on('window-all-closed', () => app.quit());