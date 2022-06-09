import React from "react";
import Loader from "./components/loader/MyLoader";
import Message from "./components/message/Message";

const MessageScroll = () => {
  return (
    <div className="">
      <Message user="initial dummy user" editable={false} message='Dummy message' likes={25} />
      <div className="bottomBar">
        <div className="loader"></div>
      </div>
        <Loader />
    </div>
  );
};

export default MessageScroll;
