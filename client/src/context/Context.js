import React, { useContext, useState } from "react";

const MainContext = React.createContext();

export const useMainContext = () => {
    return useContext(MainContext);
}

export const ContextProvider = (props) => {
    //this state that allows us to trigger, either an update or delete request of an individual comment
    const [messageUpdate, setMessageUpdate] = useState();

    //this state boolean will be changed when we post a new comment to refresh the first 10 messages
    const [messageReset, setMessageReset] = useState(false);

    //this is the state that holds the current increment value.  this is used by the intersection observer when we fetch new comments
    const [commentIncrement, setCommentIncrement] = useState(10);

    const value = {
        messageReset,
        setMessageReset,
        messageUpdate,
        setMessageUpdate,
        commentIncrement,
        setCommentIncrement
    }

    return (
        <MainContext.Provider value={value}>
            {props.children}
        </MainContext.Provider>
    )
}   