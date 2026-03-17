import { EventEmitter } from 'node:events';
import { afterEach, describe, expect, it, vi } from 'vitest';
import type { Logger } from './types.js';
import { requestLogger } from './requestLogger.js';

function createMockLogger(): Logger {
    return {
        debug: vi.fn(),
        info: vi.fn(),
        warn: vi.fn(),
        error: vi.fn(),
    };
}

function createRequest(overrides: Partial<Record<string, unknown>> = {}) {
    const headers = (overrides.headers as Record<string, string> | undefined) ?? {};

    return {
        method: (overrides.method as string | undefined) ?? 'GET',
        url: (overrides.url as string | undefined) ?? '/',
        query: overrides.query ?? {},
        body: overrides.body,
        headers,
        get(name: string) {
            return headers[name.toLowerCase()];
        },
    };
}

function createResponse() {
    const res = new EventEmitter() as EventEmitter & { statusCode: number };
    res.statusCode = 200;
    return res;
}

describe('requestLogger', () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('should log request start and completion with request metadata', () => {
        const logger = createMockLogger();
        const middleware = requestLogger({ logger, logBody: true });
        const req = createRequest({
            method: 'POST',
            url: '/items?fixed=1',
            query: { fixed: '1' },
            body: { secret: 'visible-on-complete' },
            headers: { 'x-request-id': 'req-123' },
        });
        const res = createResponse();
        const next = vi.fn();
        const dateNow = vi.spyOn(Date, 'now');

        dateNow.mockReturnValueOnce(1000).mockReturnValueOnce(1025);

        middleware(req as never, res as never, next);
        res.statusCode = 201;
        res.emit('finish');

        expect(next).toHaveBeenCalledWith();
        expect(logger.info).toHaveBeenCalledTimes(2);
        expect(logger.info).toHaveBeenNthCalledWith(
            1,
            {
                requestId: 'req-123',
                method: 'POST',
                url: '/items?fixed=1',
                query: { fixed: '1' },
            },
            'request start: POST /items?fixed=1',
        );
        expect(logger.info).toHaveBeenNthCalledWith(
            2,
            {
                requestId: 'req-123',
                method: 'POST',
                url: '/items?fixed=1',
                statusCode: 201,
                duration: '25ms',
                body: { secret: 'visible-on-complete' },
            },
            'request complete: POST /items?fixed=1 201 (25ms)',
        );
    });

    it('should skip logging when the skip predicate matches', () => {
        const logger = createMockLogger();
        const middleware = requestLogger({
            logger,
            skip: () => true,
        });
        const req = createRequest({ url: '/health' });
        const res = createResponse();
        const next = vi.fn();

        middleware(req as never, res as never, next);
        res.emit('finish');

        expect(next).toHaveBeenCalledWith();
        expect(logger.info).not.toHaveBeenCalled();
    });
});
