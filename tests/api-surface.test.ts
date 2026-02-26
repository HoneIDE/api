/**
 * API surface tests — runtime enum value assertions.
 *
 * TypeScript enums compile to JavaScript objects, so their numeric/string
 * values can be verified at runtime. This guards against accidental enum
 * reordering, which would be a breaking change for any protocol that
 * serialises these values over the wire.
 *
 * Run: compile with `npm run build:tests`, then `node .test-dist/tests/api-surface.test.js`
 * Or:  npm run test:enums
 *
 * NOTE: `declare namespace` blocks emit no JavaScript, so namespace existence
 * is verified at compile time in tests/type-checks.ts instead.
 */

import * as hone from '../src/index';

let passed = 0;
let failed = 0;

function assert(condition: boolean, message: string): void {
  if (condition) {
    passed++;
  } else {
    failed++;
    throw new Error(`FAIL: ${message}`);
  }
}

// ─── DiagnosticSeverity ───────────────────────────────────────────────────────

assert(hone.DiagnosticSeverity.Error === 0,       'DiagnosticSeverity.Error === 0');
assert(hone.DiagnosticSeverity.Warning === 1,     'DiagnosticSeverity.Warning === 1');
assert(hone.DiagnosticSeverity.Information === 2, 'DiagnosticSeverity.Information === 2');
assert(hone.DiagnosticSeverity.Hint === 3,        'DiagnosticSeverity.Hint === 3');

// ─── CompletionItemKind ───────────────────────────────────────────────────────

assert(hone.CompletionItemKind.Text === 0,          'CompletionItemKind.Text === 0');
assert(hone.CompletionItemKind.Method === 1,        'CompletionItemKind.Method === 1');
assert(hone.CompletionItemKind.Function === 2,      'CompletionItemKind.Function === 2');
assert(hone.CompletionItemKind.Constructor === 3,   'CompletionItemKind.Constructor === 3');
assert(hone.CompletionItemKind.Field === 4,         'CompletionItemKind.Field === 4');
assert(hone.CompletionItemKind.Variable === 5,      'CompletionItemKind.Variable === 5');
assert(hone.CompletionItemKind.Class === 6,         'CompletionItemKind.Class === 6');
assert(hone.CompletionItemKind.Interface === 7,     'CompletionItemKind.Interface === 7');
assert(hone.CompletionItemKind.Module === 8,        'CompletionItemKind.Module === 8');
assert(hone.CompletionItemKind.Property === 9,      'CompletionItemKind.Property === 9');
assert(hone.CompletionItemKind.Snippet === 14,      'CompletionItemKind.Snippet === 14');
assert(hone.CompletionItemKind.TypeParameter === 24,'CompletionItemKind.TypeParameter === 24');

// ─── CodeActionKind ───────────────────────────────────────────────────────────

assert(hone.CodeActionKind.QuickFix === 'quickfix',                        'CodeActionKind.QuickFix');
assert(hone.CodeActionKind.Refactor === 'refactor',                        'CodeActionKind.Refactor');
assert(hone.CodeActionKind.RefactorExtract === 'refactor.extract',         'CodeActionKind.RefactorExtract');
assert(hone.CodeActionKind.RefactorInline === 'refactor.inline',           'CodeActionKind.RefactorInline');
assert(hone.CodeActionKind.RefactorRewrite === 'refactor.rewrite',         'CodeActionKind.RefactorRewrite');
assert(hone.CodeActionKind.Source === 'source',                            'CodeActionKind.Source');
assert(hone.CodeActionKind.SourceOrganizeImports === 'source.organizeImports', 'CodeActionKind.SourceOrganizeImports');
assert(hone.CodeActionKind.SourceFixAll === 'source.fixAll',               'CodeActionKind.SourceFixAll');

// ─── SymbolKind ───────────────────────────────────────────────────────────────

assert(hone.SymbolKind.File === 0,          'SymbolKind.File === 0');
assert(hone.SymbolKind.Module === 1,        'SymbolKind.Module === 1');
assert(hone.SymbolKind.Class === 4,         'SymbolKind.Class === 4');
assert(hone.SymbolKind.Method === 5,        'SymbolKind.Method === 5');
assert(hone.SymbolKind.Function === 11,     'SymbolKind.Function === 11');
assert(hone.SymbolKind.Variable === 12,     'SymbolKind.Variable === 12');
assert(hone.SymbolKind.TypeParameter === 25,'SymbolKind.TypeParameter === 25');

// ─── EndOfLine ────────────────────────────────────────────────────────────────

assert(hone.EndOfLine.LF === 1,   'EndOfLine.LF === 1');
assert(hone.EndOfLine.CRLF === 2, 'EndOfLine.CRLF === 2');

// ─── StatusBarAlignment ───────────────────────────────────────────────────────

assert(hone.StatusBarAlignment.Left === 1,  'StatusBarAlignment.Left === 1');
assert(hone.StatusBarAlignment.Right === 2, 'StatusBarAlignment.Right === 2');

// ─── TreeItemCollapsibleState ─────────────────────────────────────────────────

assert(hone.TreeItemCollapsibleState.None === 0,      'TreeItemCollapsibleState.None === 0');
assert(hone.TreeItemCollapsibleState.Collapsed === 1, 'TreeItemCollapsibleState.Collapsed === 1');
assert(hone.TreeItemCollapsibleState.Expanded === 2,  'TreeItemCollapsibleState.Expanded === 2');

// ─── ProgressLocation ────────────────────────────────────────────────────────

assert(hone.ProgressLocation.SourceControl === 1,  'ProgressLocation.SourceControl === 1');
assert(hone.ProgressLocation.Window === 10,        'ProgressLocation.Window === 10');
assert(hone.ProgressLocation.Notification === 15,  'ProgressLocation.Notification === 15');

// ─── TextEditorCursorStyle ────────────────────────────────────────────────────

assert(hone.TextEditorCursorStyle.Line === 1,        'TextEditorCursorStyle.Line === 1');
assert(hone.TextEditorCursorStyle.Block === 2,       'TextEditorCursorStyle.Block === 2');
assert(hone.TextEditorCursorStyle.Underline === 3,   'TextEditorCursorStyle.Underline === 3');
assert(hone.TextEditorCursorStyle.LineThin === 4,    'TextEditorCursorStyle.LineThin === 4');
assert(hone.TextEditorCursorStyle.BlockOutline === 5,'TextEditorCursorStyle.BlockOutline === 5');

// ─── TextEditorLineNumbersStyle ───────────────────────────────────────────────

assert(hone.TextEditorLineNumbersStyle.Off === 0,      'TextEditorLineNumbersStyle.Off === 0');
assert(hone.TextEditorLineNumbersStyle.On === 1,       'TextEditorLineNumbersStyle.On === 1');
assert(hone.TextEditorLineNumbersStyle.Relative === 2, 'TextEditorLineNumbersStyle.Relative === 2');

// ─── TextEditorRevealType ─────────────────────────────────────────────────────

assert(hone.TextEditorRevealType.Default === 0,                     'TextEditorRevealType.Default === 0');
assert(hone.TextEditorRevealType.InCenter === 1,                    'TextEditorRevealType.InCenter === 1');
assert(hone.TextEditorRevealType.InCenterIfOutsideViewport === 2,   'TextEditorRevealType.InCenterIfOutsideViewport === 2');
assert(hone.TextEditorRevealType.AtTop === 3,                       'TextEditorRevealType.AtTop === 3');

// ─── CompletionTriggerKind ────────────────────────────────────────────────────

assert(hone.CompletionTriggerKind.Invoke === 0,                          'CompletionTriggerKind.Invoke === 0');
assert(hone.CompletionTriggerKind.TriggerCharacter === 1,                'CompletionTriggerKind.TriggerCharacter === 1');
assert(hone.CompletionTriggerKind.TriggerForIncompleteCompletions === 2, 'CompletionTriggerKind.TriggerForIncompleteCompletions === 2');

// ─── CodeActionTriggerKind ────────────────────────────────────────────────────

assert(hone.CodeActionTriggerKind.Invoke === 1,    'CodeActionTriggerKind.Invoke === 1');
assert(hone.CodeActionTriggerKind.Automatic === 2, 'CodeActionTriggerKind.Automatic === 2');

// ─── TextDocumentChangeReason ─────────────────────────────────────────────────

assert(hone.TextDocumentChangeReason.Undo === 1, 'TextDocumentChangeReason.Undo === 1');
assert(hone.TextDocumentChangeReason.Redo === 2, 'TextDocumentChangeReason.Redo === 2');

// ─── SignatureHelpTriggerKind ─────────────────────────────────────────────────

assert(hone.SignatureHelpTriggerKind.Invoke === 1,          'SignatureHelpTriggerKind.Invoke === 1');
assert(hone.SignatureHelpTriggerKind.TriggerCharacter === 2,'SignatureHelpTriggerKind.TriggerCharacter === 2');
assert(hone.SignatureHelpTriggerKind.ContentChange === 3,   'SignatureHelpTriggerKind.ContentChange === 3');

// ─── TerminalExitReason ───────────────────────────────────────────────────────

assert(hone.TerminalExitReason.Unknown === 0,   'TerminalExitReason.Unknown === 0');
assert(hone.TerminalExitReason.Shutdown === 1,  'TerminalExitReason.Shutdown === 1');
assert(hone.TerminalExitReason.Process === 2,   'TerminalExitReason.Process === 2');
assert(hone.TerminalExitReason.User === 3,      'TerminalExitReason.User === 3');
assert(hone.TerminalExitReason.Extension === 4, 'TerminalExitReason.Extension === 4');

// ─── Results ──────────────────────────────────────────────────────────────────
// If any assert() above throws, the process exits with an uncaught exception (code 1).
// Reaching this line means all assertions passed.
const _summary = `Enum value tests: ${passed} passed, ${failed} failed`;
