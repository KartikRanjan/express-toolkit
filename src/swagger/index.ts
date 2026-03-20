import { z } from 'zod';

function checkDependencies() {
    try {
        require.resolve('@asteasolutions/zod-to-openapi');
        require.resolve('swagger-ui-express');
    } catch (e) {
        throw new Error(
            "xpress-toolkit/swagger requires '@asteasolutions/zod-to-openapi' and 'swagger-ui-express' as peer dependencies. Please install them to use this module.",
            { cause: e },
        );
    }
}

// Check dependencies at runtime (CJS/Node environment)
if (typeof require !== 'undefined' && typeof require.resolve === 'function') {
    checkDependencies();
}

// Note: In ESM, we rely on the host environment's module resolution,
// but for the purposes of this implementation, we will proceed with imports.
// For a production library, we might use dynamic imports or other checks.

import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
extendZodWithOpenApi(z);

export * from './types.js';
export * from './createOpenApiRegistry.js';
export * from './setupSwagger.js';
