import React from "react";
import "../styles/Tag.css";
import "../styles/bootstrap.css";
const Tag = (props) => {
  return (
    // <div className='tag'>
    <span className="tag" style={{ backgroundColor: `${props?.color}` }}>
      {props?.tagName}
    </span>
    // </div>
  );
};

export default Tag;
