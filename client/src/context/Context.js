import React, { useContext, useState } from "react";

const MainContext = React.createContext();

export const useMainContext = () => {
    return useContext(MainContext);
}

export const ContextProvider = (props) => {

    //this state boolean will be changed when we post a new comment to refresh the first 10 messages
    const [messageReset, setMessageReset] = useState(false);

    const value = {
        messageReset,
        setMessageReset
    }

    return (
        <MainContext.Provider value={value}>
            {props.children}
        </MainContext.Provider>
    )
}   