import React from "react";
import { Editor, EditorState, ContentState } from "draft-js";

export interface TextEditProps {}

const TextEdit: React.FC<TextEditProps> = props => {
  const [editorState, setEditorState] = React.useState(
    EditorState.createWithContent(
      ContentState.createFromText("Start writing your next masterpiece...")
    )
  );

  return (
    <div className="TextEdit">
      <Editor editorState={editorState} onChange={setEditorState} />
    </div>
  );
};

export default TextEdit;
