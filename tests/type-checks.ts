/**
 * Compile-only type assertion tests.
 * These are never executed — they exist solely to ensure the type system is correctly shaped.
 * If this file compiles without errors, the types are correct.
 */

import {
  Disposable,
  Event,
  Uri,
  CancellationToken,
  ProviderResult,
  Progress,
  ProgressLocation,
} from '../src/types';

import {
  Position,
  Range,
  Selection,
  TextEdit,
  TextDocument,
  TextEditor,
  TextEditorEdit,
  SnippetString,
  Location,
  EndOfLine,
  TextEditorCursorStyle,
} from '../src/editor';

import { WorkspaceFolder, WorkspaceEdit, Configuration } from '../src/workspace';

import {
  TreeDataProvider,
  TreeItem,
  TreeItemCollapsibleState,
  StatusBarItem,
  StatusBarAlignment,
  QuickPickItem,
  WebviewPanel,
  CommandRef,
} from '../src/ui';

import {
  CompletionProvider,
  CompletionItemKind,
  CompletionItem,
  HoverProvider,
  Hover,
  DiagnosticSeverity,
  Diagnostic,
  DiagnosticCollection,
  CodeActionProvider,
  CodeActionKind,
  DocumentSymbolProvider,
  SymbolKind,
  MarkdownString,
} from '../src/languages';

import { DebugSession, DebugConfiguration, Breakpoint } from '../src/debug';
import { Terminal, TerminalOptions, TerminalExitReason } from '../src/terminal';
import {
  AIProviderAdapter,
  AICapabilities,
  ChatRequest,
  ChatChunk,
  CompletionRequest,
  CompletionChunk,
  ToolChatRequest,
  ToolChatChunk,
  AgentToolDefinition,
} from '../src/ai';

import { ExtensionContext, ActivateFunction, DeactivateFunction } from '../src/index';

// --- Disposable ---

const disposable: Disposable = { dispose() {} };

// --- Event ---

const event: Event<TextDocument> = (listener) => ({ dispose() {} });

// --- Uri (structural) ---

const uri: Uri = {
  scheme: 'file',
  authority: '',
  path: '/foo/bar.ts',
  query: '',
  fragment: '',
  fsPath: '/foo/bar.ts',
  toString() { return 'file:///foo/bar.ts'; },
};

// --- Position / Range / Selection ---

const pos: Position = { line: 0, character: 0 };
const range: Range = {
  start: pos,
  end: pos,
  isEmpty: true,
  isSingleLine: true,
  contains(_: Position | Range) { return true; },
};
const selection: Selection = { ...range, anchor: pos, active: pos, isReversed: false };

// --- TextEdit ---

const edit: TextEdit = { range, newText: 'hello' };

// --- Location ---

const location: Location = { uri, range };

// --- CompletionProvider ---

const completionProvider: CompletionProvider = {
  provideCompletionItems(_doc, _pos, _token, _ctx) {
    return [{ label: 'test', kind: CompletionItemKind.Text }];
  },
};

// --- HoverProvider ---

const hoverProvider: HoverProvider = {
  provideHover(_doc, _pos, _token) {
    const hover: Hover = { contents: [{ value: '**hover**' }] };
    return hover;
  },
};

// --- CodeActionProvider ---

const codeActionProvider: CodeActionProvider = {
  provideCodeActions(_doc, _range, _ctx, _token) {
    return [{ title: 'Fix it', kind: CodeActionKind.QuickFix }];
  },
};

// --- TreeDataProvider ---

interface MyItem { label: string }

const treeProvider: TreeDataProvider<MyItem> = {
  getTreeItem(element) {
    return { label: element.label, collapsibleState: TreeItemCollapsibleState.None };
  },
  getChildren() { return []; },
};

// --- AIProviderAdapter ---

const capabilities: AICapabilities = {
  maxContextTokens: 200000,
  supportsStreaming: true,
  supportsToolUse: true,
  supportsVision: true,
  supportsFIM: true,
  estimatedLatencyMs: 500,
};

const aiProvider: AIProviderAdapter = {
  id: 'my-provider',
  name: 'My LLM',
  capabilities,
  async *complete(_req: CompletionRequest): AsyncIterable<CompletionChunk> {
    yield { text: 'hello', done: false };
    yield { text: '', done: true };
  },
  async *chat(_req: ChatRequest): AsyncIterable<ChatChunk> {
    yield { text: 'hi', done: false };
    yield { text: '', done: true };
  },
  async *chatWithTools(_req: ToolChatRequest): AsyncIterable<ToolChatChunk> {
    yield { type: 'text', text: 'response', done: true };
  },
};

// --- AgentToolDefinition ---

const tool: AgentToolDefinition = {
  name: 'read_file',
  description: 'Read a file from disk',
  inputSchema: {
    type: 'object',
    properties: { path: { type: 'string' } },
    required: ['path'],
  },
  requiresApproval: false,
};

// --- ExtensionContext ---

const activate: ActivateFunction = (context: ExtensionContext) => {
  context.subscriptions.push({ dispose() {} });
};

const deactivate: DeactivateFunction = () => {};

// --- Diagnostic ---

const diagnostic: Diagnostic = {
  range,
  message: 'Something is wrong',
  severity: DiagnosticSeverity.Error,
  source: 'my-linter',
};

// --- WorkspaceEdit (structural) ---

const wsEdit: WorkspaceEdit = {
  size: 0,
  set(_uri, _edits) {},
  has(_uri) { return false; },
  entries() { return []; },
};

// Ensure ProgressLocation enum is accessible
const _loc: ProgressLocation = ProgressLocation.Notification;
const _cursorStyle: TextEditorCursorStyle = TextEditorCursorStyle.Line;
const _exitReason: TerminalExitReason = TerminalExitReason.User;
const _symbolKind: SymbolKind = SymbolKind.Function;
