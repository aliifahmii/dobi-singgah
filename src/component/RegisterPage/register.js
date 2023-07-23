import React, { useState } from "react";
import "./register.css";
import logoDobi1 from "../../assets/logoDobi.png"

import enLocale from "./locale.en.json"
import RegistrationSuccessDialog from "./successDialog";

//Function
import { useNavigate } from "react-router-dom";
import bcrypt from "bcryptjs"

//Database
import { collection, addDoc, setDoc, doc } from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase";

function Register(props) {
    const [nameValue, setNameValue] = useState("");
    const [emailValue, setEmailValue] = useState('');
    const [passwordValue, setPasswordValue] = useState('');
    const [confirmPasswordValue, setConfirmPasswordValue] = useState('');
    const [success, setSuccess] = useState(false); // add success state
    const [error, setError] = useState("");
    const [emailError, setEmailError] = useState("");
    const [confirmPasswordError, setConfirmPasswordError] = useState("");
    const [showSuccessDialog, setShowSuccessDialog] = useState(false);

    const navigate = useNavigate();
    const saltRounds = 10; // number of rounds for generating salt
    
    const{ 
        logoDobi = logoDobi1,
        title = enLocale.title,
        regisContinue = enLocale.regisContinue,
        name = enLocale.name,
        email = enLocale.email,
        password = enLocale.password,
        confirmPassword = enLocale.confirmPassword,
        login = enLocale.login,
        spanText1 = enLocale.spanText1,
        spanText2 = enLocale.spanText2,
    } = props;

    const handleLoginClick = () => {
        navigate("/");
    };

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          setEmailError("Please enter a valid email address.");
          return false;
        } else {
          setEmailError("");
          return true;
        }
    };

    const validateConfirmPassword = () => {
        if (passwordValue !== confirmPasswordValue) {
          setConfirmPasswordError("Passwords does not match.");
          return false;
        } else {
          setConfirmPasswordError("");
          return true;
        }
    };

    const signUpUser = async () => {
        if (!nameValue || !emailValue || !passwordValue || !confirmPasswordValue) {
            // If any of the required fields are not filled, display an error message or take appropriate action
            setError("Please fill in all the required fields.");
            return;
        }
        
        if (!validateEmail(emailValue)) {
            // If the email is not in a valid format, display an error message or take appropriate action
            setError("Please enter a valid email address.");
            return;
        }
        
        if (!validateConfirmPassword()) {
            // If the confirm password does not match the password, display an error message or take appropriate action
            setError("Passwords do not match.");
            return;
        }

        try {
            // Create the new user in Firebase Authentication
            const userCredential = await createUserWithEmailAndPassword(
                auth,
                emailValue,
                passwordValue
            );
    
            const uid = userCredential.user.uid; // get user uid
        
            // Hash the password using bcryptjs
            const hashedPassword = await bcrypt.hash(passwordValue, saltRounds);
    
            //Create the new wallet document in Firestore
            const walletCollection = collection(db, "wallet");
            const walletDocRef = await addDoc(walletCollection, {
                tokens: "1",
                points: "0"
            });
    
            // Get the ID of the newly created wallet document
            const walletDocId = walletDocRef.id;
        
            // Create the new user document in Firestore
            const userDocRef = doc(db, "users", uid); // using uid as document ID
            await setDoc(userDocRef, {
                name: nameValue,
                email: emailValue,
                password: hashedPassword, // store the hashed password in the database
                phoneNumber: "",
                roles: "Customer",
                walletID: walletDocId, // Use the wallet document ID here
            });
        
            setSuccess(true);
            setShowSuccessDialog(true);
        
            // Clear form fields
            setNameValue("");
            setEmailValue("");
            setPasswordValue("");
            setConfirmPasswordValue("");

        
        } catch (error) {
            console.log(error);
            setError(error.message);
        }
    };

    const handleClose = () => {
        setShowSuccessDialog(false);
        navigate("/"); // Navigate to the login page after closing the success dialog
    };



    return(
        <div className="container-center-horizontal">
            <div className="register screen">
                
                <img className="logo-dobi" src={logoDobi1} alt="Logo Dobi Singgah"/>
                

                <div className="register-1">

                    <h1 className="title">
                        {title}
                    </h1>

                    <div className="overlap-group3R">
                        <div className="register-continue">
                            {regisContinue}
                        </div>
                        
                        <div className="nameR">
                            <input
                                className="overlap-groupR"
                                type="text"
                                placeholder={name}
                                value={nameValue}
                                onChange={(event) => setNameValue(event.target.value)}
                                required
                            />
                        </div>
                        
                        <div className="emailR">
                            <input
                                className="overlap-groupR"
                                type="text"
                                placeholder={email}
                                value={emailValue}
                                onChange={(event) => setEmailValue(event.target.value)}
                                required
                            />
                            
                        </div>
                        {emailError && <p className="error-message">{emailError}</p>}
                        <div className="passwordR">
                            <input
                                className="overlap-groupR"
                                type="password"
                                placeholder={password}
                                value={passwordValue}
                                onChange={(event) => setPasswordValue(event.target.value)}
                                required
                            />
                        </div>

                        <div className="confirmPasswordR">
                            <input
                                className="overlap-groupR"
                                type="password"
                                placeholder={confirmPassword}
                                value={confirmPasswordValue}
                                onChange={(event) => setConfirmPasswordValue(event.target.value)}
                                required
                            />
                            
                        </div>
                        {confirmPasswordError && <p className="error-message">{confirmPasswordError}</p>}

                        <button onClick={signUpUser} className="overlap-group2">
                            <div className="login-2">
                                {login}
                            </div>
                        </button>
                    </div>
                </div>
                <p className="dont-have-account">
                    <span className="span0">{spanText1} </span>
                    <span onClick={handleLoginClick} className="span1">{spanText2}</span>
                </p>
                
                {/* Render the RegistrationSuccessDialog component when showSuccessDialog state is true */}
                <RegistrationSuccessDialog
                    open={showSuccessDialog}
                    onClose={handleClose}
                />
            </div>
        </div>
    );
}

export default Register;