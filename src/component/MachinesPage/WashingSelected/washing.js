import React, { useState, useEffect } from "react";
import "./washing.css"
import { useLocation } from 'react-router-dom';

import logoWashing from "../../../assets/washing.png"

import enLocale from "./locale.en.json"
import Header from "../../Header/header";
import NavBar from "../../NavBar/nav";
import ConfirmDialog from "../../Dialog/confirmation";

//Database
import { auth, db } from "../../firebase";
import { doc, getDoc, addDoc, updateDoc, collection, where, getDocs, query } from "firebase/firestore";

function Washing(props) {

    const [temperature, setTemperature] = useState("");
    const [tokensValue, setTokens] = useState("");
    const [pointsValue, setPoints] = useState("");
    const [soapValue, setSoap] = useState("")
    const [timerWashingValue, setTimerWashing] = useState("");
    const [statusValue, setStatus] = useState("");
    const [error, setError] = useState("")

    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogMessage, setDialogMessage] = useState(""); // Custom dialog message
    const [titleMessage, setTitleMessage] = useState(""); // Custom dialog message

    const [countdownIntervalId, setCountdownIntervalId] = useState(null); // Store the countdown interval ID
    const [showStartButton, setShowStartButton] = useState(true);
    const [showMessage, setShowMessage] = useState(false);

    const location = useLocation();
    const { machine } = location.state;

    const {
        title = enLocale.title,
        subtitle1 = enLocale.subtitle1,
        selectMachine = enLocale.selectMachine,
        selectTemperature = enLocale.selectTemperature,
        price = enLocale.price,
        infoPrice = enLocale.infoPrice,
        payNow = enLocale.payNow,
        startNow = enLocale.startNow,
        startInfo = enLocale.startInfo,
        startMessage = enLocale.startMessage
    } = props;

    const handleTemperatureChange = (event) => {
        setTemperature(event.target.value); // Update the temperature state when a radio button is selected
    };

    const fetchData = async () => {
        try {
            const user = auth.currentUser;
            console.log('Current User:', user);
            if (user) {
                // Fetch user data from Firestore
                const userDocRef = doc(db, "users", user.uid);
                const userDocSnap = await getDoc(userDocRef);
                console.log('User Document Snapshot:', userDocSnap);
                if (userDocSnap.exists()) {
                    const userData = userDocSnap.data();
                    console.log('User Data:', userData);
                    const walletID = userData.walletID;
                    if (walletID) {
                        const walletDocRef = doc(db, "wallet", walletID);
                        const walletDocSnap = await getDoc(walletDocRef);
                        console.log('Wallet Document Snapshot:', walletDocSnap);
                        if (walletDocSnap.exists()) {
                            const walletData = walletDocSnap.data();
                            console.log('Wallet Data:', walletData);
                            setTokens(walletData.tokens);
                            setPoints(walletData.points);
                        }
                    }
                }
            }
        } catch (error) {
            console.log('Fetch User Data Error:', error);
            setError("Failed to fetch user data.");
        }
        try {
            // Fetch the machine document based on its name
            const machinesCollectionRef = collection(db, "machines");
            const q = query(
                machinesCollectionRef,
                where("name", "==", machine.name)
            );
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                // Assume there is only one machine document with the given name
                const machineDocRef = querySnapshot.docs[0].ref;
                const machineDocSnap = await getDoc(machineDocRef);

                if (machineDocSnap.exists()) {
                    const machineData = machineDocSnap.data();
                    console.log('Machine Data:', machineData);
                    setTimerWashing(machineData.timer);
                    setStatus(machineData.status);
                    setSoap(machineData.soap);
                } else {
                    console.log("Machine not found!");
                    setError("Machine not found.");
                }
            }
        } catch (error) {
            console.log('Fetch Machine Data Error:', error);
            setError("Failed to fetch machine data.");
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                fetchData();
            }
        });

        return () => unsubscribe();
    }, []);

    const handleConfirmPayMachine = () => {
        setDialogOpen(true);
        setDialogMessage("Are sure want to pay this machine?"); // Set custom dialog message
        setTitleMessage("Confirm Payment Machine");
    }

    const handlePayNow = async () => {
        setDialogOpen(false); // Close the dialog box
        // Check if tokens in the database are greater than or equal to 4
        if (tokensValue >= 4) {

            try {
                const user = auth.currentUser;
                if (user) {
                    // Fetch user data from Firestore
                    const userDocRef = doc(db, "users", user.uid);
                    const userDocSnap = await getDoc(userDocRef);

                    if (userDocSnap.exists()) {
                        const userData = userDocSnap.data();
                        const walletID = userData.walletID;

                        if (walletID) {
                            const walletDocRef = doc(db, "wallet", walletID);

                            // Update wallet tokens and points in the database
                            await updateDoc(walletDocRef, {
                                tokens: tokensValue - 4,
                                points: pointsValue + 4,
                            });
                            console.log("Payment successful!");
                        }
                    }

                }
                // Fetch the machine document based on its name
                const machinesCollectionRef = collection(db, "machines");
                const q = query(
                    machinesCollectionRef,
                    where("name", "==", machine.name)
                );
                const querySnapshot = await getDocs(q);

                if (!querySnapshot.empty) {
                    // Assume there is only one machine document with the given name
                    const machineDocRef = querySnapshot.docs[0].ref;

                    // Update the machine's timer in the database
                    await updateDoc(machineDocRef, {
                        timer: "00:02:00",
                        status: "In Use",
                        soap: soapValue - 1,
                        userID: user.uid,
                    });
                    console.log("Machine timer updated!");

                    // Create an orders document
                    const ordersCollectionRef = collection(db, "orders");

                    const currentDate = new Date().toLocaleDateString("en-US", {
                        timeZone: "Asia/Kuala_Lumpur",
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                    });

                    await addDoc(ordersCollectionRef, {
                        points: 4,
                        tokens: 4,
                        date: currentDate,
                        tempSelect: temperature,
                        type: machine.type,
                        userID: user.uid,
                    });

                    fetchData();


                } else {
                    console.log("Machine not found!");
                    setError("Machine not found.");
                }
            } catch (error) {
                console.log("Payment Error:", error);
                setError("Failed to process payment.");
            }
        } else {
            console.log("Insufficient tokens!");
        }
    };

    const startCountdown = async (startTime) => {
        const countdownInterval = setInterval(async () => {
            const currentTime = new Date().getTime();
            const remainingTime = startTime - currentTime;

            if (remainingTime <= 0) {
                clearInterval(countdownInterval);
                setTimerWashing(timerWashingValue);

                try {
                    const user = auth.currentUser;
                    if (user) {
                        // Fetch the machine document based on its name
                        const machinesCollectionRef = collection(db, "machines");
                        const q = query(machinesCollectionRef, where("name", "==", machine.name));
                        const querySnapshot = await getDocs(q);

                        if (!querySnapshot.empty) {
                            // Assume there is only one machine document with the given name
                            const machineDocRef = querySnapshot.docs[0].ref;

                            // Update the machine's timer and status in the database
                            await updateDoc(machineDocRef, {
                                timer: "00:00:00",
                                status: "Available",
                                etaTime: "",
                                userID: "",
                            });

                            console.log("Machine timer updated!");

                            fetchData(); // Update the state with the latest data from the database
                        } else {
                            console.log("Machine not found!");
                            setError("Machine not found.");
                        }
                    }
                } catch (error) {
                    console.log("Update Machine Data Error:", error);
                    setError("Failed to update machine data.");
                }
            } else {
                const hours = Math.floor(remainingTime / (1000 * 60 * 60));
                const minutes = Math.floor(
                    (remainingTime % (1000 * 60 * 60)) / (1000 * 60)
                );
                const seconds = Math.floor((remainingTime % (1000 * 60)) / 1000);

                const formattedTime = `${hours.toString().padStart(2, "0")}:${minutes
                    .toString()
                    .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

                setTimerWashing(formattedTime);
            }
        }, 1000);

        setCountdownIntervalId(countdownInterval);
    };
      

    useEffect(() => {
        const storedStartTime = localStorage.getItem("countdownStartTime");
        const startTime = storedStartTime ? parseInt(storedStartTime) : null;

        if (startTime) {
            startCountdown(startTime);
        }

        return () => {
            clearInterval(countdownIntervalId);
        };
    }, []);

    const handleStartMachine = async () => {
        try {
            setShowStartButton(false);
            setShowMessage(true);
            const user = auth.currentUser;
            if (user) {
                // Fetch the machine document based on its name
                const machinesCollectionRef = collection(db, "machines");
                const q = query(machinesCollectionRef, where("name", "==", machine.name));
                const querySnapshot = await getDocs(q);

                if (!querySnapshot.empty) {
                    // Assume there is only one machine document with the given name
                    const machineDocRef = querySnapshot.docs[0].ref;
                    const currentTime = new Date().getTime();
                    const etcTime = new Date(currentTime + 1500000).toLocaleTimeString("en-US", {
                        timeZone: "Asia/Kuala_Lumpur",
                        hour: "numeric",
                        minute: "numeric",
                        hour12: true,
                    });

                    // Update the machine's timer and status in the database
                    await updateDoc(machineDocRef, {
                        etaTime: etcTime,
                    });

                    console.log("Machine timer updated!");

                    await fetchData(); // Update the state with the latest data from the database
                } else {
                    console.log("Machine not found!");
                    setError("Machine not found.");
                }
            }
        } catch (error) {
            console.log("Update Machine Data Error:", error);
            setError("Failed to update machine data.");
        }
        const startTime = new Date().getTime() + 120000; // Add 5 minutes (300,000 milliseconds) to the current time
        localStorage.setItem("countdownStartTime", startTime.toString());
        startCountdown(startTime);
    };

    return (
        <div className="container-center-horizontal">
            <div className="washingSelected screen">
                <div className="washingSelected-1">
                    <Header title={title} />

                    <h1 className="subtitle1">{subtitle1}</h1>

                    <div className="smallBoxWS">
                        <div className="selectMachine">{selectMachine}</div>

                        <div className="rowHiddenWS">
                            <div className="columnHiddenWS-1">
                                <img className="logoWashingWS" src={logoWashing} alt="Washing" />
                                <div className="machineName">{machine.name}</div>
                            </div>

                            <div className="columnHidden">
                                {/* Select Temperature */}
                                <div className="selectTemp">{selectTemperature}
                                    <div className="temperature">
                                        <input
                                            type="radio"
                                            name="temperature"
                                            value="Cold"
                                            checked={temperature === "Cold"} // Check if the temperature state matches the value
                                            onChange={handleTemperatureChange}
                                        />
                                        Cold</div>

                                    <div className="temperature">
                                        <input
                                            type="radio"
                                            name="temperature"
                                            value="Medium"
                                            checked={temperature === "Medium"} // Check if the temperature state matches the value
                                            onChange={handleTemperatureChange}
                                        />
                                        Medium</div>

                                    <div className="temperature">
                                        <input
                                            type="radio"
                                            name="temperature"
                                            value="Hot"
                                            checked={temperature === "Hot"} // Check if the temperature state matches the value
                                            onChange={handleTemperatureChange}
                                        />
                                        Hot</div>
                                </div>

                                <div className="price">{price}
                                    <div className="infoPrice">{infoPrice}</div>
                                    <div className="infoPrice">Available: {tokensValue} Tokens</div>
                                </div>

                            </div>
                        </div>

                        <div className="timer">{timerWashingValue}</div>

                        {statusValue === "In Use" ? (
                            <>
                                {showStartButton && (
                                    <>
                                        <button className="buttonStart" onClick={handleStartMachine}>
                                            <div className="buttonInfoWS">{startNow}</div>
                                        </button>
                                        <div className="startInfo">{startInfo}</div>
                                    </>
                                )}
                                {showMessage && (
                                    <div className="startInfo">{startMessage}</div>
                                )}
                            </>
                        ) : (
                            <button className="buttonPay" onClick={handleConfirmPayMachine}>
                                <div className="buttonInfoWS">{payNow}</div>
                            </button>
                        )}

                    </div>

                    <NavBar />
                </div>
            </div>
            <ConfirmDialog
                open={dialogOpen}
                onClose={() => setDialogOpen(false)}
                message={dialogMessage}
                titleMessage={titleMessage}
                onSuccess={handlePayNow}
            />
        </div>
    );
}

export default Washing;