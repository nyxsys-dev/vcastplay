const { autoUpdater } = require('electron-updater');

function onSetupAutoUpdate() {
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

module.exports = { onSetupAutoUpdate };