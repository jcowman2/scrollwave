import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export interface ILoadableProps {
  isLoading: boolean;
}

const Loadable: React.FC<ILoadableProps> = props => {
  if (!props.isLoading) {
    return <>{props.children}</>;
  }

  return (
    <div className="Loadable">
      <FontAwesomeIcon icon="spinner" pulse size="3x" opacity={0.5} />
      <div style={{ display: "none" }}>{props.children}</div>
    </div>
  );
};

export default Loadable;
