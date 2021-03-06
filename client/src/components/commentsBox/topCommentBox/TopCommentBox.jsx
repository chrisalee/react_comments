import React, { useRef, useState } from "react";
import "../commentsBox.css";
//main context
import { useMainContext } from '../../../context/Context'

const TopCommentBox = (props) => {
  const { setMessageReset, setCommentIncrement } = useMainContext()

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

  // if input value isnt empty ENABLE the comment button
  const commentStroke = (event) => {
    // event.preventDefault();
    let currentMessage = event.target.value;
    if (currentMessage === '') {
      setEnableButton(true);
    } else {
      setEnableButton(false);
    }
  };
  
  // send comment
  const sendComment = (event) => {
    event.preventDefault();
    fetch("/new-comment", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({messageData: message.current.value})
    }).then(() => {
      //reset entire comments and matching increment counter
      setMessageReset(prevState => !prevState);
      setCommentIncrement(10);
      //delete text input, update comments and disable comment button
      message.current.value = '';
      setEnableButton(true);
    })
  }

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
        {showCommentLine &&
          <div className="commentLine">
            </div>
        }
      </section>
      {showButtons && (
        <>
          <button className="commentButton sendButton" disabled={enableButton} onClick={sendComment}>
            COMMENT
          </button>
          <button
            className="commentButton"
            style={{ color: "grey", backgroundColor: "transparent" }}
            onClick={() => {
              setShowButtons(false);
              message.current.value = ''
            }}
          >
            CANCEL
          </button>
        </>
      )}
    </form>
  );
};

export default TopCommentBox;
