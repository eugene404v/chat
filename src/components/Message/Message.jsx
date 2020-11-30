import React from "react";

import "./Message.scss";

function Message(props) {
  return (
    <div className="message">
      <div className="message__avatar">
        <img className='avatar' src={props.avatar} alt="" />
      </div>
      <div className="message__content">
        <div className="message__bubble">
          <div className="message__text">{props.text}</div>
        </div>
        <span className="message__date">{props.date}</span>
      </div>
    </div>
  );
}

export default Message;
