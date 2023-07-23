import React, { useState } from "react";
import "./login.css";
import enlocale from "./locale.en.json";
import { useNavigate } from "react-router-dom";
import logoDobi1 from "../../assets/logoDobi.png";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import "firebase/auth";

import SuccessDialog from "../Dialog/success";

function ForgotPwd(props) {
    const [emailValue, setEmailValue] = useState("");
    const auth = getAuth();
    const navigate = useNavigate();

    const [success, setSuccess] = useState(false); // add success state
    const [error, setError] = useState("");

    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogMessage, setDialogMessage] = useState(""); // Custom dialog message
    const [titleMessage, setTitleMessage] = useState(""); // Custom dialog message

    const {
        title = enlocale.title,
        emailHint = enlocale.emailHint,
        sendEmail = enlocale.sendEmail,
        loginHere = enlocale.loginHere
    } = props;

    const handleEmailChange = async () => {
        await sendPasswordResetEmail(
            auth,
            emailValue);

        setSuccess(true);
        setDialogMessage("Please check your email"); // Set custom dialog message
        setTitleMessage("Eamil Send Succesfully");
        setDialogOpen(true);
        console.log("Password reset email sent")
    }

    const closeDialog = () => {
        navigate("/")
        setDialogOpen(false);
    };

    const handleLoginClick = () => {
        navigate("/")
    };

    return (
        <div className="container-center-horizontal">
            <div className="login screen">
                <img className="logo-dobi" src={logoDobi1} alt="Logo Dobi Singgah" />
                <div className="login-1">
                    <h1 className="title">Forgot Password</h1>

                    <div className="overlap-group3">
                        <div className="login-continue">
                            Not to worry. We will send you a password recovery email.
                        </div>

                        <div className="emailL">
                            <input
                                type="email"
                                className="overlap-groupL"
                                placeholder="Please input your email"
                                value={emailValue}
                                onChange={e => setEmailValue(e.target.value)} required
                            />
                        </div>

                        <div className="group-2-f">
                            <button onClick={handleEmailChange} className="overlap-group2">
                                <div className="login-2" >Send Email</div>
                            </button>
                        </div>

                        <p className="dont-have-account">
                            <span className="span0">Already have an account? </span>
                            <span onClick={handleLoginClick} className="span1">Login</span>
                        </p>

                    </div>
                    {/* <button onClick={() => navigate("/")} className="login-page">
                        Login
                    </button> */}
                </div>

            </div>
            <SuccessDialog
                open={dialogOpen && success}
                onClose={closeDialog}
                message={dialogMessage}
                titleMessage={titleMessage}
            />


            {/* <p className="dont-have-accountL">
                <span className="span0">{spanText1} </span>
                <span onClick={handleRegisterClick} className="span1">{spanText2}</span>
            </p> */}


        </div>
    );
}

export default ForgotPwd;