import React, { useState, useEffect } from "react";
import "./dryer.css"
import { useLocation } from 'react-router-dom';

import logoDryer from "../../../assets/dryer.png"

import enLocale from "./locale.en.json"
import Header from "../../Header/header";
import NavBarAdmin from "../../NavBar/navAdmin";
import SuccessDialog from "../../Dialog/success";

//Database
import { auth, db } from "../../firebase";
import { doc, getDoc, addDoc, updateDoc, collection, where, getDocs, query } from "firebase/firestore";

function DryerDetails (props) {

    const [selectedStatus, setSelectedStatus] = useState("");
    const [gasValue, setGas] = useState("");
    const [statusValue, setStatus] = useState("");
    const [error, setError] = useState("")

    const [success, setSuccess] = useState(false); // add success state

    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogMessage, setDialogMessage] = useState(""); // Custom dialog message
    const [titleMessage, setTitleMessage] = useState(""); // Custom dialog message

    const location = useLocation();
    const { machine } = location.state;

    const {
        title = enLocale.title,
        subtitle1 = enLocale.subtitle1,
        selectMachine = enLocale.selectMachine,
        status = enLocale.status,
        gas = enLocale.gas,
        updateMachine = enLocale.updateMachine,
    } = props;

    const fetchData = async () => {
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
                    setStatus(machineData.status);
                    setGas(machineData.gas);
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


    const handleStatusChange = (event) => {
        const selectedValue = event.target.value;
        setSelectedStatus(selectedValue);
    };

    const handleUpdateMachine = async () => {
        try {
            // Fetch the machine document based on its name
            const machinesCollectionRef = collection(db, "machines");
            const q = query(machinesCollectionRef, where("name", "==", machine.name));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                // Assume there is only one machine document with the given name
                const machineDocRef = querySnapshot.docs[0].ref;

                // Update the machine's status and gas values in the database
                await updateDoc(machineDocRef, {
                    status: selectedStatus,
                    gas: gasValue,
                });

                console.log("Machine updated successfully!");
                setSuccess(true);
                setDialogMessage("Machine Updated Successfully"); // Set custom dialog message
                setTitleMessage("Machine Update");
                setDialogOpen(true);
            } else {
                console.log("Machine not found!");
                setError("Machine not found.");
            }
        } catch (error) {
            console.log(error);
            setError("Failed to update machine information.");
        }
    };

    const closeDialog = () => {
        setDialogOpen(false);
    };
    

    return (
        <div className="container-center-horizontal">
            <div className="dryerSelected screen">
                <div className="dryerSelected-1">
                    <Header title={title} />

                    <h1 className="subtitle1">{subtitle1}</h1>

                    <div className="smallBoxDS">
                        <div className="selectMachine">{selectMachine}</div>

                        <div className="rowHiddenDS">
                            <div className="columnHiddenDS-1">
                                <img className="logoDryerDS" src={logoDryer} alt="Dryer" />
                                <div className="machineName">DM1</div>
                            </div>

                            <div className="columnHidden">
                                <div className="statusDD">
                                    <label>{status}</label>
                                    <select value={selectedStatus} onChange={handleStatusChange}>
                                        <option value="">{statusValue}</option>
                                        <option value="Available">Available</option>
                                        <option value="Maintenance">Maintenance</option>
                                    </select>
                                </div>
                                

                                <div class="gasDD">
                                    <label>{gas}</label>
                                    <input
                                        type="text"
                                        value={gasValue}
                                        onChange={(event) => setGas(event.target.value)}
                                    />
                                </div>

                            </div>  
                        </div>
                        
                        <button className="buttonStart" onClick={handleUpdateMachine}>
                            <div className="buttonInfoDS">{updateMachine}</div>
                        </button>                     
                    </div>

                    <NavBarAdmin/>
                </div>
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

export default DryerDetails;