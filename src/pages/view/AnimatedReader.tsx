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

/*
import React, { useEffect } from "react";
import { NodeGroup } from "react-move";
import { IBlock } from "../../common/common.types";
import AnimatedBlock from "./AnimatedBlock";
import { useMoveState, useTimingControl } from "./view.hooks";
import { IBlockAnimationState } from "./view.types";

export interface IAnimatedReaderProps {
  blocks: IBlock[];
  isPlaying: boolean;
}

const AnimatedReader: React.FC<IAnimatedReaderProps> = props => {
  const {
    nodes,
    handleStart,
    handleEnter,
    handleLeave,
    startNextBlock
  } = useMoveState(props.blocks);

  useTimingControl(props.isPlaying, startNextBlock, nodes[0]);

  return (
    <div className="TextViewport">
      <NodeGroup
        data={nodes}
        keyAccessor={(block: IBlock) => block.key}
        start={handleStart}
        enter={handleEnter}
        leave={handleLeave}
      >
        {(
          nodes: Array<{
            key: string;
            data: IBlock;
            state: IBlockAnimationState;
          }>
        ) => (
          <div className="TextViewportContent">
            {nodes.map(({ key, data, state }) => (
              <AnimatedBlock
                key={key}
                data={data}
                animationState={state}
                onUpdateBoundingRect={rect => {}}
              />
            ))}
          </div>
        )}
      </NodeGroup>
    </div>
  );
};

export default AnimatedReader;
*/
