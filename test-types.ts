import { AppError } from 'xpress-toolkit';
import { setupSwagger } from 'xpress-toolkit/swagger';

const e: AppError = new AppError('Test', 400);
console.log(e.message);
