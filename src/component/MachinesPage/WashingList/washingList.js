import React, { useState, useEffect } from "react";
import "./washingList.css"
import { useNavigate } from "react-router-dom";

import logoWashing from "../../../assets/washing.png"

import enLocale from "./locale.en.json"
import Header from "../../Header/header";
import NavBar from "../../NavBar/nav";

//Database
import { db, auth } from "../../firebase";
import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";

function WashingList (props) {

    const [machineList, setMachineList] = useState([]);
    const [userRoles, setUserRole] = useState("");
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
          const querySnapshot = await getDocs(query(machinesCollectionRef, where("type", "==", "Washing")));
          const machinesData = querySnapshot.docs.map((doc) => doc.data());
          setMachineList(machinesData);
        } catch (error) {
          console.log("Fetch Machine Data Error:", error);
          setError("Failed to fetch machine data.");
        }
    };

    const fetchUserRole = async () => {
        try {
            const user = auth.currentUser;
          if (user) {
            const userDocRef = doc(db, "users", user.uid);
            const userDocSnap = await getDoc(userDocRef);
            if (userDocSnap.exists()) {
              const userData = userDocSnap.data();
              setUserRole(userData.roles);
            }
          }
        } catch (error) {
          console.log("Fetch User Role Error:", error);
          setError("Failed to fetch user role.");
        }
    };
      
    useEffect(() => {
        fetchMachineData();
        fetchUserRole();
    }, []);

    // Sort the machine names in ascending order
    const sortedMachineList = machineList.sort((a, b) => {
        const nameA = parseInt(a.name.replace("WM", ""));
        const nameB = parseInt(b.name.replace("WM", ""));
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
        navigate("/washing", { state: { machine: machine } });
    };
      
    return (
        <div className="container-center-horizontal">
            <div className="washingList screen">
                <div className="washingList-1">
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

export default WashingList;