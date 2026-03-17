import { AppError } from './AppError.js';

export interface ValidationErrorDetail {
    path: string;
    message: string;
    code: string;
}

export class ValidationError extends AppError {
    constructor(message: string, details?: { fields: ValidationErrorDetail[] }) {
        super(message, 400, 'VALIDATION_ERROR', details);
        this.name = 'ValidationError';
    }
}
