import React, { useState, useEffect } from "react";
import "./login.css";
import logoDobi1 from "../../assets/logoDobi.png"

import enLocale from "./locale.en.json"

import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";

//Databse
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";

function Login(props) {
    const [emailValue, setEmailValue] = useState('');
    const [passwordValue, setPasswordValue] = useState('');
    const [error, setError] = useState("");

    const [user, setUser] = useState(null);


    const navigate = useNavigate();

    const{ 
        title = enLocale.title,
        loginContinue = enLocale.loginContinue,
        email = enLocale.email,
        password = enLocale.password,
        forgotPassword = enLocale.forgotPassword,
        login = enLocale.login,
        spanText1 = enLocale.spanText1,
        spanText2 = enLocale.spanText2,
    } = props;

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
          if (user) {
            // User is signed in
            setUser(user);
          } else {
            // User is signed out
            setUser(null);
          }
        });
    
        // Unsubscribe from the listener when the component is unmounted
        return () => unsubscribe();
    }, []);

    const handleRegisterClick = () => {
        navigate("/register");
    };

    const handleLogin = async () => {
        try {
          // Sign in the user with email and password
          await signInWithEmailAndPassword(auth, emailValue, passwordValue);
      
          // Clear form fields
          setEmailValue("");
          setPasswordValue("");
          setError("");
      
          // User is signed in, set the user state
          const user = auth.currentUser;
          setUser(user);
      
          // Fetch user data from Firestore
          const userDocRef = doc(db, "users", user.uid);
          const userDocSnap = await getDoc(userDocRef);
      
          if (userDocSnap.exists()) {
            const userData = userDocSnap.data();
            const { roles } = userData;
      
            if (roles === "Admin") {
              // Navigate to the admin home page
              navigate("/home_admin");
            } else {
              // Navigate to the regular user home page
              navigate("/home");
            }
          } else {
            // Navigate to the regular user home page
            navigate("/home");
          }
        } catch (error) {
          setError(error.message);
        }
      };

      const handleForgot = () => {
        navigate("/forgotPwd")
    };
      
    
    return(
        <div className="container-center-horizontal">
            <div className="login screen">
                
                <img className="logo-dobi" src={logoDobi1} alt="Logo Dobi Singgah"/>
                

                <div className="login-1">

                    <h1 className="title">
                        {title}
                    </h1>

                    <div className="overlap-group3">
                        <div className="login-continue">
                            {loginContinue}
                        </div>
                        
                        <div className="emailL">
                            <input
                                className="overlap-groupL"
                                type="text"
                                placeholder={email}
                                value={emailValue}
                                onChange={(event) => setEmailValue(event.target.value)}
                            />
                        </div>
                        
                        <div className="passwordL">
                            <input
                                className="overlap-groupL"
                                type="password"
                                placeholder={password}
                                value={passwordValue}
                                onChange={(event) => setPasswordValue(event.target.value)}
                            />
                        </div>

                        <div className="forgot-password" onClick={handleForgot}>
                            {forgotPassword}
                        </div>

                        <button onClick={handleLogin} className="overlap-group2">
                            <div className="login-2">
                                {login}
                            </div>
                        </button>
                    </div>
                </div>
                <p className="dont-have-accountL">
                    <span className="span0">{spanText1} </span>
                    <span onClick={handleRegisterClick} className="span1">{spanText2}</span>
                </p>
            </div>
        </div>
    );
    
    
}

export default Login;