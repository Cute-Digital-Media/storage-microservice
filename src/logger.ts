/* eslint-disable prettier/prettier */
import { createLogger, format, transports } from 'winston';
import * as DailyRotateFile from 'winston-daily-rotate-file'; // Use import * as for CommonJS compatibility

// Daily rotation transport configuration
const dailyRotateTransport = new DailyRotateFile({ // Use DailyRotateFile directly
    filename: 'logs/application-%DATE%.log', // Path of the log with date in the name
    datePattern: 'YYYY-MM-DD',                // Date pattern
    maxSize: '20m',                           // Maximum file size (20MB)
    maxFiles: '14d',                          // Keeps logs for the last 14 days
});

// Logger configuration
const logger = createLogger({
    level: 'info',
    format: format.combine(
        format.timestamp(),  // Adds a timestamp
        format.json(),        // JSON format for each entry
    ),
    transports: [
        new transports.Console(),             // Show in console
        dailyRotateTransport,                 // Daily rotation transport
    ],
});

// Example usage of the logger
logger.info('Image uploaded: Screenshot.png');

export default logger;
