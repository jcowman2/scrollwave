import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import WaveSurfer from "wavesurfer.js";
// @ts-ignore
import RegionsPlugin from "wavesurfer.js/dist/plugin/wavesurfer.regions";
import { Color } from "../../common/enum";
import Loadable from "../../common/Loadable";
import AudioControls from "../../common/AudioControls";
import { Timestamp, Region } from "./edit.types";
import RegionElementAnnotation from "./RegionElementAnnotation";

export interface IAudioEditProps {
  audio: File;
  onError: () => void;
}

export interface IAudioEditRef {
  addAnchor: (anchorId: string) => Region | null;
  removeAnchor: (region: Region) => void;
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

      ws.on("region-created", (evRegion: Region) => {
        const regionElement = document.querySelectorAll(
          `[data-id='${evRegion.id}']`
        )[0];

        ReactDOM.render(
          <RegionElementAnnotation anchorId={evRegion.id} />,
          regionElement
        );
      });

      surfer.current = ws;
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.audio]);

    React.useImperativeHandle<IAudioEditRef, IAudioEditRef>(ref, () => ({
      addAnchor: (anchorId: string) => {
        if (!surfer.current) {
          return null;
        }
        const playhead = surfer.current.getCurrentTime();
        console.log(playhead);

        const region = surfer.current.addRegion({
          id: anchorId,
          drag: false,
          resize: false,
          start: playhead,
          end: playhead + 0.03,
          color: "white"
        });

        return region as Region;
      },
      removeAnchor: (region: Region) => {
        region.remove();
      }
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
