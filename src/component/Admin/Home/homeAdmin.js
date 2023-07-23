import React, { useState, useEffect } from "react";
import "./homeAdmin.css";
import { useNavigate } from "react-router-dom";

import logoWashing from "../../../assets/washing.png"
import logoDryer from "../../../assets/dryer.png"
import logoHand from "../../../assets/hand.png"
import logoMoney from "../../../assets/money.png"

import enLocale from "./locale.en.json"
import Header from "../../Header/header";

import NavBarAdmin from "../../NavBar/navAdmin";

//Database
import { doc, getDoc, updateDoc, collection, query, where, getDocs } from "firebase/firestore";
import { EmailAuthProvider, reauthenticateWithCredential } from "firebase/auth";
import { auth, db } from "../../firebase";


function HomeAdmin(props) {

    const [nameValue, setNameValue] = useState('');
    const [tokenValue, setTokenValue] = useState("");
    const [priceValue, setPriceValue] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const{
        title = enLocale.title,
        subtitle = enLocale.subtitle,
        subtitle0 = enLocale.subtitle0,
        welcomeInfo = enLocale.welcomeInfo,
        salesService = enLocale.salesService,
        salesTopup = enLocale.salesTopup,
        viewDetails = enLocale.viewDetails,
        subtitle1 = enLocale.subtitle1,
        machineInfo = enLocale.machineInfo,
        washingMachine = enLocale.washingMachine,
        dryerMachine = enLocale.dryerMachine,
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
                    setNameValue(userData.name);
                }

                // Fetch the sum of tokens from the orders table where the date is equal to the currentDate
                const ordersCollectionRef = collection(db, "orders");
                const q = query(
                    ordersCollectionRef,
                    where("date", "==", currentDate)
                );
                const querySnapshot = await getDocs(q);
                let sumTokens = 0;

                querySnapshot.forEach((doc) => {
                    const orderData = doc.data();
                    sumTokens += orderData.tokens;
                });

                if (isNaN(sumTokens)) {
                    sumTokens = 0;
                }

                setTokenValue(sumTokens);
                console.log("Jadi ka tak?", sumTokens)

                // Fetch the sum of price from the transactions table where the date is equal to the currentDate
                const transactionsCollectionRef = collection(db, "transactions");
                const p = query(
                    transactionsCollectionRef,
                    where("date", "==", currentDate)
                );
                const querysSnapshot = await getDocs(p);
                let sumPrice = 0;

                querysSnapshot.forEach((doc) => {
                    const transactionsData = doc.data();
                    sumPrice += transactionsData.price;
                });

                if (isNaN(sumPrice)) {
                    sumPrice = 0;
                }

                setPriceValue(sumPrice);
                console.log("Jadi ka tak?", sumPrice) 
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

    const handleWashingList = () => {
        navigate("/washingListAdmin")
    }

    const handleDryerList = () => {
        navigate("/dryerListAdmin")
    }

    const currentDate = new Date().toLocaleDateString("en-US", {
        timeZone: "Asia/Kuala_Lumpur",
        day: "numeric",
        month: "long",
        year: "numeric",
    });

    return (
        <div className="container-center-horizontal">
            <div className="homeHA screen">
                <div className="homeHA-1">
                    <Header title={title} />

                    <div className="smallBoxH-S">
                        <h1 className="TitleStampsInfo">{subtitle0} {nameValue}</h1>
                        <div className="welcomeInfo">{welcomeInfo}</div>
                    </div>

                    <h1 className="TitleSalesInfo">{subtitle}</h1>

                    <div className="smallBoxH-S">
                        <div className="boxHiddenHA">
                            <div className="circleHA">
                                <img className="logoHand" src={logoHand} alt="hand"></img>
                            </div>
                            <div className="todayInfo">{salesService}
                                <div className="serviceInfo">RM {tokenValue}.00</div>
                                <div className="currentDateHA">As in {currentDate}</div>
                            </div>
                        </div>

                        <div className="boxHiddenHA-2">
                            <div className="circleHA">
                                <img className="logoMoney" src={logoMoney} alt="money"></img>
                            </div>
                            <div className="todayInfo">{salesTopup}
                                <div className="serviceInfo">RM {priceValue}.00</div>
                                <div className="currentDateHA">As in {currentDate}</div>
                            </div>
                        </div>
                        <button className="buttonViewHA">
                            <div className="buttonInfoViewHA">
                                {viewDetails}
                            </div>
                        </button>
                    </div>

                    <h1 className="TitleMachineInfo">{subtitle1}</h1>

                    <div className="smallBoxH">
                        <div className="machineInfoH">{machineInfo}</div>

                        <div className="boxHiddenH">
                            <button className="washingButtonH" onClick={handleWashingList}>
                                <div>
                                    <img className="logoWashing" src={logoWashing} alt="Washing Machine" />
                                    <div className="buttonInfoH">{washingMachine}</div>
                                </div>
                            </button>
                            <button className="dryerButtonH" onClick={handleDryerList}>
                                <div>
                                    <img className="logoDryer" src={logoDryer} alt="Washing Machine" />
                                    <div className="buttonInfoH">{dryerMachine}</div>
                                </div>
                            </button>
                        </div>
                    </div>
                    <NavBarAdmin />
                </div>
            </div>
        </div>
    );
}

export default HomeAdmin;