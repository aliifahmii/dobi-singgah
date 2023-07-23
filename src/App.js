import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Login from './component/LoginPage/login';
import Register from './component/RegisterPage/register';
import Profile from './component/ProfilePage/profile';
import Wallet from './component/WalletPage/wallet';
import Topup from './component/TopupPage/topup';
import Visa from './component/PaymentPage/VisaPage/visa';
import FPX from './component/PaymentPage/FPXPage/fpx';
import TNG from './component/PaymentPage/TnGPage/tng';
import Shopee from './component/PaymentPage/ShopeePage/shopee';
import Grab from './component/PaymentPage/GrabPage/grab';
import Boost from './component/PaymentPage/BoostPage/boost';
import Complete from './component/CompleteTransactionPage/complete';
import Home from './component/HomePage/home';
import Washing from './component/MachinesPage/WashingSelected/washing';
import WashingList from './component/MachinesPage/WashingList/washingList';
import DryerList from './component/MachinesPage/DryerList/dryerList';
import Dryer from './component/MachinesPage/DryerSelected/dryer';
import Receipt from './component/ReceiptTemplateToken/receipt';
import History from './component/HistoryPage/history';
import HistoryOrders from './component/HistoryPage/historyOrders';


import HomeAdmin from './component/Admin/Home/homeAdmin';
import Machines from './component/Admin/Add Machine/addMachine';
import WashingListAdmin from './component/MachinesPage/WashingList/washingList_admin';
import DryerListAdmin from './component/MachinesPage/DryerList/dryerListAdmin';
import DryerDetails from './component/MachinesPage/DryerSelected/dryerDetails';
import WashingDetails from './component/MachinesPage/WashingSelected/washingDetails';
import ProfileAdmin from './component/ProfilePage/profileAdmin';

import Scanner from './component/QR Scanner/scanner';
import ForgotPwd from './component/LoginPage/forgot';


function App() {
  return (
    <>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />}/>
        <Route path="/washing" element={<Washing />}/>
        <Route path="/washingList" element={<WashingList />}/>
        <Route path="/dryerList" element={<DryerList />}/>
        <Route path="/dryer" element={<Dryer />}/>
        <Route path="/profile" element={<Profile />}/>
        <Route path="/wallet" element={<Wallet />}/>
        <Route path="/topup" element={<Topup />}/>
        <Route path="/visa" element={<Visa />}/>
        <Route path="/fpx" element={<FPX />}/>
        <Route path="/tng" element={<TNG />}/>
        <Route path="/shopee" element={<Shopee />}/>
        <Route path="/grab" element={<Grab />}/>
        <Route path="/boost" element={<Boost />}/>
        <Route path="/complete" element={<Complete />}/>
        <Route path="/receipt" element={<Receipt />}/>
        <Route path="/history" element={<History />}/>
        <Route path="/historyOrders" element={<HistoryOrders />}/>

        <Route path="/home_admin" element={<HomeAdmin />}/>
        <Route path="/profileAdmin" element={<ProfileAdmin />}/>
        <Route path="/addMachines_admin" element={<Machines />}/>
        <Route path="/washingListAdmin" element={<WashingListAdmin />}/>
        <Route path="/washingDetails" element={<WashingDetails />}/>
        <Route path="/dryerListAdmin" element={<DryerListAdmin />}/>
        <Route path="/dryerDetails" element={<DryerDetails />}/>
        

        <Route path="/scanner" element={<Scanner />}/>
        <Route path="/forgotPwd" element={<ForgotPwd />}/>
      </Routes>
    </BrowserRouter>
    
    </>
  );
}

export default App;
