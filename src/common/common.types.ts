import Draft from "draft-js";
import { ReaderEventType } from "./enum";
import { getTransitionLength, getWordCount } from "./utils";
import logger, { ReaderDataLogConfig as LC, LogConfig } from "./logger";
import { IRegionState } from "../intime/intime.types";

const LOG = logger<LC>(LogConfig.ReaderData);

export interface IAudioFile {
  length: number;
}

export interface IBlock {
  id: string;
  spans: ISpan[];
}

export interface ISpan {
  id: string;
  text: string;
  start?: number;
}

export interface IReaderRegionData {
  block: IBlock;
  span?: ISpan;
}

export interface IReaderRegionState {
  blockOpacity: number;
  spanOpacity: number;
  loadedSpans: ISpan[];
  activeSpan?: ISpan;
}

export interface IReaderRegion {
  type: ReaderEventType;
  start: number;
  end: number;
  duration: number;
  data: IReaderRegionData;
  state: IRegionState<IReaderRegionState>;
}

interface ITrackingSpan {
  span: ISpan;
  wordsTo: number;
  timeTo: number;
  spansTo: number;
  blocksTo: number;
}

export class ReaderData {
  blocks: IBlock[];
  events: IReaderRegion[];
  audio: IAudioFile;

  constructor(blocks: IBlock[], audio: IAudioFile) {
    this.blocks = blocks;
    this.audio = audio;

    this.events = this.assembleEvents(blocks);
  }

  private assembleEvents = (blocks: IBlock[]): IReaderRegion[] => {
    LOG.log(LC.AssembleEvents, "start", { blocks });

    const events: IReaderRegion[] = [];

    const defaultSpanEnterLen = getTransitionLength(
      ReaderEventType.SPAN_WILL_ENTER
    );
    const defaultBlockLeaveLen = getTransitionLength(
      ReaderEventType.BLOCK_WILL_LEAVE
    );

    let currentTime = 0;

    const _pushEvent = (
      type: ReaderEventType,
      duration: number,
      block: IBlock,
      span?: ISpan
    ) => {
      LOG.log(LC.AssembleEvents, "_pushEvent", {
        type,
        currentTime,
        duration,
        block,
        span
      });

      events.push({
        type,
        start: currentTime,
        end: currentTime + duration,
        duration,
        data: {
          block,
          span
        },
        state: {}
      });
      currentTime += duration;
    };

    const firstSpan = blocks[0] && blocks[0].spans[0];
    const startDelay = (firstSpan && firstSpan.start) || 0;

    _pushEvent(ReaderEventType.READER_START, startDelay, blocks[0]);

    let nextSpanWithStart = this.getNextSpanWithStart(
      blocks,
      0,
      0,
      currentTime
    );

    let transitionTimes = this.getTransitionTimes(
      nextSpanWithStart,
      defaultSpanEnterLen,
      defaultBlockLeaveLen
    );

    LOG.log(LC.AssembleEvents, "before iteration", {
      currentTime,
      nextSpanWithStart
    });

    blocks.forEach((block, blockIdx) => {
      _pushEvent(ReaderEventType.BLOCK_ENTER, 0, block);

      block.spans.forEach((span, spanIdx) => {
        if (nextSpanWithStart.span.id === span.id) {
          nextSpanWithStart = this.getNextSpanWithStart(
            blocks,
            blockIdx,
            spanIdx,
            currentTime
          );

          transitionTimes = this.getTransitionTimes(
            nextSpanWithStart,
            defaultSpanEnterLen,
            defaultBlockLeaveLen
          );

          LOG.log(LC.AssembleEvents, "resetting tracking span", {
            block,
            span,
            currentTime,
            nextSpanWithStart,
            transitionTimes
          });
        }

        const spanTime = this.getSpanTime(
          span,
          nextSpanWithStart,
          transitionTimes.spanEnterLen,
          transitionTimes.blockLeaveLen
        );

        // const enterLen = Math.min(defaultSpanEnterLen, spanTime);
        _pushEvent(
          ReaderEventType.SPAN_WILL_ENTER,
          transitionTimes.spanEnterLen,
          block,
          span
        );

        // const showLen = Math.max(spanTime - enterLen, 0);
        _pushEvent(ReaderEventType.SPAN_ENTER, spanTime, block, span);
      });

      _pushEvent(
        ReaderEventType.BLOCK_WILL_LEAVE,
        transitionTimes.blockLeaveLen,
        block
      );
      _pushEvent(ReaderEventType.BLOCK_LEAVE, 0, block);
    });

    return events;
  };

  private getNextSpanWithStart = (
    blocks: IBlock[],
    blockIdx: number,
    spanIdx: number,
    currentTime: number
  ): ITrackingSpan => {
    LOG.log(LC.GetNextSpanWithStart, "start", {
      blocks,
      blockIdx,
      spanIdx,
      currentTime
    });

    const wholeBlocksLeft = blocks.slice(blockIdx + 1);
    let spans = wholeBlocksLeft.reduce<Array<ISpan & { blockIdx: number }>>(
      (prev, current, index) =>
        prev.concat(
          current.spans.map(span => ({
            ...span,
            blockIdx: blockIdx + index + 1
          }))
        ),
      []
    );
    spans = blocks[blockIdx].spans
      .slice(spanIdx + 1)
      .map(span => ({ ...span, blockIdx }))
      .concat(spans);

    let wordsTo = getWordCount(blocks[blockIdx].spans[spanIdx].text);

    LOG.log(LC.GetNextSpanWithStart, "before iter", {
      spans,
      startingWordsTo: wordsTo
    });

    for (let i = 0; i < spans.length; i++) {
      const span = spans[i];
      if (span.start) {
        return {
          span,
          wordsTo,
          timeTo: span.start - currentTime,
          blocksTo: span.blockIdx - blockIdx,
          spansTo: i + 1
        };
      } else {
        wordsTo += getWordCount(span.text);
      }
    }

    const songEnd: ISpan = {
      id: "song_end",
      text: "",
      start: this.audio.length
    };
    return {
      span: songEnd,
      wordsTo,
      timeTo: songEnd.start! - currentTime,
      blocksTo: blocks.length - blockIdx,
      spansTo: spans.length + 1
    };
  };

  private getTransitionTimes = (
    nextSpanWithStart: ITrackingSpan,
    defaultSpanEnterLen: number,
    defaultBlockLeaveLen: number
  ): { spanEnterLen: number; blockLeaveLen: number } => {
    const { spansTo, blocksTo, timeTo } = nextSpanWithStart;

    let spanEnterLen = defaultSpanEnterLen;
    let blockLeaveLen = defaultBlockLeaveLen;

    const totalSpanEnterTime = defaultSpanEnterLen * spansTo;
    const totalBlockLeaveTime = defaultBlockLeaveLen * blocksTo;

    const transitionsTooLong =
      totalSpanEnterTime + totalBlockLeaveTime > timeTo;

    if (transitionsTooLong) {
      const timeForEachType = timeTo * 0.5;
      spanEnterLen = timeForEachType / spansTo; // spansTo >= 1
      blockLeaveLen = blocksTo ? timeForEachType / blocksTo : 0; // blocksTo >= 0
    }

    LOG.log(LC.GetTransitionTimes, { spanEnterLen, blockLeaveLen });

    return { spanEnterLen, blockLeaveLen };
  };

  private getSpanTime = (
    span: ISpan,
    nextSpanWithStart: ITrackingSpan,
    spanEnterLen: number,
    blockLeaveLen: number
  ) => {
    const { timeTo, wordsTo, spansTo, blocksTo } = nextSpanWithStart;
    const timeForSpans = Math.max(
      timeTo - spanEnterLen * spansTo - blockLeaveLen * blocksTo,
      0
    );

    const wordCount = getWordCount(span.text);
    const spanBudget = wordCount ? wordsTo / wordCount : 0;
    const spanTime = spanBudget
      ? Number(((1 / spanBudget) * timeForSpans).toFixed(1))
      : 0;

    LOG.log(LC.GetSpanTime, "calculated", {
      span,
      nextSpanWithStart,
      spanEnterLen,
      blockLeaveLen,
      wordCount,
      spanBudget,
      timeForSpans,
      spanTime
    });

    return spanTime;
  };

  public static fromEditor(contentState: Draft.ContentState): ReaderData {
    const draftBlocks = contentState.getBlocksAsArray();
    console.log("ReaderData::fromEditor draftBlocks", draftBlocks);

    const readerBlocks = draftBlocks.map(draftBlock => ({
      id: draftBlock.getKey(),
      spans: [
        {
          id: draftBlock.getKey() + "_0", // TODO
          text: draftBlock.getText()
        }
      ]
    }));

    return new ReaderData(readerBlocks, { length: 10 });
  }
}
