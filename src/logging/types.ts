export interface Logger {
    debug(meta: unknown, message?: string): void;
    info(meta: unknown, message?: string): void;
    warn(meta: unknown, message?: string): void;
    error(meta: unknown, message?: string): void;
    child?(bindings: Record<string, unknown>): Logger;
}
