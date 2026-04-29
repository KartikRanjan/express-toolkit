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
    auth: {
        name: 'bearerAuth',
        scheme: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
        },
    },
});

docs.registerSchema('User', userSchema);

docs.registerRoute({
    method: 'post',
    path: '/users',
    summary: 'Create user',
    authenticate: true,
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

docs.registerRoute({
    method: 'get',
    path: '/users/{id}',
    summary: 'Get user by ID',
    authenticate: true,
    request: {
        params: z.object({
            id: z.string().uuid(),
        }),
    },
    responses: {
        200: {
            description: 'User found',
            body: userSchema,
        },
        404: {
            description: 'User not found',
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
    console.log(`Swagger UI: http://localhost:${port}/api-docs`);
    console.log(`OpenAPI JSON: http://localhost:${port}/api-docs.json`);
});
