import React, { useEffect, useRef, useState } from "react";
// import Loader from "./components/loader/MyLoader";
import Message from "./components/message/Message";
// Main Context
import { useMainContext } from './context/Context'

const MessageScroll = (props) => {

  // when bool from main context changes. re-render message list
  const { messageReset, commentIncrement, setCommentIncrement, messageUpdate } = useMainContext();

  // make sure increment value in callback function for intersection observer is up to date.
  const commentIncrementRef = useRef(commentIncrement)

  const [messages, setMessages] = useState([]);
  const [showBotomBar, setShowBottomBar] = useState(false);
  
  //load the test comments, do this either on application start or when a new comment is posted
  useEffect(() => {
    setShowBottomBar(true);
    fetch("/get-data", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({limitNum: 10})
    }).then(response => response.json()).then(comments => {
      setMessages(comments);
    })

  }, [messageReset]);

  //either update or delete on individual comment
  useEffect(() => {
    if (messageUpdate) {
      //if messageUpdate[0] is 1 then that means we update.  else we delete
      if(messageUpdate[0] === 1) {
        fetch("/update-comment", {
          method: "POST",
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify({commentId: messageUpdate[1]})
        }).then(res => res.json()).then(commentData => {
          updateComment(commentData)
        })
      } else if(messageUpdate[0] === 2) {
        deleteComment();
      }
    }
  }, [messageUpdate])

  const updateComment = (commentData) => {
    let currentMessage = [...messages];
    if(commentData) {
      let currentMessageIndex = currentMessage.findIndex(message => message._id === commentData._id);
      currentMessage.splice(currentMessageIndex, 1, commentData);
      setMessages(currentMessage)
    }
  }

  const deleteComment = () => {
    let currentMessage = [...messages];
    let currentMessageIndex = currentMessage.findIndex(message => message._id === messageUpdate[1]);
    currentMessage.splice(currentMessageIndex, 1);
    setMessages(currentMessage);
  }

  //intersection observer
  const observer = React.useRef(new IntersectionObserver(entries => {
    const first = entries[0];
    if(first.isIntersecting) {
      fetch("/get-more-data", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({commentIncrement: commentIncrementRef.current})
      }).then(response => response.json()).then(comments => {
        if(comments.length > 0) {
          setTimeout(() => {
            setMessages(prevState => [...prevState, ...comments])
          }, 1000)
        } else {
          setTimeout(() => {
            setShowBottomBar(false)
          }, 1000)
        }
        //we use comments.length incase there are not 10 comments left
        setCommentIncrement(prevState => prevState += comments.length)
      })
    }
  }), {threshold: 1})

  //ensure comment increment is up to date
  useEffect(() => {
    commentIncrementRef.current = commentIncrement;
  }, [commentIncrement]);

  //bottomBar will contain the bottomBar JSX element
  const [bottomBar, setBottomBar] = useState(null);

  useEffect(() => {
    const currentBottomBar = bottomBar;
    const currentObserver = observer.current;
    if(currentBottomBar) {
      currentObserver.observe(currentBottomBar);
    }

    return () => {
      if(currentBottomBar) {
        currentObserver.unobserve(currentBottomBar);
      }
    }
  }, [bottomBar])

  return (
    // can add reverse() in the map here to have newest messages first
    <div className="">
      {messages.map(message => (
        <Message
          key={message._id} 
          useKey={message._id} 
          user={message.user} 
          editable={message.editable} 
          message={message.message}
          likes={message.likes}
          replies={message.replies}
        />
      ))}
      {messages.length > 9 && showBotomBar ? (
        <div className="bottomBar" ref={setBottomBar}>
          <div className="loader" ></div>
          {/* <Loader /> */}
        </div>
      ) : (
        null
      )}
    </div>
  );
};

export default MessageScroll;
