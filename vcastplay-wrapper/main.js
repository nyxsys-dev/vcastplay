const si = require('systeminformation');
const { app, BrowserWindow, ipcMain, screen, Menu } = require('electron');
const { autoUpdater } = require('electron-updater');
const { exec } = require('child_process');
const path = require('path');
const os = require('os');

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
    fullscreen: true,
    autoHideMenuBar: true,
    icon: path.join(__dirname, 'assets/favicon.png'),
    webPreferences: {
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
  }

  // Auto updater
  autoUpdater.checkForUpdatesAndNotify();
}


ipcMain.handle('control', async (_event, action, appName) => {
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
});

ipcMain.handle('getSystemInfo', async () => {
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
  };
});

ipcMain.on('restart_app', () => {
  autoUpdater.quitAndInstall();
});

app.whenReady().then(createWindow);
app.on('window-all-closed', () => app.quit());

// Auto update events
autoUpdater.on('update-downloaded', () => {
  win.webContents.send('update-downloaded');
});

autoUpdater.on('update-not-available', () => {
  win.webContents.send('update-not-available');
});

autoUpdater.on('update-available', () => {
  win.webContents.send('update-available');
})