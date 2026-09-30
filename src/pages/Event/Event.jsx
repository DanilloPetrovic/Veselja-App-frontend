import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../functions/axios";
import {
  Box,
  Typography,
  Container,
  Stack,
  useTheme,
  useMediaQuery,
} from "@mui/material";

import NunitoVariableFontwght from "../../fonts/Nunito-VariableFont_wght.ttf";
import tangerineFont from "../../fonts/Tangerine-Regular.ttf";
import EventHeader from "../../components/Event/EventHeader";
import MediaGrid from "../../components/Event/MediaGrid";
import MediaUploadMenu from "../../components/Event/MediaUploadMenu";
import QrCodeModal from "../../components/Event/QrCodeModal";
import MediaLightboxModal from "../../components/Event/MediaLightboxModal";
import LoadingScreen from "../../components/Common/LoadingScreen";

const Event = () => {
  const { slug } = useParams();
  const theme = useTheme();
  const isMobileOrTablet = useMediaQuery(theme.breakpoints.down("sm"));

  const [event, setEvent] = useState(null);
  const [mediaList, setMediaList] = useState([]);
  const [loadingMedia, setLoadingMedia] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [openQrModal, setOpenQrModal] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(null);

  const selectedMedia =
    selectedIndex !== null ? mediaList[selectedIndex] : null;

  const handleNext = () => {
    if (selectedIndex !== null && selectedIndex < mediaList.length - 1) {
      setSelectedIndex(selectedIndex + 1);
    }
  };

  const handlePrev = () => {
    if (selectedIndex !== null && selectedIndex > 0) {
      setSelectedIndex(selectedIndex - 1);
    }
  };

  const getGuestSessionId = () => {
    let sessionId = localStorage.getItem("guestSessionId");
    if (!sessionId) {
      sessionId = crypto.randomUUID
        ? crypto.randomUUID()
        : `guest-${Date.now()}`;
      localStorage.setItem("guestSessionId", sessionId);
    }
    return sessionId;
  };

  const handleDownload = async (fileUrl, fileName = "uspomena") => {
    try {
      const response = await fetch(fileUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      const extension = selectedMedia?.fileType === "VIDEO" ? "mp4" : "jpg";
      link.download = `${fileName}-${Date.now()}.${extension}`;

      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Greška pri preuzimanju fajla:", err);
      window.open(fileUrl, "_blank");
    }
  };

  useEffect(() => {
    const fetchEvent = async () => {
      if (!slug) return;

      try {
        const response = await api.get(`/event/${slug}`);
        const eventData = response.data.data;
        setEvent(eventData);

        if (eventData?.id) {
          fetchMedia(eventData.id);
        }
      } catch (err) {
        console.error(
          err.response?.data?.message ||
            "Došlo je do greške pri učitavanju događaja.",
        );
      }
    };

    fetchEvent();
  }, [slug]);

  const fetchMedia = async (eventId) => {
    try {
      setLoadingMedia(true);
      const response = await api.get(`/media/event/${eventId}`);
      setMediaList(response.data.data || []);
    } catch (err) {
      console.error("Greška pri dohvatanju medija:", err);
    } finally {
      setLoadingMedia(false);
    }
  };

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0 || !event?.id) return;

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("eventId", event.id);
      formData.append("guestSessionId", getGuestSessionId());

      if (files.length === 1) {
        formData.append("file", files[0]);
        await api.post("/media/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        files.forEach((file) => formData.append("files", file));
        await api.post("/media/upload-many", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      await fetchMedia(event.id);
    } catch (err) {
      console.error("Greška pri uploadu fajla:", err.response?.data || err);
      alert(err.response?.data?.message || "Greška pri slanju medija.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  if (!event) {
    return <LoadingScreen message="Učitavanje događaja..." fullScreen={true} />;
  }

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "#faf9f6" }}>
      <Container
        disableGutters={isMobileOrTablet}
        maxWidth={isMobileOrTablet ? false : "md"}
        sx={{
          mx: isMobileOrTablet ? 0 : "auto",
          position: "relative",
          pb: 12,
        }}
      >
        {uploading && (
          <LoadingScreen
            message="Slanje uspomene u toku..."
            fullScreen={true}
          />
        )}

        <style>
          {`
            @font-face {
              font-family: 'Tangerine';
              src: url('${tangerineFont}') format('truetype');
              font-weight: normal;
              font-style: normal;
              font-display: swap;
            }

            @font-face {
              font-family: 'NunitoVariableFont';
              src: url('${NunitoVariableFontwght}') format('truetype');
              font-weight: normal;
              font-style: normal;
              font-display: swap;
            }
          `}
        </style>

        <EventHeader
          event={event}
          isMobileOrTablet={isMobileOrTablet}
          onOpenQrModal={() => setOpenQrModal(true)}
        />

        <Box
          sx={{
            px: { xs: 2, sm: 3 },
            pt: 4,
            pb: 2,
          }}
        >
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{ mb: 3, display: "flex", alignItems: "center", gap: "10px" }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                fontSize: { xs: "1.1rem", sm: "1.25rem" },
                letterSpacing: "-0.02em",
                color: "#1e293b",
                fontFamily: "NunitoVariableFont, sans-serif",
              }}
            >
              Broj medija
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: "#64748b",
                fontWeight: 600,
                fontSize: "14px",
              }}
            >
              {mediaList.length} {mediaList.length === 1 ? "fajl" : "fajlova"}
            </Typography>
          </Stack>

          <MediaGrid
            mediaList={mediaList}
            loadingMedia={loadingMedia}
            onSelectMedia={(item, index) => setSelectedIndex(index)}
          />
        </Box>

        <MediaUploadMenu onFileChange={handleFileChange} />

        <QrCodeModal
          open={openQrModal}
          onClose={() => setOpenQrModal(false)}
          event={event}
        />

        <MediaLightboxModal
          selectedMedia={selectedMedia}
          currentIndex={selectedIndex}
          totalCount={mediaList.length}
          onClose={() => setSelectedIndex(null)}
          onNext={handleNext}
          onPrev={handlePrev}
          onDownload={handleDownload}
        />
      </Container>
    </Box>
  );
};

export default Event;
