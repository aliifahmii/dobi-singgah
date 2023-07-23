import React, { useState, useEffect } from "react";
import "./fpx.css";

import enLocale from "./locale.en.json";
import Header from "../../Header/header";

// Databse
import { auth, db } from "../../firebase";
import { collection, addDoc, doc, updateDoc, getDoc } from "firebase/firestore";

// Function
import ConfirmDialog from "../../Dialog/confirmation";
import SuccessDialog from "../../Dialog/success";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

function FPX(props) {

    const [selectedBank, setSelectedBank] = useState("");

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

        subtitile2 = enLocale.subtitile2,
        timeOut = enLocale.timeOut,
        bankHint = enLocale.bankHint,
        terms = enLocale.terms,
        proceedButton = enLocale.proceedButton,
        cancelButton = enLocale.cancelButton
    } = props;

    const handleBankChange = (event) => {
        const selectedValue = event.target.value;
        setSelectedBank(selectedValue);
    };

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
                method: selectedBank,
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
                    method: selectedBank,
                },
            });

        } catch (error) {
          console.log(error);
          setError(error.message);
        }
    };

    return (

        <div className="container-center-horizontal">
            <div className="fpx screen">
                
                <div className="fpx-1">
                    <Header title={title} />
                    
                    {/* Summary */}
                    <h1 className="titleSummary">{subtitle}</h1>
                    <div className="smallBoxFPX">
                        <div className="rowHiddenFPX">
                            <div className="summaryInfo">{netCharge}</div>
                            <div className="summaryDetail">{amount}.00</div>
                        </div>

                        <div className="rowHiddenFPX">
                            <div className="summaryInfo">{payTo}{dobiSinggah}</div>
                            <div className="summaryDetail">{dobiSinggah}</div>
                        </div>
                        
                        <div className="rowHiddenFPX">
                            <div className="summaryInfo">{paymentOf}</div>
                            <div className="summaryDetail">{machineToken}</div>
                        </div>

                        <div className="rowHiddenFPX">
                            <div className="summaryInfo">{paymentMethod}</div>
                            <div className="summaryDetail">{title}</div>
                        </div>
                    </div>

                    {/* FPX Detail */}
                    <h1 className="titleFPX">{subtitile2}</h1>
                    <div className="smallBoxFPX-2">
                        <div className="timeOut">{timeOut} {minutes}:{seconds < 10 ? `0${seconds}` : seconds}</div>

                        <div className="bankF">
                            <label>{bankHint}</label>
                            <select value={selectedBank} onChange={handleBankChange}>
                                <option value="">Please select bank name</option>
                                <option value="Affin Bank">Affin Bank</option>
                                <option value="Agro Bank">Agrobank</option>
                                <option value="Alliance Bank (Personal)">Alliance Bank (Personal)</option>
                                <option value="Ambank">Ambank</option>
                                <option value="Bank Islam">Bank Islam</option>
                                <option value="Bank Muamalat">Bank Muamalat</option>
                                <option value="Bank Of China">Bank Of China</option>
                                <option value="Bank Rakyat">Bank Rakyat</option>
                                <option value="BSN">BSN</option>
                                <option value="CIMB Clicks">CIMB Clicks</option>
                                <option value="Hong Leong Bank">Hong Leong Bank</option>
                                <option value="HSBC Bank">HSBC Bank</option>
                                <option value="KFH">KFH</option>
                                <option value="Maybank2U">Maybank2U</option>
                                <option value="OCBC Bank">OCBC Bank</option>
                                <option value="Public Bank">Public Bank</option>
                                <option value="RHB Bank">RHB Bank</option>
                                <option value="Standard Chartered">Standard Chartered</option>
                                <option value="UOB Bank">UOB Bank</option>
                            </select>
                        </div>

                        
                        <div className="terms">{terms}</div>

                        <div className="rowHiddenFPX">
                            <button  className="buttonFPXP" onClick={proceedPayment}>
                                <div className="buttonInfoFPX">
                                    {proceedButton}
                                </div>
                            </button>
                            <button  className="buttonFPXC">
                                <div className="buttonInfoFPX" onClick={handleCancelTransaction} >
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

export default FPX;