import log from 'electron-log';

export function getLogger() {
  log.transports.file.level = 'info';
  return log;
}
