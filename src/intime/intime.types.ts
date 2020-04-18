export interface ITrackRegion<Data = {}, State extends object = {}> {
  id: string;
  start: number;
  end: number;
  duration: number;
  data?: Data;
  state?: IRegionState<State>;
}

export interface ITickEvent {
  value: number;
}

export type IRegionState<V> = { [K in keyof V]?: IRegionStateProperty<V[K]> };
export type IRegionStateProperty<T = any> = {
  from?: T;
  to?: T;
  set?: T | ((previous: T) => T);
};

export interface IRegionEvent<Data = {}, State extends object = {}> {
  value: number;
  region: ITrackRegion<Data, State>;
  state: State;
  progress: number;
}
