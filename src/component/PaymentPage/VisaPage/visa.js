import React, { useState, useEffect } from "react";
import "./visa.css";

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

function Visa(props) {

    const [name, setName] = useState("");
    const [cardNumber, setCardNumber] = useState("");
    const [expiration, setExpiration] = useState("");
    const [cvv, setCVV] = useState("");

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
        paymentMethodInfo = enLocale.paymentMethodInfo,
        paymentMethod = enLocale.paymentMethod,

        subtitile2 = enLocale.subtitile2,
        timeOut = enLocale.timeOut,
        nameHint = enLocale.nameHint,
        cardNumberHint = enLocale.cardNumberHint,
        expirationHint = enLocale.expirationHint,
        cvvHint = enLocale.cvvHint,
        terms = enLocale.terms,
        proceedButton = enLocale.proceedButton,
        cancelButton = enLocale.cancelButton
    } = props;

    const handleCardNumberChange = (event) => {
        const input = event.target.value;
        const formattedCardNumber = input
          .replace(/\D/g, "") // Remove non-digit characters
          .slice(0, 16); // Limit to a maximum of 16 characters
      
        let formattedValue = "";
        let chunkIndex = 0;
        const chunkSize = 4;
      
        for (let i = 0; i < formattedCardNumber.length; i++) {
          if (i !== 0 && i % chunkSize === 0) {
            formattedValue += "-";
            chunkIndex++;
          }
          formattedValue += formattedCardNumber[i];
        }
      
        setCardNumber(formattedValue);
    }; 
    
    const handleExpirationChange = (event) => {
        const input = event.target.value;
        const formattedExp = input
          .replace(/\D/g, "") // Remove non-digit characters
          .slice(0, 4); // Limit to a maximum of 16 characters
      
        let formattedValue = "";
        let chunkIndex = 0;
        const chunkSize = 2;
      
        for (let i = 0; i < formattedExp.length; i++) {
          if (i !== 0 && i % chunkSize === 0) {
            formattedValue += "/";
            chunkIndex++;
          }
          formattedValue += formattedExp[i];
        }
      
        setExpiration(formattedValue);
    };

    const handleCVVChange = (event) => {
        const input = event.target.value;
        const formattedCVV = input.replace(/\D/g, "").slice(0, 4); // Limit to 4 characters
        setCVV(formattedCVV);
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
                method: paymentMethod,
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
                    method: paymentMethod,
                },
            });

        } catch (error) {
          console.log(error);
          setError(error.message);
        }
    };

    return (

        <div className="container-center-horizontal">
            <div className="visa screen">
                
                <div className="visa-1">
                    <Header title={title} />
                    
                    {/* Summary */}
                    <h1 className="titleSummary">{subtitle}</h1>
                    <div className="smallBoxVisa">
                        <div className="rowHiddenVisa">
                            <div className="summaryInfo">{netCharge}</div>
                            <div className="summaryDetail">{amount}.00</div>
                        </div>

                        <div className="rowHiddenVisa">
                            <div className="summaryInfo">{payTo}{dobiSinggah}</div>
                            <div className="summaryDetail">{dobiSinggah}</div>
                        </div>
                        
                        <div className="rowHiddenVisa">
                            <div className="summaryInfo">{paymentOf}</div>
                            <div className="summaryDetail">{machineToken}</div>
                        </div>

                        <div className="rowHiddenVisa">
                            <div className="summaryInfo">{paymentMethodInfo}</div>
                            <div className="summaryDetail">{paymentMethod}</div>
                        </div>
                    </div>

                    {/* Visa Detail */}
                    <h1 className="titleVisa">{subtitile2}</h1>
                    <div className="smallBoxVisa-2">
                        <div className="timeOut">{timeOut} {minutes}:{seconds < 10 ? `0${seconds}` : seconds}</div>

                        <div className="nameV">
                            <label>{nameHint}</label>
                            <input 
                                type="text"
                                value={name}
                                placeholder="Please enter your full name"
                                onChange={(event) => setName(event.target.value)}
                            />
                        </div>

                        <div className="cardV">
                            <label>{cardNumberHint}</label>
                            <input 
                                type="text"
                                value= {cardNumber}
                                onChange={handleCardNumberChange}
                                placeholder="Please input your card number"
                            />
                        </div>

                        <div className="rowHiddenVisa">
                            <div className="expV">
                                <label>{expirationHint}</label>
                                <input 
                                    type="text"
                                    value={expiration}
                                    placeholder="mm/yy"
                                    onChange={handleExpirationChange}
                                />
                            </div>
                            
                            <div className="cvvV">
                                <label>{cvvHint}</label>
                                <input 
                                    type="text"
                                    value={cvv}
                                    placeholder="cvv"
                                    onChange={handleCVVChange}
                                />
                            </div>
                        </div>
                        
                        
                        <div className="terms">{terms}</div>

                        <div className="rowHiddenVisa">
                            <button  className="buttonVisaP" onClick={proceedPayment}>
                                <div className="buttonInfoVisa">
                                    {proceedButton}
                                </div>
                            </button>
                            <button  className="buttonVisaC" onClick={handleCancelTransaction}>
                                <div className="buttonInfoVisa">
                                    {cancelButton}
                                </div>
                            </button>
                        </div>
                    </div>

                </div>
            </div>
            {/* Render the SuccessDialog component */}
            <ConfirmDialog
                open={cancelDialogOpen && !success}
                onClose={() => setCancelDialogOpen(false)}
                message={dialogMessage}
                titleMessage={titleMessage}
                onSuccess={handleConfirmCancelTransaction}
            />
            <SuccessDialog
                open={dialogOpen && success}
                onClose={closeDialog}
                message={dialogMessage}
                titleMessage={titleMessage}
            />
        </div>
    );

}

export default Visa;