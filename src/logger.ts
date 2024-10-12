// logger.ts
import { createLogger, format, transports } from 'winston';

const logger = createLogger({
    level: 'info',
    format: format.combine(
        format.timestamp(),
        format.json(),
    ),
    transports: [
        new transports.Console(), // Para mostrar en la consola
        new transports.File({ filename: 'combined.log' }), // Para guardar en un archivo
    ],
});

export default logger;
