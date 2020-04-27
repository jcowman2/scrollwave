import React from "react";
import moment from "moment";
import CardModal from "../common/CardModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { formatByteDisplay } from "../common/utils";

export interface IUploadAudioModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (file: File) => void;
}

const UploadAudioModal: React.FC<IUploadAudioModalProps> = props => {
  const [audioFile, setAudioFile] = React.useState<File>();

  return (
    <CardModal
      title="Upload Audio"
      visible={props.visible}
      onClose={props.onClose}
      onSubmit={() => audioFile && props.onSubmit(audioFile)}
    >
      <div className="UploadAudioModalFileInput">
        <div className="file is-boxed">
          <label className="file-label">
            <input
              className="file-input"
              type="file"
              name="audio"
              onChange={event => {
                const file = event.target.files![0];
                if (file) {
                  setAudioFile(file);
                }
              }}
            />
            <span className="file-cta">
              <span className="file-icon">
                <FontAwesomeIcon icon="upload" />
              </span>
              <span className="file-label">Choose a file</span>
            </span>
          </label>
        </div>
        {audioFile && (
          <div className="UploadAudioModalFileInputData">
            {audioFile.name}
            <br />
            <strong>Last Modified: </strong>
            {moment(audioFile.lastModified).format("MMMM Do YYYY, h:mm a")}
            <br />
            <strong>Size: </strong>
            {formatByteDisplay(audioFile.size)}
          </div>
        )}
      </div>
      <div style={{ marginTop: 12, opacity: 0.7 }}>
        <i>
          This file will only be stored in your browser&apos;s memory while you
          use Scrollwave. It will not be sent anywhere by Scrollwave.
        </i>
      </div>
    </CardModal>
  );
};

export default UploadAudioModal;
