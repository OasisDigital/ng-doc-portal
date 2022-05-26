export interface EventPayload {
  filePath: string;
  title: string;
}

export interface RawInitEvent {
  type: 'init';
  filePaths: string[];
}

export interface ProcessedInitEvent extends RawInitEvent {
  payload: EventPayload[];
}

export interface RawAddEvent {
  type: 'add';
  filePath: string;
}

export interface ProcessedAddEvent extends RawAddEvent {
  title: string;
}

export interface RawChangeEvent {
  type: 'change';
  filePath: string;
}

export interface ProcessedChangeEvent extends RawChangeEvent {
  title: string;
}

export interface UnlinkEvent {
  type: 'unlink';
  filePath: string;
}

export type RawFileEvent =
  | RawInitEvent
  | RawAddEvent
  | RawChangeEvent
  | UnlinkEvent;
export type ProcessedFileEvent =
  | ProcessedInitEvent
  | ProcessedAddEvent
  | ProcessedChangeEvent
  | UnlinkEvent;
