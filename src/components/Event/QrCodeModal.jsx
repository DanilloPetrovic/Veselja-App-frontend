import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Box,
  Button,
  Zoom,
} from "@mui/material";
import React from "react";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Zoom ref={ref} {...props} />;
});

const QrCodeModal = ({ open, onClose, event }) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      TransitionComponent={Transition}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 4,
          p: 1.5,
          boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
        },
      }}
    >
      <DialogTitle
        sx={{
          textAlign: "center",
          fontWeight: 700,
          pt: 2,
          pb: 1,
          fontFamily: "NunitoVariableFont, sans-serif",
          color: "#0f172a",
        }}
      >
        {event?.title || "QR Kod Događaja"}
      </DialogTitle>

      <DialogContent
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 2.5,
          py: 2,
        }}
      >
        <Typography
          variant="body2"
          sx={{
            color: "#64748b",
            textAlign: "center",
            fontFamily: "NunitoVariableFont, sans-serif",
          }}
        >
          Skenirajte QR kod mobilnim telefonom za brz pristup događaju!
        </Typography>

        {event?.qrCodeUrl ? (
          <Box
            sx={{
              p: 2,
              backgroundColor: "#ffffff",
              borderRadius: 3,
              boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
              border: "1px solid #f1f5f9",
            }}
          >
            <Box
              component="img"
              src={event.qrCodeUrl}
              alt="QR Kod događaja"
              sx={{
                width: 200,
                height: 200,
                display: "block",
              }}
            />
          </Box>
        ) : (
          <Typography variant="body2" color="error">
            QR kod trenutno nije dostupan.
          </Typography>
        )}
      </DialogContent>

      <DialogActions sx={{ justifyContent: "center", pb: 2, pt: 0 }}>
        <Button
          variant="contained"
          onClick={onClose}
          disableElevation
          sx={{
            backgroundColor: "#0f172a",
            color: "#ffffff",
            "&:hover": { backgroundColor: "#1e293b" },
            textTransform: "none",
            px: 4,
            py: 1,
            borderRadius: 2.5,
            fontWeight: 600,
            fontFamily: "NunitoVariableFont, sans-serif",
          }}
        >
          Zatvori
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default QrCodeModal;
