import React from "react";
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';

import "./register.css"

function RegistrationSuccessDialog({ open, onClose }) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle fontWeight={700} fontFamily="Outfit">Registration Successful</DialogTitle>
      
      <DialogContent>
        <DialogContentText fontWeight={400} fontFamily="Outfit">
          Congratulations! You have successfully registered.
        </DialogContentText>
      </DialogContent>
      
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default RegistrationSuccessDialog;
