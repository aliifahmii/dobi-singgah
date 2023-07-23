import React, { useState } from "react";
import "./topup.css";

import enLocale from "./locale.en.json";
import Header from "../Header/header";

// Image
import logoVisa from "../../assets/visa.png";
import logoFPX from "../../assets/fpx.png";
import logoTNG from "../../assets/tng.png";
import logoShopee from "../../assets/shopee.jpg";
import logoGrab from "../../assets/grab.png";
import logoBoost from "../../assets/boost.png"

// Function
import { useLocation } from "react-router-dom";

import { Link } from "react-router-dom";
import NavBar from "../NavBar/nav";

function Topup(props) {

    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const amount = searchParams.get("amount");

    
    const {
        title = enLocale.title,
        subtitle = enLocale.subtitile,
        amountPaid = enLocale.amountPaid,
        subtitle2 = enLocale.subtitile2,
        paymentMethod = enLocale.paymentMethod,
        creditCard = enLocale.creditCard,
        fpx = enLocale.fpx,
        tng = enLocale.tng,
        spay = enLocale.spay,
        grabPay = enLocale.grabPay,
        boost = enLocale.boost,
        tnc = enLocale.tnc,
        tnc1 = enLocale.tnc1,
        tnc2 = enLocale.tnc2,
    } = props;

    return (
        <div className="container-center-horizontal">
            <div className="topup screen">
                
                <div className="topup-1">
                    <Header title={title} />

                    {/* Confirm Payment */}                    
                    <h1 className="titleConfirmPay">{subtitle}</h1>
                    <div className="smallBoxT">
                        <div className="amountPaid">{amountPaid}</div>
                        <div className="totalAmount">RM {amount}.00</div>
                    </div>

                    {/* Payment Method */}
                    <h1 className="titlePaymentMethod">{subtitle2}</h1>
                    <div className="smallBoxT-2">
                        <div className="paymentMethod">{paymentMethod}</div>
                        <div className="rowHiddenT">
                            <button className="buttonVisa">
                                <div>
                                    <Link to={`/visa?amount=${amount}`}>
                                        <img className="logoVisa" src={logoVisa} alt="Visa" />
                                        <div className="paymentInfo">{creditCard}</div>
                                    </Link>
                                </div>
                            </button>

                            <button className="buttonFPX">
                                <div>
                                    <Link to={`/FPX?amount=${amount}`}>
                                        <img className="logoFPX" src={logoFPX} alt="FPX" />
                                        <div className="paymentInfo">{fpx}</div>
                                    </Link>
                                </div>
                            </button>

                            <button className="buttonTNG">
                                <div>
                                    <Link to={`/tng?amount=${amount}`}>
                                        <img className="logoTNG" src={logoTNG} alt="TNG" />
                                        <div className="paymentInfo">{tng}</div>
                                    </Link>
                                </div>
                            </button>
                        </div>

                        <div className="rowHiddenT-2">
                            <button className="buttonShopee">
                                <div>
                                    <Link to={`/shopee?amount=${amount}`}>
                                        <img className="logoShopee" src={logoShopee} alt="Shopee" />
                                        <div className="paymentInfo">{spay}</div>
                                    </Link>
                                </div>
                            </button>

                            <button className="buttonGrab">
                                <div>
                                    <Link to={`/grab?amount=${amount}`}>
                                        <img className="logoGrab" src={logoGrab} alt="Grab" />
                                        <div className="paymentInfo">{grabPay}</div>
                                    </Link>
                                </div>
                            </button>

                            <button className="buttonBoost">
                                <div>
                                    <Link to={`/boost?amount=${amount}`}>
                                        <img className="logoBoost" src={logoBoost} alt="Boost" />
                                        <div className="paymentInfo">{boost}</div>
                                    </Link>
                                </div>
                            </button>
                        </div>

                        <div className="tncInfo">{tnc}</div>
                        <ul>
                            <li className="tncInfo1">{tnc1}</li>
                            <li className="tncInfo1">{tnc2}</li>
                        </ul>

                    </div>
                    <NavBar />
                </div>
                
            </div>
        </div>
    );

}

export default Topup;