# Changelog

All notable changes to `@honeide/api` will be documented here.

## [0.1.0] — Unreleased

### Added
- `src/types.ts` — Foundation primitives: `Disposable`, `Event<T>`, `Uri`, `CancellationToken`, `CancellationTokenSource`, `ProviderResult<T>`, `OutputChannel`, `Progress<T>`, `ProgressOptions`, `ProgressLocation`
- `src/commands.ts` — `commands` namespace: `registerCommand`, `executeCommand`, `getCommands`
- `src/editor.ts` — Text editor surface: `Position`, `Range`, `Selection`, `TextEdit`, `Location`, `TextDocument`, `TextLine`, `TextEditor`, `TextEditorEdit`, `SnippetString`, `TextEditorDecorationType`, decoration types, and related enums
- `src/workspace.ts` — Workspace API: `WorkspaceFolder`, `Configuration`, `WorkspaceEdit`, `FileSystemWatcher`, document/configuration events, and the `workspace` namespace
- `src/ui.ts` — UI contributions: `StatusBarItem`, `QuickPickItem`, `InputBoxOptions`, `TreeDataProvider`, `TreeItem`, `WebviewPanel`, `Webview`, message/dialog helpers, and the `ui` namespace
- `src/languages.ts` — Language intelligence: `CompletionProvider`, `HoverProvider`, `CodeActionProvider`, `CodeLensProvider`, `DefinitionProvider`, `ReferenceProvider`, `RenameProvider`, `DocumentSymbolProvider`, `DocumentFormattingEditProvider`, `DocumentRangeFormattingEditProvider`, `SignatureHelpProvider`, `DiagnosticCollection`, `LanguageConfiguration`, and the `languages` namespace
- `src/debug.ts` — Debug support: `DebugSession`, `DebugConfiguration`, `Breakpoint`, `SourceBreakpoint`, `FunctionBreakpoint`, `BreakpointsChangeEvent`, and the `debug` namespace
- `src/terminal.ts` — Terminal API: `Terminal`, `TerminalOptions`, `TerminalExitStatus`, `TerminalDataWriteEvent`, and the `terminal` namespace
- `src/ai.ts` — AI integration: `AIProviderAdapter`, `AICapabilities`, `CompletionRequest/Chunk`, `ChatRequest/Chunk`, `ToolChatRequest/Chunk`, `AgentToolDefinition`, `ToolCall`, `ToolResult`, `TokenUsage`, and the `ai` namespace
- `src/index.ts` — Barrel export; `ExtensionContext`, `ActivateFunction`, `DeactivateFunction`
- `tests/type-checks.ts` — Compile-time type assertion tests
- `tests/api-surface.test.ts` — Runtime enum value and namespace existence tests
