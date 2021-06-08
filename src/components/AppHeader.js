import React, { useState, useEffect } from "react"
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Badge from '@material-ui/core/Badge';
import NotificationsIcon from '@material-ui/icons/Notifications';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import ExitToAppRoundedIcon from '@material-ui/icons/ExitToAppRounded';
import { useAuth } from "../contexts/AuthContext"
import { useHistory } from "react-router-dom"
import { projectFirestore } from '../firebase';
import Brightness4Icon from '@material-ui/icons/Brightness4';
import Brightness7Icon from '@material-ui/icons/Brightness7';
import AddNewContactModal from './AddNewContactModal';
import NotificationsModal from './NotificationsModal';
import FullscreenIcon from '@material-ui/icons/Fullscreen';
import FullscreenExitIcon from '@material-ui/icons/FullscreenExit';

const AppHeader = ({ userProfile }) => {

    const { currentUser, logout } = useAuth()
    const [error, setError] = useState("")
    const history = useHistory()
    const [darkTheme, setDarkTheme] = useState(userProfile.darkTheme);
    const [newContactModalOpen, setNewContactModalOpen] = useState(false);
    const [notificationModalOpen, setNotificationModalOpen] = useState(false);
    const [screenWidth, setScreenWidth] = useState(window.innerWidth)
    const [isFullscreen, setIsFullscreen] = useState(false);

    async function handleLogout() {
        setError("")
        let root = document.querySelector(':root');
        if(darkTheme){
            // dark theme OFF
            root.style.setProperty('--primary', '#f50057');
            root.style.setProperty('--secondary', 'white');
            root.style.setProperty('--third', 'white');
            root.style.setProperty('--textColor', '#222222');
            root.style.setProperty('--boxShadow', '#d0d0d0');
            root.style.setProperty('--darkToLight', '#1f1f1f');
        }
        try {
          await logout()
          history.push("/login")
        } catch {
          setError("Failed to log out")
        }
    }

    const openNotificationsModal = () => {
        setNotificationModalOpen(!notificationModalOpen);

        // set unread notifications to 0
        projectFirestore.collection("profiles").doc(currentUser.uid).update({
            unreadNotf: 0
        })
    }

    useEffect(()=>{

        let root = document.querySelector(':root');
        if(darkTheme){
            // dark theme ON
            // root.style.setProperty('--primary', '#1f1f1f');
            root.style.setProperty('--secondary', '#1f1f1f');
            root.style.setProperty('--third', '#131313');
            root.style.setProperty('--textColor', 'white');
            root.style.setProperty('--boxShadow', 'black');
            root.style.setProperty('--darkToLight', 'white');
        }else{
            // dark theme OFF
            root.style.setProperty('--primary', '#f50057');
            root.style.setProperty('--secondary', 'white');
            root.style.setProperty('--third', 'white');
            root.style.setProperty('--textColor', '#222222');
            root.style.setProperty('--boxShadow', '#d0d0d0');
            root.style.setProperty('--darkToLight', '#1f1f1f');
        }
    }, [darkTheme])

    useEffect(()=>{



        window.addEventListener("resize", ()=>{
            setScreenWidth(window.innerWidth)
        })
        let bodyElement = document.getElementsByTagName("body")[0];
        bodyElement.addEventListener("keypress", (event) =>{
            if (event.key == "Escape") {
                handleFullscreen()

            }
        });

        // so that fullscreen event listener can be used in all browsers
        const prefixes = ["", "moz", "webkit", "ms"]
        let chat_panel = document.querySelector(".chat-panel");
        
        prefixes.forEach(function(prefix) {
            bodyElement.addEventListener(prefix + "fullscreenchange", function() {
            let isItFullscreen = document.fullscreenElement || /* Standard syntax */
            document.webkitFullscreenElement || /* Chrome, Safari and Opera syntax */
            document.mozFullScreenElement ||/* Firefox syntax */
            document.msFullscreenElement /* IE/Edge syntax */;
            if (isItFullscreen) {
                chat_panel.classList.add("make-fullscreen");
                setIsFullscreen(true)
            } else if (!document.fullscreenchange) {
                chat_panel.classList.remove("make-fullscreen");
                setIsFullscreen(false)
            }
        });
        });
    }, [])

    const handleDarkTheme = () => {
        if(darkTheme){
            setDarkTheme(false)
            projectFirestore.collection("profiles").doc(currentUser.uid).update({
                darkTheme: false
            })
        }else{
            setDarkTheme(true)
            projectFirestore.collection("profiles").doc(currentUser.uid).update({
                darkTheme: true
            })
        }
    }

    const handleFullscreen = ()=>{

        let fullscreenElem = document.getElementsByTagName("body")[0];
        if(!isFullscreen){

            if (fullscreenElem.requestFullscreen) {
                fullscreenElem.requestFullscreen();
              } else if (fullscreenElem.webkitRequestFullscreen) { /* Safari */
                fullscreenElem.webkitRequestFullscreen();
              } else if (fullscreenElem.msRequestFullscreen) { /* IE11 */
                fullscreenElem.msRequestFullscreen();
              }
            setIsFullscreen(true)
        }else{
            if(document.fullscreenElement){

                if (document.exitFullscreen) {
                    document.exitFullscreen();
                } else if (document.webkitExitFullscreen) { /* Safari */
                    document.webkitExitFullscreen();
                } else if (document.msExitFullscreen) { /* IE11 */
                    document.msExitFullscreen();
                }
            }
            setIsFullscreen(false)
        }
    }


    return (
        <div className="header-chat-panel">
            {newContactModalOpen && <AddNewContactModal open={newContactModalOpen} setOpen={setNewContactModalOpen} userProfile={userProfile} />}
            {notificationModalOpen && <NotificationsModal fullscreen={true} open={notificationModalOpen} setOpen={setNotificationModalOpen} />}
            <div className="user-details-container">
                <img className="header-profile-pic" alt="Profile Picture" src={userProfile.profilePicture} />
                <div className="user-info">
                    <h2>{userProfile.username}</h2>
                    <p className="hide-on-mobile">{currentUser.email}</p>
                </div>
                {screenWidth <= 625  &&
                <Button variant="contained" color="secondary" className="logout-button" onClick={handleLogout}>
                    <ExitToAppRoundedIcon className="logout-icon" /> Logout
                </Button>}
            </div>
            <div className="header-buttons">
                <IconButton onClick={()=>setNewContactModalOpen(!newContactModalOpen)} aria-label="Add new friend" color="inherit">
                    <PersonAddIcon />
                </IconButton>
                <IconButton onClick={handleDarkTheme} aria-label="Toggle Dark Theme" color="inherit">
                    {darkTheme ? <Brightness7Icon /> : <Brightness4Icon /> }
                </IconButton>
                <IconButton onClick={openNotificationsModal} aria-label="show new notifications" color="inherit">
                    <Badge badgeContent={userProfile.unreadNotf} color="secondary">
                        <NotificationsIcon />
                    </Badge>
                </IconButton>
                <IconButton onClick={handleFullscreen} aria-label="Toggle Full Screen" color="inherit">
                    {isFullscreen ? <FullscreenExitIcon /> : <FullscreenIcon /> }
                </IconButton>
                { screenWidth > 625 &&
                <Button variant="contained" color="secondary" className="logout-button" onClick={handleLogout}>
                    <ExitToAppRoundedIcon className="logout-icon" /> Logout
                </Button> }
            </div>
        </div>
    )
}

export default AppHeader;
