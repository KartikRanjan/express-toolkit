import express from 'express';
import { z } from 'zod';
import { createOpenApiRegistry, setupSwagger } from '../src/swagger/index.js';

const app = express();
app.use(express.json());

const userSchema = z.object({
    id: z.string().uuid(),
    email: z.string().email(),
    name: z.string(),
});

const docs = createOpenApiRegistry({
    title: 'User API',
    version: '1.0.0',
});

docs.registerSchema('User', userSchema);

docs.registerRoute({
    method: 'post',
    path: '/users',
    summary: 'Create user',
    request: {
        body: userSchema,
    },
    responses: {
        201: {
            description: 'User created',
            body: userSchema,
        },
    },
});

setupSwagger(app, {
    registry: docs,
    title: 'User API',
    version: '1.0.0',
    path: '/api-docs',
});

const port = 3000;
app.listen(port, () => {
    console.log(`Swagger demo running on http://localhost:${port}/api-docs`);
});
