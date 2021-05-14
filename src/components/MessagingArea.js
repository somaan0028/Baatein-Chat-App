import React, { useState, useEffect } from "react"
import SingleMessage from './SingleMessage';
import { useAuth } from "../contexts/AuthContext"
import { projectFirestore } from '../firebase';
import { CircularProgress } from '@material-ui/core';
import TypingArea from './TypingArea';
import { IconButton } from '@material-ui/core';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';

const MessagingArea = ({ activeContact }) => {
    // console.log("The active contact ID is: ");
    // console.log(activeContact);
    const { currentUser } = useAuth()
    const [messages, setMessages] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [displayMessages, setDisplayMessages] = useState(null);
    const [convoID, setConvoID] = useState(null);
    const [removeListener, setRemoveListener] = useState(null);
    const [isListenerSet, setIsListenerSet] = useState(false);

    const generateConvoID = (id_1, id_2) => {
        if(id_1 > id_2){
            return id_1 + "-" + id_2;
        }else{
            return id_2 + "-" + id_1;
        }
    }

    useEffect(()=>{
        if(!activeContact){return};

        // as function is running again, it means activeContact changed so we need to remove previous listener
        if(isListenerSet){
            console.log("removed the listener");
            removeListener();
        };

        // resetting state for new messages from the new activeContact
        setMessages([]);
        setDisplayMessages(null);
        
        setIsLoading(true);
        let conversationID = generateConvoID(currentUser.uid, activeContact.userID);
        console.log(conversationID);
        setConvoID(conversationID);

        var unsubscribe = projectFirestore.collection("conversations").doc(conversationID).onSnapshot((docRef)=>{
            if(docRef.data()){
                setIsListenerSet(true);
                var received_messages = docRef.data().messages;
                console.log(received_messages);
                var newMessagesArray = [];
                console.log(conversationID);
                received_messages.forEach((message)=>{
                    newMessagesArray.push(
                        <SingleMessage message={message} />
                    );
                })
                setMessages(received_messages);
                setDisplayMessages(newMessagesArray);
            }

            // so that we know that a listener exists
            setIsListenerSet(true);
            setRemoveListener(()=>unsubscribe);

            setIsLoading(false);

            // scrolling to latest msg
            var objDiv = document.querySelector(".chat-msg-area");
            objDiv.scrollTop = objDiv.scrollHeight;
        });


    }, [activeContact])

    const slideInContacts = ()=>{
        console.log("Sliding in contacts")
        document.querySelector(".contacts-area").style.transform = "translate(0)"
    }

    return (
                
        !activeContact ? 
        <div className="messaging-area">
            <p className="no-contact-selected">Pick a Contact<br/>to see Messages</p>
        </div>
        :
        <div className="messaging-area">
            <div className="header-msg-area">
                <div className="user-details-container">
                    <IconButton onClick={slideInContacts} className="back-btn" aria-label="Back to contacts">
                        <ArrowBackIcon className="back-icon" />
                    </IconButton>
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

            <TypingArea activeContact={activeContact} convoID={convoID} messages={messages} />
        </div>
        

    )
}

export default MessagingArea;
