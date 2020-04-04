import React from "react";
import { Editor, EditorState, RichUtils } from "draft-js";

export interface TextEditProps {}

const TextEdit: React.FC<TextEditProps> = props => {
  const [editorState, setEditorState] = React.useState(
    EditorState.createEmpty()
  );

  const handleKeyCommand = (command: any, editorState: EditorState) => {
    const handleResult = RichUtils.handleKeyCommand(editorState, command);
    const newState = handleResult || editorState;
    const response = handleResult ? "handled" : "not-handled";

    setEditorState(newState);

    return response;
  };

  return (
    <Editor
      editorState={editorState}
      onChange={setEditorState}
      handleKeyCommand={handleKeyCommand}
    />
  );
};

export default TextEdit;
