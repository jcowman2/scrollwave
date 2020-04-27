import React from "react";
import { CompositeDecorator, ContentBlock, ContentState } from "draft-js";
import { EntityType } from "../../common/enum";
import { AnchorContext } from "./edit.context";

const getEntityStrategy = (type: EntityType) => (
  contentBlock: ContentBlock,
  callback: (start: number, end: number) => void,
  contentState: ContentState
) => {
  contentBlock.findEntityRanges(char => {
    const entityKey = char.getEntity();
    if (entityKey === null) {
      return false;
    }
    return contentState.getEntity(entityKey).getType() === type;
  }, callback);
};

export interface IAnchorSpanProps {
  contentState: ContentState;
  entityKey: string;
}

const AnchorSpan: React.FC<IAnchorSpanProps> = props => {
  const { id: anchorId }: { id: string } = props.contentState
    .getEntity(props.entityKey)
    .getData();

  const anchors = React.useContext(AnchorContext);
  const idx = anchors.findIndex(anchor => anchor === anchorId);

  return (
    <span key={anchorId} className="AnchorSpan">
      {idx + 1}
    </span>
  );
};

export const decorator = new CompositeDecorator([
  {
    strategy: getEntityStrategy(EntityType.ANCHOR),
    component: AnchorSpan
  }
]);
