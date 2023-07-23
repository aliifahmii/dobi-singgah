import React, { useState, useEffect } from "react";
import "./history.css";

import enLocale from "./locale.en.json";
import Header from "../Header/header";
import logoTopup from "../../assets/topup.png";
import logoDownload from "../../assets/download.png";

import { useNavigate } from "react-router-dom";

import { auth, db } from "../firebase";
import { doc, getDoc, getDocs, collection, query, where } from "firebase/firestore";

import NavBar from "../NavBar/nav";


function History(props) {

    const [transactions, setTransactions] = useState([]);
    const [dateValue, setDate] = useState("");
    const [timeValue, setTime] = useState("");
    const [methodValue, setMethod] = useState("");
    const [priceValue, setPrice] = useState("");
    const [error, setError] = useState("")

    const navigate = useNavigate();

    const {
        title = enLocale.title,
        TopupInfo = enLocale.topupInfo,
    } = props;

    const fetchTransactionsData = async () => {
        try {
          const user = auth.currentUser;
          if (user) {
            const transactionsCollectionRef = collection(db, "transactions");
            const q = query(transactionsCollectionRef, where("userID", "==", user.uid));
            const querySnapshot = await getDocs(q);
      
            const transactionsData = querySnapshot.docs.map((doc) => doc.data());
      
            // Sort transactions by date and time in descending order
            transactionsData.sort((a, b) => {
              const dateA = new Date(`${a.date} ${a.time}`);
              const dateB = new Date(`${b.date} ${b.time}`);
              return dateB - dateA;
            });
      
            setTransactions(transactionsData);
          }
        } catch (error) {
          console.log('Fetch User Data Error:', error);
          setError("Failed to fetch user data.");
        }
    };

    useEffect(() => {
        fetchTransactionsData();
    }, []);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                fetchTransactionsData();
            }
        });

        return () => unsubscribe();
    }, []);

    const handleDownloadReceipt = (receiptURL) => {
        window.open(receiptURL, "_blank");
    };

    return (

        <div className="container-center-horizontal">
            <div className="history screen">

                <div className="history-1">
                    <Header title={title} />

                    <div className="transactionList">
                        {transactions.map((transaction, index) => (
                            <div className="smallBoxW" key={index}>
                                <div className="dateHT">{transaction.date} {transaction.time}</div>
                                <div className="boxHiddenHT">
                                    <div className="circle">
                                        <img className="logoTopup" src={logoTopup} alt="topup"></img>
                                    </div>
                                    <div className="amountInfo">{TopupInfo}
                                        <div className="methodInfo">{transaction.method}</div>
                                        <div className="tokenInfo">RM {transaction.price}.00</div>
                                    </div>
                                    <img className="logoDownload" src={logoDownload} alt="topup" onClick={() => handleDownloadReceipt(transaction.receiptURL)} ></img>
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

export default History;