import React from "react";
import { Editor, EditorState, ContentState } from "draft-js";

export interface TextEditProps {}

export interface TextEditRef {
  getContentState: () => ContentState;
}

const TextEdit = React.forwardRef<TextEditRef, TextEditProps>(function TextEdit(
  props,
  ref
) {
  const [editorState, setEditorState] = React.useState(
    EditorState.createWithContent(
      ContentState.createFromText("Start writing your next masterpiece...")
    )
  );

  React.useImperativeHandle<TextEditRef, TextEditRef>(ref, () => ({
    getContentState: () => editorState.getCurrentContent()
  }));

  return (
    <div className="TextEdit">
      <Editor editorState={editorState} onChange={setEditorState} />
    </div>
  );
});

export default TextEdit;
