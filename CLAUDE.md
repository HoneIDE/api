# CLAUDE.md — hone-api

## What This Repo Is

`@honeide/api` is the public extension API for Hone IDE. It is a **pure TypeScript type library** — zero runtime code, zero dependencies. Every type, interface, namespace, and event signature that extension authors need lives here.

Extensions import it as:
```typescript
import * as hone from '@honeide/api';
```

This is **Layer 0** of the Hone ecosystem. No `@honeide/*` dependencies allowed.

---

## Current Status

**Phase 4 of 5 complete.** All source files are written and `tsc --noEmit` passes clean.

### Completed
- [x] Phase 1 — Core types (`types.ts`, `commands.ts`, `editor.ts`)
- [x] Phase 2 — Workspace & UI (`workspace.ts`, `ui.ts`)
- [x] Phase 3 — Language & Debug (`languages.ts`, `debug.ts`)
- [x] Phase 4 — Terminal, AI & barrel export (`terminal.ts`, `ai.ts`, `index.ts`)
- [x] Tests — `tests/type-checks.ts`, `tests/api-surface.test.ts`
- [x] Project files — `package.json`, `tsconfig.json`, `CHANGELOG.md`, `LICENSE`

### Remaining
- [ ] Phase 5 — Publish: final API review, update CHANGELOG, publish `@honeide/api@0.1.0` to npm

---

## Project Structure

```
hone-api/
├── src/
│   ├── index.ts        Barrel export + ExtensionContext, ActivateFunction, DeactivateFunction
│   ├── types.ts        Disposable, Event<T>, Uri, CancellationToken, ProviderResult, OutputChannel, Progress
│   ├── commands.ts     commands namespace — registerCommand, executeCommand, getCommands
│   ├── editor.ts       Position, Range, Selection, TextEdit, Location, TextDocument, TextEditor, decorations
│   ├── workspace.ts    WorkspaceFolder, Configuration, WorkspaceEdit, FileSystemWatcher, workspace namespace
│   ├── ui.ts           StatusBarItem, QuickPickItem, TreeDataProvider, WebviewPanel, CommandRef, ui namespace
│   ├── languages.ts    11 provider interfaces, DiagnosticCollection, LanguageConfiguration, languages namespace
│   ├── debug.ts        DebugSession, Breakpoint, SourceBreakpoint, FunctionBreakpoint, debug namespace
│   ├── terminal.ts     Terminal, TerminalOptions, TerminalExitStatus, terminal namespace
│   └── ai.ts           AIProviderAdapter, AgentToolDefinition, chat/completion/tool streaming types, ai namespace
├── tests/
│   ├── type-checks.ts       Compile-only structural type assertions (never executed)
│   └── api-surface.test.ts  Runtime enum value + namespace existence assertions
├── PROJECT_PLAN.md     Full design document — read this before making API changes
├── CLAUDE.md           This file
├── package.json
├── tsconfig.json
├── CHANGELOG.md
└── LICENSE             MIT
```

---

## Key Conventions

### Namespaces use `export declare namespace`
All namespaces (`commands`, `workspace`, `ui`, `languages`, `debug`, `terminal`, `ai`, `Uri`, `Position`, `Range`, `TextEdit`) are declared with `export declare namespace`. This is a declaration-only library — no implementations, no runtime code.

### `PromiseLike<T>` not `Thenable<T>`
`Thenable` is only available in the `dom` lib. We use `PromiseLike<T>` everywhere instead — it's equivalent and always available in any TypeScript target.

### `Location` lives in `editor.ts`
Deliberately placed in `editor.ts` (not `languages.ts`) so that `debug.ts` can import it without creating a `debug → languages` dependency.

### Module dependency order (no cycles)
```
types
  ↑
commands, editor
  ↑
workspace
  ↑
ui
  ↑
languages (also imports editor, workspace, ui for CommandRef)
  ↑
debug (also imports editor for Location, workspace for WorkspaceFolder)
  ↑
terminal, ai
  ↑
index (re-exports all)
```

---

## Common Commands

```bash
# Type-check everything (source + tests)
npm test

# Same as above
npx tsc --noEmit
```

---

## Open Questions (from PROJECT_PLAN.md)

1. **AI namespace stability** — `ai.ts` is the most likely to change as agent capabilities evolve. Consider `@experimental` tag before v1.0.
2. **VSCode API divergence** — Design is VSCode-inspired but intentionally diverges. Don't add compatibility shims.
3. **Extension sandboxing** — No runtime sandbox. Mitigation is curated marketplace + OS-level sandboxing.
4. **Webview CSP** — `cspSource` on the `Webview` interface is the hook for enforcing Content Security Policy.
5. **Namespace pattern** — Sticking with namespaces (like `hone.commands.registerCommand`) over class instances for familiarity.

---

## Next Steps for Implementors

When implementing `hone-core`, every `declare namespace` in this package corresponds to a real object you must provide via the API bridge. The type shapes here are the contract — implement against them exactly.

When writing extensions, extend `ExtensionContext.subscriptions` with every `Disposable` returned from `register*` calls for automatic cleanup on deactivation.
