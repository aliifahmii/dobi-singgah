import React, { useState, useRef } from 'react';
import { Container, Card, CardContent, makeStyles, Grid, TextField, Button } from '@material-ui/core';
import QRCode from 'qrcode';
import { QrReader } from 'react-qr-reader';


function Scanner() {
    const [text, setText] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [scanResultFile, setScanResultFile] = useState('');
    const [scanResultWebCam, setScanResultWebCam] = useState('');
    
    const qrRef = useRef(null);


    const generateQrCode = async () => {
        try {
            const response = await QRCode.toDataURL(text);
            setImageUrl(response);
        } catch (error) {
            console.log(error);
        }
    }
    const handleErrorFile = (error) => {
        console.log(error);
    }
    const handleScanFile = (result) => {
        if (result) {
            setScanResultFile(result);
        }
    }
    const onScanFile = () => {
        qrRef.current.openImageDialog();
    }
    const handleErrorWebCam = (error) => {
        console.log(error);
    }
    const handleScanWebCam = (result) => {
        if (result) {
            setScanResultWebCam(result);
        }
    }
    return (
        
        
        <div className="container-center-horizontal">
        <div className="receipt screen">
            <div className="receipt-1">
                
                

                
                            <h1 className="TitleSalesInfo">Qr Code Scan</h1>
                            <QrReader
                                delay={300}
                                style={{ width: '100%' }}
                                onError={handleErrorWebCam}
                                onScan={handleScanWebCam}
                            />
                            
                        </div>
                        </div>
                        </div>
    );
}

export default Scanner;