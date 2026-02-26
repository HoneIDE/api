import { Disposable } from './types';

// Re-export all types and namespaces
export * from './types';
export * from './commands';
export * from './editor';
export * from './workspace';
export * from './ui';
export * from './languages';
export * from './debug';
export * from './terminal';
export * from './ai';

// === Extension Activation ===

/**
 * Every extension must export an `activate` function.
 * Called when one of the extension's activation events fires.
 */
export interface ExtensionContext {
  /** Subscriptions to be disposed when the extension is deactivated */
  readonly subscriptions: Disposable[];
  /** Absolute path to the extension's install directory */
  readonly extensionPath: string;
  /** Storage path for extension-specific persistent data */
  readonly storagePath: string | undefined;
  /** Global storage path shared across workspaces */
  readonly globalStoragePath: string;
}

/**
 * Extensions export this as their entry point.
 */
export type ActivateFunction = (context: ExtensionContext) => void | Promise<void>;

/**
 * Optional — called when the extension is deactivated.
 */
export type DeactivateFunction = () => void | Promise<void>;
