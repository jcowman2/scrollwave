import React, { useEffect } from "react";
import { NodeGroup } from "react-move";
import { IBlock } from "../../common/common.types";
import { TEXT_VIEWPORT_HEIGHT } from "../../common/constants";
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
