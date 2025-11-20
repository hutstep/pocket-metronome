import { LocalStorageAdapter } from './localStorageAdapter';

export * from './types';
export const storage = new LocalStorageAdapter();
