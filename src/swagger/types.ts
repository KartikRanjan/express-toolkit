import type { AnyZodObject, ZodSchema } from 'zod';
import type { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';

export type HttpMethod = 'get' | 'post' | 'put' | 'patch' | 'delete' | 'options' | 'head';

export interface RouteDoc {
    method: HttpMethod;
    path: string;
    summary?: string;
    description?: string;
    tags?: string[];
    request?: {
        body?: ZodSchema;
        query?: AnyZodObject;
        params?: AnyZodObject;
        headers?: AnyZodObject;
    };
    responses: Record<
        number,
        {
            description: string;
            body?: ZodSchema;
        }
    >;
}

export interface OpenApiRegistry {
    registerSchema(name: string, schema: ZodSchema): void;
    registerRoute(route: RouteDoc): void;
    getRegistry(): OpenAPIRegistry;
}
