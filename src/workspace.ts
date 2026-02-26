import { Disposable, Event, Uri, OutputChannel } from './types';
import { TextDocument, TextEdit, Range } from './editor';

export interface WorkspaceFolder {
  readonly uri: Uri;
  readonly name: string;
  readonly index: number;
}

export interface Configuration {
  get<T>(key: string): T | undefined;
  get<T>(key: string, defaultValue: T): T;
  has(key: string): boolean;
  update(key: string, value: any, global?: boolean): Promise<void>;
}

export interface TextDocumentChangeEvent {
  readonly document: TextDocument;
  readonly contentChanges: readonly TextDocumentContentChangeEvent[];
  readonly reason?: TextDocumentChangeReason;
}

export interface TextDocumentContentChangeEvent {
  readonly range: Range;
  readonly rangeOffset: number;
  readonly rangeLength: number;
  readonly text: string;
}

export enum TextDocumentChangeReason {
  Undo = 1,
  Redo = 2,
}

export interface FileSystemWatcher extends Disposable {
  readonly onDidCreate: Event<Uri>;
  readonly onDidChange: Event<Uri>;
  readonly onDidDelete: Event<Uri>;
}

export interface WorkspaceEdit {
  set(uri: Uri, edits: TextEdit[]): void;
  has(uri: Uri): boolean;
  entries(): [Uri, TextEdit[]][];
  readonly size: number;
}

export declare namespace workspace {
  /** Currently open workspace folders */
  const workspaceFolders: readonly WorkspaceFolder[] | undefined;

  /** Open a text document by URI */
  function openTextDocument(uri: Uri | string): Promise<TextDocument>;

  /** Find files matching a glob pattern */
  function findFiles(include: string, exclude?: string, maxResults?: number): Promise<Uri[]>;

  /** Create a file system watcher */
  function createFileSystemWatcher(globPattern: string, ignoreCreate?: boolean, ignoreChange?: boolean, ignoreDelete?: boolean): FileSystemWatcher;

  /** Get configuration for a section */
  function getConfiguration(section?: string): Configuration;

  /** Apply a workspace edit (multi-file) */
  function applyEdit(edit: WorkspaceEdit): Promise<boolean>;

  /** Create an output channel */
  function createOutputChannel(name: string): OutputChannel;

  // Events
  const onDidOpenTextDocument: Event<TextDocument>;
  const onDidCloseTextDocument: Event<TextDocument>;
  const onDidSaveTextDocument: Event<TextDocument>;
  const onDidChangeTextDocument: Event<TextDocumentChangeEvent>;
  const onDidChangeConfiguration: Event<ConfigurationChangeEvent>;
  const onDidChangeWorkspaceFolders: Event<WorkspaceFoldersChangeEvent>;
}

export interface ConfigurationChangeEvent {
  affectsConfiguration(section: string): boolean;
}

export interface WorkspaceFoldersChangeEvent {
  readonly added: readonly WorkspaceFolder[];
  readonly removed: readonly WorkspaceFolder[];
}
