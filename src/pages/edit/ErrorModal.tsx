import React from "react";
import CardModal from "../../common/CardModal";

export interface IErrorModalProps {
  message: string | null;
  onClose: () => void;
}

const ErrorModal: React.FC<IErrorModalProps> = props => {
  if (props.message === null) {
    return null;
  }
  return (
    <CardModal title="Error" visible onClose={props.onClose} notifyOnly>
      {props.message}
    </CardModal>
  );
};

export default ErrorModal;
