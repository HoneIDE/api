import { Disposable, Event } from './types';
import { Location } from './editor';
import { WorkspaceFolder } from './workspace';

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

export interface BreakpointsChangeEvent {
  readonly added: readonly Breakpoint[];
  readonly removed: readonly Breakpoint[];
  readonly changed: readonly Breakpoint[];
}

export declare namespace debug {
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
