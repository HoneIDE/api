/**
 * A resource that can be released/cleaned up.
 * Extensions return Disposable from register* calls.
 */
export interface Disposable {
  dispose(): void;
}

/**
 * Typed event emitter pattern. Extensions subscribe via `onDid*` properties.
 */
export interface Event<T> {
  (listener: (e: T) => void, thisArgs?: any, disposables?: Disposable[]): Disposable;
}

/**
 * Uniform resource identifier for files, untitled docs, etc.
 */
export interface Uri {
  readonly scheme: string;     // "file", "untitled", "hone-webview", etc.
  readonly authority: string;
  readonly path: string;
  readonly query: string;
  readonly fragment: string;
  readonly fsPath: string;     // Platform-native file path
  toString(): string;
}

/** Factory for creating Uri instances */
export declare namespace Uri {
  function file(path: string): Uri;
  function parse(value: string): Uri;
  function from(components: { scheme: string; authority?: string; path?: string; query?: string; fragment?: string }): Uri;
}

/**
 * Cancellation support for long-running operations.
 */
export interface CancellationToken {
  readonly isCancellationRequested: boolean;
  readonly onCancellationRequested: Event<void>;
}

export interface CancellationTokenSource {
  readonly token: CancellationToken;
  cancel(): void;
  dispose(): void;
}

/**
 * A thenable (promise-like) that the API returns in many places.
 */
export type ProviderResult<T> = T | undefined | null | PromiseLike<T | undefined | null>;

/**
 * Output channel for extension logging.
 */
export interface OutputChannel {
  readonly name: string;
  append(value: string): void;
  appendLine(value: string): void;
  clear(): void;
  show(preserveFocus?: boolean): void;
  hide(): void;
  dispose(): void;
}

/**
 * Progress reporting.
 */
export interface Progress<T> {
  report(value: T): void;
}

export interface ProgressOptions {
  location: ProgressLocation;
  title?: string;
  cancellable?: boolean;
}

export enum ProgressLocation {
  SourceControl = 1,
  Window = 10,
  Notification = 15,
}
