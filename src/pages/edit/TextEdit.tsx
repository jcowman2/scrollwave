import React from "react";
import {
  Editor,
  EditorState,
  ContentState,
  ContentBlock,
  KeyBindingUtil,
  getDefaultKeyBinding,
  DraftHandleValue
} from "draft-js";
import { useAnchorModifiers } from "./edit.hooks";
import AnchorBlock from "./AnchorBlock";
import { Key, KeybindEvent } from "../../common/enum";

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

const blockRendererFn = (block: ContentBlock) => {
  if (block.getType() !== "atomic") {
    return;
  }

  return {
    component: AnchorBlock,
    editable: false
  };
};

const TextEdit = React.forwardRef<TextEditRef, TextEditProps>(function TextEdit(
  props,
  ref
) {
  const [editorState, setEditorState] = React.useState(
    EditorState.createWithContent(
      ContentState.createFromText("Start writing your next masterpiece...")
    )
  );

  const { placeAnchor } = useAnchorModifiers(setEditorState);

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
    <>
      <div className="TextEdit">
        <Editor
          editorState={editorState}
          onChange={setEditorState}
          blockRendererFn={blockRendererFn}
          keyBindingFn={keyBindingFn}
          handleKeyCommand={handleKeyCommand}
        />
      </div>
    </>
  );
});

export default TextEdit;
