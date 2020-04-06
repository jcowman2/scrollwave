import React from "react";
import { NodeGroup } from "react-move";
import FullPage from "../../common/FullPage";
import { ReaderData, IBlock } from "../../common/common.types";
import { TEXT_VIEWPORT_HEIGHT } from "../../common/constants";

export interface IViewPageProps {
  readerData: ReaderData;
}

interface IBlockState {
  offsetVertical: number;
}

const ViewPage: React.FC<IViewPageProps> = props => {
  return (
    <FullPage>
      <div className="TextViewport">
        <NodeGroup
          data={props.readerData.blocks}
          keyAccessor={(block: IBlock) => block.key}
          start={(_item: IBlock, _index: number): IBlockState => ({
            offsetVertical: TEXT_VIEWPORT_HEIGHT + 20
          })}
          enter={(_item: IBlock, index: number) => ({
            offsetVertical: [-100], // TODO - account for multiline blocks
            timing: { duration: 10000, delay: 1000 * index }
          })}
        >
          {(
            nodes: Array<{ key: string; data: IBlock; state: IBlockState }>
          ) => (
            <div className="TextViewportContent">
              {nodes.map(({ key, data, state }) => (
                <p
                  className="TextViewportBlock"
                  key={key}
                  style={{ top: state.offsetVertical }}
                >
                  {data.text}
                </p>
              ))}
            </div>
          )}
        </NodeGroup>
      </div>
    </FullPage>
  );
};

export default ViewPage;
