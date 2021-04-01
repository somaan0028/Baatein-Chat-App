import React, { useState, useEffect } from "react"
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MailIcon from '@material-ui/icons/Mail';
import Badge from '@material-ui/core/Badge';
import NotificationsIcon from '@material-ui/icons/Notifications';
import TextField from '@material-ui/core/TextField';
import SearchBar from './SearchBar';
import SendIcon from '@material-ui/icons/Send';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import Brightness4OutlinedIcon from '@material-ui/icons/Brightness4Outlined';
import Brightness4RoundedIcon from '@material-ui/icons/Brightness4Rounded';
import ExitToAppRoundedIcon from '@material-ui/icons/ExitToAppRounded';

export default function ChatPanel() {

    return(
        <div className="chat-panel">
            <div className="header-chat-panel">
                <div className="user-details-container">
                    <img className="header-profile-pic" alt="Profile Picture" src="https://www.worldfuturecouncil.org/wp-content/uploads/2020/02/dummy-profile-pic-300x300-1.png" />
                    <div className="user-info">
                        <h2>John Doe</h2>
                        <p>dummyemail@gmail.com</p>
                    </div>
                </div>
                <div className="header-buttons">
                    <IconButton aria-label="Add new friend" color="inherit">
                        <PersonAddIcon />
                    </IconButton>
                    <IconButton aria-label="Toggle Dark Theme" color="inherit">
                        <Brightness4OutlinedIcon />
                    </IconButton>
                    <IconButton aria-label="show 17 new notifications" color="inherit">
                        <Badge badgeContent={17} color="secondary">
                            <NotificationsIcon />
                        </Badge>
                    </IconButton>
                    <Button variant="contained" color="secondary" className="logout-button">
                        <ExitToAppRoundedIcon className="logout-icon" /> Logout
                    </Button>
                </div>
            </div>

            <div className="chat-panel-body">
                <div className="contacts-area">
                    <h3 className="chats-heading">Chats</h3>

                    <SearchBar />
                    <div className="contacts-list scroll-section">
                        <div className="single-contact">
                            <img className="contact-profile-pic" alt="Profile Picture" src="https://www.worldfuturecouncil.org/wp-content/uploads/2020/02/dummy-profile-pic-300x300-1.png" />
                            <div className="contact-info">
                                <div className="name-and-msg">
                                    <p className="contact-name">John Doe</p>
                                    <p className="recent-msg">lorem ipsum delorum kkdf gdf...</p>
                                </div>
                                <div className="time-and-notification">
                                    <p className="recent-msg-time">3:40 pm</p>
                                    <p className="no-of-msgs">24</p>
                                </div>
                            </div>
                        </div>
                        <div className="single-contact">
                            <img className="contact-profile-pic" alt="Profile Picture" src="https://www.worldfuturecouncil.org/wp-content/uploads/2020/02/dummy-profile-pic-300x300-1.png" />
                            <div className="contact-info">
                                <div className="name-and-msg">
                                    <p className="contact-name">John Doe</p>
                                    <p className="recent-msg">lorem ipsum delorum kkdf gdf...</p>
                                </div>
                                <div className="time-and-notification">
                                    <p className="recent-msg-time">3:40 pm</p>
                                    <p className="no-of-msgs">24</p>
                                </div>
                            </div>
                        </div>
                        <div className="single-contact">
                            <img className="contact-profile-pic" alt="Profile Picture" src="https://www.worldfuturecouncil.org/wp-content/uploads/2020/02/dummy-profile-pic-300x300-1.png" />
                            <div className="contact-info">
                                <div className="name-and-msg">
                                    <p className="contact-name">John Doe</p>
                                    <p className="recent-msg">lorem ipsum delorum kkdf gdf...</p>
                                </div>
                                <div className="time-and-notification">
                                    <p className="recent-msg-time">3:40 pm</p>
                                    <p className="no-of-msgs">24</p>
                                </div>
                            </div>
                        </div>
                        <div className="single-contact">
                            <img className="contact-profile-pic" alt="Profile Picture" src="https://www.worldfuturecouncil.org/wp-content/uploads/2020/02/dummy-profile-pic-300x300-1.png" />
                            <div className="contact-info">
                                <div className="name-and-msg">
                                    <p className="contact-name">John Doe</p>
                                    <p className="recent-msg">lorem ipsum delorum kkdf gdf...</p>
                                </div>
                                <div className="time-and-notification">
                                    <p className="recent-msg-time">3:40 pm</p>
                                    <p className="no-of-msgs">24</p>
                                </div>
                            </div>
                        </div>
                        <div className="single-contact selected-contact">
                            <img className="contact-profile-pic" alt="Profile Picture" src="https://www.worldfuturecouncil.org/wp-content/uploads/2020/02/dummy-profile-pic-300x300-1.png" />
                            <div className="contact-info">
                                <div className="name-and-msg">
                                    <p className="contact-name">John Doe</p>
                                    <p className="recent-msg">lorem ipsum delorum kkdf gdf...</p>
                                </div>
                                <div className="time-and-notification">
                                    <p className="recent-msg-time">3:40 pm</p>
                                    <p className="no-of-msgs">24</p>
                                </div>
                            </div>
                        </div>
                        <div className="single-contact">
                            <img className="contact-profile-pic" alt="Profile Picture" src="https://www.worldfuturecouncil.org/wp-content/uploads/2020/02/dummy-profile-pic-300x300-1.png" />
                            <div className="contact-info">
                                <div className="name-and-msg">
                                    <p className="contact-name">John Doe</p>
                                    <p className="recent-msg">lorem ipsum delorum kkdf gdf...</p>
                                </div>
                                <div className="time-and-notification">
                                    <p className="recent-msg-time">3:40 pm</p>
                                    <p className="no-of-msgs">24</p>
                                </div>
                            </div>
                        </div>
                        
                    </div>
                </div>

                <div className="messaging-area">
                    <div className="header-msg-area">
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
                    </div>
                </div>
            </div>

            
        </div>
    )
}