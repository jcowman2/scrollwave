export enum LogConfig {
  ReaderData = "ReaderData",
  AnimatedReader = "AnimatedReader",
  Timeline = "Timeline"
}

const SUPPRESS: LogConfig[] = [
  //
  LogConfig.ReaderData,
  LogConfig.AnimatedReader
];

const createLogger = <S extends string>(module: LogConfig) => {
  if (SUPPRESS.includes(module)) {
    return {
      log: () => {}
    };
  }

  return {
    log: (scope?: S, ...data: any[]) =>
      console.log(
        `${module}::${scope || "enter"}`,
        ...data.map(d =>
          typeof d === "object" ? JSON.parse(JSON.stringify(d)) : d
        )
      )
  };
};

export enum TimingControlLogConfig {
  PlayPause = "PlayPause",
  InitialSetTimeRemaining = "InitialSetTimeRemaining",
  SetTimeout = "SetTimeout"
}

export enum ReaderDataLogConfig {
  AssembleEvents = "AssembleEvents",
  GetNextSpanWithStart = "GetNextSpanWithStart",
  GetSpanTime = "GetSpanTime",
  GetTransitionTimes = "GetTransitionTimes"
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

export default createLogger;
