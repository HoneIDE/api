// Editor domain API types

export interface TabInfo {
  id: string;
  filePath: string;
  fileName: string;
  isActive: boolean;
  isDirty: boolean;
  viewColumn?: number;
}

export interface CursorPosition {
  line: number;
  column: number;
}

export interface ViewportRange {
  startLine: number;
  endLine: number;
}

// editor.openTabs
export interface EditorOpenTabsRequest {}
export interface EditorOpenTabsResponse {
  tabs: TabInfo[];
}

// editor.openFile
export interface EditorOpenFileRequest {
  projectId: string;
  path: string;
  line?: number;
  column?: number;
}
export interface EditorOpenFileResponse {
  tab: TabInfo;
}

// editor.closeFile
export interface EditorCloseFileRequest {
  tabId: string;
}
export interface EditorCloseFileResponse {
  success: boolean;
}

// editor.cursor
export interface EditorCursorRequest {
  tabId?: string;
}
export interface EditorCursorResponse {
  tabId: string;
  position: CursorPosition;
  selection?: { start: CursorPosition; end: CursorPosition };
}

// editor.setCursor
export interface EditorSetCursorRequest {
  tabId: string;
  position: CursorPosition;
  selection?: { start: CursorPosition; end: CursorPosition };
}
export interface EditorSetCursorResponse {
  success: boolean;
}

// editor.viewport
export interface EditorViewportRequest {
  tabId?: string;
}
export interface EditorViewportResponse {
  tabId: string;
  range: ViewportRange;
}

// editor.onTabChanged (event)
export interface EditorTabChangedEvent {
  type: 'opened' | 'closed' | 'activated' | 'dirty' | 'saved';
  tab: TabInfo;
}
