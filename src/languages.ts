import { Disposable, CancellationToken, ProviderResult, Uri, Event } from './types';
import { Position, Range, TextDocument, TextEdit, SnippetString, Location } from './editor';
import { WorkspaceEdit } from './workspace';
import { CommandRef } from './ui';

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

export interface CompletionItemLabel {
  label: string;
  detail?: string;
  description?: string;
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

export interface CodeActionProviderMetadata {
  readonly providedCodeActionKinds?: readonly CodeActionKind[];
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

// === Language Configuration ===

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

// === Namespace ===

export declare namespace languages {
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
