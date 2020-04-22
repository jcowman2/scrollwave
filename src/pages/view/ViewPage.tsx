import React from "react";
import FullPage from "../../common/FullPage";
import { ReaderData } from "../../common/common.types";
import AnimatedReader from "./AnimatedReader";
import AudioControls from "../../common/AudioControls";

export interface IViewPageProps {
  readerData?: ReaderData;
}

const ViewPage: React.FC<IViewPageProps> = props => {
  const { readerData } = props;
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [playhead, setPlayhead] = React.useState(0);
  const [didFinish, setDidFinish] = React.useState(false);

  if (!readerData) {
    return <div />;
  }

  const handlePlayPause = async () => {
    if (isPlaying) {
      readerData.audio.element.pause();
    } else {
      await readerData.audio.element.play();
    }
    setIsPlaying(!isPlaying);
    if (didFinish) {
      setPlayhead(0);
      setDidFinish(false);
    }
  };

  return (
    <FullPage>
      <AnimatedReader
        regions={readerData.events}
        isPlaying={isPlaying}
        value={playhead}
        onTick={({ value }) => setPlayhead(value)}
        onEnded={() => {
          setIsPlaying(false);
          setDidFinish(true);
        }}
      />
      <AudioControls isPlaying={isPlaying} onPlayPause={handlePlayPause} />
    </FullPage>
  );
};

export default ViewPage;
