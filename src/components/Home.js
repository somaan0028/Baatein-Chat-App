import React from 'react'
import Button from '@material-ui/core/Button';
import { Link } from "react-router-dom"

export default function Home() {
    return (
        <div className="home-page-div">
            <header>
                <img className="logo" src="logo-gif.gif" alt="logo" />
            </header>
            <div className="main-home-body">
                <div className="home-text">
                    <h1 className="home-heading">Baatein</h1>
                    <p>The Next Big Chat Application to take over the World!</p>
                    <div className="home-auth-buttons">
                        <Button variant="contained" color="secondary" className="auth-submit-btn">
                            <Link to="/login">Log In</Link>
                        </Button>
                        <Button variant="contained" color="secondary" className="auth-submit-btn">
                            <Link to="/signup">Sign Up</Link>
                        </Button>
                    </div>
                </div>
                <img className="home-page-image" src="auth-page-image.gif"/>
            </div>
            <div className="parallax-div">
                
            </div>
        </div>
    )
}
