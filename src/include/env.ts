export const commonjs: boolean = typeof window === 'undefined';
export const env: string = commonjs ? 'node' : 'browser';
