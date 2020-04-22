import React from "react";
import { ContentBlock, ContentState } from "draft-js";
import { EntityType } from "../../common/enum";
import logger, { LogConfig } from "../../common/logger";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const LOG = logger(LogConfig.AnchorBlock);

export interface IAnchorBlockProps {
  block: ContentBlock;
  contentState: ContentState;
}

const AnchorBlock: React.FC<IAnchorBlockProps> = props => {
  const { block, contentState } = props;

  const entity = contentState.getEntity(block.getEntityAt(0));
  const data = entity.getData();
  const type = entity.getType();

  if (type !== EntityType.ANCHOR) {
    LOG.error("render - bad entity type", type);
    return <div />;
  }

  return <FontAwesomeIcon icon="play" />;
};

export default AnchorBlock;
