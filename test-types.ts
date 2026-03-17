import { AppError } from '@kartik/express-toolkit';
import { setupSwagger } from '@kartik/express-toolkit/swagger';

const e: AppError = new AppError(400, 'Test');
console.log(e.message);
