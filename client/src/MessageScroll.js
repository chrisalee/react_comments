import React, { useEffect, useState } from "react";
import Loader from "./components/loader/MyLoader";
import Message from "./components/message/Message";
// Main Context
import { useMainContext } from './context/Context'

const MessageScroll = (props) => {

  // when bool from main context changes. re-render message list
  const { messageReset } = useMainContext();

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

  }, [messageReset])

  return (
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
        <div className="bottomBar">
          {/* <div className="loader"></div> */}
          <Loader />
        </div>
      ) : (
        null
      )}
    </div>
  );
};

export default MessageScroll;
