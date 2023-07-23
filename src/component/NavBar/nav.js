import React, { useState, useEffect, useRef } from "react";

import "./nav.css";

import logoHome from "../../assets/home.png"
import logoBooking from "../../assets/booking.png"
import logoScanner from "../../assets/scanner.png"
import logoWallet from "../../assets/walletN.png"
import logoProfile from "../../assets/user.png"

import { useNavigate } from "react-router-dom";

function NavBar(props){

    const navigate = useNavigate();
    const [scanResultWebCam, setScanResultWebCam] =  useState('');
    const qrRef = useRef(null);

    const handleHome = () => {
        navigate("/home")
    }

    const handleScan = async () => {
        navigate("/scanner")
    }

    const handleWallet = () => {
        navigate("/wallet")
    }

    const handleProfile = () => {
        navigate("/profile")
    }

    return (
        <div className="nav">

            
            <div className="box">
                <button className="buttonHome" onClick={handleHome} >
                    <img className="logoHome" src={logoHome} alt="Home" />
                </button>

                <button className="buttonBooking">
                    <img className="logoBooking" src={logoBooking} alt="Booking" />
                </button>

                
                <button className="circleNav" onClick={handleScan}>
                    
                        <img className="logoScanner" src={logoScanner} alt="Scanner" />
                    
                </button>
                

                <button className="buttonWallet" onClick={handleWallet} >
                    <img className="logoWallet" src={logoWallet} alt="Wallet" />
                </button>

                <button className="buttonProfile" onClick={handleProfile} >
                    <img className="logoProfile" src={logoProfile} alt="Profile" />
                </button>
            </div>
            
        </div>
    );

}

export default NavBar;