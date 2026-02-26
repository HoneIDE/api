import { Disposable, Event } from './types';

export interface Terminal {
  readonly name: string;
  readonly processId: Promise<number | undefined>;
  readonly exitStatus: TerminalExitStatus | undefined;

  sendText(text: string, addNewLine?: boolean): void;
  show(preserveFocus?: boolean): void;
  hide(): void;
  dispose(): void;
}

export interface TerminalExitStatus {
  readonly code: number | undefined;
  readonly reason: TerminalExitReason;
}

export enum TerminalExitReason {
  Unknown = 0,
  Shutdown = 1,
  Process = 2,
  User = 3,
  Extension = 4,
}

export interface TerminalOptions {
  name?: string;
  shellPath?: string;
  shellArgs?: string | string[];
  cwd?: string;
  env?: { [key: string]: string | null | undefined };
  hideFromUser?: boolean;
}

export interface TerminalDataWriteEvent {
  readonly terminal: Terminal;
  readonly data: string;
}

export declare namespace terminal {
  const terminals: readonly Terminal[];
  const activeTerminal: Terminal | undefined;

  function createTerminal(options?: TerminalOptions): Terminal;
  function createTerminal(name?: string, shellPath?: string, shellArgs?: string | string[]): Terminal;

  const onDidOpenTerminal: Event<Terminal>;
  const onDidCloseTerminal: Event<Terminal>;
  const onDidChangeActiveTerminal: Event<Terminal | undefined>;
  const onDidWriteTerminalData: Event<TerminalDataWriteEvent>;
}
