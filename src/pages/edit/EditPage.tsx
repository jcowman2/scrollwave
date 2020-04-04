import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import TextEdit from "./TextEdit";
import { IAudio } from "./edit.types";
import AudioEdit from "./AudioEdit";
import UploadAudioModal from "../UploadAudioModal";

export interface IEditPageProps {}

const EditPage: React.FC<IEditPageProps> = props => {
  const [isAudioModalVisible, setAudioModalVisible] = React.useState(false);
  const [audio, setAudio] = React.useState<IAudio>();

  return (
    <>
      <div className="TextEditContainer">
        <TextEdit />
      </div>
      <div className="AudioEditContainer">
        {audio ? (
          <AudioEdit audio={audio} />
        ) : (
          <button
            className="AddAudioBtn"
            onClick={() => setAudioModalVisible(true)}
          >
            <FontAwesomeIcon icon="plus-circle" size="6x" />
            <div className="AddAudioBtnLabel">Click to upload audio</div>
          </button>
        )}
      </div>
      <UploadAudioModal
        visible={isAudioModalVisible}
        onClose={() => setAudioModalVisible(false)}
        onSubmit={file => {
          setAudioModalVisible(false);
          setAudio({ file });
        }}
      />
    </>
  );
};

export default EditPage;
