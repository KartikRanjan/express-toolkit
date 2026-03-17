import { describe, expect, it } from 'vitest';
import { AppError } from './AppError.js';
import { ValidationError } from './ValidationError.js';

describe('ValidationError', () => {
    it('should create a 400 AppError with validation defaults', () => {
        const details = {
            fields: [{ path: 'body.email', message: 'Invalid email', code: 'invalid_string' }],
        };

        const error = new ValidationError('Validation failed', details);

        expect(error).toBeInstanceOf(AppError);
        expect(error.name).toBe('ValidationError');
        expect(error.statusCode).toBe(400);
        expect(error.code).toBe('VALIDATION_ERROR');
        expect(error.expose).toBe(true);
        expect(error.details).toEqual(details);
    });
});
