import React from "react";
import { IBlock } from "../../common/common.types";

interface IAnimatedBlockData extends IBlock {
  isActive: boolean;
}

type UpdateHandler = (item: IAnimatedBlockData, index: number) => object;

export const useMoveState = (blocks: IBlock[]) => {
  const [animatedBlocks, setAnimatedBlocks] = React.useState<
    IAnimatedBlockData[]
  >(() => blocks.map(block => ({ ...block, isActive: false })));
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [lastActive, setLastActive] = React.useState(-1);

  const update: UpdateHandler = (item, index) => {
    console.log("update", item, index);
    if (item.isActive) {
      return {
        offsetVertical: [-100],
        timing: { duration: 10000 }
      };
    }
    return {
      offsetVertical: [0],
      timing: { duration: Number.MAX_SAFE_INTEGER }
    };
  };

  const play = () => {
    if (!isPlaying) {
      setIsPlaying(true);
      setLastActive(n => n + 1);
      setAnimatedBlocks(
        animatedBlocks.map((block, index) => ({
          ...block,
          isActive: index <= lastActive + 1
        }))
      );
    }
  };

  const pause = () => {
    if (isPlaying) {
      setIsPlaying(false);
      setAnimatedBlocks(
        animatedBlocks.map(block => ({ ...block, isActive: false }))
      );
    }
  };

  return { update, play, pause, animatedBlocks };
};
