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
import ErrorModal from "./ErrorModal";

export interface TextEditProps {
  canSetAnchors: boolean;
}

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
  const { canSetAnchors } = props;
  const [editorState, setEditorState] = React.useState(
    EditorState.createWithContent(
      ContentState.createFromText("Start writing your next masterpiece..."),
      decorator
    )
  );
  const [error, setError] = React.useState<string | null>(null);

  const { placeAnchor, anchors } = useAnchorModifiers(
    setEditorState,
    canSetAnchors,
    setError
  );

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
      <ErrorModal message={error} onClose={() => setError(null)} />
    </AnchorContext.Provider>
  );
});

export default TextEdit;
