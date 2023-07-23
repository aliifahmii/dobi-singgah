import React, { useState, useEffect } from "react";
import "./home.css";
import { useNavigate } from "react-router-dom";

import logoWashing from "../../assets/washing.png"
import logoDryer from "../../assets/dryer.png"

import enLocale from "./en.locale.json"
import Header from "../Header/header";

import NavBar from "../NavBar/nav";

//Database
import { doc, getDoc, getDocs, collection, query, where, onSnapshot } from "firebase/firestore";
import { EmailAuthProvider, reauthenticateWithCredential } from "firebase/auth";
import { auth, db } from "../firebase";


function Home(props) {

    const [nameValue, setNameValue] = useState('');
    const [error, setError] = useState("");
    const [activeOrders, setActiveOrders] = useState([]);
    const navigate = useNavigate();
    


    const{
        title = enLocale.title,
        subtitle = enLocale.subtitle,
        subtitle1 = enLocale.subtitle1,
        welcomeInfo = enLocale.welcomeInfo,
        quotes = enLocale.quotes,
        machineInfo = enLocale.machineInfo,
        washingMachine = enLocale.washingMachine,
        dryerMachine = enLocale.dryerMachine,
        subtitle2 =enLocale.subtitle2,
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
            }
        } catch (error) {
            console.log('Fetch User Data Error:', error); // Debugging line
            setError("Failed to fetch user data.");
        }
    };

    const fetchActiveOrders = async (userId) => {
        try {
          const machinesCollectionRef = collection(db, "machines");
          const querySnapshot = await getDocs(
            query(machinesCollectionRef, where("userID", "==", userId))
          );
          const machinesData = querySnapshot.docs.map((doc) => doc.data());
          setActiveOrders(machinesData);
        } catch (error) {
          console.log("Fetch Active Orders Error:", error);
          setError("Failed to fetch active orders.");
        }
      };

    useEffect(() => {
        fetchUserData();
    }, []);
    
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                fetchUserData();
                fetchActiveOrders(user.uid);
            }
        });
    
        return () => unsubscribe();
    }, []);

    const handleWashingList = () => {
        navigate("/washingList")
    }

    const handleDryerList = () => {
        navigate("/dryerList")
    }

    const handleHistoryOrders = () => {
        navigate("/historyOrders");
    }

    return (
        <div className="container-center-horizontal">
            <div className="home screen">
                <div className="home-1">
                    <Header title={title} />

                    <div className="smallBoxH-S">
                        <h1 className="TitleStampsInfo">{subtitle} {nameValue}</h1>
                        <div className="welcomeInfo">{welcomeInfo}</div>
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
                        <button className="buttonW" onClick={handleHistoryOrders}>
                            <div className="buttonInfoViewHA">
                                History
                            </div>
                        </button>
                    </div>

                    <h1 className="TitleMachineInfo">{subtitle2}</h1>

                    <div className="smallBoxH-S">

                        <div className="boxHiddenH">
                            {/* Render the active order buttons */}
                            {activeOrders.map((machines) => (
                                <button
                                    className="washingButtonWL"
                                    key={machines.id}
                                >
                                    <div>
                                        {machines.type === 'Washing' ? (
                                            <img className="logoWashingWL" src={logoWashing} alt="Washing Machine" />
                                        ) : machines.type === 'Dryer' ? (
                                            <img className="logoWashingWL" src={logoDryer} alt="Dryer" />
                                        ) : null}
                                        <div className="buttonInfoWL">{machines.name}</div>
                                        <div className="timerWL">{machines.status}</div>
                                        <div className="estTime">Est Time: {machines.etaTime}</div>
                                    </div>
                                </button>
                            ))}
                        </div>

                        
                    </div>

                    <NavBar />
                </div>
            </div>
        </div>
    );
}

export default Home;