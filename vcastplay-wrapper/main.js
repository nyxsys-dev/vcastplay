const si = require('systeminformation');
const { app, BrowserWindow, ipcMain, screen, Menu, nativeImage, Tray } = require('electron');
const { autoUpdater } = require('electron-updater');
const log = require('electron-log');
const { exec } = require('child_process');
const path = require('path');
const os = require('os');

const isDev = !app.isPackaged;

let win;
let tray;

/**
 * Creates a new browser window with the specified configuration.
 * The window is initialized in fullscreen mode and uses a preload script.
 * In production, it loads the built Angular app from the local filesystem.
 * In development, it connects to the Angular live server at localhost:4200.
 */

function createWindow() {
  win = new BrowserWindow({
    fullscreen: !isDev,
    contextIsolation: true,
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

    setupAutoUpdater();
  }

  win.on('close', (event) => {
    if (!app.isQuiting) {
      event.preventDefault();
      win.hide();
    }
  })

  createTray();
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
});

ipcMain.on('restart_app', () => {
  autoUpdater.quitAndInstall();
});

// Check for updates when Angular asks
ipcMain.on('check-for-updates', () => {
  log.info('Manual update check triggered');
  autoUpdater.checkForUpdatesAndNotify();
});

function createTray() {
  const icon = path.join(__dirname, 'assets/favicon.png');
  const trayIcon = nativeImage.createFromPath(icon);
  tray = new Tray(trayIcon);

  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Show App',
      click: () => win.show()
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
  
  // Optional: click to toggle window
  tray.on('double-click', () => {
    win.isVisible() ? win.hide() : win.show();
  });
}

app.whenReady().then(createWindow);
app.on('window-all-closed', () => app.quit());

function setupAutoUpdater() {
  // Logging
  autoUpdater.logger = log;
  autoUpdater.logger.transports.file.level = 'info';
  // Auto download and install after update is downloaded
  autoUpdater.autoDownload = true;

  // Events
  autoUpdater.on('checking-for-update', () => {
    log.info('Checking for updates...');
  });

  autoUpdater.on('update-available', (info) => {
    log.info('Update available:', info);
  });

  autoUpdater.on('update-not-available', (info) => {
    log.info('No update available:', info);
  });

  autoUpdater.on('error', (err) => {
    log.error('Error in auto-updater:', err);
  });

  autoUpdater.on('download-progress', (progress) => {
    log.info(`Download speed: ${progress.bytesPerSecond}`);
    log.info(`Downloaded: ${progress.percent}%`);
  });

  autoUpdater.on('update-downloaded', (info) => {
    log.info('Update downloaded. Quitting and installing...');
    autoUpdater.quitAndInstall();
  });

  // Initial check
  autoUpdater.checkForUpdatesAndNotify();

  // Real-time check every 10 minutes
  setInterval(() => {
    autoUpdater.checkForUpdatesAndNotify();
  }, 10 * 60 * 1000); // 10 minutes
}