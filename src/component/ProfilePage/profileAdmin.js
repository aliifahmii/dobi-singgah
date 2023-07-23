import React, { useState, useEffect } from "react";
import "./profile.css";

import enLocale from "./locale.en.json"
import Header from "../Header/header";


//Function
import { useNavigate } from "react-router-dom";
import bcrypt from "bcryptjs"
import SuccessDialog from "../Dialog/success";

//Database
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { collection, addDoc } from "firebase/firestore";
import { EmailAuthProvider, reauthenticateWithCredential } from "firebase/auth";
import { auth, db } from "../firebase";

import { signInWithEmailAndPassword } from "firebase/auth";

import NavBarAdmin from "../NavBar/navAdmin";

function ProfileAdmin(props) {
  const [emailValue, setEmailValue] = useState('');
  const [nameValue, setNameValue] = useState('');
  const [phoneNumberValue, setPhoneNumberValue] = useState('');
  const [currentPasswordValue, setCurrentPasswordValue] = useState('');
  const [newPasswordValue, setNewPasswordValue] = useState('');
  const [confirmPasswordValue, setConfirmPasswordValue] = useState('');

  const [success, setSuccess] = useState(false); // add success state
  const [error, setError] = useState("");

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMessage, setDialogMessage] = useState(""); // Custom dialog message
  const [titleMessage, setTitleMessage] = useState(""); // Custom dialog message
  
  const saltRounds = 10; // number of rounds for generating salt
    
  const{ 
    title = enLocale.title,
    updateProfileInfo = enLocale.updateProfileInfo,
    email = enLocale.email,
    name = enLocale.name,
    phoneNumber = enLocale.phoneNumber,
    updateInformationButton = enLocale.updateInformationButton,

    updatePasswordInfo = enLocale.updatePasswordInfo,
    currentHint = enLocale.currentHint,
    newHint = enLocale.newHint,
    confirmHint = enLocale.confirmHint,
    updatePasswordButton = enLocale.updatePasswordButton,
  } = props;

  const fetchUserData = async () => {
    try {
      // Get the currently logged-in user
      const user = auth.currentUser;
      console.log('Current User:', user); // Debugging line
      if (user) {
        // Fetch user data from Firestore
        const userDocRef = doc(db, "users", user.uid);
        const userDocSnap = await getDoc(userDocRef);
        console.log('User Document Snapshot:', userDocSnap); // Debugging line
        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          console.log('User Data:', userData); // Debugging line
          setEmailValue(userData.email);
          setNameValue(userData.name);
          setPhoneNumberValue(userData.phoneNumber);
        }
      }
    } catch (error) {
      console.log('Fetch User Data Error:', error); // Debugging line
      setError("Failed to fetch user data.");
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        fetchUserData();
      }
    });

    return () => unsubscribe();
  }, []);

  const updateUserInfo = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        const userDocRef = doc(db, "users", user.uid);
        await updateDoc(userDocRef, {
          name: nameValue,
          phoneNumber: phoneNumberValue,
        });
        setSuccess(true);
        setDialogMessage("Update Successfully"); // Set custom dialog message
        setTitleMessage("Profile Information");
        setDialogOpen(true);
      }
    } catch (error) {
      console.log(error);
      setError("Failed to update user information.");
    }
  };

  const updatePassword = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        if (newPasswordValue !== confirmPasswordValue) {
          setError("New password and confirm password do not match.");
          return;
        }
  
        const credentials = await signInWithEmailAndPassword(
          auth,
          user.email,
          currentPasswordValue
        );
  
        if (credentials.user) {
          // Reauthenticate the user with the current password
          const credential = EmailAuthProvider.credential(
            user.email,
            currentPasswordValue
          );
          await reauthenticateWithCredential(user, credential);
  
          // Hash the new password using bcryptjs
          const hashedPassword = await bcrypt.hash(newPasswordValue, 10);
  
          // Update the password field in Firestore with the hashed password
          const userDocRef = doc(db, "users", user.uid);
          await updateDoc(userDocRef, { password: hashedPassword });
  
          // Update the password in Firebase Authentication
          await updatePassword(user, newPasswordValue);
  
          setSuccess(true);
          setDialogMessage("Password updated successfully."); // Set custom dialog message
          setTitleMessage("Password Update");
          setDialogOpen(true);
          setCurrentPasswordValue("");
          setNewPasswordValue("");
          setConfirmPasswordValue("");
        }
      }
    } catch (error) {
      console.log(error);
      setError(
        "Failed to update password. Please make sure your current password is correct."
      );
    }
  };

  const closeDialog = () => {
    setDialogOpen(false);
  };

  return(
    <div className="container-center-horizontal">
      <div className="register screen">
        <div className="profile-1">
          
          <Header title={title} />
          <h1 className="titleUpdateInfo">
            {updateProfileInfo}
          </h1>

          <div className="smallBoxP">
            <div class="emailP">
              <label>{email}</label>
              <input 
                type="text"
                value= {emailValue}
                readOnly
              />
            </div>

            <div class="nameP">
              <label>{name}</label>
              <input 
                type="text"
                value= {nameValue}
                onChange={(event) => setNameValue(event.target.value)}
              />
            </div>

            <div class="phoneNumber">
              <label>{phoneNumber}</label>
              <input 
                type="text"
                value= {phoneNumberValue}
                placeholder="Enter your phone number"
                onChange={(event) => setPhoneNumberValue(event.target.value)}
              />
            </div>

            <button  className="buttonP">
              <div onClick={updateUserInfo} className="buttonInfo">
                {updateInformationButton}
              </div>
            </button>
          </div>
                    
        <h1 className="titlePasswordInfo">
          {updatePasswordInfo}
        </h1>
        
        <div className="smallBoxP">
          <div class="currentPasswordP">
            <label>{currentHint}</label>
            <input 
              type="password"
              placeholder="Enter your current password"
              value= {currentPasswordValue}
              onChange={(event) => setCurrentPasswordValue(event.target.value)}  
            />
          </div>

          <div class="newPasswordP">
            <label>{newHint}</label>
            <input 
              type="password"
              placeholder="Enter your new password"
              value= {newPasswordValue}
              onChange={(event) => setNewPasswordValue(event.target.value)}    
            />
          </div>

          <div class="confirmPasswordP">
            <label>{confirmHint}</label>
            <input 
              type="password"
              placeholder="Enter confirm password"
              value= {confirmPasswordValue}
              onChange={(event) => setConfirmPasswordValue(event.target.value)}   
            />
          </div>

          <button  className="buttonP">
            <div onClick={updatePassword} className="buttonInfo">
              {updatePasswordButton}
            </div>
          </button>
        </div>
        <NavBarAdmin />
      </div>
    </div>
    {/* Render the SuccessDialog component */}
    <SuccessDialog
      open={dialogOpen && success}
      onClose={closeDialog}
      message={dialogMessage}
      titleMessage={titleMessage}
    />
  </div>
  );
}

export default ProfileAdmin;