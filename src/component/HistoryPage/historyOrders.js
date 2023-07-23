import React, { useState, useEffect } from "react";
import "./history.css";

import enLocale from "./locale.en.json";
import Header from "../Header/header";
import logoWashing from "../../assets/washing.png";
import logoDryer from "../../assets/dryer.png";


import { useNavigate } from "react-router-dom";

import { auth, db } from "../firebase";
import { doc, getDoc, getDocs, collection, query, where } from "firebase/firestore";

import NavBar from "../NavBar/nav";


function HistoryOrders(props) {

    const [orders, setOrders] = useState([]);
    const [error, setError] = useState("")

    const navigate = useNavigate();

    const {
        title2 = enLocale.title2,
        TopupInfo = enLocale.topupInfo,
    } = props;

    const fetchOrdersData = async () => {
        try {
            const user = auth.currentUser;
            if (user) {
                const ordersCollectionRef = collection(db, "orders");
                const q = query(ordersCollectionRef, where("userID", "==", user.uid));
                const querySnapshot = await getDocs(q);

                const ordersData = querySnapshot.docs.map((doc) => doc.data());

                // Sort orders by date in descending order
                ordersData.sort((a, b) => new Date(b.date) - new Date(a.date));

                setOrders(ordersData);
            }
        } catch (error) {
            console.log('Fetch User Data Error:', error);
            setError("Failed to fetch user data.");
        }
    };

    useEffect(() => {
        fetchOrdersData();
    }, []);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                fetchOrdersData();
            }
        });

        return () => unsubscribe();
    }, []);


    return (

        <div className="container-center-horizontal">
            <div className="history screen">

                <div className="history-1">
                    <Header title={title2} />

                    <div className="ordersList">
                        {orders.map((order, index) => (
                            <div className="smallBoxW" key={index}>
                                <div className="dateHT">{order.date}</div>
                                <div className="boxHiddenHT">
                                    
                                        {order.type === 'Washing' ? (
                                            <img className="logoMachineHA" src={logoWashing} alt="topup" />
                                        ) : order.type === 'Dryer' ? (
                                            <img className="logoMachineHA" src={logoDryer} alt="topup" />
                                        ) : null}
                                    
                                    <div className="amountInfo">{order.type}
                                        <div className="methodInfo">Temperature: {order.tempSelect}</div>
                                        <div className="methodInfo">Earn {order.points} points</div>
                                        <div className="tokenInfo">Tokens Used: {order.tokens}</div>

                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <NavBar />
                </div>
            </div>
        </div>

    );
}

export default HistoryOrders;