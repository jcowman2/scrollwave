import React from "react";
import { EditorState, Modifier, convertToRaw } from "draft-js";
import { EntityType } from "../../common/enum";
import { newId } from "../../common/utils";
import { Timestamp } from "./edit.types";
import { IAudioEditRef } from "./AudioEdit";

export const useAnchorModifiers = (
  setEditorState: (es: EditorState) => void,
  canSetAnchors: boolean,
  setError: (message: string) => void,
  onAddAnchor: (id: string) => void,
  onRemoveAnchor: (id: string) => void
) => {
  const [anchors, setAnchors] = React.useState<string[]>([]);

  const addAnchor = (newAnchor: string) => {
    onAddAnchor(newAnchor);
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

  const getAllAnchors = (editorState: EditorState) => {
    const contentState = editorState.getCurrentContent();
    const { entityMap } = convertToRaw(contentState);
    const anchors = Object.values(entityMap)
      .filter(entity => entity.type === EntityType.ANCHOR)
      .map(entity => entity.data.id);
    return anchors;
  };

  const checkForDeletedAnchors = (
    oldState: EditorState,
    newState: EditorState
  ) => {
    const oldAnchors = getAllAnchors(oldState);
    const newAnchors = getAllAnchors(newState);

    if (newAnchors.length < oldAnchors.length) {
      setAnchors(newAnchors);

      for (let oldAnchor of oldAnchors) {
        if (!newAnchors.includes(oldAnchor)) {
          onRemoveAnchor(oldAnchor);
        }
      }
    }
  };

  return { placeAnchor, anchors, checkForDeletedAnchors };
};

export const useAudioMarkers = (
  audioEditRef: React.RefObject<IAudioEditRef>
) => {
  const [timestamps, setTimestamps] = React.useState<Timestamp[]>([]);

  const handleAddAnchor = (anchorId: string) => {
    if (audioEditRef.current === null) {
      console.log("ref is null");
      return;
    }

    console.log("adding anchor");

    audioEditRef.current.addAnchor();
  };

  const handleRemoveAnchor = (anchorId: string) => {};

  return { handleAddAnchor, handleRemoveAnchor, timestamps };
};
