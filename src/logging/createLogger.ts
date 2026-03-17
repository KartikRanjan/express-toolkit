import type { LoggerOptions } from 'pino';
import pino from 'pino';
import type { Logger } from './types.js';

/**
 * Creates a Pino logger instance.
 * Automatically uses pino-pretty in development for readable logs.
 * In production, it uses standard JSON output for maximum performance.
 */
export function createLogger(options?: LoggerOptions): Logger {
    const isDevelopment = process.env.NODE_ENV === 'development';

    const defaultOptions: LoggerOptions = {
        level: process.env.LOG_LEVEL ?? 'info',
        ...(isDevelopment && {
            transport: {
                target: 'pino-pretty',
                options: {
                    colorize: true,
                    ignore: 'pid,hostname',
                    translateTime: 'SYS:standard',
                },
            },
        }),
    };

    return pino({ ...defaultOptions, ...options });
}
