import React, { useState} from "react";
import "./header.css";

import Back from "../../assets/leftArrow.png"
import Logout from "../../assets/logout.png"
import ConfirmDialog from "../Dialog/confirmation";

import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";

const Header = ({ title }) => {

  const [success, setSuccess] = useState(false); // add success state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMessage, setDialogMessage] = useState(""); // Custom dialog message
  const [titleMessage, setTitleMessage] = useState(""); // Custom dialog message
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogout = () => {
    // Show confirmation dialog
    setDialogOpen(true);
    setDialogMessage("Are you sure you want to log out?");
    setTitleMessage("Logout Confirmation");
    setSuccess(false);
  };
  
  const handleConfirmLogout = () => {
    // Perform the necessary logout actions
    // For example, clear the session, redirect to the login page, etc.
    // Here, we are using Firebase's `auth` to log out the user
    auth
      .signOut()
      .then(() => {
        setSuccess(true);
        setDialogMessage("Logged out successfully."); // Set custom dialog message
        setTitleMessage("Logout");
        setDialogOpen(true);
        navigate("/");
      })
      .catch((error) => {
        console.log(error);
        setError("Failed to log out. Please try again.");
      });
  };
  
  const handleCancelLogout = () => {
    // Cancel the logout action
    setDialogOpen(false);
  };

  const handleBack = () => {
    navigate(-1);
  };
  
  return (
    <div className="header">
      <button className="buttonBack" onClick={handleBack} >
        <img 
          className="logoBack" 
          src={Back} 
          alt="Back" 
        />
      </button>

      <div className="pageTitle">{title}</div>

      <button className="buttonLogout" onClick={handleLogout}>
        <img 
          className="logoLogout" 
          src={Logout} 
          alt="Logout" 
        />
      </button>
      <ConfirmDialog
        open={dialogOpen && !success}
        onClose={handleCancelLogout}
        message={dialogMessage}
        titleMessage={titleMessage}
        onSuccess={handleConfirmLogout}
      />
    </div>
    
  );
};

export default Header;
