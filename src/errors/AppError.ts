export class AppError extends Error {
    statusCode: number;
    code: string;
    details?: unknown;
    expose: boolean;
    isOperational: boolean;

    constructor(
        message: string,
        statusCode = 500,
        code = 'INTERNAL_SERVER_ERROR',
        details?: unknown,
    ) {
        super(message);
        this.name = 'AppError';
        this.statusCode = statusCode;
        this.code = code;
        this.details = details;
        this.expose = statusCode < 500;
        this.isOperational = true;
        Error.captureStackTrace(this, this.constructor);
    }
}
