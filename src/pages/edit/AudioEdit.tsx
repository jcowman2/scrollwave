import React, { useEffect } from "react";
import WaveSurfer from "wavesurfer.js";
// @ts-ignore
import RegionsPlugin from "wavesurfer.js/dist/plugin/wavesurfer.regions";
import { Color } from "../../common/enum";
import Loadable from "../../common/Loadable";
import AudioControls from "../../common/AudioControls";
import { Timestamp, Region } from "./edit.types";

export interface IAudioEditProps {
  audio: File;
  onError: () => void;
}

export interface IAudioEditRef {
  addAnchor: () => Region | null;
  removeAnchor: (regionId: string) => void;
}

const AudioEdit = React.forwardRef<IAudioEditRef, IAudioEditProps>(
  function AudioEdit(props, ref) {
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
        barGap: 3,
        plugins: [RegionsPlugin.create({})]
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

    React.useImperativeHandle<IAudioEditRef, IAudioEditRef>(ref, () => ({
      addAnchor: () => {
        if (!surfer.current) {
          return null;
        }
        const playhead = surfer.current.getCurrentTime();
        console.log(playhead);

        const region = surfer.current.addRegion({
          drag: false,
          resize: false,
          start: playhead,
          end: playhead + 0.1,
          color: Color.TURQUOISE
        });
        console.log("region", region);

        return region as Region;
      },
      removeAnchor: (regionId: string) => {}
    }));

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
  }
);

export default AudioEdit;
