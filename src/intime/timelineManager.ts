import { easeCubic } from "d3-ease";
import { interpolate } from "d3-interpolate";
import {
  ITrackRegion,
  IRegionEvent,
  IRegionStateProperty
} from "./intime.types";

type IInterpolateStateResult = {
  progress: number;
  newState: { [key: string]: any };
};

export class TimelineManager {
  public length: number;
  private track: ITrackRegion[];

  constructor(track: ITrackRegion[]) {
    this.track = track; // TODO - Validation
    this.length = track[track.length - 1].end;
  }

  getEventsSinceLastTick = (
    last: number,
    current: number
  ): IRegionEvent<any, any, any>[] => {
    const regions = this.track.filter(
      region =>
        this.isWithinRegion(region, last) ||
        this.isWithinRegion(region, current)
    );
    const events = regions.map<IRegionEvent>(region => {
      const { progress, newState: state } = this.interpolateState(
        region,
        current
      );
      return { value: current, region, state, progress };
    });
    return events;
  };

  isWithinRegion = (region: ITrackRegion, value: number) =>
    region.start <= value && region.end >= value;

  interpolateState = (
    region: ITrackRegion,
    current: number
  ): IInterpolateStateResult => {
    const local = Math.min(
      Math.max(current - region.start, 0),
      region.duration
    );
    const localNormalized = region.duration ? local / region.duration : 0;
    const eased = easeCubic(localNormalized);

    const newState: { [key: string]: any } = {};
    if (region.state) {
      Object.entries<IRegionStateProperty>(region.state).forEach(
        ([key, value]) => {
          newState[key] = interpolate(value.from, value.to)(eased);
        }
      );
    }

    return { progress: eased, newState };
  };
}
