import React from "react";
import { IBlock } from "../../common/common.types";

export interface IBlockAnimationState {
  offsetVertical: number;
}

export interface IAnimatedBlockProps {
  animationState: IBlockAnimationState;
  data: IBlock;
  onUpdateBoundingRect: (rect: DOMRect) => void;
}

const AnimatedBlock: React.FC<IAnimatedBlockProps> = props => {
  const blockRef = React.createRef<HTMLParagraphElement>();

  React.useEffect(() => {
    const rect = blockRef.current?.getBoundingClientRect();
    if (rect) {
      props.onUpdateBoundingRect(rect);
    }
  });

  return (
    <p
      className="TextViewportBlock"
      style={{ top: props.animationState.offsetVertical }}
      ref={blockRef}
    >
      {props.data.text}
    </p>
  );
};

export default AnimatedBlock;
