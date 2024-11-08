import log4js from 'log4js';

const logger = log4js.getLogger('BasicNetwork');
logger.level = 'debug';

// Define custom levels
log4js.levels.addLevels({
  success: { value: log4js.levels.INFO.level - 1000, colour: 'green' },
  notfound: { value: log4js.levels.WARN.level + 1000, colour: 'red' },
});

// Create and export logger functions for various levels
export const logError = (message: string) => logger.error(message);
export const logWarning = (message: string) => logger.warn(message);
export const logInfo = (message: string) => logger.info(message);
export const logSuccess = (message: string) => logger.log('success', message);
export const logNotFound = (message: string) => logger.log('notfound', message);

// Export the logger for other uses
export default logger;
