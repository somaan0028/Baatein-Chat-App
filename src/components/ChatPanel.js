import React, { useState, useEffect } from "react"
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import SendIcon from '@material-ui/icons/Send';
import AppHeader from './AppHeader';
import ContactsArea from './ContactsArea';
import MessagingArea from './MessagingArea';

export default function ChatPanel({ userProfile }) {
  
    const [activeContact, setActiveContact] = useState(null);
    return(
        <div className="chat-panel">
            
            < AppHeader userProfile={userProfile} />

            <div className="chat-panel-body">
                
                <ContactsArea activeContact={activeContact} setActiveContact={setActiveContact} />

                <MessagingArea activeContact={activeContact} />
                
            </div>

            
        </div>
    )
}