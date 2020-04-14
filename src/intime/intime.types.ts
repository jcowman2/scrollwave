export interface ITrackRegion<
  RegionType extends string = string,
  Data = {},
  State extends object = {}
> {
  type: RegionType;
  start: number;
  end: number;
  duration: number;
  data?: Data;
  state?: IRegionState<State>;
}

export interface ITickEvent {
  value: number;
}

export type IRegionState<V> = { [K in keyof V]: IRegionStateProperty<V[K]> };
export type IRegionStateProperty<T = any> = { from: T; to: T };

export interface IRegionEvent<
  RegionType extends string = string,
  Data = {},
  State extends object = {}
> {
  value: number;
  region: ITrackRegion<RegionType, Data, State>;
  state: State;
  progress: number;
}
