import React from "react";
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';


function ConfirmDialog({ open, onClose, message, titleMessage, onSuccess }) {
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
          Cancel
        </Button>
        {onSuccess && (
          <Button onClick={onSuccess} color="primary" autoFocus>
            Confirm
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}

export default ConfirmDialog;
