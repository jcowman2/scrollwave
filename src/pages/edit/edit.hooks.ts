import React from "react";
import {
  EditorState,
  AtomicBlockUtils,
  Modifier,
  SelectionState
} from "draft-js";
import { EntityType } from "../../common/enum";
import { newId } from "../../common/utils";

export const useAnchorModifiers = (
  setEditorState: (es: EditorState) => void,
  canSetAnchors: boolean,
  setError: (message: string) => void
) => {
  const [anchors, setAnchors] = React.useState<string[]>([]);

  const addAnchor = (newAnchor: string) => {
    setAnchors([...anchors, newAnchor]);
  };

  const placeAnchor = (editorState: EditorState) => {
    if (!canSetAnchors) {
      setError("Upload audio before you can place anchors.");
      return;
    }

    const anchorId = newId();

    const contentState = editorState.getCurrentContent();
    const contentStateWithEntity = contentState.createEntity(
      EntityType.ANCHOR,
      "IMMUTABLE",
      { id: anchorId }
    );
    const entityKey = contentStateWithEntity.getLastCreatedEntityKey();

    const initSelectionState = editorState.getSelection();
    if (
      initSelectionState.getStartOffset() !== initSelectionState.getEndOffset()
    ) {
      setError("You can't have anything highlighted when you add an anchor.");
      return;
    }

    const contentStateWithAnchor = Modifier.insertText(
      contentStateWithEntity,
      initSelectionState,
      "■",
      undefined,
      entityKey
    );

    const newEditorState = EditorState.push(
      editorState,
      contentStateWithAnchor,
      "insert-characters"
    );

    setEditorState(newEditorState);
    addAnchor(anchorId);
  };

  return { placeAnchor, anchors };
};
