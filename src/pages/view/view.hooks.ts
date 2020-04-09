import React from "react";
import { IBlock } from "../../common/common.types";
import { UpdateHandler } from "./view.types";

export const useMoveState = (blocks: IBlock[]) => {
  const [activeBlockIndex, setActiveBlockIndex] = React.useState(-1);
  const [isBlockExiting, setBlockExiting] = React.useState(false);

  const nodes = isBlockExiting
    ? []
    : blocks.slice(activeBlockIndex, activeBlockIndex + 1);

  const handleStart: UpdateHandler = () => ({ opacity: 0 });
  const handleEnter: UpdateHandler = () => ({
    opacity: [1],
    timing: { duration: 1000 }
  });
  const handleLeave: UpdateHandler = () => ({
    opacity: [0],
    timing: { duration: 1000 },
    events: { end: () => setBlockExiting(false) }
  });

  const startNextBlock = () => {
    if (activeBlockIndex >= 0) {
      setBlockExiting(true);
    }

    setActiveBlockIndex(idx => idx + 1);
  };

  return { nodes, handleStart, handleEnter, handleLeave, startNextBlock };
};

export const useTimingControl = (
  isPlaying: boolean,
  startNextBlock: () => void,
  activeNode: IBlock
) => {
  const [isPlayHandled, setPlayHandled] = React.useState(false);
  const [isPauseHandled, setPauseHandled] = React.useState(false);

  React.useEffect(() => {
    if (isPlaying && !isPlayHandled) {
      startNextBlock();
      setPlayHandled(true);
      setPauseHandled(false);
    } else if (!isPlaying && !isPauseHandled) {
      setPauseHandled(true);
      setPlayHandled(false);
    }
  }, [isPlaying, startNextBlock, isPlayHandled, isPauseHandled]);

  React.useEffect(() => {
    if (!activeNode) {
      return;
    }

    const wordCount = activeNode.text.split(" ").length;
    const duration = Math.max(wordCount * (60 / 200) * 1000, 2000);

    setTimeout(startNextBlock, duration);
  }, [activeNode, startNextBlock]);
};
