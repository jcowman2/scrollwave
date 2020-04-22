export enum LogConfig {
  ReaderData = "ReaderData",
  AnimatedReader = "AnimatedReader",
  Timeline = "Timeline",
  TimelineManager = "TimelineManager",
  AnchorBlock = "AnchorBlock"
}

const SUPPRESS: LogConfig[] = [
  //
  LogConfig.ReaderData,
  LogConfig.AnimatedReader,
  LogConfig.Timeline,
  LogConfig.TimelineManager
];

const createLogger = <S extends string>(module: LogConfig) => {
  const noop = () => {};
  const logFn = (nativeFn: (...d: any[]) => void, deepCopy = true) => (
    scope?: S,
    ...data: any[]
  ) =>
    nativeFn(
      `${module}::${scope || "enter"}`,
      ...(deepCopy
        ? data.map(d =>
            typeof d === "object" ? JSON.parse(JSON.stringify(d)) : d
          )
        : data)
    );

  const suppressed = SUPPRESS.includes(module);

  return {
    log: suppressed ? noop : logFn(console.log),
    logNoCopy: suppressed ? noop : logFn(console.log, false),
    error: logFn(console.error)
  };
};

export enum ReaderDataLogConfig {
  AssembleEvents = "AssembleEvents",
  GetNextSpanWithStart = "GetNextSpanWithStart",
  GetSpanTime = "GetSpanTime",
  GetTransitionTimes = "GetTransitionTimes",
  FromEditor = "FromEditor"
}

export enum AnimatedReaderLogConfig {
  HandleRegionEvent = "handleRegionEvent"
}

export enum TimelineLogConfig {
  NewTimelineManager = "NewTimelineManagerEffect",
  UpdateInterval = "UpdateIntervalEffect",
  Tick = "TickEffect",
  ValueUpdated = "ValueUpdatedEffect"
}

export enum TimelineManagerLogConfig {
  Construct = "Construct",
  GetEventsSinceLastTick = "GetEventsSinceLastTick",
  InterpolateState = "InterpolateState"
}

export default createLogger;
