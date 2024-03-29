import React, { useRef, useState, useContext } from "react";
import SubCommentsBox from "../../commentsBox/subCommentsBox/SubCommentsBox";
//main context
import { useMainContext } from "../../../context/Context";

//context
const showReply = React.createContext();

export const useOpenReply = () => {
  return useContext(showReply)
}


const SubMessage = (props) => {
  const {setMessageUpdate} = useMainContext();

  const likeIcon = useRef();
  const numLikes = useRef();

  const [openReply, setOpenReply] = useState(false);

  //toggle when cancel button and reply button are pressed
  const changeOpenReply = () => {
    setOpenReply(prevState => prevState = !prevState);
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
    fetch("/update-sub-like", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({messageId: props.parentKey, subId: props.subId, likes: likes})
    })
  }

  const deleteMessage = () => {
    fetch("/delete-sub-comment", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({messageId: props.parentKey, subId: props.subId})
    }).then(() => {
      setMessageUpdate([1, props.parentKey]);
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
            props.user !== "Default User" ? (
              <div style={{cursor: "pointer"}} onClick={changeOpenReply}
              >REPLY</div>
            ) : (
              <div style={{cursor: "pointer"}} onClick={deleteMessage}>DELETE</div>
            )
          }
        </section>
        <showReply.Provider value={changeOpenReply}>
          {openReply && <SubCommentsBox parentKey={props.parentKey} autoFocus={true} />}
        </showReply.Provider>
      </section>
    </div>
  );
};

export default SubMessage;
