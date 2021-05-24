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
                {/* <img src="parallax-image.jpg" /> */}
            </div>
            <div className="app-information-div">
                <div className="single-info">
                    <img className="info-gif" src="messaging.gif" alt="infographic" />
                    <div className="info-text">
                        <h3>Easy and Safe Messaging</h3>
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam et tellus felis. Morbi vulputate elit non diam pulvinar consectetur. Sed at porta est. In vehicula dapibus lectus eget ornare.</p>
                    </div>
                </div>
                <div className="single-info reverse-direction">
                    <div className="info-text">
                        <h3>Use on any Device</h3>
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam et tellus felis. Morbi vulputate elit non diam pulvinar consectetur. Sed at porta est. In vehicula dapibus lectus eget ornare.</p>
                    </div>
                    <img className="info-gif" src="responsive.gif" alt="infographic" />
                </div>
                <div className="single-info">
                    <img className="info-gif" src="dark-mode.gif" alt="infographic" />
                    <div className="info-text">
                        <h3>Includes Dark Mode</h3>
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam et tellus felis. Morbi vulputate elit non diam pulvinar consectetur. Sed at porta est. In vehicula dapibus lectus eget ornare.</p>
                    </div>
                </div>
            </div>
            <div className="auth-footer">
                <h3>Get Started Now!</h3>
                <div className="home-auth-buttons">
                    <Button variant="contained" color="secondary" className="auth-submit-btn">
                        <Link to="/login">Log In</Link>
                    </Button>
                    <Button variant="contained" color="secondary" className="auth-submit-btn">
                        <Link to="/signup">Sign Up</Link>
                    </Button>
                </div>
            </div>
            <footer>
                <p className="copy-right">2021 © Baatein</p>
                <p className="credit">Created by Somaan Shakeel</p>
            </footer>
        </div>
    )
}
