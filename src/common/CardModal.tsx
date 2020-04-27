import React from "react";

export interface ICardModalProps {
  title: string;
  visible: boolean;
  onClose: () => void;
  onSubmit?: () => void;
  submitDisabled?: boolean;
  notifyOnly?: boolean;
}

const CardModal: React.FC<ICardModalProps> = props => {
  if (!props.visible) {
    return <div />;
  }

  return (
    <div className="modal is-active">
      <div className="modal-background" onClick={props.onClose} />
      <div className="modal-card">
        <header className="modal-card-head">
          <p className="modal-card-title">{props.title}</p>
          <button
            className="delete"
            aria-label="close"
            onClick={props.onClose}
          />
        </header>
        <section className="modal-card-body">{props.children}</section>
        <footer className="modal-card-foot">
          {props.notifyOnly ? (
            <button className="button" onClick={props.onClose}>
              Okay
            </button>
          ) : (
            <>
              <button
                className="button is-success"
                onClick={!props.submitDisabled ? props.onSubmit : () => {}}
                disabled={!!props.submitDisabled}
              >
                Submit
              </button>
              <button className="button" onClick={props.onClose}>
                Cancel
              </button>
            </>
          )}
        </footer>
      </div>
    </div>
  );
};

export default CardModal;
