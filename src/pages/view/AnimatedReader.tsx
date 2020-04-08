import React, { useEffect } from "react";
import { NodeGroup } from "react-move";
import { IBlock } from "../../common/common.types";
import { TEXT_VIEWPORT_HEIGHT } from "../../common/constants";
import AnimatedBlock, { IBlockAnimationState } from "./AnimatedBlock";
import { useMoveState } from "./view.hooks";

export interface IAnimatedReaderProps {
  blocks: IBlock[];
  isPlaying: boolean;
}

const AnimatedReader: React.FC<IAnimatedReaderProps> = props => {
  const { update, play, pause, animatedBlocks } = useMoveState(props.blocks);

  useEffect(() => {
    if (props.isPlaying) {
      play();
    } else {
      pause();
    }
  }, [props.isPlaying, play, pause]);

  return (
    <div className="TextViewport">
      <NodeGroup
        data={animatedBlocks}
        keyAccessor={(block: IBlock) => block.key}
        start={(_item: IBlock, _index: number): IBlockAnimationState => ({
          offsetVertical: TEXT_VIEWPORT_HEIGHT + 20
        })}
        update={update}
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
