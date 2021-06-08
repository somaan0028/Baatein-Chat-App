import React, { useState } from "react"
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

                <MessagingArea activeContact={activeContact} setActiveContact={setActiveContact}  />
                
            </div>

            
        </div>
    )
}