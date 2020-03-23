import React from "react";

export interface ITextEditProps {}

const TextEdit: React.FC<ITextEditProps> = props => {
  return (
    <div className="field">
      <div className="control">
        <textarea
          className="textarea TextEdit"
          placeholder="e.g. Hello world"
        />
      </div>
    </div>
  );
};

export default TextEdit;
