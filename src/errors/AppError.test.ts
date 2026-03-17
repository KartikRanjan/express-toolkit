import { describe, it, expect } from 'vitest';
import { AppError } from './AppError.js';

describe('AppError', () => {
    it('should create an error with default values', () => {
        const error = new AppError('Something went wrong');
        expect(error.message).toBe('Something went wrong');
        expect(error.statusCode).toBe(500);
        expect(error.code).toBe('INTERNAL_SERVER_ERROR');
        expect(error.expose).toBe(false);
        expect(error.isOperational).toBe(true);
    });

    it('should expose error details when statusCode < 500', () => {
        const error = new AppError('Bad request', 400, 'BAD_REQUEST');
        expect(error.statusCode).toBe(400);
        expect(error.expose).toBe(true);
    });

    it('should include custom details', () => {
        const details = { field: 'email', reason: 'invalid' };
        const error = new AppError('Validation failed', 422, 'UNPROCESSABLE_ENTITY', details);
        expect(error.details).toEqual(details);
    });
});
