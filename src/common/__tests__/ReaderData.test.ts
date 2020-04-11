import { ReaderData, IBlock, ISpan, IReaderEvent } from "../common.types";
import { ReaderEventType } from "../enum";

const DEMO_BLOCKS1: IBlock[] = [
  { id: "b1", spans: [{ id: "1s1", text: "Leaflets" }] },
  {
    id: "b2",
    spans: [
      {
        id: "2s1",
        text: "At dusk they pour from the sky."
      },
      {
        id: "2s2",
        text:
          "They blow across the ramparts, turn cartwheels over rooftops, flutter into the ravines between houses. Entire streets swirl with them, flashing white against the cobbles. Urgent message to the inhabitants of this town, they say. Depart immediately to open country."
      }
    ]
  },
  {
    id: "b3",
    spans: [
      {
        id: "3s1",
        text:
          "The tide climbs. The moon hangs small and yellow and gibbous. On the rooftops of beachfront hotels to the east, and in the gardens behind them, a half-dozen American artillery units drop incendiary rounds into the mouths of mortars."
      }
    ]
  }
];

const DEMO_SONG = { length: 20000 };

const deepCopy = <T extends object>(obj: T): T =>
  JSON.parse(JSON.stringify(obj));

const sumDurations = (events: IReaderEvent[]) =>
  Math.round(events.reduce((sum, event) => sum + event.duration, 0));

const findSpanEnterIndex = (span: ISpan, readerData: ReaderData) =>
  readerData.events.findIndex(
    ev => ev.span === span && ev.type === ReaderEventType.SPAN_WILL_ENTER
  );

it("Events sum up to the total song length", () => {
  const length = 20000;
  const readerData = new ReaderData(DEMO_BLOCKS1, { length });
  expect(sumDurations(readerData.events)).toEqual(length);
});

it("The first event can be delayed", () => {
  const blocks = deepCopy(DEMO_BLOCKS1);
  const start = 200;

  blocks[0].spans[0].start = start;
  const readerData = new ReaderData(blocks, DEMO_SONG);
  expect(readerData.events[0].duration).toEqual(start);
});

it("Specifying two starts sets the duration", () => {
  const blocks = deepCopy(DEMO_BLOCKS1);

  const span1 = blocks[0].spans[0];
  span1.start = 200;

  const span2 = blocks[1].spans[0];
  span2.start = 2000;

  const readerData = new ReaderData(blocks, DEMO_SONG);

  const event1Idx = findSpanEnterIndex(span1, readerData);
  const event2Idx = findSpanEnterIndex(span2, readerData);

  const event1 = readerData.events[event1Idx];
  const event2 = readerData.events[event2Idx];

  expect(event1.start).toEqual(200);
  expect(event2.start).toEqual(2000);
  expect(sumDurations(readerData.events.slice(event1Idx, event2Idx))).toEqual(
    1800
  );
});
