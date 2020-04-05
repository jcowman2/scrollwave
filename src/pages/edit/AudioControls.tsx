import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export interface IAudioControlsProps {
  isPlaying: boolean;
  onPlayPause: () => void;
}

const AudioControls: React.FC<IAudioControlsProps> = props => {
  return (
    <div className="AudioControls">
      <button className="BlankButton" onClick={props.onPlayPause}>
        <FontAwesomeIcon icon={props.isPlaying ? "pause" : "play"} size="4x" />
      </button>
    </div>
  );
};

export default AudioControls;
