import type { RequestHandler } from 'express';
import type { ZodTypeAny } from 'zod';
import { ZodError } from 'zod';
import { ValidationError } from '../errors/ValidationError.js';

export interface ValidateRequestOptions {
    mode?: 'validated' | 'mutate';
}

function parseSection(
    section: 'body' | 'query' | 'params' | 'headers',
    schema: ZodTypeAny,
    value: unknown,
) {
    try {
        return schema.parse(value) as unknown;
    } catch (error) {
        if (error instanceof ZodError) {
            const fields = error.errors.map((err) => ({
                path: [section, ...err.path].join('.'),
                message: err.message,
                code: err.code,
            }));
            throw new ValidationError('Validation failed', { fields });
        }

        throw error;
    }
}

export function validateRequest(
    schemas: {
        body?: ZodTypeAny;
        query?: ZodTypeAny;
        params?: ZodTypeAny;
        headers?: ZodTypeAny;
    },
    options: ValidateRequestOptions = { mode: 'validated' },
): RequestHandler {
    return (req, res, next) => {
        try {
            const mode = options.mode ?? 'validated';
            const results: Record<string, unknown> = {};

            if (schemas.params) {
                const parsed = parseSection('params', schemas.params, req.params);
                if (mode === 'mutate') {
                    req.params = parsed as Record<string, string>;
                }
                results.params = parsed;
            }

            if (schemas.query) {
                const parsed = parseSection('query', schemas.query, req.query);
                if (mode === 'mutate') {
                    req.query = parsed as Record<string, string>;
                }
                results.query = parsed;
            }

            if (schemas.body) {
                const parsed = parseSection('body', schemas.body, req.body);
                if (mode === 'mutate') {
                    req.body = parsed;
                }
                results.body = parsed;
            }

            if (schemas.headers) {
                // Headers are ALWAYS placed on req.validated.headers as per DESIGN.md
                results.headers = parseSection('headers', schemas.headers, req.headers);
            }

            req.validated = {
                params: mode === 'validated' ? results.params : undefined,
                query: mode === 'validated' ? results.query : undefined,
                body: mode === 'validated' ? results.body : undefined,
                headers: results.headers,
            };

            next();
        } catch (error) {
            next(error);
        }
    };
}
