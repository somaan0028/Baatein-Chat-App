import React, { useState, useEffect } from "react"
import { useAuth } from "../contexts/AuthContext"
import IconButton from '@material-ui/core/IconButton';
import SendIcon from '@material-ui/icons/Send';
import { projectFirestore, timestamp } from "../firebase";

const TypingArea = ({ activeContact, convoID, messages }) => {
    const { currentUser } = useAuth();
    const [typedText, setTypedText] = useState('');

    const handleSubmit = (e)=>{
        e.preventDefault();
        if(!typedText){return};
        console.log(typedText);
        let newMsg = {
            text: typedText,
            senderID: currentUser.uid,
            timestamp: 17171668
        }
        projectFirestore.collection("conversations").doc(convoID).set({
            messages: [...messages, newMsg]
        })

        setTypedText('');
    }

    useEffect(()=>{
        setTypedText('');
    }, [activeContact])

    return(
        <div className="typing-area">
            <form onSubmit={handleSubmit}>
                <input onChange={(e)=>setTypedText(e.target.value)} className="typing-field" type="text" value={typedText} placeholder="Type your message here..." />
                <IconButton disabled={!typedText} type="submit" className="submit-button" aria-label="Toggle Dark Theme" color="inherit">
                    <SendIcon />
                </IconButton>
            </form>
        </div>
    )
}

export default TypingArea;