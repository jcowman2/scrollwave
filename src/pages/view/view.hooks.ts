/*

import React from "react";
import moment from "moment";
import { IBlock } from "../../common/common.types";
import { UpdateHandler } from "./view.types";
import {
  ENTER_FADE_DURATION,
  LEAVE_FADE_DURATION
} from "../../common/constants";
import logger, { TimingControlLogConfig } from "../../common/logger";


export const useMoveState = (blocks: IBlock[]) => {
  const [activeBlockIndex, setActiveBlockIndex] = React.useState(-1);
  const [isBlockExiting, setBlockExiting] = React.useState(false);

  const nodes = isBlockExiting
    ? []
    : blocks.slice(activeBlockIndex, activeBlockIndex + 1);

  const handleStart: UpdateHandler = () => ({ opacity: 0 });
  const handleEnter: UpdateHandler = () => ({
    opacity: [1],
    timing: { duration: ENTER_FADE_DURATION }
  });
  const handleLeave: UpdateHandler = () => ({
    opacity: [0],
    timing: { duration: LEAVE_FADE_DURATION },
    events: { end: () => setBlockExiting(false) }
  });

  const startNextBlock = React.useCallback(() => {
    if (activeBlockIndex >= 0) {
      setBlockExiting(true);
    }

    setActiveBlockIndex(idx => idx + 1);
  }, [activeBlockIndex]);

  return { nodes, handleStart, handleEnter, handleLeave, startNextBlock };
};

const _TimingControlLog = logger<TimingControlLogConfig>("useTimingControl");

export const useTimingControl = (
  isPlaying: boolean,
  startNextBlock: () => void,
  activeNode: IBlock
) => {
  _TimingControlLog.log();
  const [isPlayHandled, setPlayHandled] = React.useState(false);
  const [isPauseHandled, setPauseHandled] = React.useState(false);

  const [blockTimeout, setBlockTimeout] = React.useState<NodeJS.Timeout>();
  const [timestamp, setTimestamp] = React.useState<moment.Moment>();
  const [timeRemainingOnBlock, setTimeRemainingOnBlock] = React.useState(0);
  // const [currentTick, ]

  React.useEffect(() => {
    if (isPlaying && !isPlayHandled) {
      _TimingControlLog.log(TimingControlLogConfig.PlayPause, "onPlay");

      setPlayHandled(true);
      setPauseHandled(false);

      if (!activeNode) {
        startNextBlock();
      }
    } else if (!isPlaying && !isPauseHandled) {
      _TimingControlLog.log(TimingControlLogConfig.PlayPause, "pause");

      if (!activeNode) {
        return;
      }

      setPauseHandled(true);
      setPlayHandled(false);

      const currentTime = moment();
      const msPassed = currentTime.diff(timestamp);
      const msLeft = activeNode.leave - activeNode.enter - msPassed;
      setTimeRemainingOnBlock(msLeft);

      clearInterval(blockTimeout!);

      _TimingControlLog.log(TimingControlLogConfig.PlayPause, "afterPause", {
        activeNode,
        msPassed,
        msLeft
      });
    }
  }, [
    isPlaying,
    startNextBlock,
    activeNode,
    isPlayHandled,
    isPauseHandled,
    blockTimeout,
    timestamp
  ]);

  React.useEffect(() => {
    _TimingControlLog.log(TimingControlLogConfig.InitialSetTimeRemaining);

    if (!activeNode) {
      return;
    }
    const timeRemaining = activeNode.leave - activeNode.enter;
    setTimeRemainingOnBlock(timeRemaining);

    _TimingControlLog.log(TimingControlLogConfig.InitialSetTimeRemaining, {
      timeRemaining
    });
  }, [activeNode]);

  React.useEffect(() => {
    _TimingControlLog.log(TimingControlLogConfig.SetTimeout);

    if (!isPlaying || !timeRemainingOnBlock) {
      return;
    }

    const timer = setTimeout(startNextBlock, timeRemainingOnBlock);
    setBlockTimeout(timer);
    setTimestamp(moment());

    _TimingControlLog.log(TimingControlLogConfig.SetTimeout, {
      timeRemainingOnBlock
    });

    return () => clearTimeout(timer);
  }, [isPlaying, startNextBlock, timeRemainingOnBlock]);
};

*/

export default {};
