import React, { useState, useEffect } from "react";

export default function SingleContact({ id, contactName, contactDetails, activeContactID, setActiveContactID }) {

    // console.log(activeContactID);

    const handleOnClick = (e) => {
        setActiveContactID(e.target.id);
    }

    const convertTimestamp = (timestamp) => {
        return timestamp;
    }

    return(
        <div className={id==activeContactID ? "single-contact selected-contact" : "single-contact"} >
            <div className="div-contact-to-click" id={id} onClick={handleOnClick}></div>
                <img className="contact-profile-pic" alt="Profile Picture" src="https://www.worldfuturecouncil.org/wp-content/uploads/2020/02/dummy-profile-pic-300x300-1.png" />
                <div className="contact-info">
                    <div className="name-and-msg">
                        <p className="contact-name">{contactName}</p>
                        <p className="recent-msg">lorem delorum kkdf gdf...</p>
                    </div>
                    <div className="time-and-notification">
                        {/* <p className="recent-msg-time">{()=>convertTimestamp(contactDetails.latestTimestamp)}</p> */}
                        {/* <p className="recent-msg-time">{contactDetails.latestTimestamp}</p> */}
                        <p className="recent-msg-time">3:56 pm</p>
                        <p className="no-of-msgs">{contactDetails.unread}</p>
                    </div>
                </div>
        </div>
    )
}