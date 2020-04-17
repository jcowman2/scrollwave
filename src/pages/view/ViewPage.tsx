import React from "react";
import FullPage from "../../common/FullPage";
import { ReaderData } from "../../common/common.types";
import AnimatedReader from "./AnimatedReader";
import AudioControls from "../../common/AudioControls";

export interface IViewPageProps {
  readerData: ReaderData;
}

const ViewPage: React.FC<IViewPageProps> = props => {
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [playhead, setPlayhead] = React.useState(0);
  const [didFinish, setDidFinish] = React.useState(false);

  return (
    <FullPage>
      <AnimatedReader
        regions={props.readerData.events}
        isPlaying={isPlaying}
        value={playhead}
        onTick={({ value }) => setPlayhead(value)}
        onEnded={() => {
          setIsPlaying(false);
          setDidFinish(true);
        }}
      />
      <AudioControls
        isPlaying={isPlaying}
        onPlayPause={() => {
          setIsPlaying(!isPlaying);
          if (didFinish) {
            setPlayhead(0);
            setDidFinish(false);
          }
        }}
      />
    </FullPage>
  );
};

export default ViewPage;
