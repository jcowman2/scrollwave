import { easeCubic } from "d3-ease";
import { interpolate } from "d3-interpolate";
import { ITrackRegion, IRegionEvent } from "./intime.types";
import logger, {
  TimelineManagerLogConfig as LC,
  LogConfig
} from "../common/logger";

const LOG = logger<LC>(LogConfig.TimelineManager);

type IInterpolateStateResult<State> = {
  progress: number;
  newState: State;
};

type Interpolatable = string | number | boolean;

const isFunction = (f: any): f is (a: any) => any =>
  f && typeof f === "function";

const isInterpolatable = (v: any): v is Interpolatable =>
  v !== undefined && ["string", "number", "boolean"].includes(typeof v);

export class TimelineManager<Data, State extends object> {
  public length: number;

  private track: ITrackRegion<Data, State>[];
  private currentState: State;

  private setPropertyMap: { [id: string]: PropertyKey[] } = {};

  constructor(track: ITrackRegion<Data, State>[], defaults: State) {
    this.length = track[track.length - 1].end;

    this.track = track; // TODO - Validation
    this.currentState = defaults;

    LOG.log(LC.Construct, { length: this.length, track, defaults });
  }

  getEventsSinceLastTick = (
    last: number,
    current: number
  ): IRegionEvent<Data, State>[] => {
    const regions = this.track.filter(region =>
      this.isWithinRegion(region, last, current)
    );
    const events = regions.map<IRegionEvent<Data, State>>(region => {
      const { progress, newState: state } = this.interpolateState(
        region,
        current
      );
      return { value: current, region, state, progress };
    });

    LOG.log(LC.GetEventsSinceLastTick, { last, current, regions, events });

    return events;
  };

  private isWithinRegion = (
    region: ITrackRegion,
    last: number,
    current: number
  ) => {
    if (region.start >= last && region.end <= current) {
      return true;
    }

    if (region.start <= current && region.end >= current) {
      return true;
    }

    if (region.start <= last && region.end >= last) {
      return true;
    }
  };

  private interpolateState = (
    region: ITrackRegion<Data, State>,
    current: number
  ): IInterpolateStateResult<State> => {
    LOG.log(LC.InterpolateState, {
      region,
      current,
      currentState: this.currentState
    });

    const local = Math.min(
      Math.max(current - region.start, 0),
      region.duration
    );
    const localNormalized = region.duration ? local / region.duration : 0;
    const eased = easeCubic(localNormalized);
    const atEnd = region.duration ? eased === 1 : true;

    const newState = { ...this.currentState };
    if (region.state) {
      for (let key in region.state) {
        const prev = this.currentState[key];
        const animProp = region.state[key]!;
        const { set, from, to } = animProp;

        if (set !== undefined) {
          if (!this.isPropertyAlreadySet(region.id, key)) {
            this.markPropertySet(region.id, key);
            newState[key] = isFunction(set) ? set(prev) : set;
          }

          continue;
        }

        if (to === undefined) {
          LOG.error(LC.InterpolateState, "from/to is not valid", {
            region,
            key,
            animProp
          });
          continue;
        }

        const fromPrev = from !== undefined ? from : prev;

        if (!isInterpolatable(to)) {
          newState[key] = !atEnd ? fromPrev : to;
          continue;
        }

        newState[key] = interpolate(fromPrev, to as any)(eased);
      }
    }

    LOG.log(LC.InterpolateState, "after interp", { eased, newState });

    this.currentState = newState;
    return { progress: eased, newState };
  };

  private safePropertyEntry = (regionId: string) => {
    if (!this.setPropertyMap[regionId]) {
      this.setPropertyMap[regionId] = [];
    }
    return this.setPropertyMap[regionId];
  };

  private isPropertyAlreadySet = (
    regionId: string,
    propertyKey: PropertyKey
  ): boolean => {
    return this.safePropertyEntry(regionId).includes(propertyKey);
  };

  private markPropertySet = (regionId: string, propertyKey: PropertyKey) => {
    this.safePropertyEntry(regionId).push(propertyKey);
  };
}
