import React from "react";
import "./receipt.css";

import logoDobi from "../../assets/logoDobi.png"
import enLocale from "./locale.en.json"
import { useLocation, useNavigate } from "react-router-dom";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

//Database
import { auth, db } from "../firebase";
import { collection, addDoc, setDoc, doc, updateDoc, getDoc } from "firebase/firestore";
import { getDownloadURL, getStorage, ref, uploadString, uploadBytes } from "firebase/storage";
import { storage } from "../firebase";


function Receipt(props) {

    const navigate = useNavigate();
    const location = useLocation();
    const { amount, date, time, refID, method} = location.state;

    const{
        successful = enLocale.succesful,
        thankYou = enLocale.thankYou,
        here = enLocale.here,
        referenceID = enLocale.referenceID,
        benefiaciaryName = enLocale.benefiaciaryName,
        dobiSinggah = enLocale.dobiSinggah,
        recepientRef = enLocale.recepientRef,
        receiptInfo = enLocale.receiptInfo,
        paymentDetails = enLocale.paymentDetails,
        paymentInfo = enLocale.paymentInfo,
        amountDetails = enLocale.amountDetails,
        note = enLocale.note,
        noteInfo = enLocale.noteInfo,
        buttonDownload = enLocale.buttonDownload,
        buttonDone = enLocale.buttonDone
    } = props;

    const downloadPDF = async () => {
        const receiptContainer = document.getElementById("receipt-container");
        if (!receiptContainer) return;
    
        try {
          const canvas = await html2canvas(receiptContainer);
          const dataURL = canvas.toDataURL("image/jpeg");
    
          // Convert image to PDF
          const pdf = new jsPDF();
          pdf.addImage(dataURL, "JPEG", 45, 0);
          pdf.save("receipt_topup.pdf");
        } catch (error) {
          console.log("Error generating PDF:", error);
        }
    };

    const generatePDF = async () => {
        const receiptContainer = document.getElementById("receipt-container");
        if (!receiptContainer) return;
    
        try {
            const canvas = await html2canvas(receiptContainer);
            const dataURL = canvas.toDataURL("image/jpeg");
    
            // Convert image to PDF
            const pdf = new jsPDF();
            pdf.addImage(dataURL, "JPEG", 45, 0);
    
            const pdfData = pdf.output("blob");

            // Upload PDF to Firebase Storage
            const pdfFilename = `receipt/receipt_topup_${refID}.pdf`;
            const pdfStorageRef = ref(storage, pdfFilename);
            await uploadBytes(pdfStorageRef, pdfData);
    
            console.log("PDF uploaded successfully.");

            // Get the download URL of the uploaded PDF
            const downloadURL = await getDownloadURL(pdfStorageRef);

            // Update table transactions in Firestore
            const transactionRef = doc(db, "transactions", refID);
            await updateDoc(transactionRef, {
            receiptURL: downloadURL,
        });

            console.log("Receipt URL updated in table transactions.");
            navigate("/wallet")
        } catch (error) {
            console.log("Error generating PDF or uploading to Firebase Storage:", error);
            console.log("Full error object:", error?.serverResponse); // Log the full error object
        }
    };

    return (
        <div className="container-center-horizontal">
            <div className="receipt screen">
                <div className="receipt-1">
                    <div className="smallBoxRT" id="receipt-container">
                        <img className="logoDobi" src={logoDobi} alt="Logo Dobi" />
                        <div className="successful">{successful}</div>
                        <div className="thankYou">{thankYou}</div>
                        <div className="regular">{here}</div>
                        <div className="line"></div>
                        <div className="regular1">{referenceID}</div>
                        <div className="bold">{refID}</div>
                        <div className="regular">{date} {time}</div>
                        <div className="line"></div>
                        <div className="regular1">{benefiaciaryName}</div>
                        <div className="bold">{dobiSinggah}</div>
                        <div className="line"></div>
                        <div className="regular1">{recepientRef}</div>
                        <div className="bold">{receiptInfo}</div>
                        <div className="line"></div>
                        <div className="regular1">{paymentDetails}</div>
                        <div className="bold">{paymentInfo} ( {method} )</div>
                        <div className="line"></div>
                        <div className="regular1">{amountDetails}</div>
                        <div className="bold">RM {amount}.00</div>
                        <div className="line"></div>
                        <div className="regular1">{note}</div>
                        <div className="regular">{noteInfo}</div>
                    </div>

                    <div className="rowHiddenRT">
                        <button  className="buttonRTDW" onClick={downloadPDF}>
                            <div className="buttonInfoRT">
                                {buttonDownload}
                            </div>
                        </button>
                        <button  className="buttonRTDO" onClick={generatePDF}>
                            <div className="buttonInfoRT">
                                {buttonDone}
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Receipt;