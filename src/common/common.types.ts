import Draft from "draft-js";

export interface IBlock {
  key: string;
  text: string;
}

export class ReaderData {
  blocks: IBlock[];

  constructor(blocks: IBlock[]) {
    this.blocks = blocks;
  }

  public static fromEditor(contentState: Draft.ContentState): ReaderData {
    const draftBlocks = contentState.getBlocksAsArray();
    console.log("ReaderData::fromEditor draftBlocks", draftBlocks);

    const readerBlocks = draftBlocks.map(draftBlock => ({
      key: draftBlock.getKey(),
      text: draftBlock.getText()
    }));

    return new ReaderData(readerBlocks);
  }
}
