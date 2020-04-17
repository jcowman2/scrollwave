import { ReaderEventType } from "./enum";
import { ENTER_FADE_DURATION, LEAVE_FADE_DURATION } from "./constants";

const KILOBYTE = 1000;
const MEGABYTE = KILOBYTE * 1000;
const GIGABYTE = MEGABYTE * 1000;

export const formatByteDisplay = (numBytes: number) => {
  let rawCount = numBytes;
  let prefix = "B";

  if (numBytes === 0) {
  } else if (numBytes >= GIGABYTE) {
    rawCount = numBytes / GIGABYTE;
    prefix = "GB";
  } else if (numBytes >= MEGABYTE) {
    rawCount = numBytes / MEGABYTE;
    prefix = "MB";
  } else if (numBytes >= KILOBYTE) {
    rawCount = numBytes / KILOBYTE;
    prefix = "KB";
  }

  return `${Number(rawCount.toFixed(2))} ${prefix}`;
};

export const getTransitionLength = (event: ReaderEventType) => {
  switch (event) {
    case ReaderEventType.SPAN_WILL_ENTER:
      return ENTER_FADE_DURATION;
    case ReaderEventType.BLOCK_WILL_LEAVE:
      return LEAVE_FADE_DURATION;
    case ReaderEventType.BLOCK_ENTER:
    case ReaderEventType.SPAN_ENTER:
    case ReaderEventType.BLOCK_LEAVE:
    default:
      return 0;
  }
};

export const getWordCount = (text: string) => text.split(" ").length;

const PUNC = [".", "?", "!", ","];
export const splitParagraph = (blockId: string, text: string) => {
  let spans = [text];
  for (let punc of PUNC) {
    const tempSpans: string[] = [];
    spans.forEach(span => {
      tempSpans.push(
        ...span
          .split(punc)
          .filter(s => s.trim().length)
          .map((s, sIdx, arr) => s + (sIdx < arr.length - 1 ? punc : ""))
      );

      if (span.endsWith(punc)) {
        tempSpans[tempSpans.length - 1] += punc;
      }
    });
    spans = tempSpans;
  }
  return spans.map((span, spanIdx) => ({
    id: `${blockId}_$${spanIdx}`,
    text: span
  }));
};
