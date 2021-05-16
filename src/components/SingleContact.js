import React, { useState, useEffect } from "react";

export default function SingleContact({ id, contactName, contactDetails, activeContact, setActiveContact, profilePicture, timeToDisplay }) {

    // console.log(activeContact);

    const handleOnClick = (e) => {
        console.log(e.target);
        if(window.innerWidth <= 625){
            document.querySelector(".contacts-area").style.transform = "translate(-1000px)"
        }
        let newActiveContact = {
            username: e.target.parentNode.querySelector(".contact-name").innerText,
            userID: e.target.id,
            profilePicture: e.target.parentNode.querySelector(".contact-profile-pic").src
        }
        console.log();
        setActiveContact(newActiveContact);
    }

    const convertTimestamp = (timestamp) => {
        return timestamp;
    }

    useEffect(()=>{
        console.log("contact details changed");
    }, [contactDetails])

    return(
        <div className={activeContact && id==activeContact.userID ? "single-contact selected-contact" : "single-contact"} >
            <div className="div-contact-to-click" id={id} onClick={handleOnClick}></div>
                <img className="contact-profile-pic" alt="Profile Picture" src={profilePicture} />
                <div className="contact-info">
                    <div className="name-and-msg">
                        <p className="contact-name">{contactName}</p>
                        <p className="recent-msg">{contactDetails.latestMsg}</p>
                    </div>
                    <div className="time-and-notification">
                        {/* <p className="recent-msg-time">{()=>convertTimestamp(contactDetails.latestTimestamp)}</p> */}
                        <p className="recent-msg-time">{timeToDisplay}</p>
                        <p className={contactDetails.unread ? "no-of-msgs" : "no-of-msgs hidden"}>{contactDetails.unread}</p>
                    </div>
                </div>
        </div>
    )
}