import { useEffect } from "react";
import {
  Box,
  Card,
  CardMedia,
  Typography,
  Stack,
  IconButton,
} from "@mui/material";
import QrCodeIcon from "@mui/icons-material/QrCode2";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useNavigate } from "react-router-dom";

const loadGoogleFont = (fontFamily) => {
  if (!fontFamily) return;
  const formattedFont = fontFamily.replace(/ /g, "+");
  const linkId = `google-font-${formattedFont}`;

  if (!document.getElementById(linkId)) {
    const link = document.createElement("link");
    link.id = linkId;
    link.rel = "stylesheet";
    link.href = `https://fonts.googleapis.com/css2?family=${formattedFont}:wght@400;700&display=swap`;
    document.head.appendChild(link);
  }
};

const EventHeader = ({ event, isMobileOrTablet, onOpenQrModal }) => {
  const navigate = useNavigate();

  const savedFont =
    (event?.slug && localStorage.getItem(`event_font_${event.slug}`)) ||
    "Tangerine";

  useEffect(() => {
    if (savedFont) {
      loadGoogleFont(savedFont);
    }
  }, [savedFont]);

  const handleEditClick = () => {
    if (event?.slug) {
      navigate(`/${event.slug}/edit`);
    }
  };

  const glassButtonStyle = {
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    color: "#ffffff",
    backdropFilter: "blur(12px)",
    WebkitBackdropFilter: "blur(12px)",
    border: "1px solid rgba(255, 255, 255, 0.2)",
    boxShadow: "0 4px 15px rgba(0, 0, 0, 0.15)",
    transition: "all 0.3s ease",
    "&:hover": {
      backgroundColor: "rgba(255, 255, 255, 0.3)",
      transform: "translateY(-2px)",
    },
  };

  return (
    <Card
      elevation={0}
      sx={{
        position: "relative",
        overflow: "hidden",
        borderRadius: isMobileOrTablet ? 0 : 4,
        boxShadow: isMobileOrTablet ? "none" : "0 20px 40px rgba(0,0,0,0.08)",
      }}
    >
      {event?.coverImageUrl && (
        <CardMedia
          component="img"
          image={event?.coverImageUrl}
          alt={event?.title || "Event cover"}
          sx={{
            width: "100%",
            height: isMobileOrTablet ? "70vh" : { sm: 480, md: 560 },
            objectFit: "cover",
            display: "block",
          }}
        />
      )}

      <Box
        sx={{
          position: "absolute",
          top: 20,
          right: 20,
          zIndex: 10,
          p: 1,
          borderRadius: 2,
          backgroundColor: "rgba(0, 0, 0, 0.3)",
          backdropFilter: "blur(5px)",
          WebkitBackdropFilter: "blur(5px)",
        }}
      >
        <Stack direction="row" spacing={1.5}>
          <IconButton
            size="medium"
            onClick={onOpenQrModal}
            sx={glassButtonStyle}
          >
            <QrCodeIcon />
          </IconButton>
          <IconButton
            size="medium"
            onClick={handleEditClick}
            sx={glassButtonStyle}
          >
            <MoreVertIcon />
          </IconButton>
        </Stack>
      </Box>

      {event?.welcomeMessage && (
        <Box
          sx={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            pt: 16,
            pb: isMobileOrTablet ? 6 : 5,
            px: 3,
            background:
              "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 60%, rgba(0,0,0,0) 100%)",
            textAlign: "center",
          }}
        >
          <Typography
            variant={isMobileOrTablet ? "h2" : "h1"}
            sx={{
              fontFamily: `"${savedFont}", cursive, serif`,
              color: "#ffffff",
              lineHeight: 1,
              textShadow: "0 2px 10px rgba(0, 0, 0, 0.3)",
              fontSize: isMobileOrTablet ? "3.5rem" : "5rem",
            }}
          >
            {event.welcomeMessage}
          </Typography>
        </Box>
      )}
    </Card>
  );
};

export default EventHeader;
