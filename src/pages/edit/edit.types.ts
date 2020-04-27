export interface Timestamp {
  anchorId: string;
  region: Region;
  position: number;
}

export interface Region {
  id: string;
  start: number;
  remove: () => void;
}
