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

  return (
    <FullPage>
      <AnimatedReader blocks={props.readerData.blocks} isPlaying={isPlaying} />
      <AudioControls
        isPlaying={isPlaying}
        onPlayPause={() => setIsPlaying(!isPlaying)}
      />
    </FullPage>
  );
};

export default ViewPage;
