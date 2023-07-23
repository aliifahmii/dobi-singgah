import React, { useState, useEffect } from "react";
import "./dryerList.css"
import { useNavigate } from "react-router-dom";

import logoWashing from "../../../assets/dryer.png"

import enLocale from "./locale.en.json"
import Header from "../../Header/header";
import NavBar from "../../NavBar/nav";

//Database
import { db } from "../../firebase";
import { collection, doc, getDocs, query, where } from "firebase/firestore";

function DryerList (props) {

    const [machineList, setMachineList] = useState([]);
    const [error, setError] = useState("")
    const navigate = useNavigate();

    const {
        title = enLocale.title,
        subtitle1 = enLocale.subtitle1,
        selectMachine = enLocale.selectMachine,
    } = props;

    const fetchMachineData = async () => {
        try {
          const machinesCollectionRef = collection(db, "machines");
          const querySnapshot = await getDocs(query(machinesCollectionRef, where("type", "==", "Dryer")));
          const machinesData = querySnapshot.docs.map((doc) => doc.data());
          setMachineList(machinesData);
        } catch (error) {
          console.log("Fetch Machine Data Error:", error);
          setError("Failed to fetch machine data.");
        }
    };
      
    useEffect(() => {
        fetchMachineData();
    }, []);

    // Sort the machine names in ascending order
    const sortedMachineList = machineList.sort((a, b) => {
        const nameA = parseInt(a.name.replace("DM", ""));
        const nameB = parseInt(b.name.replace("DM", ""));
        return nameA - nameB;
    });

    // Calculate the number of rows
    const numRows = Math.ceil(sortedMachineList.length / 2);

    // Create an array of rows, each containing two machines
    const machineRows = Array.from({ length: numRows }, (_, index) =>
        sortedMachineList.slice(index * 2, index * 2 + 2)
    );

    const handleMachineClick = (machine) => {
        if (machine.status === "In Use") {
            // Machine is in use, do not navigate or perform any action
            return;
        } else if (machine.status === "Maintenance") {
            // Machine is in use, do not navigate or perform any action
            return;
        }
      
        // Navigate to the `/dryer` route and pass the machine data as a prop
        navigate("/dryer", { state: { machine: machine } });
      };
      
    return (
        <div className="container-center-horizontal">
            <div className="dryerList screen">
                <div className="dryerList-1">
                    <Header title={title} />

                    <h1 className="subtitle1">{subtitle1}</h1>

                    <div className="smallBoxWS">
                        <div className="selectMachine">{selectMachine}</div>
                        {/* Render the machine buttons in rows */}
                        {machineRows.map((row, rowIndex) => (
                            <div className="rowHiddenDL" key={rowIndex}>
                                {row.map((machine) => (
                                    <button 
                                        className="washingButtonDL" 
                                        key={machine.name} 
                                        onClick={() => handleMachineClick(machine)}>
                                    <div>
                                        <img className="logoWashingDL" src={logoWashing} alt="Dryer Machine" />
                                        <div className="buttonInfoWL">{machine.name}</div>
                                        <div className="timerWL">{machine.status}</div>
                                        <div className="estTime">Est Time:{machine.etaTime}</div>
                                    </div>
                                    </button>
                                ))}
                            </div>
                        ))}
                    </div>

                    <NavBar />
                </div>
            </div>
        </div>
    );
}

export default DryerList;