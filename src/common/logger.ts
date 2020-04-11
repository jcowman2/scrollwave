const SUPPRESS: string[] = [
  // "useTimingControl"
  "ReaderData"
];

const createLogger = <S extends string>(module: string) => {
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

export default createLogger;
