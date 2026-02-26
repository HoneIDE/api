# @honeide/api

[![npm version](https://img.shields.io/npm/v/@honeide/api)](https://www.npmjs.com/package/@honeide/api)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow)](LICENSE)

> The public extension API for [Hone IDE](https://hone.codes).
> A pure TypeScript type library — zero runtime code, zero dependencies.

---

## What is this?

`@honeide/api` is the foundational contract for the Hone extension ecosystem. It defines every type, interface, namespace, and event signature that extension authors need to build features for Hone.

**It is Layer 0** — no `@honeide/*` dependencies, no runtime, nothing to import at execution time. When you install this package, you are installing a set of TypeScript declarations that describe how your extension interacts with Hone.

**Who uses it:**
- **Extension authors** — import types to build and type-check their extensions
- **`hone-core`** — implements the API bridge that fulfills these contracts at runtime
- **`hone-extensions`** — all built-in extensions import only this package
- **`hone-ide`** — wires API implementations to the runtime

---

## Installation

```bash
npm install @honeide/api --save-dev
```

This is a development-time dependency only. Your compiled extension does not bundle this package.

---

## Quick Start

Every Hone extension exports an `activate` function. The `ExtensionContext` gives you access to the API surface and a subscriptions array for automatic cleanup.

```typescript
import * as hone from '@honeide/api';

export function activate(context: hone.ExtensionContext): void {
  // Register a command
  const cmd = hone.commands.registerCommand('myext.greet', () => {
    hone.ui.showInformationMessage('Hello from My Extension!');
  });

  // Register a hover provider for TypeScript files
  const hover = hone.languages.registerHoverProvider('typescript', {
    provideHover(document, position, token) {
      const word = document.getWordRangeAtPosition(position);
      if (!word) return undefined;
      return {
        contents: [{ value: `**Word:** \`${document.getText(word)}\`` }],
        range: word,
      };
    },
  });

  // Everything pushed to subscriptions is disposed on deactivation
  context.subscriptions.push(cmd, hover);
}

export function deactivate(): void {}
```

---

## API Reference

### `commands`

Register and execute commands. Commands are the primary action mechanism in Hone.

```typescript
// Register a handler
const disposable = hone.commands.registerCommand('myext.action', (arg: string) => {
  // handle command
});

// Execute programmatically
const result = await hone.commands.executeCommand<string>('myext.action', 'hello');

// List all commands
const all = await hone.commands.getCommands(/* filterInternal */ true);
```

---

### `editor`

Types for working with open text editors and documents.

```typescript
// Core types
hone.Position   // { line: number; character: number }
hone.Range      // { start, end, isEmpty, isSingleLine, contains() }
hone.Selection  // extends Range, adds anchor, active, isReversed
hone.TextEdit   // { range, newText }
hone.Location   // { uri, range }

// The document (read-only)
const doc: hone.TextDocument;
doc.getText();                          // full text
doc.lineAt(0).text;                    // first line
doc.getWordRangeAtPosition(pos);       // word boundary at position

// Mutate via the editor's edit builder
const editor: hone.TextEditor;
await editor.edit(builder => {
  builder.insert(pos, 'inserted text');
  builder.replace(range, 'replacement');
  builder.delete_(range);
});
```

---

### `workspace`

File system access, workspace folders, configuration, and document events.

```typescript
// Open a document
const doc = await hone.workspace.openTextDocument('/path/to/file.ts');

// Find files
const files = await hone.workspace.findFiles('**/*.ts', '**/node_modules/**');

// Read configuration
const cfg = hone.workspace.getConfiguration('myext');
const timeout: number = cfg.get('timeout', 5000);

// Watch for file changes
const watcher = hone.workspace.createFileSystemWatcher('**/*.ts');
context.subscriptions.push(
  watcher.onDidChange(uri => console.log('changed:', uri.fsPath)),
  watcher,
);

// Multi-file edits
const edit = new hone.WorkspaceEdit(); // implemented by hone-core
edit.set(uri, [hone.TextEdit.insert(pos, '// header\n')]);
await hone.workspace.applyEdit(edit);

// Events
hone.workspace.onDidSaveTextDocument(doc => { /* ... */ });
hone.workspace.onDidChangeConfiguration(e => {
  if (e.affectsConfiguration('myext')) { /* reload */ }
});
```

---

### `ui`

Status bar, messages, input, tree views, and webviews.

```typescript
// Status bar
const item = hone.ui.createStatusBarItem(hone.StatusBarAlignment.Left, 100);
item.text = '$(sync~spin) Building...';
item.show();

// Messages
await hone.ui.showInformationMessage('Done!');
const choice = await hone.ui.showWarningMessage('Delete file?', 'Yes', 'No');

// Input
const name = await hone.ui.showInputBox({ prompt: 'Enter name', placeHolder: 'my-extension' });
const item = await hone.ui.showQuickPick(['Option A', 'Option B'], { placeHolder: 'Select' });

// Tree view
const provider: hone.TreeDataProvider<MyNode> = {
  getTreeItem: el => ({ label: el.name, collapsibleState: hone.TreeItemCollapsibleState.None }),
  getChildren: el => el ? el.children : rootNodes,
};
hone.ui.registerTreeDataProvider('myext.view', provider);

// Webview
const panel = hone.ui.createWebviewPanel('myView', 'My Panel', { enableScripts: true });
panel.webview.html = '<html><body><h1>Hello</h1></body></html>';
panel.webview.onDidReceiveMessage(msg => { /* handle message from webview */ });
await panel.webview.postMessage({ type: 'update', data: 42 });

// Progress
await hone.ui.withProgress({ location: hone.ProgressLocation.Notification, title: 'Indexing' }, async (progress, token) => {
  progress.report({ increment: 50, message: 'halfway...' });
  await doWork(token);
});
```

---

### `languages`

Register language intelligence providers.

```typescript
// Completion
hone.languages.registerCompletionItemProvider('typescript', {
  provideCompletionItems(doc, pos, token, ctx) {
    return [
      { label: 'mySnippet', kind: hone.CompletionItemKind.Snippet, insertText: 'console.log($1)' },
    ];
  },
}, '.' /* trigger character */);

// Hover
hone.languages.registerHoverProvider({ language: 'typescript', scheme: 'file' }, {
  provideHover(doc, pos, token) {
    return { contents: [{ value: '**Type:** `string`' }] };
  },
});

// Diagnostics (pushed proactively, not pulled)
const collection = hone.languages.createDiagnosticCollection('my-linter');
collection.set(uri, [{
  range: someRange,
  message: 'Unused import',
  severity: hone.DiagnosticSeverity.Warning,
  source: 'my-linter',
}]);
context.subscriptions.push(collection);

// Code actions (quick fixes)
hone.languages.registerCodeActionProvider('typescript', {
  provideCodeActions(doc, range, ctx, token) {
    return ctx.diagnostics.map(diag => ({
      title: `Fix: ${diag.message}`,
      kind: hone.CodeActionKind.QuickFix,
      diagnostics: [diag],
    }));
  },
});

// Other providers available:
hone.languages.registerDefinitionProvider(selector, provider);
hone.languages.registerReferenceProvider(selector, provider);
hone.languages.registerRenameProvider(selector, provider);
hone.languages.registerCodeLensProvider(selector, provider);
hone.languages.registerDocumentSymbolProvider(selector, provider);
hone.languages.registerDocumentFormattingEditProvider(selector, provider);
hone.languages.registerSignatureHelpProvider(selector, provider, '(', ',');
```

---

### `debug`

Debug session lifecycle and breakpoints.

```typescript
// Start a debug session
await hone.debug.startDebugging(folder, {
  type: 'node',
  name: 'Launch',
  request: 'launch',
  program: '${file}',
});

// Listen to sessions
hone.debug.onDidStartDebugSession(session => {
  session.customRequest('evaluate', { expression: 'myVar' });
});

// Manage breakpoints
hone.debug.onDidChangeBreakpoints(({ added, removed }) => { /* ... */ });
```

---

### `terminal`

Create and interact with integrated terminals.

```typescript
const term = hone.terminal.createTerminal({ name: 'Build', shellPath: '/bin/zsh' });
term.sendText('npm run build');
term.show();

hone.terminal.onDidWriteTerminalData(({ terminal, data }) => {
  // data is stdout/stderr output
});

hone.terminal.onDidCloseTerminal(t => {
  const code = t.exitStatus?.code;
});
```

---

### `ai`

Register custom AI providers and agent tools.

```typescript
// Register a custom LLM provider
const provider: hone.AIProviderAdapter = {
  id: 'my-llm',
  name: 'Corporate LLM',
  capabilities: {
    maxContextTokens: 32_000,
    supportsStreaming: true,
    supportsToolUse: true,
    supportsVision: false,
    supportsFIM: false,
    estimatedLatencyMs: 800,
  },
  async *complete(req, token) {
    // stream FIM completions
  },
  async *chat(req, token) {
    // stream chat responses
  },
  async *chatWithTools(req, token) {
    // stream tool-use responses
  },
};

const disposable = hone.ai.registerAIProvider(provider);

// Register an agent tool the AI can use
hone.ai.registerAgentTool({
  name: 'run_tests',
  description: 'Run the project test suite and return output',
  inputSchema: {
    type: 'object',
    properties: { filter: { type: 'string', description: 'Test name filter' } },
  },
  requiresApproval: true,
  execute: async ({ filter }) => {
    // run tests, return result string
    return 'All tests passed.';
  },
});
```

---

## Extension Lifecycle

```typescript
// src/extension.ts
import * as hone from '@honeide/api';

// Called when any activation event fires (defined in extension manifest)
export function activate(context: hone.ExtensionContext): void {
  // context.extensionPath   — absolute path to your extension directory
  // context.storagePath     — workspace-scoped persistent storage
  // context.globalStoragePath — cross-workspace persistent storage
  // context.subscriptions   — push Disposables here for auto-cleanup

  const disp = hone.commands.registerCommand('myext.hello', () => {});
  context.subscriptions.push(disp);
}

// Called when the extension is deactivated (optional)
export function deactivate(): void {
  // perform any final cleanup not covered by subscriptions
}
```

---

## Disposable Pattern

Every `register*` call returns a `Disposable`. Push it into `context.subscriptions` for automatic cleanup when your extension is deactivated, or call `.dispose()` manually to unregister earlier.

```typescript
// Auto-cleanup via subscriptions
context.subscriptions.push(
  hone.commands.registerCommand('myext.foo', handler),
  hone.languages.registerHoverProvider('typescript', hoverProvider),
  hone.ui.createStatusBarItem(hone.StatusBarAlignment.Right, 0),
);

// Manual cleanup
const watcher = hone.workspace.createFileSystemWatcher('**/*.ts');
// later:
watcher.dispose();
```

---

## For `hone-core` Implementors

Every `declare namespace` in this package corresponds to a real JavaScript object you must provide via the API bridge. The shapes here are the contract — implement against them exactly.

The `export declare namespace commands { ... }` pattern means:
- At the type level: the namespace exists and has these members
- At runtime: `hone-core` must attach a real object with matching signatures

---

## Contributing

Contributions are welcome! This repository defines the public API surface for Hone extensions — changes here affect every extension author.

**Guidelines:**
- This is a **type-only** library. No runtime code, no imports from non-TypeScript packages.
- All changes to existing types are **breaking changes**. Additions are backwards-compatible.
- Run `npm test` before opening a PR — a clean type-check is the full test suite.
- For significant API additions, open an issue first to discuss design.

```bash
git clone https://github.com/HoneIDE/api.git
cd api
npm install
npm test          # type-check (primary tests)
npm run test:enums  # compile + run enum value assertions
```

---

## License

MIT © [Honeide](https://hone.codes)
