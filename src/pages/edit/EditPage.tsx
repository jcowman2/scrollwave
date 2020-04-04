import React from "react";
import TextEdit from "./TextEdit";

export interface IEditPageProps {}

const EditPage: React.FC<IEditPageProps> = props => {
  return (
    <div className="TextEditContainer">
      <TextEdit />
    </div>
  );
};

export default EditPage;
