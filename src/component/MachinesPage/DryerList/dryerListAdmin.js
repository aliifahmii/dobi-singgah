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
import NavBarAdmin from "../../NavBar/navAdmin";

function DryerListAdmin (props) {

    const [machineList, setMachineList] = useState([]);
    const [error, setError] = useState("")
    const navigate = useNavigate();

    const {
        title = enLocale.title,
        subtitle1 = enLocale.subtitle1,
        selectMachine = enLocale.selectMachine,
        addMachine = enLocale.addMachine,
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
        // Navigate to the `/dryer` route and pass the machine data as a prop
        navigate("/dryerDetails", { state: { machine: machine } });
    };

    const handleAddMachine = () => {
        navigate("/addMachines_admin")
    }
      
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
                            <div className="rowHiddenWL" key={rowIndex}>
                                {row.map((machine) => (
                                    <button 
                                        className="washingButtonWL" 
                                        key={machine.name} 
                                        onClick={() => handleMachineClick(machine)}>
                                    <div>
                                        <img className="logoWashingWL" src={logoWashing} alt="Washing Machine" />
                                        <div className="buttonInfoDL">{machine.name}</div>
                                        <div className="timerWL">Gas: {machine.gas}%</div>
                                        <div className="estTime">Status: {machine.status}</div>
                                    </div>
                                    </button>
                                ))}
                            </div>
                        ))}

                        <button className="buttonViewHA" onClick={handleAddMachine}>
                            <div className="buttonInfoViewHA">
                                {addMachine}
                            </div>
                        </button>

                        
                    </div>



                    <NavBarAdmin />
                </div>
            </div>
        </div>
    );
}

export default DryerListAdmin;