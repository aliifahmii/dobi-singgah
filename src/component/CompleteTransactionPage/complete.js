import React from "react";
import "./complete.css";

import logoCheck from "../../assets/check.png";
import logoReceipt from "../../assets/receipt.png";
import enlocale from "./locale.en.json";

import { useNavigate, useLocation } from "react-router-dom";

function Complete(props) {

    const navigate = useNavigate();
    const location = useLocation();
    const { amount, date, time, refID } = location.state;


    const{
        successful = enlocale.successful,
        dobiSinggah = enlocale.dobiSinggah,
        slipInfo = enlocale.slipInfo,
        buttonDownload = enlocale.buttonDownload,
        buttonDone = enlocale.buttonDone
    } = props;

    const handleDone = () => {
        navigate("/wallet")
    }

    return (
        <div className="container-center-horizontal">
            <div className="complete screen">
                <div className="complete-1">
                    <div className="smallBoxCS">
                        <div className="circleCS">
                            <img className="logoCheck" src={logoCheck} alt="Check" />
                        </div>
                        <div className="infoCS">{successful}</div>
                        <div className="infoCSB">RM{amount}.00</div>
                        <div className="infoCSB">{dobiSinggah}</div>
                        <div className="rowHiddenCS">
                            <div className="infoCSDT">{date}</div>
                            <div className="infoCSDT">{time}</div>
                        </div>
                        <div className="infoCSR">Ref ID: {refID}</div>
                    </div>

                    <div className="smallBoxCS">
                        <img className="logoReceipt" src={logoReceipt} alt="Receipt" />
                        <div className="infoCS">{slipInfo}</div>

                        <div className="rowHiddenCS">
                            <button  className="buttonCSDW">
                                <div className="buttonInfoCS">
                                    {buttonDownload}
                                </div>
                            </button>
                            <button  className="buttonCSDO" onClick={handleDone}>
                                <div className="buttonInfoCS">
                                    {buttonDone}
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Complete;