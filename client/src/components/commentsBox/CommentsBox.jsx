import React, { useRef, useState } from "react";
import "./commentsBox.css";
import { useOpenReply } from '../message/Message';
//main context
import { useMainContext } from '../../context/Context';

const CommentsBox = (props) => {

  const { setMessageUpdate } = useMainContext();

  const changeOpenReply = useOpenReply();

  const message = useRef(null);

  // trigger underlined animation
  const [showCommentLine, setShowCommentLine] = useState(false);
  // true on focus, false on cancel press
  const [showButtons, setShowButtons] = useState(false);
  // true on input data, false when input is blank
  const [enableButton, setEnableButton] = useState(true);

  // when click on the input, show the underline and the button
  const commentFocus = () => {
    setShowCommentLine(true);
    setShowButtons(true);
  };

  // when click on input, hide the underline
  const commentFocusOut = () => {
    setShowCommentLine(false);
  };

  // if input value isnt empty enable the comment button
  const commentStroke = (event) => {
    // event.preventDefault();
    let currentMessage = event.target.value;
    if (currentMessage !== '') {
      setEnableButton(false);
    } else {
      setEnableButton(true);
    }
  };

  // send comment
  const sendComment = (event) => {
    event.preventDefault();
    fetch("/new-sub-comment", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({messageId: props.useKey, messageData: message.current.value})
    }).then(() => {
      setMessageUpdate([1, props.useKey]);
      //reset everything so it resets
      message.current.value = '';
      setEnableButton(false);
    })
  };

  return (
    <form>
      <section className="commentBox">
        <input
          autoFocus={props.autoFocus}
          type="text"
          placeholder="Add a public comment"
          ref={message}
          onFocus={commentFocus}
          onBlur={commentFocusOut}
          onKeyUp={commentStroke}
        />
        {/* underline begins here */}
        {showCommentLine && <div className="commentLine"></div>}
      </section>
      {showButtons && (
        <>
          <button
            className="commentButton sendButton"
            disabled={enableButton}
            onClick={sendComment}
          >
            COMMENT
          </button>
          <button
            className="commentButton"
            style={{ color: "grey", backgroundColor: "transparent" }}
            onClick={() => {
              setShowButtons(false);
              changeOpenReply();
            }}
          >
            CANCEL
          </button>
        </>
      )}
    </form>
  );
};

export default CommentsBox;
