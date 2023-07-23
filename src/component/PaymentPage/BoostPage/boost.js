import React, { useState, useEffect } from "react";
import "./boost.css";

import enLocale from "./locale.en.json";
import Header from "../../Header/header";

// Image
import logoBoost from "../../../assets/boost.png";

// Databse
import { auth, db } from "../../firebase";
import { collection, addDoc, doc, updateDoc, getDoc } from "firebase/firestore";

// Function
import ConfirmDialog from "../../Dialog/confirmation";
import SuccessDialog from "../../Dialog/success";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

function Boost(props) {

    const [success, setSuccess] = useState(false); // add success state
    const [error, setError] = useState("");

    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogMessage, setDialogMessage] = useState(""); // Custom dialog message
    const [titleMessage, setTitleMessage] = useState(""); // Custom dialog message
    const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
    
    const navigate = useNavigate();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const amount = searchParams.get("amount");

    const [remainingTime, setRemainingTime] = useState(480);
    const minutes = Math.floor(remainingTime / 60);
    const seconds = remainingTime % 60;

    const {
        title = enLocale.title,
        subtitle = enLocale.subtitle,
        netCharge =  enLocale.netCharge,
        payTo = enLocale.payTo,
        dobiSinggah = enLocale.dobiSinggah,
        paymentOf = enLocale.paymentOf,
        machineToken = enLocale.machineToken,
        paymentMethod = enLocale.paymentMethod,

        subtitle2 = enLocale.subtitle2,
        timeOut = enLocale.timeOut,
        transactionInfo = enLocale.transactionInfo,
        terms = enLocale.terms,
        proceedButton = enLocale.proceedButton,
        cancelButton = enLocale.cancelButton
    } = props;

    useEffect(() => {
        const timer = setInterval(() => {
          setRemainingTime((prevTime) => prevTime - 1);
        }, 1000);
      
        return () => clearInterval(timer); // Clean up the timer on component unmount
    }, []);

    useEffect(() => {
        if (remainingTime === 0) {
            setSuccess(true);
            setDialogMessage("Please trg again"); // Set custom dialog message
            setTitleMessage("Session Timeout");
            setDialogOpen(true);
        }
    }, [remainingTime, navigate]);

    const closeDialog = () => {
        setDialogOpen(false);
        navigate(`/topup?amount=${amount}`);
    };

    const handleCancelTransaction = () => {
        setCancelDialogOpen(true);
        setDialogMessage("Are sure want to cancel the transaction?"); // Set custom dialog message
        setTitleMessage("Cancel Transaction");
    }

    const handleConfirmCancelTransaction = () => {
        setCancelDialogOpen(false);
        navigate(`/topup?amount=${amount}`);
    };

    const proceedPayment = async () => {
        try {
            if (!amount) {
                setError("Amount is not defined.");
                return;
            }
      
            // Get the current user ID
            const userId = auth.currentUser.uid;
      
            // Get the current date and time in UTC+8 timezone
            const currentDate = new Date().toLocaleDateString("en-US", {
                timeZone: "Asia/Kuala_Lumpur",
                day: "numeric",
                month: "long",
                year: "numeric",
            });
            const currentTime = new Date().toLocaleTimeString("en-US", {
                timeZone: "Asia/Kuala_Lumpur",
                hour: "numeric",
                minute: "numeric",
                hour12: true,
            });
      
            // Add data to the transactions table
            const transactionsRef = collection(db, "transactions");
            const newTransaction = {
                price: Number(amount),
                method: subtitle2,
                date: currentDate,
                time: currentTime,
                userID: userId,
                receiptURL: "",
            };
            const docRef = await addDoc(transactionsRef, newTransaction);
      
            const userRef = doc(db, "users", userId);
            const userSnapshot = await getDoc(userRef);
            const userData = userSnapshot.data();
            const walletId = userData.walletID; // Corrected spelling

            // Update the wallet table using the walletId
            const walletRef = doc(db, "wallet", walletId); // Corrected collection name
            const walletSnapshot = await getDoc(walletRef);
            const walletData = walletSnapshot.data();

            let newTokens;

            if (amount === "10") {
                newTokens = parseInt(walletData.tokens, 10) + 11;
            } else if (amount === "20") {
                newTokens = parseInt(walletData.tokens, 10) + 22;
            } else if (amount === "50") {
                newTokens = parseInt(walletData.tokens, 10) + 54;
            } else if (amount === "100") {
                newTokens = parseInt(walletData.tokens, 10) + 110;
            } else {
                // Handle invalid amount value
                setError("Invalid amount.");
            return;
            }

            // Update the wallet with the new tokens value
            await updateDoc(walletRef, { tokens: newTokens.toString() });
            navigate("/receipt", {
                state: {
                    amount: amount,
                    date: currentDate,
                    time: currentTime,
                    refID: docRef.id,
                    method: subtitle2,
                },
            });

        } catch (error) {
          console.log(error);
          setError(error.message);
        }
    };

    return (

        <div className="container-center-horizontal">
            <div className="boost screen">
                
                <div className="boost-1">
                    <Header title={title} />
                    
                    {/* Summary */}
                    <h1 className="titleSummary">{subtitle}</h1>
                    <div className="smallBoxBoost">
                        <div className="rowHiddenBoost">
                            <div className="summaryInfo">{netCharge}</div>
                            <div className="summaryDetail">{amount}.00</div>
                        </div>

                        <div className="rowHiddenBoost">
                            <div className="summaryInfo">{payTo}{dobiSinggah}</div>
                            <div className="summaryDetail">{dobiSinggah}</div>
                        </div>
                        
                        <div className="rowHiddenBoost">
                            <div className="summaryInfo">{paymentOf}</div>
                            <div className="summaryDetail">{machineToken}</div>
                        </div>

                        <div className="rowHiddenBoost">
                            <div className="summaryInfo">{paymentMethod}</div>
                            <div className="summaryDetail">{subtitle2}</div>
                        </div>
                    </div>

                    {/* Boost Detail */}
                    <h1 className="titleBoost">{subtitle2}</h1>
                    <div className="smallBoxBoost-2">
                        <div className="timeOut">{timeOut} {minutes}:{seconds < 10 ? `0${seconds}` : seconds}</div>
                        <img className="boostLogo" src={logoBoost} alt="Boost" />
                        <div className="transaction">{transactionInfo}</div>
                        <div className="terms">{terms}</div>

                        <div className="rowHiddenBoost">
                            <button  className="buttonBoostP" onClick={proceedPayment}>
                                <div className="buttonInfoBoost">
                                    {proceedButton}
                                </div>
                            </button>
                            <button  className="buttonBoostC" onClick={handleCancelTransaction}>
                                <div className="buttonInfoBoost">
                                    {cancelButton}
                                </div>
                            </button>
                        </div>
                    </div>

                </div>
            </div>
            {/* Render the SuccessDialog component */}
            <SuccessDialog
                open={dialogOpen && success}
                onClose={closeDialog}
                message={dialogMessage}
                titleMessage={titleMessage}
            />
            <ConfirmDialog
                open={cancelDialogOpen && !success}
                onClose={() => setCancelDialogOpen(false)}
                message={dialogMessage}
                titleMessage={titleMessage}
                onSuccess={handleConfirmCancelTransaction}
            />
        </div>
    );

}

export default Boost;