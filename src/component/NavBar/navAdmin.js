import React from "react";

import "./nav.css";

import logoHome from "../../assets/home.png"
import logoReport from "../../assets/report.png"
import logoPlus from "../../assets/plus.png"
import logoChat from "../../assets/chat.png"
import logoProfile from "../../assets/user.png"

import { useNavigate } from "react-router-dom";

function NavBarAdmin(props){

    const navigate = useNavigate();

    const handleHome = () => {
        navigate("/home_admin")
    }

    const handleAddMachine = () => {
        navigate("/addMachines_admin")
    }

    const handleProfile = () => {
        navigate("/profileAdmin")
    }

    return (
        <div className="nav">
            
            <div className="box">
                <button className="buttonHome" onClick={handleHome} >
                    <img className="logoHome" src={logoHome} alt="Home" />
                </button>

                <button className="buttonBooking">
                    <img className="logoBooking" src={logoReport} alt="Report" />
                </button>

                <div className="circleNav">
                    <img className="logoPlus" src={logoPlus} alt="Plus" onClick={handleAddMachine} />
                </div>

                <button className="buttonChat" >
                    <img className="logoChat" src={logoChat} alt="Chat" />
                </button>

                <button className="buttonProfile" onClick={handleProfile} >
                    <img className="logoProfile" src={logoProfile} alt="Profile" />
                </button>
            </div>
        </div>
    );

}

export default NavBarAdmin;