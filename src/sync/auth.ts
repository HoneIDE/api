// Authentication and authorization types

export type ApiScope =
  | 'projects.*' | 'projects.list' | 'projects.open' | 'projects.close' | 'projects.active' | 'projects.setActive'
  | 'files.*' | 'files.tree' | 'files.read' | 'files.write' | 'files.patch' | 'files.delete' | 'files.move'
  | 'editor.*' | 'editor.openTabs' | 'editor.openFile' | 'editor.closeFile' | 'editor.cursor' | 'editor.setCursor' | 'editor.viewport'
  | 'ai.*' | 'ai.conversations' | 'ai.history' | 'ai.send' | 'ai.cancel'
  | 'build.*' | 'build.start' | 'build.cancel' | 'build.status' | 'build.log'
  | 'run.*' | 'run.start' | 'run.stop';

export interface ApiToken {
  token: string;
  deviceId: string;
  deviceName: string;
  scopes: ApiScope[];
  issuedAt: number;
  expiresAt?: number;
}

export interface ApiHandshake {
  version: number;
  token: string;
  clientInfo: ClientInfo;
}

export interface ClientInfo {
  deviceId: string;
  deviceName: string;
  platform: 'macos' | 'ios' | 'windows' | 'linux' | 'android' | 'web';
  appVersion: string;
}

export function scopeAllows(scopes: ApiScope[], domain: string, operation: string): boolean {
  const wildcard = `${domain}.*` as ApiScope;
  const specific = `${domain}.${operation}` as ApiScope;
  for (let i = 0; i < scopes.length; i++) {
    if (scopes[i] === wildcard || scopes[i] === specific) {
      return true;
    }
  }
  return false;
}
