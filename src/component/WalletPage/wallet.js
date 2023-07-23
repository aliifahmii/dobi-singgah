import React, { useState, useEffect } from "react";
import "./wallet.css";

import enLocale from "./locale.en.json";
import Header from "../Header/header";
import logoWallet from "../../assets/wallet.png";
import logoPoint from "../../assets/points.png";
import logoGift from "../../assets/gift.png";
import logoVoucher from "../../assets/voucher.png";
import logoDollar from "../../assets/dollar.png";

import { useNavigate } from "react-router-dom";

import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";

import NavBar from "../NavBar/nav";


function Wallet(props) {
    
    const [tokensValue, setTokens] = useState("");
    const [pointsValue, setPoints] = useState("");
    const [error, setError] = useState("")
    
    const navigate = useNavigate();
    
    const{ 
        title = enLocale.title,
        subTitle1 = enLocale.subTitle1,
        walletInfo = enLocale.walletInfo,

        subTitle2 = enLocale.subTitle2,
        rewardInfo = enLocale.rewardsInfo,
        redeemPoints = enLocale.redeemPoints,
        redeemVoucher = enLocale.redeemVoucher,

        subTitle3 = enLocale.subTitle3,
        topupInfo = enLocale.topupInfo,
        topupButton = enLocale.topupButton,
        rm10 = enLocale.rm10,
        rm20 = enLocale.rm20,
        rm50 = enLocale.rm50,
        rm100 = enLocale.rm100,
        token11 = enLocale.token11,
        token22 = enLocale.token22,
        token54 = enLocale.token54,
        token110 = enLocale.token110,
    } = props;

    const fetchWalletData = async () => {
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
    };
    
    useEffect(() => {
        fetchWalletData();
    }, []);
    
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
          if (user) {
            fetchWalletData();
          }
        });
    
        return () => unsubscribe();
    }, []);

    const handleAmount = (amount) => {
        navigate(`/topup?amount=${encodeURIComponent(amount)}`);
    }

    const handleHistory = () => {
        navigate("/history");
    }

    return (
    
        <div className="container-center-horizontal">
            <div className="wallet screen">
                
                <div className="wallet-1">
                    <Header title={title} />
                    
                    
                    {/*Wallet Section */}
                    <h1 className="titleWalletInfo">
                        {subTitle1}
                    </h1>
                    
                    <div className="smallBoxW">
                        <div className="boxHidden">
                            <div className="circle">
                                <img className="logoWallet" src={logoWallet} alt="wallet"></img>
                            </div>
                            <div className="walletInfo">{walletInfo}
                                <div className="tokenInfo">{tokensValue} TOKENS</div>
                            </div>
                        </div>

                        <button className="buttonW" onClick={handleHistory}>
                            <div className="buttonInfoViewHA">
                                History
                            </div>
                        </button>
                    </div>

                    {/*Reward Section */}
                    <h1 className="titleRewardInfo">
                        {subTitle2}
                    </h1>

                    <div className="smallBoxW1">
                        <div className="boxHidden1">
                            <div className="circle">
                                <img className="logoPoint" src={logoPoint} alt="point"></img>
                            </div>
                            <div className="rewardInfo">{rewardInfo}
                                <div className="pointInfo">{pointsValue} PTS</div>
                            </div>
                        </div>
                        
                        <div className="boxHidden1-1">
                            <button className="buttonW">
                                <img className="logoGift" src={logoGift} alt="point" />
                                    <div className="buttonInfoW">
                                        {redeemPoints}
                                    </div>
                            </button>

                            <button className="buttonW1">
                                <img className="logoGift" src={logoVoucher} alt="point" />
                                    <div className="buttonInfoW">
                                        {redeemVoucher}
                                    </div>
                            </button>
                        </div>
                    </div>

                    {/*Topup Section */}
                    <h1 className="titleTopupInfo">
                        {subTitle3}
                    </h1>

                    <div className="smallBoxW2">
                        <div className="topupInfoW">{topupInfo}</div>

                        <div className="boxHidden1-2">
                            <button className="buttonW2" onClick={() => handleAmount(rm10)}>
                                <img className="logoDollar" src={logoDollar} alt="point" />
                                    <div className="buttonInfoWT">
                                        RM {rm10}<div className="buttonInfoWT">{token11}</div>
                                    </div>
                            </button>

                            <button className="buttonW3" onClick={() => handleAmount(rm20)}>
                                <img className="logoDollar" src={logoDollar} alt="point" />
                                    <div className="buttonInfoWT">
                                        RM {rm20}<div className="buttonInfoWT">{token22}</div>
                                    </div>
                            </button>
                        </div>

                        <div className="boxHidden1-2">
                            <button className="buttonW4" onClick={() => handleAmount(rm50)}>
                                <img className="logoDollar" src={logoDollar} alt="point" />
                                    <div className="buttonInfoWT">
                                        RM {rm50}<div className="buttonInfoWT">{token54}</div>
                                    </div>
                            </button>

                            <button className="buttonW5" onClick={() => handleAmount(rm100)}>
                                <img className="logoDollar" src={logoDollar} alt="point" />
                                    <div className="buttonInfoWT">
                                        RM {rm100}<div className="buttonInfoWT">{token110}</div>
                                    </div>
                            </button>
                        </div>

                        {/* <button className="buttonP">
                            <div className="buttonInfo">
                                {topupButton}
                            </div>
                        </button> */}

                    </div>
                    <NavBar /> 
                </div>
            </div>
        </div>
        
    );
}

export default Wallet;