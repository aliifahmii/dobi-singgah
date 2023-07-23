import React, { useState, useRef } from "react";
import "./addMachine.css";

import enLocale from "./locale.en.json";
import Header from "../../Header/header";
import NavBarAdmin from "../../NavBar/navAdmin";
import SuccessDialog from "../../Dialog/success";

import  QRCode  from "qrcode";

import html2canvas from "html2canvas";
import jsPDF from "jspdf";

//Database
import { collection, addDoc, setDoc, doc, updateDoc, getDocs, query, where } from "firebase/firestore";
import { auth, db } from "../../firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../../firebase";


function Machines (props) {

    const [selectedType, setSelectedType] = useState("");
    const [nameValue, setNameValue] = useState("");
    const [soapValue, setSoapValue] = useState("");
    const [gasValue, setGasValue] = useState("");
    const [machineList, setMachineList] = useState([]);

    const [success, setSuccess] = useState(false); // add success state
    const [error, setError] = useState("");

    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogMessage, setDialogMessage] = useState(""); // Custom dialog message
    const [titleMessage, setTitleMessage] = useState(""); // Custom dialog message

    // Ref for the QR code component
    const qrCodeRef = useRef();

    const{
        title = enLocale.title,
        subtitle = enLocale.subtitle,
        type = enLocale.type,
        name = enLocale.name,
        soap = enLocale.soap,
        gas = enLocale.gas,
        buttonAdd = enLocale.buttonAdd,
        
    } = props;

    const handleTypeChange = (event) => {
        const selectedType = event.target.value;
        setSelectedType(selectedType);
    };

    const handleAddMachine = async () => {
        if (selectedType && nameValue) {
            try {
                const machineData = {
                    etaTime: "",
                    name: nameValue,
                    soap: soapValue || "",
                    gas: gasValue || "",
                    status: "Available",
                    timer: "00:00:00",
                    type: selectedType,
                    userID: "",
                };

                // Add machine data to Firestore collection
                const machineDocRef = await addDoc(collection(db, "machines"), machineData);

                const qrContainer = qrCodeRef.current;
                if (!qrContainer) return;

                const qrCodeLink = `localhost:3000/washing?machineName=${encodeURIComponent(nameValue)}`;

                // Generate QR code image
                const qrCodeDataURL = await QRCode.toDataURL(qrCodeLink);

                // Convert image to PDF
                const pdf = new jsPDF();
                const qrCodeWidth = 200; // Set the desired width of the QR code in the PDF
                const qrCodeHeight = qrCodeWidth; // Set the desired height of the QR code in the PDF

                // Add QR code image to the PDF with scaling
                pdf.addImage(qrCodeDataURL, "JPEG", 10, 20, qrCodeWidth, qrCodeHeight);

                const pdfData = pdf.output("blob");

                // Upload PDF to Firebase Storage
                const pdfFilename = `QRCode/${nameValue}.pdf`;
                const pdfStorageRef = ref(storage, pdfFilename);
                await uploadBytes(pdfStorageRef, pdfData);

                console.log("PDF uploaded successfully.");

                // Get the download URL of the uploaded PDF
                const downloadURL = await getDownloadURL(pdfStorageRef);

                // Update table transactions in Firestore
                await updateDoc(machineDocRef, {
                    qrCodeURL: downloadURL,
                });

                setSuccess(true);
                setDialogMessage("Add Successfully");
                setTitleMessage("Machine Details");
                setDialogOpen(true);

                // Reset form values
                setSelectedType("");
                setNameValue("");
                setSoapValue("");
                setGasValue("");

                console.log("Machine added successfully!");
            } catch (error) {
                console.log("Add Machine Error:", error);
                // Show error message or perform any other necessary action
            }
        }
    };

    const closeDialog = () => {
        setDialogOpen(false);
    };

    return(
        <div className = "container-center-horizontal" >
            <div className="machines screen">
                <div className="machines-1">
                    <Header title={title} />

                    <h1 className="TitleMachineInfo">{subtitle}</h1>
                    <div className="smallBoxAM">
                    <div className="qr-code" ref={qrCodeRef} />

                        <div className="typeAM">
                            <label>{type}</label>
                            <select value={selectedType} onChange={handleTypeChange}>
                                <option value="">Select type</option>
                                <option value="Washing">Washing</option>
                                <option value="Dryer">Dryer</option>
                            </select>
                        </div>

                        <div className="nameAM">
                            <label>{name}</label>
                            <input
                                type="text"
                                placeholder="Please input machine name"
                                value={nameValue}
                                onChange={(event) => setNameValue(event.target.value)}
                            />
                        </div>

                        {selectedType === "Washing" && (
                            <div className="soapAM">
                                <label>{soap}</label>
                                <input
                                    type="text"
                                    placeholder="Please input soap quantity %"
                                    value={soapValue}
                                    onChange={(event) => setSoapValue(event.target.value)}
                                />
                            </div>
                        )}

                        {selectedType === "Dryer" && (
                            <div className="gasAM">
                                <label>{gas}</label>
                                <input
                                    type="text"
                                    placeholder="Please input gas quantity %"
                                    value={gasValue}
                                    onChange={(event) => setGasValue(event.target.value)}
                                />
                            </div>
                        )}

                        <button className="buttonAddAM" onClick={handleAddMachine}>
                            <div className="buttonInfoAddAM">
                                {buttonAdd}
                            </div>
                        </button>

                    </div>
                    
                    <NavBarAdmin />
                </div>
                
                {/* Render the SuccessDialog component */}
                <SuccessDialog
                    open={dialogOpen && success}
                    onClose={closeDialog}
                    message={dialogMessage}
                    titleMessage={titleMessage}
                />
            </div>
        </div>

    );
}

export default Machines;
