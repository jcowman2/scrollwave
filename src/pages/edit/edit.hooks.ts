import { EditorState, AtomicBlockUtils } from "draft-js";
import { EntityType } from "../../common/enum";

export const useAnchorModifiers = (
  setEditorState: (es: EditorState) => void
) => {
  const placeAnchor = (editorState: EditorState) => {
    const contentState = editorState.getCurrentContent();
    const contentStateWithEntity = contentState.createEntity(
      EntityType.ANCHOR,
      "IMMUTABLE"
    );
    const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
    const newEditorState = EditorState.push(
      editorState,
      contentStateWithEntity,
      "insert-fragment"
    );

    console.log("setting editor state");

    setEditorState(
      AtomicBlockUtils.insertAtomicBlock(newEditorState, entityKey, " ")
    );
  };

  return { placeAnchor };
};
