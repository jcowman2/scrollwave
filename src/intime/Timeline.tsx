import React, { PropsWithChildren, useEffect } from "react";
import { ITrackRegion, IRegionEvent, ITickEvent } from "./intime.types";
import { TimelineManager } from "./timelineManager";
import logger, { LogConfig, TimelineLogConfig as LC } from "../common/logger";

const LOG = logger(LogConfig.Timeline);

const DEFAULT_INTERVAL_LENGTH = 100;

export interface ITimelineProps<
  RegionType extends string,
  Data = {},
  State extends object = {}
> {
  track: ITrackRegion<RegionType, Data, State>[];
  value: number;
  playing: boolean;
  interval?: number;
  onTick: (event: ITickEvent) => void;
  onRegion: (event: IRegionEvent<RegionType, Data, State>) => void;
}

const Timeline = <
  RegionType extends string,
  Data = {},
  State extends object = {}
>(
  props: PropsWithChildren<ITimelineProps<RegionType, Data, State>>
) => {
  const manager = React.useRef<TimelineManager>();
  const interval = React.useRef<NodeJS.Timeout>();
  const [queued, setQueued] = React.useState(0);
  const [lastTick, setLastTick] = React.useState(0);

  const {
    onTick,
    value,
    track,
    playing,
    interval: intervalProp,
    onRegion
  } = props;

  React.useEffect(() => {
    LOG.log(LC.Tick, { value, queued });
    if (queued) {
      setQueued(0);
      setLastTick(value);

      const newValue = value + queued;
      onTick({ value: newValue });
    }
  }, [onTick, value, queued]);

  React.useEffect(() => {
    LOG.log(LC.NewTimelineManager, { track });
    manager.current = new TimelineManager(track);
  }, [track]);

  React.useEffect(() => {
    LOG.log(LC.UpdateInterval, {
      playing,
      intervalProp,
      intervalRef: interval.current
    });

    if (interval.current) {
      clearInterval(interval.current);
      interval.current = undefined;
    }
    if (playing) {
      const intervalLen = intervalProp || DEFAULT_INTERVAL_LENGTH;

      interval.current = setInterval(
        () => setQueued(q => q + intervalLen),
        intervalLen
      );
    }
  }, [playing, intervalProp]);

  React.useEffect(() => {
    LOG.log(LC.ValueUpdated, { value, lastTick });

    if (!manager.current || lastTick === value) {
      return;
    }

    let properLastTick = lastTick;
    if (lastTick < value) {
      properLastTick = value;
      setLastTick(properLastTick);
    }

    const events = manager.current.getEventsSinceLastTick(
      properLastTick,
      value
    );
    events.forEach(onRegion);
  }, [onRegion, value, lastTick]);

  return null;
};

export default Timeline;
