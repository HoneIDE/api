import { Disposable } from './types';

export declare namespace commands {
  /**
   * Register a command handler.
   * @param id Unique command identifier (e.g., "myext.doSomething")
   * @param handler The function to execute when the command is invoked
   * @returns Disposable that unregisters the command
   */
  function registerCommand(id: string, handler: (...args: any[]) => any): Disposable;

  /**
   * Execute a registered command programmatically.
   * @param id The command identifier
   * @param args Arguments to pass to the command handler
   */
  function executeCommand<T = any>(id: string, ...args: any[]): Promise<T>;

  /**
   * Get all registered command identifiers.
   */
  function getCommands(filterInternal?: boolean): Promise<string[]>;
}
