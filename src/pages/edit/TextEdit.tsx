import React from "react";
import {
  Editor,
  EditorState,
  ContentState,
  KeyBindingUtil,
  getDefaultKeyBinding,
  DraftHandleValue
} from "draft-js";
import { useAnchorModifiers } from "./edit.hooks";
import { Key, KeybindEvent } from "../../common/enum";
import { decorator } from "./AnchorSpan";
import { AnchorContext } from "./edit.context";

export interface TextEditProps {}

export interface TextEditRef {
  getContentState: () => ContentState;
}

const keyBindingFn = (e: any) => {
  if (e.keyCode == Key.PERIOD && KeyBindingUtil.hasCommandModifier(e)) {
    return KeybindEvent.INSERT_ANCHOR;
  }
  return getDefaultKeyBinding(e);
};

const TextEdit = React.forwardRef<TextEditRef, TextEditProps>(function TextEdit(
  props,
  ref
) {
  const [editorState, setEditorState] = React.useState(
    EditorState.createWithContent(
      ContentState.createFromText("Start writing your next masterpiece..."),
      decorator
    )
  );

  const { placeAnchor, anchors } = useAnchorModifiers(setEditorState);

  React.useImperativeHandle<TextEditRef, TextEditRef>(ref, () => ({
    getContentState: () => editorState.getCurrentContent()
  }));

  const handleKeyCommand = (command: string): DraftHandleValue => {
    if (command === KeybindEvent.INSERT_ANCHOR) {
      placeAnchor(editorState);
      return "handled";
    }
    return "not-handled";
  };

  return (
    <AnchorContext.Provider value={anchors}>
      <div className="TextEdit">
        <Editor
          editorState={editorState}
          onChange={setEditorState}
          keyBindingFn={keyBindingFn}
          handleKeyCommand={handleKeyCommand}
        />
      </div>
    </AnchorContext.Provider>
  );
});

export default TextEdit;
