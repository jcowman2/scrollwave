import React, { PropsWithChildren } from "react";
import { ITrackRegion, ITickEvent } from "./intime.types";
import { TimelineManager } from "./timelineManager";

export interface ITimelineProps<RegionType extends string> {
  track: ITrackRegion<RegionType>[];
  value: number;
  playing: boolean;
  interval: number;
  onTick: (event: ITickEvent<RegionType>) => void;
}

const Timeline = <RegionType extends string>(
  props: PropsWithChildren<ITimelineProps<RegionType>>
) => {
  const manager = React.useRef<TimelineManager>();
  const interval = React.useRef<NodeJS.Timeout>();
  const [queued, setQueued] = React.useState(0);

  if (queued && manager.current) {
    setQueued(0);
    const events = manager.current.getEventsSinceLastTick(
      props.value,
      props.value + queued
    );
    events.forEach(props.onTick);
  }

  React.useEffect(() => {
    manager.current = new TimelineManager(props.track);
  }, [props.track]);

  React.useEffect(() => {
    if (interval.current) {
      clearTimeout(interval.current);
    }
    if (props.playing) {
      interval.current = setInterval(
        () => setQueued(q => q + props.interval),
        props.interval
      );
    }
  }, [props.playing, props.interval]);

  return null;
};

export default Timeline;
