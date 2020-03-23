import React from "react";
import { Editor, EditorState } from "draft-js";

export interface TextEditProps {}

const TextEdit: React.FC<TextEditProps> = props => {
  const [editorState, setEditorState] = React.useState(
    EditorState.createEmpty()
  );

  return <Editor editorState={editorState} onChange={setEditorState} />;
};

export default TextEdit;
