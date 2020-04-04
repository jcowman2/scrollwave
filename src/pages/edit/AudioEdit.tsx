import React from "react";
import { IAudio } from "./edit.types";

export interface IAudioEditProps {
  audio: IAudio;
}

const AudioEdit: React.FC<IAudioEditProps> = props => {
  return <div>AUDIO EDIT GOES HERE</div>;
};

export default AudioEdit;
