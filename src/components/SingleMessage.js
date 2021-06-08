import React from "react"
import { useAuth } from "../contexts/AuthContext"

const SingleMessage = ({ message, msgTime }) => {
    const { currentUser } = useAuth();
    
    return(
        <div className={message.senderID == currentUser.uid ? "single-msg-container my-own-msg" : "single-msg-container"} >
            <div className="single-msg">
                <p className="msg-text">{message.text}</p>
                {/* <p className="msg-time">{message.timestamp.toDate()}</p> */}
                <p className="msg-time">{msgTime}</p>
            </div>
        </div>
    )
}

export default SingleMessage;
