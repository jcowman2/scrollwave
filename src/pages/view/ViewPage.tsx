import React from "react";
import { NodeGroup } from "react-move";
import FullPage from "../../common/FullPage";
import { ReaderData } from "../../common/common.types";

export interface IViewPageProps {
  readerData: ReaderData;
}

const ViewPage: React.FC<IViewPageProps> = props => {
  return (
    <FullPage>
      <div className="TextViewport">
        {/* <NodeGroup></NodeGroup> */}
        <div className="TextContent">
          {props.readerData.blocks.map(block => (
            <p key={block.key}>{block.text}</p>
          ))}
        </div>
      </div>
    </FullPage>
  );
};

export default ViewPage;
