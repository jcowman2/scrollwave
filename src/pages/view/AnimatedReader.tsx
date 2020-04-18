import React from "react";
import Timeline from "../../intime/Timeline";
import {
  IReaderRegion,
  IReaderRegionData,
  IReaderRegionState
} from "../../common/common.types";
import { ITickEvent, IRegionEvent } from "../../intime/intime.types";
import logger, {
  AnimatedReaderLogConfig as LC,
  LogConfig
} from "../../common/logger";

const LOG = logger<LC>(LogConfig.AnimatedReader);

export interface IAnimatedReaderProps {
  regions: IReaderRegion[];
  isPlaying: boolean;
  value: number;
  onTick: (event: ITickEvent) => void;
  onEnded: () => void;
}

const AnimatedReader: React.FC<IAnimatedReaderProps> = props => {
  const [elements, setElements] = React.useState<JSX.Element>();

  const handleRegionEvent = (
    event: IRegionEvent<IReaderRegionData, IReaderRegionState>
  ) => {
    LOG.log(LC.HandleRegionEvent, { event });
    setElements(
      <p style={{ opacity: event.state.blockOpacity }}>
        {event.state.loadedSpans.map(span => span.text).join(" ")}
        {event.state.activeSpan && (
          <>
            {" "}
            <span style={{ opacity: event.state.spanOpacity }}>
              {event.state.activeSpan.text}
            </span>
          </>
        )}
      </p>
    );
  };

  const defaultState = React.useMemo<IReaderRegionState>(
    () => ({
      blockOpacity: 1,
      spanOpacity: 0,
      loadedSpans: [],
      activeSpan: null
    }),
    []
  );

  return (
    <>
      <Timeline<IReaderRegionData, IReaderRegionState>
        track={props.regions}
        defaultState={defaultState}
        value={props.value}
        playing={props.isPlaying}
        onTick={props.onTick}
        onRegion={handleRegionEvent}
        onEnded={props.onEnded}
      />
      <div className="TextViewport">{elements}</div>
    </>
  );
};

export default AnimatedReader;
