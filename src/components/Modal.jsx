// components/Modal/Modal.jsx
import React from "react";
import "../styles/Modal.css";
import "../../bootstrap.css";
const Modal = (props) => {
  return (
    <div className="custom__modal" onClick={() => props.onClose(false)}>
      <div
        className="modal__content"
        onClick={(event) => event.stopPropagation()}
      >
        {props.children}
      </div>
    </div>
  );
};

export default Modal;
