import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import TextEdit, { TextEditRef } from "./TextEdit";
import AudioEdit, { IAudioEditRef } from "./AudioEdit";
import UploadAudioModal from "../UploadAudioModal";
import FullPage from "../../common/FullPage";
import { ReaderData } from "../../common/common.types";
import { useAudioMarkers } from "./edit.hooks";
import ErrorModal from "./ErrorModal";

export interface IEditPageProps {
  onWatch: (readerData: ReaderData) => void;
}

const EditPage: React.FC<IEditPageProps> = props => {
  const [isAudioModalVisible, setAudioModalVisible] = React.useState(false);
  const [isAutomaticMode, setAutomaticMode] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [audio, setAudio] = React.useState<File>();
  const textEditRef = React.useRef<TextEditRef>(null);
  const audioEditRef = React.useRef<IAudioEditRef>(null);
  const { handleAddAnchor, handleRemoveAnchor, timestamps } = useAudioMarkers(
    audioEditRef
  );

  return (
    <FullPage
      header={
        <nav
          className="navbar FadeIn"
          style={audio ? { animationPlayState: "running" } : {}}
        >
          <div className="container">
            <div className="navbar-menu">
              <div className="navbar-end">
                <div className="navbar-item">
                  <div className="field">
                    <label className="checkbox">
                      <input
                        type="checkbox"
                        checked={isAutomaticMode}
                        onChange={() => {
                          if (isAutomaticMode) {
                            setAutomaticMode(false);
                          } else {
                            setError(
                              "Once you change to manual mode, you can't switch back to automatic."
                            );
                          }
                        }}
                        style={{ marginRight: 4 }}
                      />
                      Automatic Mode
                    </label>
                  </div>
                </div>
                <div className="navbar-item">
                  <button
                    className="button NavButton"
                    onClick={async () => {
                      const contentState = textEditRef.current?.getContentState();
                      const readerData = await ReaderData.fromEditor(
                        contentState!,
                        audio!,
                        isAutomaticMode,
                        timestamps!
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
        <TextEdit
          ref={textEditRef}
          canSetAnchors={audio !== undefined && !isAutomaticMode}
          onAddAnchor={handleAddAnchor}
          onRemoveAnchor={handleRemoveAnchor}
        />
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
            ref={audioEditRef}
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
      <ErrorModal message={error} onClose={() => setError(null)} />
    </FullPage>
  );
};

export default EditPage;
