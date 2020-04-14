import React, { PropsWithChildren, useEffect } from "react";
import { ITrackRegion, IRegionEvent, ITickEvent } from "./intime.types";
import { TimelineManager } from "./timelineManager";

const DEFAULT_INTERVAL_LENGTH = 100;

export interface ITimelineProps<RegionType extends string> {
  track: ITrackRegion<RegionType>[];
  value: number;
  playing: boolean;
  interval?: number;
  onTick: (event: ITickEvent) => void;
  onRegion: (event: IRegionEvent<RegionType>) => void;
}

const Timeline = <RegionType extends string>(
  props: PropsWithChildren<ITimelineProps<RegionType>>
) => {
  const manager = React.useRef<TimelineManager>();
  const interval = React.useRef<NodeJS.Timeout>();
  const [queued, setQueued] = React.useState(0);
  const [lastTick, setLastTick] = React.useState(0);

  React.useEffect(() => {
    if (queued) {
      setQueued(0);
      setLastTick(props.value);
      props.onTick({ value: props.value + queued });
    }
  }, [props, queued]);

  React.useEffect(() => {
    manager.current = new TimelineManager(props.track);
  }, [props.track]);

  React.useEffect(() => {
    if (interval.current) {
      clearTimeout(interval.current);
    }
    if (props.playing) {
      const intervalLen = props.interval || DEFAULT_INTERVAL_LENGTH;

      interval.current = setInterval(
        () => setQueued(q => q + intervalLen),
        intervalLen
      );
    }
  }, [props.playing, props.interval]);

  React.useEffect(() => {
    if (!manager.current || lastTick === props.value) {
      return;
    }

    let properLastTick = lastTick;
    if (lastTick > props.value) {
      properLastTick = props.value;
      setLastTick(properLastTick);
    }

    const events = manager.current.getEventsSinceLastTick(
      properLastTick,
      props.value
    );
    events.forEach(props.onRegion);
  }, [props.onRegion, props.value, lastTick]);

  return null;
};

export default Timeline;
