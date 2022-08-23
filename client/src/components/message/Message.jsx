import React, { useRef, useState, useContext } from "react";
import "./message.css";
import CommentsBox from "../commentsBox/CommentsBox";
import SubMessage from "./subMessage/SubMessage";
import { Icon } from '@iconify/react';
//main context
import { useMainContext } from '../../context/Context'

//context
const showReply = React.createContext();

export const useOpenReply = () => {
  return useContext(showReply)
}


const Message = (props) => {

  const { setMessageUpdate } = useMainContext();

  const likeIcon = useRef();
  const numLikes = useRef();

  const [arrowUp, setArrowUp] = useState(false);
  const [openReply, setOpenReply] = useState(false);

  //toggle when cancel button and reply button are pressed
  const changeOpenReply = () => {
    setOpenReply(prevState => prevState = !prevState);
  }

  //toggle arrow up and down
  let arrow = <Icon className="arrowIcon" icon="akar-icons:arrow-down-thick" />

  const changeArrow = () => {
    setArrowUp(prevState => prevState = !prevState)
  }

  if(arrowUp) {
    // console.log('arrow up')
    arrow = <Icon className="arrowIcon" icon="ph:arrow-elbow-left-up-bold" />
  } else {
    // console.log('arrow down')
    arrow = <Icon className="arrowIcon" icon="ph:arrow-elbow-left-down-bold" />
  }

  //like message
  let toggleLike = false;
  let likes = props.likes;
  const likeComment = () => {
    toggleLike = !toggleLike;
    // console.log('click')
    if (toggleLike) {
      likes++;
      likeIcon.current.style.color = '#0e019a';
    } else {
      likes--;
      likeIcon.current.style.color = '#7a7a7a';
    }
    numLikes.current.innerHTML = likes;
    //store this new value in the database
    fetch("/update-like", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({messageId: props.useKey, likes: likes})
    })
  }

  const deleteMessage = () => {
    fetch("/delete-comment", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({messageId: props.useKey})
    }).then(() => {
      setMessageUpdate([2, props.useKey])
    })
  }



  return (
    <div className="message">
      <section className="messageContainer">
        <div className="messageUser">{props.user}</div>
        <span className="iconify userIcon" data-icon="bxs:user-circle"></span>
        <div className="messageText">{props.message}</div>
        <section className="messageIconsContainer">
          <div ref={likeIcon} onClick={likeComment}>
            <span className="iconify messageIcon" data-icon="zondicons:thumbs-up" ></span>
          </div>
          {/* <span className="iconify messageIcon" data-icon="zondicons:thumbs-up" ref={likeIcon} onClick={likeComment}></span> */}
          {/* need to put span tags in a div element */}
          <div className="messageLikes" ref={numLikes}>{props.likes}</div>
          <span className="iconify messageIcon" data-icon="zondicons:thumbs-down"></span>
          {
            !props.editable ? (
              <div style={{cursor: "pointer"}} onClick={changeOpenReply}
              >REPLY</div>
            ) : (
              <div style={{cursor: "pointer"}} onClick={deleteMessage}>DELETE</div>
            )
          }
        </section>
        <showReply.Provider value={changeOpenReply}>
          {openReply && <CommentsBox useKey={props.useKey} autoFocus={true} />}
        </showReply.Provider>
        <section className="arrowReplies" onClick={changeArrow}>
          {props.replies.length > 0 ? (
            <div>{arrow} View {props.replies.length} replies</div>
          ) : (
            null
          )}
        
        </section>
        { arrowUp && (
          <section className="subMessages">
            {
              props.replies.map(reply => (
                <SubMessage 
                  key={Math.random()}
                  parentKey={props.useKey}
                  subId={reply._id}
                  user={reply.user} 
                  message={reply.message} 
                  likes={reply.likes} />
              ))
            }
          </section>
        )}
      </section>
    </div>
  );
};

export default Message;
