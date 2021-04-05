import React, { useState, useEffect } from "react"
import IconButton from '@material-ui/core/IconButton';
import SendIcon from '@material-ui/icons/Send';
import SingleMessage from './SingleMessage';
import { useAuth } from "../contexts/AuthContext"
import { projectFirestore } from '../firebase';
import { CircularProgress } from '@material-ui/core';

const MessagingArea = ({ activeContact }) => {
    // console.log("The active contact ID is: ");
    // console.log(activeContact);
    const { currentUser } = useAuth()
    const [messages, setMessages] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [displayMessages, setDisplayMessages] = useState(null);

    const generateConvoID = (id_1, id_2) => {
        if(id_1 > id_2){
            return id_1 + "-" + id_2;
        }else{
            return id_2 + "-" + id_1;
        }
    }

    useEffect(()=>{
        if(!activeContact){return};
        setDisplayMessages(null);
        setIsLoading(true);
        let convoID = generateConvoID(currentUser.uid, activeContact.userID);
        console.log(convoID);
        projectFirestore.collection("conversations").doc(convoID).get()
        .then((docRef)=>{
            if(docRef.data()){
                var received_messages = docRef.data().messages;
                console.log(received_messages);
                var newMessagesArray = [];
                received_messages.forEach((message)=>{
                    newMessagesArray.push(
                        <SingleMessage message={message} />
                    );
                })
                setMessages(received_messages);
                setDisplayMessages(newMessagesArray);
            }
            setIsLoading(false);
        })
        .catch((err)=>{
            console.log(err);
            setIsLoading(false);
        })
    }, [activeContact])


    // const messages = [{
    //     text: "Yo man whass up!!",
    //     senderID: "jjfkdsl",
    //     timestamp: 43897424,
    // }, {
    //     text: "Yo man whass up!!",
    //     senderID: "jjfkdsl",
    //     timestamp: 43897424,
    // }];


    return (
                
        !activeContact ? 
        <div className="messaging-area">
            <p className="no-contact-selected">Pick a Contact<br/>to see Messages</p>
        </div>
        :
        <div className="messaging-area">
            <div className="header-msg-area">
                <div className="user-details-container">
                    <img className="header-profile-pic" alt="Profile Picture" src="https://www.worldfuturecouncil.org/wp-content/uploads/2020/02/dummy-profile-pic-300x300-1.png" />
                    <div className="user-info">
                        <h2>{activeContact.username}</h2>
                        <p>Last seen 4:54 pm</p>
                    </div>
                </div>
            </div>
            <div className="chat-msg-area scroll-section">
                {isLoading ? <CircularProgress className="messages-loading-sign" size={30}/> : displayMessages}
                {!isLoading && !displayMessages && <p className="start-the-conversation">No messages.<br/>Start the Conversation!</p>}
            </div>
            <div className="typing-area">
                <form>
                    <input className="typing-field" type="text" placeholder="Type your message here..." />
                    <IconButton className="submit-button" aria-label="Toggle Dark Theme" color="inherit">
                        <SendIcon />
                    </IconButton>
                </form>
            </div>
        </div>
        

    )
}

export default MessagingArea;
