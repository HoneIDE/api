/**
 * API surface tests — ensures all expected exports exist and key enum values are correct.
 * These run at compile time (type-level) and optionally at runtime with a simple assert helper.
 */

import * as hone from '../src/index';

function assert(condition: boolean, message: string): void {
  if (!condition) {
    throw new Error(`API surface assertion failed: ${message}`);
  }
}

// === Namespaces ===

assert(typeof hone.commands !== 'undefined', 'hone.commands namespace missing');
assert(typeof hone.workspace !== 'undefined', 'hone.workspace namespace missing');
assert(typeof hone.ui !== 'undefined', 'hone.ui namespace missing');
assert(typeof hone.languages !== 'undefined', 'hone.languages namespace missing');
assert(typeof hone.debug !== 'undefined', 'hone.debug namespace missing');
assert(typeof hone.terminal !== 'undefined', 'hone.terminal namespace missing');
assert(typeof hone.ai !== 'undefined', 'hone.ai namespace missing');

// === DiagnosticSeverity ===

assert(hone.DiagnosticSeverity.Error === 0, 'DiagnosticSeverity.Error should be 0');
assert(hone.DiagnosticSeverity.Warning === 1, 'DiagnosticSeverity.Warning should be 1');
assert(hone.DiagnosticSeverity.Information === 2, 'DiagnosticSeverity.Information should be 2');
assert(hone.DiagnosticSeverity.Hint === 3, 'DiagnosticSeverity.Hint should be 3');

// === CompletionItemKind ===

assert(hone.CompletionItemKind.Text === 0, 'CompletionItemKind.Text should be 0');
assert(hone.CompletionItemKind.Method === 1, 'CompletionItemKind.Method should be 1');
assert(hone.CompletionItemKind.Function === 2, 'CompletionItemKind.Function should be 2');
assert(hone.CompletionItemKind.TypeParameter === 24, 'CompletionItemKind.TypeParameter should be 24');

// === CodeActionKind ===

assert(hone.CodeActionKind.QuickFix === 'quickfix', 'CodeActionKind.QuickFix should be "quickfix"');
assert(hone.CodeActionKind.Refactor === 'refactor', 'CodeActionKind.Refactor should be "refactor"');
assert(hone.CodeActionKind.SourceOrganizeImports === 'source.organizeImports', 'CodeActionKind.SourceOrganizeImports mismatch');

// === SymbolKind ===

assert(hone.SymbolKind.File === 0, 'SymbolKind.File should be 0');
assert(hone.SymbolKind.Function === 11, 'SymbolKind.Function should be 11');
assert(hone.SymbolKind.TypeParameter === 25, 'SymbolKind.TypeParameter should be 25');

// === EndOfLine ===

assert(hone.EndOfLine.LF === 1, 'EndOfLine.LF should be 1');
assert(hone.EndOfLine.CRLF === 2, 'EndOfLine.CRLF should be 2');

// === StatusBarAlignment ===

assert(hone.StatusBarAlignment.Left === 1, 'StatusBarAlignment.Left should be 1');
assert(hone.StatusBarAlignment.Right === 2, 'StatusBarAlignment.Right should be 2');

// === TreeItemCollapsibleState ===

assert(hone.TreeItemCollapsibleState.None === 0, 'TreeItemCollapsibleState.None should be 0');
assert(hone.TreeItemCollapsibleState.Collapsed === 1, 'TreeItemCollapsibleState.Collapsed should be 1');
assert(hone.TreeItemCollapsibleState.Expanded === 2, 'TreeItemCollapsibleState.Expanded should be 2');

// === ProgressLocation ===

assert(hone.ProgressLocation.SourceControl === 1, 'ProgressLocation.SourceControl should be 1');
assert(hone.ProgressLocation.Window === 10, 'ProgressLocation.Window should be 10');
assert(hone.ProgressLocation.Notification === 15, 'ProgressLocation.Notification should be 15');

// === TerminalExitReason ===

assert(hone.TerminalExitReason.Unknown === 0, 'TerminalExitReason.Unknown should be 0');
assert(hone.TerminalExitReason.Extension === 4, 'TerminalExitReason.Extension should be 4');

// === TextEditorCursorStyle ===

assert(hone.TextEditorCursorStyle.Line === 1, 'TextEditorCursorStyle.Line should be 1');
assert(hone.TextEditorCursorStyle.Block === 2, 'TextEditorCursorStyle.Block should be 2');

// === TextEditorRevealType ===

assert(hone.TextEditorRevealType.Default === 0, 'TextEditorRevealType.Default should be 0');
assert(hone.TextEditorRevealType.InCenter === 1, 'TextEditorRevealType.InCenter should be 1');

// === CompletionTriggerKind ===

assert(hone.CompletionTriggerKind.Invoke === 0, 'CompletionTriggerKind.Invoke should be 0');
assert(hone.CompletionTriggerKind.TriggerCharacter === 1, 'CompletionTriggerKind.TriggerCharacter should be 1');

// === CodeActionTriggerKind ===

assert(hone.CodeActionTriggerKind.Invoke === 1, 'CodeActionTriggerKind.Invoke should be 1');
assert(hone.CodeActionTriggerKind.Automatic === 2, 'CodeActionTriggerKind.Automatic should be 2');

// === TextDocumentChangeReason ===

assert(hone.TextDocumentChangeReason.Undo === 1, 'TextDocumentChangeReason.Undo should be 1');
assert(hone.TextDocumentChangeReason.Redo === 2, 'TextDocumentChangeReason.Redo should be 2');

// === SignatureHelpTriggerKind ===

assert(hone.SignatureHelpTriggerKind.Invoke === 1, 'SignatureHelpTriggerKind.Invoke should be 1');
assert(hone.SignatureHelpTriggerKind.TriggerCharacter === 2, 'SignatureHelpTriggerKind.TriggerCharacter should be 2');
assert(hone.SignatureHelpTriggerKind.ContentChange === 3, 'SignatureHelpTriggerKind.ContentChange should be 3');

// All assertions passed if no error was thrown above.
