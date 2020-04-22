import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import TextEdit, { TextEditRef } from "./TextEdit";
import AudioEdit from "./AudioEdit";
import UploadAudioModal from "../UploadAudioModal";
import FullPage from "../../common/FullPage";
import { ReaderData } from "../../common/common.types";

export interface IEditPageProps {
  onWatch: (readerData: ReaderData) => void;
}

const EditPage: React.FC<IEditPageProps> = props => {
  const [isAudioModalVisible, setAudioModalVisible] = React.useState(false);
  const [audio, setAudio] = React.useState<File>();
  const textEditRef = React.useRef<TextEditRef>(null);

  return (
    <FullPage
      header={
        <nav
          className="navbar FadeIn"
          style={audio ? { animationPlayState: "running" } : {}}
          // style={{ animationPlayState: "running" }}
        >
          <div className="container">
            <div className="navbar-menu">
              <div className="navbar-end">
                <div className="navbar-item">
                  <button
                    className="button NavButton"
                    onClick={async () => {
                      const contentState = textEditRef.current?.getContentState();
                      const readerData = await ReaderData.fromEditor(
                        contentState!,
                        audio!
                      );
                      props.onWatch(readerData);
                    }}
                  >
                    Watch
                  </button>
                </div>
              </div>
            </div>
          </div>
        </nav>
      }
    >
      <div className="TextEditContainer">
        <TextEdit ref={textEditRef} />
      </div>
      <div className="AudioEditContainer">
        {audio ? (
          <AudioEdit
            audio={audio}
            onError={() => {
              alert(
                "That file could not be processed. Please try again or upload a different file."
              );
              setAudio(undefined);
            }}
          />
        ) : (
          <button
            className="BlankButton AddAudioBtn"
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
          setAudio(file);
        }}
      />
    </FullPage>
  );
};

export default EditPage;
