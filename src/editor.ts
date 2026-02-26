import { Disposable, Event, Uri, ProviderResult } from './types';

/** Zero-based line and character position in a document */
export interface Position {
  readonly line: number;
  readonly character: number;
}

export declare namespace Position {
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

export declare namespace Range {
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

export declare namespace TextEdit {
  function insert(position: Position, newText: string): TextEdit;
  function delete_(range: Range): TextEdit;
  function replace(range: Range, newText: string): TextEdit;
}

/** A location in a document — used by language features and debug */
export interface Location {
  uri: Uri;
  range: Range;
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
