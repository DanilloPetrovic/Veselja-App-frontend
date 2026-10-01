import { useState } from "react";
import {
  Card,
  CardContent,
  Box,
  Typography,
  Button,
  Chip,
  CardMedia,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import GetAppIcon from "@mui/icons-material/GetApp";
import DeleteIcon from "@mui/icons-material/Delete";

const EventCard = ({ event, onClick, onDownloadQR, onDeleteEvent }) => {
  const [openConfirm, setOpenConfirm] = useState(false);

  const handleOpenConfirm = (e) => {
    e.stopPropagation(); // Sprečava otvaranje stranice događaja klikom na dugme
    setOpenConfirm(true);
  };

  const handleCloseConfirm = (e) => {
    if (e) e.stopPropagation();
    setOpenConfirm(false);
  };

  const handleConfirmDelete = (e) => {
    e.stopPropagation();
    onDeleteEvent(event.id);
    setOpenConfirm(false);
  };

  const getEventStatus = (dateString) => {
    const today = new Date();
    const eventDate = new Date(dateString);

    const todayReset = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
    );
    const eventReset = new Date(
      eventDate.getFullYear(),
      eventDate.getMonth(),
      eventDate.getDate(),
    );

    if (eventReset.getTime() === todayReset.getTime()) {
      return { label: "Aktivno danas", color: "success" };
    } else if (eventReset.getTime() > todayReset.getTime()) {
      return { label: "Predstojeće", color: "info" };
    } else {
      return { label: "Završeno", color: "error" };
    }
  };

  const status = getEventStatus(event.eventDate);
  const fallbackImage =
    "https://image.pollinations.ai/prompt/A%20minimalist%20and%20modern%20placeholder%20image%20for%20a%20missing%20event%20cover%20photo%20in%20a%20Material%20UI%20style.%20The%20image%20is%20a%20clean%2C%20square%20canvas%20with%20a%20subtle%20light%20grey%20gradient%20background.%20In%20the%20center%2C%20there%20is%20a%20stylized%2C%20abstract%20icon%20of%20a%20calendar%20with%20a%20question%20mark%20inside%20it%2C%20rendered%20in%20MUI's%20default%20grey%20and%20blue%20colors.%20The%20icon%20is%20contained%20within%20a%20circular%20border.%20The%20overall%20composition%20is%20uncluttered%20and%20uses%20flat%20design%20principles%2C%20suitable%20for%20a%20user%20interface%20element.%20There%20is%20a%20soft%20shadow%20underneath%20the%20circular%20icon%20to%20give%20it%20depth%2C%20consistent%20with%20Material%20Design's%20elevation%20guidelines.%20The%20aspect%20ratio%20is%201%3A1.";

  return (
    <>
      <Card
        variant="outlined"
        onClick={onClick}
        sx={{
          width: "100%",
          borderRadius: 2,
          cursor: "pointer",
          transition: "background-color 0.2s",
          "&:hover": { backgroundColor: "#f9fafb" },
        }}
      >
        <CardContent
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "nowrap",
            overflowX: { xs: "auto", md: "visible" },
            WebkitOverflowScrolling: "touch",
            gap: { xs: 2, md: 3 },
            padding: { xs: "16px !important", md: "24px !important" },
            "&::-webkit-scrollbar": { display: "none" },
            scrollbarWidth: "none",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              flex: { xs: "0 0 auto", md: 1 },
              minWidth: { xs: "200px", md: 0 },
            }}
          >
            <CardMedia
              component="img"
              image={event.coverImageUrl || fallbackImage}
              alt={event.title || "Event cover"}
              sx={{
                width: { xs: 50, md: 70 },
                height: { xs: 50, md: 70 },
                borderRadius: 1.5,
                objectFit: "cover",
                flexShrink: 0,
              }}
            />

            <Box sx={{ minWidth: 0 }}>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 600,
                  fontSize: { xs: "15px", md: "20px" },
                  mb: 0.5,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {event.title}
              </Typography>
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{
                  fontSize: { xs: "12px", md: "15px" },
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                Kreator: {event.createdBy?.name || "N/A"}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ flexShrink: 0 }}>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ fontSize: { xs: "10px", md: "13px" } }}
            >
              Datum Kreiranja
            </Typography>
            <Typography
              variant="body1"
              sx={{
                fontWeight: 500,
                fontSize: { xs: "12px", md: "16px" },
                whiteSpace: "nowrap",
              }}
            >
              {new Date(event.createdAt).toLocaleDateString("sr-RS")}
            </Typography>
          </Box>

          <Box sx={{ flexShrink: 0 }}>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ fontSize: { xs: "10px", md: "13px" } }}
            >
              Datum Odrzavanja
            </Typography>
            <Typography
              variant="body1"
              sx={{
                fontWeight: 500,
                fontSize: { xs: "12px", md: "16px" },
                whiteSpace: "nowrap",
              }}
            >
              {new Date(event.eventDate).toLocaleDateString("sr-RS")}
            </Typography>
          </Box>

          <Box sx={{ flexShrink: 0 }}>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ fontSize: { xs: "10px", md: "13px" } }}
            >
              PIN kod
            </Typography>
            <Typography
              variant="body1"
              sx={{
                fontWeight: 600,
                fontSize: { xs: "12px", md: "16px" },
                letterSpacing: "1px",
                whiteSpace: "nowrap",
              }}
            >
              {event.pinCode}
            </Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              flexShrink: 0,
              ml: { xs: 0, md: "auto" },
            }}
          >
            <Button
              variant="outlined"
              size="small"
              startIcon={<GetAppIcon />}
              onClick={(e) => {
                e.stopPropagation();
                onDownloadQR(e, event);
              }}
              sx={{
                fontSize: { xs: "10px", md: "12px" },
                fontWeight: 600,
                textTransform: "none",
                whiteSpace: "nowrap",
                borderColor: "#111827",
                color: "#111827",
                "&:hover": {
                  backgroundColor: "#f3f4f6",
                  borderColor: "#111827",
                },
              }}
            >
              Preuzmi QR
            </Button>

            <Chip
              label={status.label}
              color={status.color}
              size="small"
              sx={{
                fontWeight: 600,
                fontSize: { xs: "11px", md: "14px" },
                px: { xs: 0.5, md: 1 },
                py: { xs: 1.5, md: 2.2 },
              }}
            />

            {/* Dugme za brisanje veselja */}
            <IconButton
              color="error"
              size="small"
              onClick={handleOpenConfirm}
              sx={{
                backgroundColor: "#fee2e2",
                "&:hover": { backgroundColor: "#fca5a5" },
              }}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Box>
        </CardContent>
      </Card>

      {/* Pop-up dijalog za potvrdu brisanja */}
      <Dialog
        open={openConfirm}
        onClose={handleCloseConfirm}
        onClick={(e) => e.stopPropagation()}
      >
        <DialogTitle sx={{ fontWeight: 600 }}>Brisanje veselja</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Da li ste sigurni da želite da obrišete veselje{" "}
            <strong>"{event.title}"</strong>? Ova akcija je trajna i ne može se
            poništiti.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={handleCloseConfirm}
            variant="outlined"
            color="inherit"
          >
            Otkaži
          </Button>
          <Button
            onClick={handleConfirmDelete}
            variant="contained"
            color="error"
            autoFocus
          >
            Obriši veselje
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default EventCard;
