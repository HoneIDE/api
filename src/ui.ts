import { Disposable, Event, Uri, CancellationToken, ProviderResult, Progress, ProgressOptions, ProgressLocation } from './types';

// === Status Bar ===

export enum StatusBarAlignment {
  Left = 1,
  Right = 2,
}

export interface StatusBarItem {
  alignment: StatusBarAlignment;
  priority?: number;
  text: string;
  tooltip?: string;
  color?: string;
  backgroundColor?: string;
  command?: string;
  show(): void;
  hide(): void;
  dispose(): void;
}

// === Quick Pick ===

export interface QuickPickItem {
  label: string;
  description?: string;
  detail?: string;
  picked?: boolean;
  alwaysShow?: boolean;
}

export interface QuickPickOptions {
  title?: string;
  placeHolder?: string;
  canPickMany?: boolean;
  matchOnDescription?: boolean;
  matchOnDetail?: boolean;
}

// === Input Box ===

export interface InputBoxOptions {
  title?: string;
  prompt?: string;
  placeHolder?: string;
  value?: string;
  password?: boolean;
  validateInput?(value: string): string | undefined | null | PromiseLike<string | undefined | null>;
}

// === Tree View ===

export interface TreeDataProvider<T> {
  getTreeItem(element: T): TreeItem | PromiseLike<TreeItem>;
  getChildren(element?: T): ProviderResult<T[]>;
  getParent?(element: T): ProviderResult<T>;
  onDidChangeTreeData?: Event<T | undefined | null | void>;
}

export interface TreeItem {
  label: string;
  description?: string;
  tooltip?: string;
  iconPath?: Uri | { light: Uri; dark: Uri };
  collapsibleState?: TreeItemCollapsibleState;
  command?: CommandRef;
  contextValue?: string;
}

export enum TreeItemCollapsibleState {
  None = 0,
  Collapsed = 1,
  Expanded = 2,
}

export interface CommandRef {
  command: string;
  title: string;
  arguments?: any[];
}

// === Webview ===

export interface WebviewPanel {
  readonly viewType: string;
  title: string;
  readonly webview: Webview;
  readonly visible: boolean;
  readonly active: boolean;
  readonly onDidDispose: Event<void>;
  readonly onDidChangeViewState: Event<WebviewPanelOnDidChangeViewStateEvent>;
  reveal(preserveFocus?: boolean): void;
  dispose(): void;
}

export interface Webview {
  html: string;
  readonly onDidReceiveMessage: Event<any>;
  postMessage(message: any): Promise<boolean>;
  readonly cspSource: string;
}

export interface WebviewPanelOnDidChangeViewStateEvent {
  readonly webviewPanel: WebviewPanel;
}

export interface WebviewOptions {
  enableScripts?: boolean;
  localResourceRoots?: Uri[];
}

// === Messages ===

export interface MessageItem {
  title: string;
  isCloseAffordance?: boolean;
}

export interface MessageOptions {
  modal?: boolean;
}

// === Dialogs ===

export interface OpenDialogOptions {
  canSelectFiles?: boolean;
  canSelectFolders?: boolean;
  canSelectMany?: boolean;
  filters?: { [name: string]: string[] };
  title?: string;
}

export interface SaveDialogOptions {
  filters?: { [name: string]: string[] };
  title?: string;
  defaultUri?: Uri;
}

// === Namespace ===

export declare namespace ui {
  function registerTreeDataProvider<T>(viewId: string, provider: TreeDataProvider<T>): Disposable;
  function createWebviewPanel(viewType: string, title: string, options?: WebviewOptions): WebviewPanel;
  function createStatusBarItem(alignment?: StatusBarAlignment, priority?: number): StatusBarItem;

  function showInformationMessage(message: string, ...items: string[]): Promise<string | undefined>;
  function showInformationMessage(message: string, options: MessageOptions, ...items: MessageItem[]): Promise<MessageItem | undefined>;
  function showWarningMessage(message: string, ...items: string[]): Promise<string | undefined>;
  function showErrorMessage(message: string, ...items: string[]): Promise<string | undefined>;

  function showInputBox(options?: InputBoxOptions): Promise<string | undefined>;
  function showQuickPick(items: string[], options?: QuickPickOptions): Promise<string | undefined>;
  function showQuickPick(items: QuickPickItem[], options?: QuickPickOptions): Promise<QuickPickItem | undefined>;
  function showQuickPick<T extends QuickPickItem>(items: T[], options?: QuickPickOptions & { canPickMany: true }): Promise<T[] | undefined>;

  function showOpenDialog(options?: OpenDialogOptions): Promise<Uri[] | undefined>;
  function showSaveDialog(options?: SaveDialogOptions): Promise<Uri | undefined>;

  function withProgress<R>(
    options: ProgressOptions,
    task: (progress: Progress<{ message?: string; increment?: number }>, token: CancellationToken) => PromiseLike<R>
  ): PromiseLike<R>;
}
