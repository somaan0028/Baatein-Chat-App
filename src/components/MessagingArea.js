import React, { useState, useEffect } from "react"
import IconButton from '@material-ui/core/IconButton';
import SendIcon from '@material-ui/icons/Send';

const MessagingArea = ({ activeContactID }) => {
    // console.log("The active contact ID is: ");
    // console.log(activeContactID);

    return (
        
        <div className="messaging-area">
            {activeContactID ? activeContactID : <h5>No one selected yet</h5>}
            {/* <div className="header-msg-area">
                <div className="user-details-container">
                    <img className="header-profile-pic" alt="Profile Picture" src="https://www.worldfuturecouncil.org/wp-content/uploads/2020/02/dummy-profile-pic-300x300-1.png" />
                    <div className="user-info">
                        <h2>John Doe</h2>
                        <p>Last seen 4:54 pm</p>
                    </div>
                </div>
            </div>
            <div className="chat-msg-area scroll-section">
                <div className="single-msg-container">
                    <div className="single-msg">
                        <p className="msg-text">Hey man how are u?</p>
                        <p className="msg-time">2:37 am</p>
                    </div>
                </div>
                <div className="single-msg-container my-own-msg">
                    <div className="single-msg">
                        <p className="msg-text">Hey man how are u?</p>
                        <p className="msg-time">2:37 am</p>
                    </div>
                </div>
                <div className="single-msg-container">
                    <div className="single-msg">
                        <p className="msg-text">Hey man how are u?</p>
                        <p className="msg-time">2:37 am</p>
                    </div>
                </div>
                <div className="single-msg-container my-own-msg">
                    <div className="single-msg">
                        <p className="msg-text">Hey man how are u?</p>
                        <p className="msg-time">2:37 am</p>
                    </div>
                </div>
                <div className="single-msg-container my-own-msg">
                    <div className="single-msg">
                        <p className="msg-text">Hey man how are u?</p>
                        <p className="msg-time">2:37 am</p>
                    </div>
                </div>
                <div className="single-msg-container">
                    <div className="single-msg">
                        <p className="msg-text">Hey man how are u?</p>
                        <p className="msg-time">2:37 am</p>
                    </div>
                </div>
                <div className="single-msg-container my-own-msg">
                    <div className="single-msg">
                        <p className="msg-text">Hey man how are u?</p>
                        <p className="msg-time">2:37 am</p>
                    </div>
                </div>
                <div className="single-msg-container my-own-msg">
                    <div className="single-msg">
                        <p className="msg-text">Hey man how are u?</p>
                        <p className="msg-time">2:37 am</p>
                    </div>
                </div>
                <div className="single-msg-container">
                    <div className="single-msg">
                        <p className="msg-text">Hey man how are u?</p>
                        <p className="msg-time">2:37 am</p>
                    </div>
                </div>
            </div>
            <div className="typing-area">
                <form>
                    <input className="typing-field" type="text" placeholder="Type your message here..." />
                    <IconButton className="submit-button" aria-label="Toggle Dark Theme" color="inherit">
                        <SendIcon />
                    </IconButton>
                </form>
            </div> */}
        </div>

    )
}

export default MessagingArea;
