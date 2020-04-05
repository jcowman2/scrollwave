import React, { useEffect } from "react";
import WaveSurfer from "wavesurfer.js";

import { Color } from "../../common/enum";
import Loadable from "../../common/Loadable";
import AudioControls from "./AudioControls";

export interface IAudioEditProps {
  audio: File;
  onError: () => void;
}

const AudioEdit: React.FC<IAudioEditProps> = props => {
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [zoom, setZoom] = React.useState(100);

  let surfer = React.useRef<WaveSurfer>();

  useEffect(() => {
    const ws = WaveSurfer.create({
      container: "#AudioEditWaveform",
      waveColor: Color.PRIMARY,
      progressColor: Color.TURQUOISE,
      cursorColor: Color.GRAY,
      barWidth: 3,
      barRadius: 3,
      cursorWidth: 1,
      height: 200,
      barGap: 3
    });

    ws.loadBlob(props.audio);
    ws.on("ready", () => {
      setIsLoaded(true);
      ws.zoom(100);
    });
    ws.on("finish", () => setIsPlaying(false));
    ws.on("error", () => props.onError());

    surfer.current = ws;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.audio]);

  return (
    <div>
      <div id="AudioEditWaveform" />
      <Loadable isLoading={!isLoaded}>
        <AudioControls
          isPlaying={isPlaying}
          onPlayPause={() => {
            surfer.current?.playPause();
            setIsPlaying(!isPlaying);
          }}
        />
      </Loadable>
    </div>
  );
};

export default AudioEdit;
