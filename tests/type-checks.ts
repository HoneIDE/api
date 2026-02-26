/**
 * Compile-only type assertion tests.
 *
 * These are NEVER executed at runtime. They exist solely to verify the type
 * system is correctly shaped. A clean `tsc --noEmit` means all tests pass.
 *
 * Positive tests: assign correctly-shaped values to typed variables.
 * Negative tests: use @ts-expect-error to assert that bad shapes are rejected.
 */

import {
  Disposable,
  Event,
  Uri,
  CancellationToken,
  CancellationTokenSource,
  ProviderResult,
  OutputChannel,
  Progress,
  ProgressLocation,
  ProgressOptions,
} from '../src/types';

import {
  Position,
  Range,
  Selection,
  TextEdit,
  TextDocument,
  TextLine,
  TextEditor,
  TextEditorEdit,
  SnippetString,
  TextEditorDecorationType,
  DecorationOptions,
  Location,
  EndOfLine,
  TextEditorCursorStyle,
  TextEditorLineNumbersStyle,
  TextEditorRevealType,
} from '../src/editor';

import {
  WorkspaceFolder,
  WorkspaceEdit,
  Configuration,
  TextDocumentChangeEvent,
  FileSystemWatcher,
  ConfigurationChangeEvent,
  TextDocumentChangeReason,
} from '../src/workspace';

import {
  TreeDataProvider,
  TreeItem,
  TreeItemCollapsibleState,
  StatusBarItem,
  StatusBarAlignment,
  QuickPickItem,
  QuickPickOptions,
  InputBoxOptions,
  WebviewPanel,
  Webview,
  CommandRef,
  MessageItem,
  OpenDialogOptions,
} from '../src/ui';

import {
  DocumentSelector,
  DocumentFilter,
  DiagnosticSeverity,
  Diagnostic,
  DiagnosticRelatedInformation,
  DiagnosticCollection,
  CompletionProvider,
  CompletionItem,
  CompletionItemKind,
  CompletionItemLabel,
  CompletionList,
  CompletionContext,
  CompletionTriggerKind,
  HoverProvider,
  Hover,
  MarkdownString,
  CodeAction,
  CodeActionProvider,
  CodeActionKind,
  CodeActionContext,
  CodeActionTriggerKind,
  CodeLens,
  CodeLensProvider,
  DefinitionProvider,
  ReferenceProvider,
  RenameProvider,
  DocumentSymbolProvider,
  DocumentSymbol,
  SymbolKind,
  FormattingOptions,
  DocumentFormattingEditProvider,
  SignatureHelpProvider,
  SignatureHelp,
  SignatureInformation,
  ParameterInformation,
  SignatureHelpTriggerKind,
  LanguageConfiguration,
} from '../src/languages';

import {
  DebugSession,
  DebugConfiguration,
  Breakpoint,
  SourceBreakpoint,
  FunctionBreakpoint,
  BreakpointsChangeEvent,
} from '../src/debug';

import {
  Terminal,
  TerminalOptions,
  TerminalExitStatus,
  TerminalExitReason,
  TerminalDataWriteEvent,
} from '../src/terminal';

import {
  AIProviderAdapter,
  AICapabilities,
  ChatRequest,
  ChatMessage,
  ChatChunk,
  CompletionRequest,
  CompletionChunk,
  ToolChatRequest,
  ToolChatChunk,
  AgentToolDefinition,
  ToolCall,
  ToolResult,
  TokenUsage,
} from '../src/ai';

import { ExtensionContext, ActivateFunction, DeactivateFunction } from '../src/index';

// ─── Shared primitives ────────────────────────────────────────────────────────

const disposable: Disposable = { dispose() {} };

// Disposable must have dispose()
// @ts-expect-error — missing dispose
const _badDisposable: Disposable = {};

const _event: Event<string> = (listener, _thisArgs, _disposables) => ({ dispose() {} });

const _uri: Uri = {
  scheme: 'file',
  authority: '',
  path: '/foo/bar.ts',
  query: '',
  fragment: '',
  fsPath: '/foo/bar.ts',
  toString() { return 'file:///foo/bar.ts'; },
};

// @ts-expect-error — fsPath is required
const _badUri: Uri = { scheme: 'file', authority: '', path: '', query: '', fragment: '', toString() { return ''; } };

const _token: CancellationToken = {
  isCancellationRequested: false,
  onCancellationRequested: (l) => ({ dispose() {} }),
};

const _src: CancellationTokenSource = {
  token: _token,
  cancel() {},
  dispose() {},
};

// ProviderResult accepts sync, promise, null, undefined
const _pr1: ProviderResult<string> = 'hello';
const _pr2: ProviderResult<string> = undefined;
const _pr3: ProviderResult<string> = null;
const _pr4: ProviderResult<string> = Promise.resolve('hello');

const _out: OutputChannel = {
  name: 'My Channel',
  append(_v) {},
  appendLine(_v) {},
  clear() {},
  show() {},
  hide() {},
  dispose() {},
};

const _progress: Progress<{ message?: string }> = { report(_v) {} };
const _progressOpts: ProgressOptions = { location: ProgressLocation.Notification, title: 'Loading', cancellable: true };

// ─── Editor types ─────────────────────────────────────────────────────────────

const pos: Position = { line: 0, character: 0 };
const pos2: Position = { line: 5, character: 10 };

// @ts-expect-error — character is required
const _badPos: Position = { line: 0 };

const range: Range = {
  start: pos,
  end: pos2,
  isEmpty: false,
  isSingleLine: false,
  contains(p) { return true; },
};

// @ts-expect-error — missing contains method
const _badRange: Range = { start: pos, end: pos2, isEmpty: false, isSingleLine: false };

// Selection extends Range — must have anchor, active, isReversed
const selection: Selection = {
  ...range,
  anchor: pos,
  active: pos2,
  isReversed: false,
};

// @ts-expect-error — isReversed is required
const _badSelection: Selection = { ...range, anchor: pos, active: pos2 };

const _edit: TextEdit = { range, newText: 'replacement' };
const _loc: Location = { uri: _uri, range };

const _line: TextLine = {
  lineNumber: 0,
  text: 'hello world',
  range,
  rangeIncludingLineBreak: range,
  firstNonWhitespaceCharacterIndex: 0,
  isEmptyOrWhitespace: false,
};

const _snippet: SnippetString = { value: 'function ${1:name}() {\n\t$0\n}' };
const _decType: TextEditorDecorationType = { key: 'my-dec', dispose() {} };
const _decOpts: DecorationOptions = { range, hoverMessage: 'hover text' };

// Enum accessibility
const _eol: EndOfLine = EndOfLine.LF;
const _cursor: TextEditorCursorStyle = TextEditorCursorStyle.Block;
const _lineNums: TextEditorLineNumbersStyle = TextEditorLineNumbersStyle.Relative;
const _reveal: TextEditorRevealType = TextEditorRevealType.InCenter;

// ─── Workspace ────────────────────────────────────────────────────────────────

const _folder: WorkspaceFolder = { uri: _uri, name: 'my-project', index: 0 };

// @ts-expect-error — index is required
const _badFolder: WorkspaceFolder = { uri: _uri, name: 'proj' };

const _cfg: Configuration = {
  get<T>(key: string, def?: T) { return def; },
  has(_k) { return false; },
  update(_k, _v) { return Promise.resolve(); },
};

// Configuration.get() returns T | undefined
const _cfgVal: string | undefined = _cfg.get<string>('editor.fontSize');
const _cfgValDef: string = _cfg.get<string>('editor.fontSize', '14px');

const _wsEdit: WorkspaceEdit = {
  size: 0,
  set(_u, _e) {},
  has(_u) { return false; },
  entries() { return []; },
};

const _watcher: FileSystemWatcher = {
  onDidCreate: (l) => ({ dispose() {} }),
  onDidChange: (l) => ({ dispose() {} }),
  onDidDelete: (l) => ({ dispose() {} }),
  dispose() {},
};

const _cfgChange: ConfigurationChangeEvent = {
  affectsConfiguration(_s) { return false; },
};

const _changeReason: TextDocumentChangeReason = TextDocumentChangeReason.Undo;

// ─── UI ───────────────────────────────────────────────────────────────────────

const _statusBar: StatusBarItem = {
  alignment: StatusBarAlignment.Left,
  priority: 100,
  text: '$(check) Ready',
  tooltip: 'Extension ready',
  command: 'myext.action',
  show() {},
  hide() {},
  dispose() {},
};

// @ts-expect-error — text is required
const _badStatus: StatusBarItem = { alignment: StatusBarAlignment.Left, show() {}, hide() {}, dispose() {} };

const _qpItem: QuickPickItem = { label: 'Option A', description: 'Does something', picked: false };
const _qpOpts: QuickPickOptions = { placeHolder: 'Select one', canPickMany: false };

const _inputOpts: InputBoxOptions = {
  prompt: 'Enter a value',
  placeHolder: 'value',
  validateInput(v) { return v.length === 0 ? 'Required' : null; },
};

const _commandRef: CommandRef = { command: 'myext.run', title: 'Run', arguments: ['arg1'] };

const _treeItem: TreeItem = {
  label: 'My Node',
  description: 'optional text',
  collapsibleState: TreeItemCollapsibleState.Collapsed,
  command: _commandRef,
  contextValue: 'myItem',
};

// TreeDataProvider is generic — getChildren returns the same type as getTreeItem receives
interface FileNode { path: string; isDir: boolean; }

const _fileTree: TreeDataProvider<FileNode> = {
  getTreeItem(el) {
    return { label: el.path, collapsibleState: el.isDir ? TreeItemCollapsibleState.Collapsed : TreeItemCollapsibleState.None };
  },
  getChildren(el) {
    return el?.isDir ? [] : [];
  },
  getParent(_el) { return undefined; },
};

const _msgItem: MessageItem = { title: 'Retry', isCloseAffordance: false };
const _openDialog: OpenDialogOptions = { canSelectFiles: true, canSelectMany: false, title: 'Pick file' };

const _webview: Webview = {
  html: '<h1>Hello</h1>',
  onDidReceiveMessage: (l) => ({ dispose() {} }),
  postMessage: (_m) => Promise.resolve(true),
  cspSource: 'vscode-webview:',
};

// ─── Languages ────────────────────────────────────────────────────────────────

// DocumentSelector accepts string, filter, or array
const _sel1: DocumentSelector = 'typescript';
const _sel2: DocumentSelector = { language: 'typescript', scheme: 'file' };
const _sel3: DocumentSelector = ['typescript', { language: 'javascript', pattern: '**/*.js' }];

const _filter: DocumentFilter = { language: 'python' };

// Diagnostic
const _diag: Diagnostic = {
  range,
  message: 'Unused variable',
  severity: DiagnosticSeverity.Warning,
  code: 'no-unused-vars',
  source: 'eslint',
};

// @ts-expect-error — message is required
const _badDiag: Diagnostic = { range, severity: DiagnosticSeverity.Error };

const _diagRelated: DiagnosticRelatedInformation = {
  location: _loc,
  message: 'Originally declared here',
};

const _diagCollection: DiagnosticCollection = {
  name: 'my-linter',
  set(_u, _d) {},
  delete(_u) {},
  clear() {},
  forEach(_cb) {},
  get(_u) { return undefined; },
  has(_u) { return false; },
  dispose() {},
};

// CompletionItem accepts plain string or CompletionItemLabel
const _ci1: CompletionItem = { label: 'myFunction' };
const _ci2: CompletionItem = { label: { label: 'myFunction', detail: '(): void', description: 'My ext' }, kind: CompletionItemKind.Function };
const _ciList: CompletionList = { isIncomplete: false, items: [_ci1, _ci2] };
const _ctx: CompletionContext = { triggerKind: CompletionTriggerKind.Invoke };

const _completionProvider: CompletionProvider = {
  provideCompletionItems(_doc, _pos, _token, _ctx) {
    return [{ label: 'test', kind: CompletionItemKind.Keyword }];
  },
  resolveCompletionItem(item, _token) { return item; },
};

// Hover
const _md: MarkdownString = { value: '**bold** text', isTrusted: true };
const _hover: Hover = { contents: [_md], range };

const _hoverProvider: HoverProvider = {
  provideHover(_doc, _pos, _token) {
    return { contents: [{ value: 'Hover info' }] };
  },
};

// CodeAction
const _codeAction: CodeAction = {
  title: 'Extract variable',
  kind: CodeActionKind.RefactorExtract,
  isPreferred: true,
};

const _codeActionCtx: CodeActionContext = {
  diagnostics: [_diag],
  triggerKind: CodeActionTriggerKind.Invoke,
};

const _codeActionProvider: CodeActionProvider = {
  provideCodeActions(_doc, _range, _ctx, _token) {
    return [{ title: 'Fix', kind: CodeActionKind.QuickFix }];
  },
};

// CodeLens
const _codeLens: CodeLens = { range, isResolved: false };

const _codeLensProvider: CodeLensProvider = {
  provideCodeLenses(_doc, _token) { return []; },
  resolveCodeLens(lens, _token) { return lens; },
};

// Definition / References
const _defProvider: DefinitionProvider = {
  provideDefinition(_doc, _pos, _token) { return _loc; },
};

const _refProvider: ReferenceProvider = {
  provideReferences(_doc, _pos, _ctx, _token) { return [_loc]; },
};

// Rename
const _renameProvider: RenameProvider = {
  provideRenameEdits(_doc, _pos, _newName, _token) { return _wsEdit; },
};

// Document Symbols
const _sym: DocumentSymbol = {
  name: 'MyClass',
  detail: '',
  kind: SymbolKind.Class,
  range,
  selectionRange: range,
  children: [],
};

const _symProvider: DocumentSymbolProvider = {
  provideDocumentSymbols(_doc, _token) { return [_sym]; },
};

// Formatting
const _fmtOpts: FormattingOptions = { tabSize: 2, insertSpaces: true };

const _fmtProvider: DocumentFormattingEditProvider = {
  provideDocumentFormattingEdits(_doc, _opts, _token) { return []; },
};

// Signature Help
const _param: ParameterInformation = { label: 'name: string' };
const _sig: SignatureInformation = { label: 'greet(name: string): void', parameters: [_param] };
const _sigHelp: SignatureHelp = { signatures: [_sig], activeSignature: 0, activeParameter: 0 };

const _sigProvider: SignatureHelpProvider = {
  provideSignatureHelp(_doc, _pos, _token, _ctx) { return _sigHelp; },
};

// Language configuration
const _langCfg: LanguageConfiguration = {
  comments: { lineComment: '//', blockComment: ['/*', '*/'] },
  brackets: [['(', ')'], ['[', ']'], ['{', '}']],
  autoClosingPairs: [{ open: '(', close: ')' }, { open: '"', close: '"' }],
};

// ─── Debug ────────────────────────────────────────────────────────────────────

const _dbgSession: DebugSession = {
  id: 'session-1',
  type: 'node',
  name: 'Launch Program',
  customRequest: (_cmd, _args) => Promise.resolve({}),
};

const _dbgConfig: DebugConfiguration = {
  type: 'node',
  name: 'Launch',
  request: 'launch',
  program: '${file}',
};

// request must be 'launch' or 'attach'
// @ts-expect-error — 'run' is not a valid request type
const _badDbgConfig: DebugConfiguration = { type: 'node', name: 'X', request: 'run' };

const _breakpoint: Breakpoint = {
  id: 'bp-1',
  enabled: true,
  condition: 'x > 5',
};

const _srcBp: SourceBreakpoint = {
  id: 'bp-2',
  enabled: true,
  location: _loc,
};

const _fnBp: FunctionBreakpoint = {
  id: 'bp-3',
  enabled: true,
  functionName: 'myFunction',
};

const _bpChange: BreakpointsChangeEvent = {
  added: [_breakpoint],
  removed: [],
  changed: [],
};

// ─── Terminal ─────────────────────────────────────────────────────────────────

const _exitStatus: TerminalExitStatus = {
  code: 0,
  reason: TerminalExitReason.Process,
};

const _terminal: Terminal = {
  name: 'My Shell',
  processId: Promise.resolve(1234),
  exitStatus: undefined,
  sendText(_text, _newLine) {},
  show() {},
  hide() {},
  dispose() {},
};

const _termOpts: TerminalOptions = {
  name: 'Build',
  shellPath: '/bin/zsh',
  env: { NODE_ENV: 'development', DEBUG: null },
  cwd: '/home/user/project',
  hideFromUser: false,
};

const _termData: TerminalDataWriteEvent = {
  terminal: _terminal,
  data: 'stdout output\n',
};

// ─── AI ───────────────────────────────────────────────────────────────────────

const _caps: AICapabilities = {
  maxContextTokens: 200_000,
  supportsStreaming: true,
  supportsToolUse: true,
  supportsVision: true,
  supportsFIM: true,
  estimatedLatencyMs: 500,
};

// @ts-expect-error — supportsFIM is required
const _badCaps: AICapabilities = {
  maxContextTokens: 100_000,
  supportsStreaming: true,
  supportsToolUse: false,
  supportsVision: false,
  estimatedLatencyMs: 200,
};

const _chatMsg: ChatMessage = { role: 'user', content: 'Hello!' };
const _chatMsgMultipart: ChatMessage = {
  role: 'user',
  content: [
    { type: 'text', text: 'What is in this image?' },
    { type: 'image', imageUrl: 'data:image/png;base64,...', mimeType: 'image/png' },
  ],
};

// @ts-expect-error — role must be 'system' | 'user' | 'assistant'
const _badMsg: ChatMessage = { role: 'bot', content: 'Hi' };

const _chatReq: ChatRequest = {
  messages: [_chatMsg],
  model: 'claude-3-5-sonnet',
  maxTokens: 1024,
  temperature: 0.7,
};

const _usage: TokenUsage = { promptTokens: 100, completionTokens: 50, totalTokens: 150 };

const _chatChunk: ChatChunk = { text: 'Hello', done: false, usage: _usage };

const _compReq: CompletionRequest = {
  prompt: 'function greet(',
  suffix: ') {',
  maxTokens: 64,
};

const _compChunk: CompletionChunk = { text: 'name: string', done: false };

const _toolDef: AgentToolDefinition = {
  name: 'read_file',
  description: 'Read the contents of a file',
  inputSchema: {
    type: 'object',
    properties: { path: { type: 'string', description: 'Absolute path to file' } },
    required: ['path'],
  },
  requiresApproval: false,
};

// @ts-expect-error — requiresApproval is required
const _badTool: AgentToolDefinition = { name: 'x', description: 'y', inputSchema: {} };

const _toolCall: ToolCall = { id: 'call-1', name: 'read_file', arguments: { path: '/tmp/a.txt' } };
const _toolResult: ToolResult = { toolCallId: 'call-1', content: 'file contents', isError: false };

const _toolChatReq: ToolChatRequest = {
  messages: [_chatMsg],
  tools: [_toolDef],
};

const _toolChunk: ToolChatChunk = { type: 'tool_call', toolCall: _toolCall, done: false };

// AIProviderAdapter — full implementation
const _aiProvider: AIProviderAdapter = {
  id: 'my-llm',
  name: 'My LLM',
  capabilities: _caps,
  async *complete(req: CompletionRequest) {
    yield { text: req.prompt.slice(0, 5), done: false };
    yield { text: '', done: true };
  },
  async *chat(req: ChatRequest) {
    yield { text: 'response', done: false };
    yield { text: '', done: true, usage: { promptTokens: 10, completionTokens: 5, totalTokens: 15 } };
  },
  async *chatWithTools(req: ToolChatRequest) {
    yield { type: 'text' as const, text: 'I will call a tool.', done: false };
    yield { type: 'tool_call' as const, toolCall: { id: 'c1', name: req.tools[0].name, arguments: {} }, done: false };
    yield { type: 'text' as const, text: 'Done.', done: true };
  },
};

// ─── ExtensionContext ─────────────────────────────────────────────────────────

const activate: ActivateFunction = (context: ExtensionContext) => {
  // subscriptions array accepts Disposable
  context.subscriptions.push(disposable);
  const _path: string = context.extensionPath;
  const _storage: string | undefined = context.storagePath;
  const _global: string = context.globalStoragePath;
};

const deactivate: DeactivateFunction = () => {};

// Async activate is also valid
const _asyncActivate: ActivateFunction = async (_ctx) => {
  await Promise.resolve();
};

// ─── Type-level namespace shape checks ───────────────────────────────────────
// These verify that the namespaces are exported at the type level.
// (Namespaces declared with `declare` emit no JS, so these are compile-time only.)

type _HasCommands = typeof import('../src/commands').commands;
type _HasWorkspace = typeof import('../src/workspace').workspace;
type _HasUi = typeof import('../src/ui').ui;
type _HasLanguages = typeof import('../src/languages').languages;
type _HasDebug = typeof import('../src/debug').debug;
type _HasTerminal = typeof import('../src/terminal').terminal;
type _HasAi = typeof import('../src/ai').ai;

// Verify specific members exist on namespaces at the type level
type _CanRegisterCommand = _HasCommands['registerCommand'];
type _CanOpenTextDocument = _HasWorkspace['openTextDocument'];
type _CanShowInputBox = _HasUi['showInputBox'];
type _CanRegisterHover = _HasLanguages['registerHoverProvider'];
type _CanStartDebugging = _HasDebug['startDebugging'];
type _CanCreateTerminal = _HasTerminal['createTerminal'];
type _CanRegisterProvider = _HasAi['registerAIProvider'];
