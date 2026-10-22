import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  Stack,
  IconButton,
  Box,
  Typography,
  Button,
  DialogTitle,
  DialogContentText,
  DialogActions,
  Tooltip,
  Fade,
  TextField,
} from "@mui/material";
import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import KeyRoundedIcon from "@mui/icons-material/KeyRounded";

const MediaLightboxModal = ({
  selectedMedia,
  currentIndex,
  totalCount,
  currentGuestSessionId,
  onClose,
  onNext,
  onPrev,
  onDownload,
  onDelete,
}) => {
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [pinDialogOpen, setPinDialogOpen] = useState(false);
  const [pinCode, setPinCode] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const isOpen = Boolean(selectedMedia);
  const hasPrev = currentIndex !== null && currentIndex > 0;
  const hasNext = currentIndex !== null && currentIndex < totalCount - 1;

  const isMyMedia =
    Boolean(selectedMedia) &&
    selectedMedia.guestSessionId === currentGuestSessionId;

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen || confirmDeleteOpen || pinDialogOpen) return;
      if (e.key === "ArrowLeft" && hasPrev) onPrev();
      if (e.key === "ArrowRight" && hasNext) onNext();
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    isOpen,
    hasPrev,
    hasNext,
    onPrev,
    onNext,
    onClose,
    confirmDeleteOpen,
    pinDialogOpen,
  ]);

  const handleDeleteClick = () => {
    if (isMyMedia) {
      setConfirmDeleteOpen(true);
    } else {
      setPinCode("");
      setPinDialogOpen(true);
    }
  };

  const handleConfirmMyDelete = async () => {
    if (selectedMedia?.id) {
      setIsDeleting(true);
      try {
        await onDelete(selectedMedia.id);
        setConfirmDeleteOpen(false);
      } catch (err) {
        console.error(err);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const handleConfirmPinDelete = async () => {
    if (!pinCode.trim()) {
      alert("Molimo unesite PIN kod.");
      return;
    }

    if (selectedMedia?.id) {
      setIsDeleting(true);
      try {
        await onDelete(selectedMedia.id, pinCode.trim());
        setPinDialogOpen(false);
        setPinCode("");
      } catch (err) {
        console.error(err);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  return (
    <>
      <Dialog
        open={isOpen}
        onClose={onClose}
        maxWidth="lg"
        fullWidth
        TransitionComponent={Fade}
        transitionDuration={300}
        PaperProps={{
          sx: {
            backgroundColor: "rgba(12, 12, 14, 0.95)",
            backdropFilter: "blur(12px)",
            color: "white",
            position: "relative",
            overflow: "hidden",
            borderRadius: { xs: 0, sm: 4 },
            boxShadow: "0 24px 48px rgba(0, 0, 0, 0.8)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            maxHeight: "90vh",
            m: { xs: 0, sm: 2 },
          },
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            zIndex: 10,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            p: 2,
            background:
              "linear-gradient(to bottom, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 100%)",
          }}
        >
          <Box
            sx={{
              px: 1.5,
              py: 0.5,
              borderRadius: 3,
              backgroundColor: "rgba(255, 255, 255, 0.12)",
              backdropFilter: "blur(8px)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
            }}
          >
            <Typography
              variant="caption"
              sx={{
                color: "rgba(255, 255, 255, 0.9)",
                fontWeight: 600,
                letterSpacing: 0.5,
              }}
            >
              {currentIndex !== null
                ? `${currentIndex + 1} / ${totalCount}`
                : ""}
            </Typography>
          </Box>

          <Stack direction="row" spacing={1}>
            <Tooltip title="Preuzmi" arrow placement="bottom">
              <IconButton
                onClick={() =>
                  onDownload(
                    selectedMedia?.fileUrl,
                    `medij-${selectedMedia?.id || "download"}`,
                  )
                }
                aria-label="Preuzmi medij"
                sx={{
                  color: "white",
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                  backdropFilter: "blur(8px)",
                  transition: "all 0.2s",
                  "&:hover": {
                    backgroundColor: "rgba(255, 255, 255, 0.25)",
                    transform: "translateY(-1px)",
                  },
                }}
              >
                <DownloadRoundedIcon />
              </IconButton>
            </Tooltip>

            <Tooltip title="Obriši" arrow placement="bottom">
              <IconButton
                onClick={handleDeleteClick}
                aria-label="Obriši medij"
                sx={{
                  color: "#f87171",
                  backgroundColor: "rgba(248, 113, 113, 0.12)",
                  backdropFilter: "blur(8px)",
                  transition: "all 0.2s",
                  "&:hover": {
                    backgroundColor: "rgba(248, 113, 113, 0.25)",
                    transform: "translateY(-1px)",
                  },
                }}
              >
                <DeleteOutlineRoundedIcon />
              </IconButton>
            </Tooltip>

            <Tooltip title="Zatvori (Esc)" arrow placement="bottom">
              <IconButton
                onClick={onClose}
                aria-label="Zatvori"
                sx={{
                  color: "white",
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                  backdropFilter: "blur(8px)",
                  transition: "all 0.2s",
                  "&:hover": {
                    backgroundColor: "rgba(255, 255, 255, 0.25)",
                    transform: "translateY(-1px)",
                  },
                }}
              >
                <CloseRoundedIcon />
              </IconButton>
            </Tooltip>
          </Stack>
        </Box>

        {hasPrev && (
          <IconButton
            onClick={onPrev}
            sx={{
              position: "absolute",
              left: 16,
              top: "50%",
              transform: "translateY(-50%)",
              zIndex: 10,
              color: "white",
              backgroundColor: "rgba(0, 0, 0, 0.4)",
              backdropFilter: "blur(8px)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              transition: "all 0.2s ease-in-out",
              "&:hover": {
                backgroundColor: "rgba(0, 0, 0, 0.7)",
                transform: "translateY(-50%) scale(1.08)",
              },
            }}
          >
            <ChevronLeftRoundedIcon sx={{ fontSize: 32 }} />
          </IconButton>
        )}

        {hasNext && (
          <IconButton
            onClick={onNext}
            sx={{
              position: "absolute",
              right: 16,
              top: "50%",
              transform: "translateY(-50%)",
              zIndex: 10,
              color: "white",
              backgroundColor: "rgba(0, 0, 0, 0.4)",
              backdropFilter: "blur(8px)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              transition: "all 0.2s ease-in-out",
              "&:hover": {
                backgroundColor: "rgba(0, 0, 0, 0.7)",
                transform: "translateY(-50%) scale(1.08)",
              },
            }}
          >
            <ChevronRightRoundedIcon sx={{ fontSize: 32 }} />
          </IconButton>
        )}

        <DialogContent
          sx={{
            p: 0,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: { xs: 320, md: 500 },
            backgroundColor: "transparent",
            position: "relative",
          }}
        >
          {selectedMedia?.fileType === "VIDEO" ? (
            <Box
              key={selectedMedia?.fileUrl}
              component="video"
              src={selectedMedia?.fileUrl}
              controls
              autoPlay
              sx={{
                width: "100%",
                maxHeight: "78vh",
                objectFit: "contain",
                outline: "none",
              }}
            />
          ) : (
            <Box
              key={selectedMedia?.fileUrl}
              component="img"
              src={selectedMedia?.fileUrl}
              alt="Slika u punoj veličini"
              sx={{
                width: "100%",
                maxHeight: "78vh",
                objectFit: "contain",
                userSelect: "none",
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      <Dialog
        open={confirmDeleteOpen}
        onClose={() => setConfirmDeleteOpen(false)}
        TransitionComponent={Fade}
        PaperProps={{
          sx: {
            borderRadius: 4,
            p: 1.5,
            maxWidth: 420,
            backgroundColor: "#ffffff",
            color: "#0f172a",
            boxShadow:
              "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
            border: "1px solid rgba(226, 232, 240, 0.8)",
          },
        }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            fontWeight: 700,
            fontSize: "1.2rem",
            color: "#ef4444",
            fontFamily: "NunitoVariableFont, sans-serif",
            pb: 1,
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 40,
              height: 40,
              borderRadius: "50%",
              backgroundColor: "#fef2f2",
            }}
          >
            <WarningAmberRoundedIcon sx={{ color: "#ef4444" }} />
          </Box>
          Brisanje uspomene
        </DialogTitle>
        <DialogContent sx={{ pt: 1 }}>
          <DialogContentText
            sx={{
              color: "#64748b",
              fontFamily: "NunitoVariableFont, sans-serif",
              fontWeight: 600,
              fontSize: "0.95rem",
              lineHeight: 1.5,
            }}
          >
            Da li ste sigurni da želite da obrišete vašu uspomenu? Ova akcija je
            trajna i ne može se poništiti.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2, pt: 2, gap: 1 }}>
          <Button
            onClick={() => setConfirmDeleteOpen(false)}
            variant="text"
            disabled={isDeleting}
            sx={{
              color: "#64748b",
              borderRadius: 2.5,
              fontWeight: 700,
              textTransform: "none",
              fontFamily: "NunitoVariableFont, sans-serif",
              px: 2,
              "&:hover": {
                backgroundColor: "#f1f5f9",
                color: "#0f172a",
              },
            }}
          >
            Otkaži
          </Button>
          <Button
            onClick={handleConfirmMyDelete}
            variant="contained"
            color="error"
            disabled={isDeleting}
            disableElevation
            sx={{
              borderRadius: 2.5,
              fontWeight: 700,
              px: 3,
              py: 1,
              textTransform: "none",
              fontFamily: "NunitoVariableFont, sans-serif",
              backgroundColor: "#ef4444",
              "&:hover": {
                backgroundColor: "#dc2626",
              },
            }}
          >
            {isDeleting ? "Brisanje..." : "Obriši"}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={pinDialogOpen}
        onClose={() => setPinDialogOpen(false)}
        TransitionComponent={Fade}
        PaperProps={{
          sx: {
            borderRadius: 4,
            p: 1.5,
            maxWidth: 420,
            backgroundColor: "#ffffff",
            color: "#0f172a",
            boxShadow:
              "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
            border: "1px solid rgba(226, 232, 240, 0.8)",
          },
        }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            fontWeight: 700,
            fontSize: "1.2rem",
            color: "#0f172a",
            fontFamily: "NunitoVariableFont, sans-serif",
            pb: 1,
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 40,
              height: 40,
              borderRadius: "50%",
              backgroundColor: "#f1f5f9",
            }}
          >
            <KeyRoundedIcon sx={{ color: "#0f172a" }} />
          </Box>
          Autorizacija brisanja
        </DialogTitle>
        <DialogContent sx={{ pt: 1 }}>
          <DialogContentText
            sx={{
              color: "#64748b",
              fontFamily: "NunitoVariableFont, sans-serif",
              fontWeight: 600,
              fontSize: "0.95rem",
              lineHeight: 1.5,
              mb: 2.5,
            }}
          >
            Unesite PIN kod događaja da biste potvrdili brisanje:
          </DialogContentText>
          <TextField
            autoFocus
            fullWidth
            type="password"
            placeholder="Unesite PIN kod"
            value={pinCode}
            onChange={(e) => setPinCode(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleConfirmPinDelete();
            }}
            sx={{
              input: {
                color: "#0f172a",
                fontFamily: "NunitoVariableFont, sans-serif",
                fontWeight: 700,
                letterSpacing: "0.1em",
              },
              "& .MuiOutlinedInput-root": {
                borderRadius: 3,
                backgroundColor: "#f8fafc",
                "& fieldset": { borderColor: "#e2e8f0" },
                "&:hover fieldset": { borderColor: "#cbd5e1" },
                "&.Mui-focused fieldset": { borderColor: "#0f172a" },
              },
            }}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2, pt: 1, gap: 1 }}>
          <Button
            onClick={() => setPinDialogOpen(false)}
            variant="text"
            disabled={isDeleting}
            sx={{
              color: "#64748b",
              borderRadius: 2.5,
              fontWeight: 700,
              textTransform: "none",
              fontFamily: "NunitoVariableFont, sans-serif",
              px: 2,
              "&:hover": {
                backgroundColor: "#f1f5f9",
                color: "#0f172a",
              },
            }}
          >
            Otkaži
          </Button>
          <Button
            onClick={handleConfirmPinDelete}
            variant="contained"
            disabled={isDeleting}
            disableElevation
            sx={{
              borderRadius: 2.5,
              fontWeight: 700,
              px: 3,
              py: 1,
              textTransform: "none",
              fontFamily: "NunitoVariableFont, sans-serif",
              backgroundColor: "#0f172a",
              color: "#ffffff",
              "&:hover": {
                backgroundColor: "#1e293b",
              },
            }}
          >
            {isDeleting ? "Brisanje..." : "Potvrdi i obriši"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default MediaLightboxModal;
