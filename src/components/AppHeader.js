import React, { useState, useEffect } from "react"
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Badge from '@material-ui/core/Badge';
import NotificationsIcon from '@material-ui/icons/Notifications';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import Brightness4OutlinedIcon from '@material-ui/icons/Brightness4Outlined';
import Brightness4RoundedIcon from '@material-ui/icons/Brightness4Rounded';
import ExitToAppRoundedIcon from '@material-ui/icons/ExitToAppRounded';
import { useAuth } from "../contexts/AuthContext"
import { useHistory } from "react-router-dom"

const AppHeader = () => {

    const { currentUser, logout } = useAuth()
    const [error, setError] = useState("")
    const history = useHistory()

    async function handleLogout() {
        setError("")
    
        try {
          await logout()
          history.push("/login")
        } catch {
          setError("Failed to log out")
        }
    }

    return (
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
                <Button variant="contained" color="secondary" className="logout-button" onClick={handleLogout}>
                    <ExitToAppRoundedIcon className="logout-icon" /> Logout
                </Button>
            </div>
        </div>
    )
}

export default AppHeader;
