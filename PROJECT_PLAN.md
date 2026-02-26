# hone-api — Project Plan

## 1. Overview

**What:** `@honeide/api` is the public extension API for Hone. It is a pure TypeScript type library — zero runtime code, zero dependencies. Every type, interface, namespace, and event signature that extension authors need lives here.

**Why:** Decoupling the extension contract from implementation allows extensions to be compiled independently, version the API surface with strict semver, and ensure extensions never import internal IDE code.

**Who uses it:**
- Extension authors (`import * as hone from '@honeide/api'`)
- `hone-extensions` (all built-in extensions import only this)
- `hone-core` (implements the API bridge that fulfills these contracts)
- `hone-ide` (wires API implementations to the runtime)

**Role in ecosystem:** The foundational contract. Layer 0 — no dependencies on any other `@honeide/*` package.

---

## 2. Dependencies

### Internal
None. This package has zero `@honeide/*` dependencies.

### External
None. Zero runtime dependencies. Zero dev dependencies beyond TypeScript itself.

### Peer
None.

---

## 3. Repository Structure

```
hone-api/
├── src/
│   ├── index.ts              # Barrel export with namespaces
│   ├── types.ts              # Shared primitives (Disposable, Event, Uri, CancellationToken, etc.)
│   ├── commands.ts           # Command registration types
│   ├── editor.ts             # TextEditor, TextDocument, Position, Range, Selection
│   ├── workspace.ts          # WorkspaceFolder, Configuration, file events
│   ├── ui.ts                 # TreeDataProvider, WebviewPanel, StatusBarItem, QuickPick, InputBox
│   ├── languages.ts          # CompletionProvider, HoverProvider, CodeActionProvider, diagnostics
│   ├── debug.ts              # Debug session, breakpoint types
│   ├── terminal.ts           # Terminal creation and I/O types
│   └── ai.ts                 # AIProviderAdapter, AgentToolDefinition, capabilities
│
├── tests/
│   ├── type-checks.ts        # Compile-only type assertion tests
│   └── api-surface.test.ts   # Ensures all expected exports exist
│
├── package.json              # Published as @honeide/api
├── tsconfig.json
├── CHANGELOG.md
└── LICENSE                   # MIT
```

---

## 4. Core Interfaces & Types

### `src/types.ts` — Shared Primitives

```typescript
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
export namespace Uri {
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
export type ProviderResult<T> = T | undefined | null | Thenable<T | undefined | null>;

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
```

### `src/commands.ts` — Command Registration

```typescript
import { Disposable } from './types';

export namespace commands {
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
```

### `src/editor.ts` — Editor & Document Types

```typescript
import { Disposable, Event, Uri, ProviderResult } from './types';

/** Zero-based line and character position in a document */
export interface Position {
  readonly line: number;
  readonly character: number;
}

export namespace Position {
  function create(line: number, character: number): Position;
}

/** A range between two positions */
export interface Range {
  readonly start: Position;
  readonly end: Position;
  readonly isEmpty: boolean;
  readonly isSingleLine: boolean;
  contains(positionOrRange: Position | Range): boolean;
}

export namespace Range {
  function create(start: Position, end: Position): Range;
  function create(startLine: number, startChar: number, endLine: number, endChar: number): Range;
}

/** A selection with anchor (where selection started) and active (cursor) positions */
export interface Selection extends Range {
  readonly anchor: Position;
  readonly active: Position;
  readonly isReversed: boolean;
}

/** A text edit (insert, delete, or replace) */
export interface TextEdit {
  readonly range: Range;
  readonly newText: string;
}

export namespace TextEdit {
  function insert(position: Position, newText: string): TextEdit;
  function delete_(range: Range): TextEdit;
  function replace(range: Range, newText: string): TextEdit;
}

/** Read-only view of a text document */
export interface TextDocument {
  readonly uri: Uri;
  readonly fileName: string;
  readonly languageId: string;
  readonly version: number;
  readonly isDirty: boolean;
  readonly isUntitled: boolean;
  readonly lineCount: number;
  readonly eol: EndOfLine;
  readonly encoding: string;

  getText(range?: Range): string;
  getWordRangeAtPosition(position: Position, regex?: RegExp): Range | undefined;
  lineAt(line: number): TextLine;
  lineAt(position: Position): TextLine;
  offsetAt(position: Position): number;
  positionAt(offset: number): Position;
  validatePosition(position: Position): Position;
  validateRange(range: Range): Range;
}

export interface TextLine {
  readonly lineNumber: number;
  readonly text: string;
  readonly range: Range;
  readonly rangeIncludingLineBreak: Range;
  readonly firstNonWhitespaceCharacterIndex: number;
  readonly isEmptyOrWhitespace: boolean;
}

export enum EndOfLine {
  LF = 1,
  CRLF = 2,
}

/** An editor tab showing a document */
export interface TextEditor {
  readonly document: TextDocument;
  selection: Selection;
  selections: Selection[];
  readonly visibleRanges: Range[];
  options: TextEditorOptions;

  edit(callback: (editBuilder: TextEditorEdit) => void): Promise<boolean>;
  insertSnippet(snippet: SnippetString, location?: Position | Range | readonly Position[] | readonly Range[]): Promise<boolean>;
  setDecorations(decorationType: TextEditorDecorationType, rangesOrOptions: Range[] | DecorationOptions[]): void;
  revealRange(range: Range, revealType?: TextEditorRevealType): void;
}

export interface TextEditorEdit {
  insert(location: Position, value: string): void;
  delete_(location: Range): void;
  replace(location: Range | Position | Selection, value: string): void;
}

export interface TextEditorOptions {
  tabSize?: number | string;
  insertSpaces?: boolean | string;
  cursorStyle?: TextEditorCursorStyle;
  lineNumbers?: TextEditorLineNumbersStyle;
}

export enum TextEditorCursorStyle {
  Line = 1,
  Block = 2,
  Underline = 3,
  LineThin = 4,
  BlockOutline = 5,
  UnderlineThin = 6,
}

export enum TextEditorLineNumbersStyle {
  Off = 0,
  On = 1,
  Relative = 2,
}

export enum TextEditorRevealType {
  Default = 0,
  InCenter = 1,
  InCenterIfOutsideViewport = 2,
  AtTop = 3,
}

export interface SnippetString {
  readonly value: string;
}

export interface TextEditorDecorationType {
  readonly key: string;
  dispose(): void;
}

export interface DecorationOptions {
  range: Range;
  hoverMessage?: string;
  renderOptions?: DecorationRenderOptions;
}

export interface DecorationRenderOptions {
  backgroundColor?: string;
  border?: string;
  color?: string;
  fontStyle?: string;
  fontWeight?: string;
  textDecoration?: string;
  opacity?: string;
  after?: ThemableDecorationAttachmentRenderOptions;
  before?: ThemableDecorationAttachmentRenderOptions;
}

export interface ThemableDecorationAttachmentRenderOptions {
  contentText?: string;
  color?: string;
  backgroundColor?: string;
  fontStyle?: string;
  fontWeight?: string;
}
```

### `src/workspace.ts` — Workspace & Configuration

```typescript
import { Disposable, Event, Uri } from './types';
import { TextDocument, TextEdit } from './editor';

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

export namespace workspace {
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
```

### `src/ui.ts` — UI Contributions

```typescript
import { Disposable, Event, Uri, CancellationToken, ProviderResult } from './types';

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
  validateInput?(value: string): string | undefined | null | Thenable<string | undefined | null>;
}

// === Tree View ===

export interface TreeDataProvider<T> {
  getTreeItem(element: T): TreeItem | Thenable<TreeItem>;
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

// === Namespace ===

export namespace ui {
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

  function withProgress<R>(options: ProgressOptions, task: (progress: Progress<{ message?: string; increment?: number }>, token: CancellationToken) => Thenable<R>): Thenable<R>;
}

export interface MessageOptions {
  modal?: boolean;
}

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
```

### `src/languages.ts` — Language Feature Providers

```typescript
import { Disposable, CancellationToken, ProviderResult, Uri, Event } from './types';
import { Position, Range, TextDocument, TextEdit } from './editor';

/** Document selector for language feature registration */
export type DocumentSelector = string | DocumentFilter | (string | DocumentFilter)[];

export interface DocumentFilter {
  language?: string;
  scheme?: string;
  pattern?: string;
}

// === Diagnostics ===

export enum DiagnosticSeverity {
  Error = 0,
  Warning = 1,
  Information = 2,
  Hint = 3,
}

export interface Diagnostic {
  range: Range;
  message: string;
  severity: DiagnosticSeverity;
  code?: string | number;
  source?: string;
  relatedInformation?: DiagnosticRelatedInformation[];
}

export interface DiagnosticRelatedInformation {
  location: Location;
  message: string;
}

export interface Location {
  uri: Uri;
  range: Range;
}

export interface DiagnosticCollection extends Disposable {
  readonly name: string;
  set(uri: Uri, diagnostics: Diagnostic[]): void;
  delete(uri: Uri): void;
  clear(): void;
  forEach(callback: (uri: Uri, diagnostics: Diagnostic[], collection: DiagnosticCollection) => any): void;
  get(uri: Uri): Diagnostic[] | undefined;
  has(uri: Uri): boolean;
}

// === Completion ===

export enum CompletionItemKind {
  Text = 0, Method = 1, Function = 2, Constructor = 3, Field = 4,
  Variable = 5, Class = 6, Interface = 7, Module = 8, Property = 9,
  Unit = 10, Value = 11, Enum = 12, Keyword = 13, Snippet = 14,
  Color = 15, File = 16, Reference = 17, Folder = 18, EnumMember = 19,
  Constant = 20, Struct = 21, Event = 22, Operator = 23, TypeParameter = 24,
}

export enum CompletionTriggerKind {
  Invoke = 0,
  TriggerCharacter = 1,
  TriggerForIncompleteCompletions = 2,
}

export interface CompletionContext {
  triggerKind: CompletionTriggerKind;
  triggerCharacter?: string;
}

export interface CompletionItem {
  label: string | CompletionItemLabel;
  kind?: CompletionItemKind;
  detail?: string;
  documentation?: string | MarkdownString;
  sortText?: string;
  filterText?: string;
  insertText?: string | SnippetString;
  range?: Range;
  additionalTextEdits?: TextEdit[];
  command?: CommandRef;
  preselect?: boolean;
}

export interface CompletionItemLabel {
  label: string;
  detail?: string;
  description?: string;
}

export interface CompletionList {
  isIncomplete: boolean;
  items: CompletionItem[];
}

export interface CompletionProvider {
  provideCompletionItems(document: TextDocument, position: Position, token: CancellationToken, context: CompletionContext): ProviderResult<CompletionItem[] | CompletionList>;
  resolveCompletionItem?(item: CompletionItem, token: CancellationToken): ProviderResult<CompletionItem>;
}

// === Hover ===

export interface MarkdownString {
  readonly value: string;
  readonly isTrusted?: boolean;
}

export interface Hover {
  contents: MarkdownString[];
  range?: Range;
}

export interface HoverProvider {
  provideHover(document: TextDocument, position: Position, token: CancellationToken): ProviderResult<Hover>;
}

// === Code Actions ===

export enum CodeActionKind {
  QuickFix = 'quickfix',
  Refactor = 'refactor',
  RefactorExtract = 'refactor.extract',
  RefactorInline = 'refactor.inline',
  RefactorRewrite = 'refactor.rewrite',
  Source = 'source',
  SourceOrganizeImports = 'source.organizeImports',
  SourceFixAll = 'source.fixAll',
}

export interface CodeAction {
  title: string;
  kind?: CodeActionKind;
  diagnostics?: Diagnostic[];
  isPreferred?: boolean;
  edit?: WorkspaceEdit;
  command?: CommandRef;
}

export interface CodeActionContext {
  readonly diagnostics: readonly Diagnostic[];
  readonly only?: CodeActionKind;
  readonly triggerKind: CodeActionTriggerKind;
}

export enum CodeActionTriggerKind {
  Invoke = 1,
  Automatic = 2,
}

export interface CodeActionProvider {
  provideCodeActions(document: TextDocument, range: Range, context: CodeActionContext, token: CancellationToken): ProviderResult<CodeAction[]>;
}

// === Code Lens ===

export interface CodeLens {
  range: Range;
  command?: CommandRef;
  isResolved: boolean;
}

export interface CodeLensProvider {
  provideCodeLenses(document: TextDocument, token: CancellationToken): ProviderResult<CodeLens[]>;
  resolveCodeLens?(codeLens: CodeLens, token: CancellationToken): ProviderResult<CodeLens>;
  onDidChangeCodeLenses?: Event<void>;
}

// === Definition / References ===

export interface DefinitionProvider {
  provideDefinition(document: TextDocument, position: Position, token: CancellationToken): ProviderResult<Location | Location[]>;
}

export interface ReferenceContext {
  includeDeclaration: boolean;
}

export interface ReferenceProvider {
  provideReferences(document: TextDocument, position: Position, context: ReferenceContext, token: CancellationToken): ProviderResult<Location[]>;
}

// === Rename ===

export interface RenameProvider {
  provideRenameEdits(document: TextDocument, position: Position, newName: string, token: CancellationToken): ProviderResult<WorkspaceEdit>;
  prepareRename?(document: TextDocument, position: Position, token: CancellationToken): ProviderResult<Range | { range: Range; placeholder: string }>;
}

// === Document Symbols ===

export enum SymbolKind {
  File = 0, Module = 1, Namespace = 2, Package = 3, Class = 4,
  Method = 5, Property = 6, Field = 7, Constructor = 8, Enum = 9,
  Interface = 10, Function = 11, Variable = 12, Constant = 13, String = 14,
  Number = 15, Boolean = 16, Array = 17, Object = 18, Key = 19,
  Null = 20, EnumMember = 21, Struct = 22, Event = 23, Operator = 24,
  TypeParameter = 25,
}

export interface DocumentSymbol {
  name: string;
  detail: string;
  kind: SymbolKind;
  range: Range;
  selectionRange: Range;
  children?: DocumentSymbol[];
}

export interface DocumentSymbolProvider {
  provideDocumentSymbols(document: TextDocument, token: CancellationToken): ProviderResult<DocumentSymbol[]>;
}

// === Formatting ===

export interface FormattingOptions {
  tabSize: number;
  insertSpaces: boolean;
}

export interface DocumentFormattingEditProvider {
  provideDocumentFormattingEdits(document: TextDocument, options: FormattingOptions, token: CancellationToken): ProviderResult<TextEdit[]>;
}

export interface DocumentRangeFormattingEditProvider {
  provideDocumentRangeFormattingEdits(document: TextDocument, range: Range, options: FormattingOptions, token: CancellationToken): ProviderResult<TextEdit[]>;
}

// === Signature Help ===

export interface SignatureHelp {
  signatures: SignatureInformation[];
  activeSignature: number;
  activeParameter: number;
}

export interface SignatureInformation {
  label: string;
  documentation?: string | MarkdownString;
  parameters: ParameterInformation[];
}

export interface ParameterInformation {
  label: string | [number, number];
  documentation?: string | MarkdownString;
}

export interface SignatureHelpProvider {
  provideSignatureHelp(document: TextDocument, position: Position, token: CancellationToken, context: SignatureHelpContext): ProviderResult<SignatureHelp>;
}

export interface SignatureHelpContext {
  triggerKind: SignatureHelpTriggerKind;
  triggerCharacter?: string;
  isRetrigger: boolean;
  activeSignatureHelp?: SignatureHelp;
}

export enum SignatureHelpTriggerKind {
  Invoke = 1,
  TriggerCharacter = 2,
  ContentChange = 3,
}

// === Namespace ===

export namespace languages {
  function registerCompletionItemProvider(selector: DocumentSelector, provider: CompletionProvider, ...triggerCharacters: string[]): Disposable;
  function registerHoverProvider(selector: DocumentSelector, provider: HoverProvider): Disposable;
  function registerCodeActionProvider(selector: DocumentSelector, provider: CodeActionProvider, metadata?: CodeActionProviderMetadata): Disposable;
  function registerCodeLensProvider(selector: DocumentSelector, provider: CodeLensProvider): Disposable;
  function registerDefinitionProvider(selector: DocumentSelector, provider: DefinitionProvider): Disposable;
  function registerReferenceProvider(selector: DocumentSelector, provider: ReferenceProvider): Disposable;
  function registerRenameProvider(selector: DocumentSelector, provider: RenameProvider): Disposable;
  function registerDocumentSymbolProvider(selector: DocumentSelector, provider: DocumentSymbolProvider): Disposable;
  function registerDocumentFormattingEditProvider(selector: DocumentSelector, provider: DocumentFormattingEditProvider): Disposable;
  function registerDocumentRangeFormattingEditProvider(selector: DocumentSelector, provider: DocumentRangeFormattingEditProvider): Disposable;
  function registerSignatureHelpProvider(selector: DocumentSelector, provider: SignatureHelpProvider, ...triggerCharacters: string[]): Disposable;

  function createDiagnosticCollection(name?: string): DiagnosticCollection;
  function getDiagnostics(resource?: Uri): Diagnostic[] | [Uri, Diagnostic[]][];

  function setLanguageConfiguration(language: string, configuration: LanguageConfiguration): Disposable;
}

export interface CodeActionProviderMetadata {
  readonly providedCodeActionKinds?: readonly CodeActionKind[];
}

export interface LanguageConfiguration {
  comments?: CommentRule;
  brackets?: [string, string][];
  wordPattern?: RegExp;
  indentationRules?: IndentationRule;
  autoClosingPairs?: AutoClosingPair[];
}

export interface CommentRule {
  lineComment?: string;
  blockComment?: [string, string];
}

export interface IndentationRule {
  increaseIndentPattern: RegExp;
  decreaseIndentPattern: RegExp;
}

export interface AutoClosingPair {
  open: string;
  close: string;
  notIn?: string[];
}
```

### `src/debug.ts` — Debug Types

```typescript
import { Disposable, Event, Uri } from './types';

export interface DebugSession {
  readonly id: string;
  readonly type: string;
  readonly name: string;
  customRequest(command: string, args?: any): Promise<any>;
}

export interface DebugConfiguration {
  type: string;
  name: string;
  request: 'launch' | 'attach';
  [key: string]: any;
}

export interface Breakpoint {
  readonly id: string;
  readonly enabled: boolean;
  readonly condition?: string;
  readonly hitCondition?: string;
  readonly logMessage?: string;
}

export interface SourceBreakpoint extends Breakpoint {
  readonly location: Location;
}

export interface FunctionBreakpoint extends Breakpoint {
  readonly functionName: string;
}

export namespace debug {
  const activeDebugSession: DebugSession | undefined;
  const breakpoints: readonly Breakpoint[];

  function startDebugging(folder: WorkspaceFolder | undefined, config: DebugConfiguration): Promise<boolean>;
  function stopDebugging(session?: DebugSession): Promise<void>;
  function addBreakpoints(breakpoints: Breakpoint[]): void;
  function removeBreakpoints(breakpoints: Breakpoint[]): void;

  const onDidStartDebugSession: Event<DebugSession>;
  const onDidTerminateDebugSession: Event<DebugSession>;
  const onDidChangeActiveDebugSession: Event<DebugSession | undefined>;
  const onDidChangeBreakpoints: Event<BreakpointsChangeEvent>;
}

export interface BreakpointsChangeEvent {
  readonly added: readonly Breakpoint[];
  readonly removed: readonly Breakpoint[];
  readonly changed: readonly Breakpoint[];
}
```

### `src/terminal.ts` — Terminal Types

```typescript
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

export namespace terminal {
  const terminals: readonly Terminal[];
  const activeTerminal: Terminal | undefined;

  function createTerminal(options?: TerminalOptions): Terminal;
  function createTerminal(name?: string, shellPath?: string, shellArgs?: string | string[]): Terminal;

  const onDidOpenTerminal: Event<Terminal>;
  const onDidCloseTerminal: Event<Terminal>;
  const onDidChangeActiveTerminal: Event<Terminal | undefined>;
  const onDidWriteTerminalData: Event<TerminalDataWriteEvent>;
}

export interface TerminalDataWriteEvent {
  readonly terminal: Terminal;
  readonly data: string;
}
```

### `src/ai.ts` — AI Provider & Agent Types

```typescript
import { Disposable, CancellationToken } from './types';

// === AI Provider Adapter ===

/**
 * Interface that AI providers implement to integrate with Hone.
 * Extensions can register custom providers (e.g., corporate LLM endpoints).
 */
export interface AIProviderAdapter {
  readonly id: string;
  readonly name: string;
  readonly capabilities: AICapabilities;

  /** Stream a completion (for inline ghost text / FIM) */
  complete(request: CompletionRequest, token?: CancellationToken): AsyncIterable<CompletionChunk>;

  /** Stream a chat response */
  chat(request: ChatRequest, token?: CancellationToken): AsyncIterable<ChatChunk>;

  /** Stream a chat response with tool use support (for agent mode) */
  chatWithTools(request: ToolChatRequest, token?: CancellationToken): AsyncIterable<ToolChatChunk>;
}

export interface AICapabilities {
  maxContextTokens: number;
  supportsStreaming: boolean;
  supportsToolUse: boolean;
  supportsVision: boolean;
  supportsFIM: boolean;
  estimatedLatencyMs: number;
}

// === Completion (Ghost Text / FIM) ===

export interface CompletionRequest {
  prompt: string;
  suffix?: string;
  maxTokens?: number;
  temperature?: number;
  stop?: string[];
  model?: string;
}

export interface CompletionChunk {
  text: string;
  done: boolean;
}

// === Chat ===

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string | ChatContentPart[];
}

export interface ChatContentPart {
  type: 'text' | 'image';
  text?: string;
  imageUrl?: string;
  mimeType?: string;
}

export interface ChatRequest {
  messages: ChatMessage[];
  model?: string;
  maxTokens?: number;
  temperature?: number;
  stop?: string[];
}

export interface ChatChunk {
  text: string;
  done: boolean;
  usage?: TokenUsage;
}

export interface TokenUsage {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
}

// === Tool Use (Agent Mode) ===

export interface AgentToolDefinition {
  name: string;
  description: string;
  inputSchema: Record<string, any>;  // JSON Schema
  requiresApproval: boolean;
}

export interface ToolChatRequest extends ChatRequest {
  tools: AgentToolDefinition[];
}

export interface ToolCall {
  id: string;
  name: string;
  arguments: Record<string, any>;
}

export interface ToolResult {
  toolCallId: string;
  content: string;
  isError?: boolean;
}

export interface ToolChatChunk {
  type: 'text' | 'tool_call' | 'tool_result_request';
  text?: string;
  toolCall?: ToolCall;
  done: boolean;
  usage?: TokenUsage;
}

// === AI Namespace ===

export namespace ai {
  /** Register a custom AI provider adapter */
  function registerAIProvider(provider: AIProviderAdapter): Disposable;

  /** Register a custom agent tool */
  function registerAgentTool(tool: AgentToolDefinition & { execute: (args: Record<string, any>) => Promise<string> }): Disposable;

  /** Get the currently active AI provider (user's configured default) */
  function getActiveProvider(): AIProviderAdapter | null;

  /** List all registered providers */
  function getProviders(): AIProviderAdapter[];
}
```

### `src/index.ts` — Barrel Export

```typescript
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
```

---

## 5. Implementation Guide

### `src/types.ts`
**Purpose:** Foundation types used across all other modules.
- `Disposable` — The cleanup pattern. Every `register*` call returns one. Extensions push them into `context.subscriptions` for auto-cleanup.
- `Event<T>` — A function type that accepts a listener callback. The implementation (in hone-core) manages listener lists, but extensions only see this signature.
- `Uri` — Immutable identifier for resources. The `Uri` namespace provides factory functions. The `fsPath` property converts to OS-native paths.
- `CancellationToken` — Providers receive this so they can abort long operations when the user moves on.
- `ProviderResult<T>` — Convenience type allowing providers to return values synchronously or as promises, with null/undefined for "no result."

**Edge cases:**
- `Uri.file()` must handle Windows drive letters (`C:\`) and Unix paths (`/usr/`).
- `Event` must support multiple listeners and handle disposal during emission.

### `src/commands.ts`
**Purpose:** The command system — how extensions register callable actions.
- `registerCommand` returns a Disposable. Calling dispose unregisters the command.
- `executeCommand` returns a Promise that resolves to the handler's return value.
- Command IDs should be namespaced (e.g., `myext.doThing`).

### `src/editor.ts`
**Purpose:** The text editing surface API — what extensions see when manipulating open documents.
- `Position` and `Range` are zero-based (line 0, character 0 is the start of the file).
- `TextDocument` is read-only. Mutations go through `TextEditor.edit()` which takes an `EditBuilder`.
- Multi-cursor is exposed through `TextEditor.selections` (array of Selections).
- `DecorationRenderOptions` supports `before` and `after` pseudo-elements for inline decorations.

**Edge cases:**
- `validatePosition` must clamp to valid document bounds.
- `getWordRangeAtPosition` with no regex uses default word boundaries.

### `src/workspace.ts`
**Purpose:** File system access, configuration, and workspace events.
- `openTextDocument` opens or returns an already-open document by URI.
- `findFiles` uses glob patterns and returns matching URIs.
- `Configuration` is layered: default < user < workspace < language-specific.
- `WorkspaceEdit` supports multi-file atomic edits.

### `src/ui.ts`
**Purpose:** All UI contribution points — status bar, quick pick, tree views, webviews, dialogs, messages.
- `TreeDataProvider` is the primary way extensions add sidebar views.
- `WebviewPanel` provides an HTML rendering surface for complex custom UIs.
- `StatusBarItem` entries appear in the bottom bar.
- `showQuickPick` and `showInputBox` are the primary user input methods.

### `src/languages.ts`
**Purpose:** Language intelligence registration — completion, hover, diagnostics, definitions, etc.
- Providers are registered with a `DocumentSelector` that filters by language/scheme/pattern.
- Most providers are lazy — only called when the user interacts (hover, trigger completion, etc.).
- `DiagnosticCollection` is the exception — extensions push diagnostics proactively.
- `CodeActionProvider` supports quick fixes (from diagnostics) and refactoring.

### `src/debug.ts`
**Purpose:** Debug session lifecycle and breakpoint management.
- `startDebugging` launches a debug session with the given configuration.
- Breakpoints are managed as abstract objects with conditions and hit counts.
- `customRequest` allows sending arbitrary DAP messages.

### `src/terminal.ts`
**Purpose:** Terminal creation and interaction.
- `createTerminal` spawns a shell process.
- `sendText` writes to stdin. `onDidWriteTerminalData` emits stdout/stderr data.
- Terminal lifecycle events track open/close/active changes.

### `src/ai.ts`
**Purpose:** AI provider registration and agent tool definitions.
- `AIProviderAdapter` is the core interface. Each provider (Anthropic, OpenAI, etc.) implements it.
- Extensions can register custom providers for corporate LLMs.
- `AgentToolDefinition` lets extensions add tools the agent can use.
- All AI methods return `AsyncIterable` for streaming.
- `chatWithTools` is the key agent method — returns text and tool calls interleaved.

### `src/index.ts`
**Purpose:** Single barrel export. Extensions do `import * as hone from '@honeide/api'`.
- Also defines `ExtensionContext` and activation/deactivation function types.
- `ExtensionContext.subscriptions` is the primary cleanup mechanism.

---

## 6. Perry Integration

### Build Command
```bash
perry compile src/index.ts --output-type library --target <platform>
```

Since `hone-api` is pure types with no runtime code, Perry compiles it as type declarations only. It serves as:
1. A compile-time dependency for extensions (type-checking only)
2. A type definition source for hone-core to implement against

### No FFI Required
This package has zero platform-specific code. No native rendering, no system calls.

### npm Publishing
```json
{
  "name": "@honeide/api",
  "version": "1.0.0",
  "types": "src/index.ts",
  "files": ["src/"],
  "license": "MIT"
}
```

---

## 7. Test Strategy

### Type Check Tests (`tests/type-checks.ts`)
Compile-only tests that assert type relationships work correctly:
```typescript
// Verify a CompletionProvider can be created
const provider: CompletionProvider = {
  provideCompletionItems(doc, pos, token, ctx) {
    return [{ label: 'test', kind: CompletionItemKind.Text }];
  }
};

// Verify Event<T> signature
const event: Event<TextDocument> = (listener) => ({ dispose() {} });

// Verify Disposable pattern
const disposable: Disposable = { dispose() {} };
```

### API Surface Tests (`tests/api-surface.test.ts`)
Ensures all expected exports exist and are the correct types:
```typescript
import * as hone from '../src/index';

// Assert namespaces exist
assert(typeof hone.commands !== 'undefined');
assert(typeof hone.workspace !== 'undefined');
assert(typeof hone.editor !== 'undefined');
assert(typeof hone.languages !== 'undefined');
assert(typeof hone.ui !== 'undefined');
assert(typeof hone.debug !== 'undefined');
assert(typeof hone.terminal !== 'undefined');
assert(typeof hone.ai !== 'undefined');

// Assert key enums
assert(hone.DiagnosticSeverity.Error === 0);
assert(hone.CompletionItemKind.Method === 1);
```

---

## 8. Phased Milestones

### Phase 1: Core Types (Week 1)
- `types.ts` — Disposable, Event, Uri, CancellationToken
- `commands.ts` — Command registration
- `editor.ts` — Position, Range, Selection, TextDocument, TextEditor
- Type check tests passing

### Phase 2: Workspace & UI (Week 1–2)
- `workspace.ts` — WorkspaceFolder, Configuration, events
- `ui.ts` — StatusBarItem, TreeDataProvider, QuickPick, WebviewPanel
- All UI contribution types complete

### Phase 3: Language & Debug (Week 2)
- `languages.ts` — All provider interfaces (Completion, Hover, CodeAction, etc.)
- `debug.ts` — Debug session and breakpoint types

### Phase 4: Terminal & AI (Week 2–3)
- `terminal.ts` — Terminal creation and lifecycle
- `ai.ts` — AIProviderAdapter, AgentToolDefinition, chat/completion/tool types
- `index.ts` — Barrel export with ExtensionContext

### Phase 5: Publish (Week 3)
- Full API surface review
- Ensure compatibility with hone-core implementation plan
- Publish `@honeide/api@0.1.0` on npm
- CHANGELOG.md

---

## 9. Open Questions / Risks

1. **API stability vs. features**: The AI namespace (`ai.ts`) is the most likely to change as agent capabilities evolve. Consider marking it as `@experimental` until v1.0.

2. **VSCode API compatibility**: The current design is VSCode-inspired but not identical. Should we add a compatibility shim or accept divergence? Current decision: accept divergence, optimize for Hone's native model.

3. **Extension sandboxing**: Perry compiles extensions to native code in-process. Without a runtime sandbox, malicious extensions have full access. Mitigation: curated marketplace with code review, plus OS-level sandboxing on platforms that support it (macOS App Sandbox, iOS).

4. **Webview security**: `WebviewPanel` provides raw HTML rendering. CSP (Content Security Policy) must be enforced. The `cspSource` property helps extensions load resources safely.

5. **Namespace pattern vs. class pattern**: Using namespaces (like VSCode's `vscode.commands.registerCommand`) vs. class instances. Current decision: namespaces for familiarity.

6. **Thenable vs. Promise**: Using `ProviderResult<T>` allows synchronous returns from providers (important for performance). This is VSCode's approach and we follow it.
