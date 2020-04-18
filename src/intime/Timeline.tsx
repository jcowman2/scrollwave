import React, { PropsWithChildren, useEffect } from "react";
import { ITrackRegion, IRegionEvent, ITickEvent } from "./intime.types";
import { TimelineManager } from "./timelineManager";
import logger, { LogConfig, TimelineLogConfig as LC } from "../common/logger";

const LOG = logger(LogConfig.Timeline);

const DEFAULT_INTERVAL_LENGTH = 10;

export interface ITimelineProps<D, S extends object = {}> {
  track: ITrackRegion<D, S>[];
  defaultState: S;
  value: number;
  playing: boolean;
  interval?: number;
  onTick: (event: ITickEvent) => void;
  onRegion: (event: IRegionEvent<D, S>) => void;
  onEnded: () => void;
}

const Timeline = <D, S extends object = {}>(
  props: PropsWithChildren<ITimelineProps<D, S>>
) => {
  const manager = React.useRef<TimelineManager<D, S>>();
  const interval = React.useRef<NodeJS.Timeout>();
  const [queued, setQueued] = React.useState(0);
  const [lastTick, setLastTick] = React.useState(0);
  const [hasStarted, setHasStarted] = React.useState(false);

  const {
    onTick,
    value,
    track,
    defaultState,
    playing,
    interval: intervalProp,
    onRegion,
    onEnded
  } = props;

  React.useEffect(() => {
    LOG.log(LC.Tick, { value, queued });
    if (!manager.current) {
      return;
    }

    if (queued) {
      setQueued(0);
      setLastTick(value);

      let newValue = value + queued;

      if (newValue >= manager.current.length) {
        newValue = manager.current.length;
        setHasStarted(false);
        onEnded();
      }
      onTick({ value: newValue });
    }
  }, [onTick, value, queued, onEnded]);

  React.useEffect(() => {
    LOG.log(LC.NewTimelineManager, { track, defaultState, hasStarted });
    if (hasStarted) {
      manager.current = new TimelineManager(track, defaultState);
    }
  }, [track, defaultState, hasStarted]);

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
      setHasStarted(true);
    }
  }, [playing, intervalProp]);

  React.useEffect(() => {
    LOG.log(LC.ValueUpdated, { value, lastTick });

    if (!manager.current || lastTick === value) {
      return;
    }

    setLastTick(value);

    const events = manager.current.getEventsSinceLastTick(lastTick, value);
    events.forEach(onRegion);
  }, [onRegion, value, lastTick]);

  return null;
};

export default Timeline;
