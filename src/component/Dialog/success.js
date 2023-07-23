import React from "react";
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';


function SuccessDialog({ open, onClose, message, titleMessage }) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle fontWeight={700} fontFamily="Outfit">{titleMessage}</DialogTitle>
      
      <DialogContent>
        <DialogContentText fontWeight={400} fontFamily="Outfit">
          {message}
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

export default SuccessDialog;
