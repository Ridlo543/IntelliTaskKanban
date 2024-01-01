// components/Editable/Editable.jsx
import React, { useState } from "react";
import { Plus, X } from "react-feather";
import "../../../bootstrap.css";

const Editable = (props) => {
  const [show, setShow] = useState(props?.handler || false);
  const [text, setText] = useState(props.defaultValue || "");
  const [limit, setLimit] = useState(0);

  const handleOnSubmit = (e) => {
    e.preventDefault();
    if (text && props.onSubmit) {
      setText("");
      props.onSubmit(text, props.limitEnabled ? limit : undefined);
    }
    setShow(false);
    setLimit(0); // Reset the limit after submission
  };

  return (
    <div className={`editable ${props.parentClass}`}>
      {show ? (
        <form onSubmit={handleOnSubmit}>
          <div className={`editable__input ${props.class}`}>
            <textarea
              placeholder={props.placeholder}
              autoFocus
              id={"edit-input"}
              type={"text"}
              onChange={(e) => setText(e.target.value)}
            />
            <br />
            {props.limitEnabled && (
              <input
                className="limit__input"
                type="number"
                placeholder="Set card limit"
                onChange={(e) => setLimit(e.target.value)}
              />
            )}
            <div className="btn__control">
              <button className="add__btn" type="submit">
                {`${props.btnName}` || "Add"}
              </button>
              <X
                className="close"
                onClick={() => {
                  setShow(false);
                  if (props?.setHandler) {
                    props.setHandler(false);
                  }
                }}
              />
            </div>
          </div>
        </form>
      ) : (
        <p
          onClick={() => {
            setShow(true);
          }}
        >
          {props.defaultValue === undefined ? <Plus /> : <></>}
          {props?.name || "Add"}
        </p>
      )}
    </div>
  );
};

export default Editable;
