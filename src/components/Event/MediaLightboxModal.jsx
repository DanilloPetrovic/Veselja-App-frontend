import { useEffect } from "react";
import {
  Dialog,
  DialogContent,
  Stack,
  IconButton,
  Box,
  Typography,
} from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import CloseIcon from "@mui/icons-material/Close";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

const MediaLightboxModal = ({
  selectedMedia,
  currentIndex,
  totalCount,
  onClose,
  onNext,
  onPrev,
  onDownload,
}) => {
  const isOpen = Boolean(selectedMedia);
  const hasPrev = currentIndex !== null && currentIndex > 0;
  const hasNext = currentIndex !== null && currentIndex < totalCount - 1;

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;
      if (e.key === "ArrowLeft" && hasPrev) onPrev();
      if (e.key === "ArrowRight" && hasNext) onNext();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, hasPrev, hasNext, onPrev, onNext]);

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          backgroundColor: "black",
          color: "white",
          position: "relative",
          overflow: "hidden",
        },
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: 12,
          left: 16,
          zIndex: 10,
        }}
      >
        <Typography
          variant="body2"
          sx={{ color: "rgba(255,255,255,0.8)", fontWeight: 600 }}
        >
          {currentIndex !== null ? `${currentIndex + 1} / ${totalCount}` : ""}
        </Typography>
      </Box>

      <Stack
        direction="row"
        spacing={1}
        sx={{
          position: "absolute",
          top: 12,
          right: 12,
          zIndex: 10,
        }}
      >
        <IconButton
          onClick={() =>
            onDownload(
              selectedMedia?.fileUrl,
              `medij-${selectedMedia?.id || "download"}`,
            )
          }
          aria-label="Skini medij"
          sx={{
            color: "white",
            backgroundColor: "rgba(0,0,0,0.5)",
            "&:hover": { backgroundColor: "rgba(0,0,0,0.7)" },
          }}
        >
          <DownloadIcon />
        </IconButton>

        <IconButton
          onClick={onClose}
          aria-label="Zatvori"
          sx={{
            color: "white",
            backgroundColor: "rgba(0,0,0,0.5)",
            "&:hover": { backgroundColor: "rgba(0,0,0,0.7)" },
          }}
        >
          <CloseIcon />
        </IconButton>
      </Stack>

      {hasPrev && (
        <IconButton
          onClick={onPrev}
          sx={{
            position: "absolute",
            left: 12,
            top: "50%",
            transform: "translateY(-50%)",
            zIndex: 10,
            color: "white",
            backgroundColor: "rgba(0, 0, 0, 0.4)",
            "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.7)" },
          }}
        >
          <ChevronLeftIcon sx={{ fontSize: 36 }} />
        </IconButton>
      )}

      {hasNext && (
        <IconButton
          onClick={onNext}
          sx={{
            position: "absolute",
            right: 12,
            top: "50%",
            transform: "translateY(-50%)",
            zIndex: 10,
            color: "white",
            backgroundColor: "rgba(0, 0, 0, 0.4)",
            "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.7)" },
          }}
        >
          <ChevronRightIcon sx={{ fontSize: 36 }} />
        </IconButton>
      )}

      <DialogContent
        sx={{
          p: 0,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: 300,
        }}
      >
        {selectedMedia?.fileType === "VIDEO" ? (
          <Box
            key={selectedMedia?.fileUrl}
            component="video"
            src={selectedMedia?.fileUrl}
            controls
            autoPlay
            sx={{ width: "100%", maxHeight: "80vh", objectFit: "contain" }}
          />
        ) : (
          <Box
            key={selectedMedia?.fileUrl}
            component="img"
            src={selectedMedia?.fileUrl}
            alt="Slika u punoj veličini"
            sx={{ width: "100%", maxHeight: "80vh", objectFit: "contain" }}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default MediaLightboxModal;
