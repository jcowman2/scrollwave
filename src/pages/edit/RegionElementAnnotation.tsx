import React from "react";

export interface IRegionElementAnnotationProps {
  anchorId: string;
}

const RegionElementAnnotation: React.FC<IRegionElementAnnotationProps> = props => {
  return <div className="RegionElementAnnotation">{props.anchorId}</div>;
};

export default RegionElementAnnotation;
