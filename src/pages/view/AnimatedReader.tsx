import React from "react";
import Timeline from "../../intime/Timeline";
import {
  IReaderRegion,
  IReaderRegionData,
  IReaderRegionState
} from "../../common/common.types";
import { ITickEvent, IRegionEvent } from "../../intime/intime.types";
import { ReaderEventType } from "../../common/enum";
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
}

const AnimatedReader: React.FC<IAnimatedReaderProps> = props => {
  const [elements, setElements] = React.useState<JSX.Element>();

  const handleRegionEvent = (
    event: IRegionEvent<ReaderEventType, IReaderRegionData, IReaderRegionState>
  ) => {
    LOG.log(LC.HandleRegionEvent, { event });
    setElements(
      <div>
        {event.region.type}
        <br />
        {event.progress}
        <br />
        {event.region.data?.span?.text}
      </div>
    );
  };

  return (
    <>
      <Timeline<ReaderEventType, IReaderRegionData, IReaderRegionState>
        track={props.regions}
        value={props.value}
        playing={props.isPlaying}
        onTick={props.onTick}
        onRegion={handleRegionEvent}
      />
      {elements}
    </>
  );
};

export default AnimatedReader;
