import type { Request, RequestHandler } from 'express';
import type { Logger } from '../logging/types.js';
import { createLogger } from './createLogger.js';

export interface RequestLoggerOptions {
    logger?: Logger;
    requestIdHeader?: string;
    logBody?: boolean;
    logQuery?: boolean;
    skip?: (req: Request) => boolean;
}

export function requestLogger(options: RequestLoggerOptions = {}): RequestHandler {
    const {
        logger = createLogger(),
        requestIdHeader = 'x-request-id',
        logBody = false,
        logQuery = true,
    } = options;

    return (req, res, next) => {
        if (options.skip?.(req)) {
            next();
            return;
        }

        const start = Date.now();
        const requestId = req.get(requestIdHeader);

        // Log request start
        logger.info(
            {
                requestId,
                method: req.method,
                url: req.url,
                query: logQuery ? req.query : undefined,
            },
            `request start: ${req.method} ${req.url}`,
        );

        res.on('finish', () => {
            const duration = Date.now() - start;
            logger.info(
                {
                    requestId,
                    method: req.method,
                    url: req.url,
                    statusCode: res.statusCode,
                    duration: `${String(duration)}ms`,
                    body: logBody ? (req.body as unknown) : undefined,
                },
                `request complete: ${req.method} ${req.url} ${String(res.statusCode)} (${String(duration)}ms)`,
            );
        });

        next();
    };
}
