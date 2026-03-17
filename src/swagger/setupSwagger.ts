import type { Express } from 'express';
import swaggerUi from 'swagger-ui-express';
import { OpenApiGeneratorV3 } from '@asteasolutions/zod-to-openapi';
import type { OpenApiRegistry } from './types.js';

export interface SetupSwaggerOptions {
    registry: OpenApiRegistry;
    path?: string;
    title: string;
    version: string;
}

export function setupSwagger(app: Express, options: SetupSwaggerOptions) {
    const { registry, path = '/api-docs', title, version } = options;

    const generator = new OpenApiGeneratorV3(registry.getRegistry().definitions);
    const document = generator.generateDocument({
        openapi: '3.0.0',
        info: {
            title,
            version,
        },
    });

    app.use(path, swaggerUi.serve, swaggerUi.setup(document));
}
