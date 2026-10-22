import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";
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

const SOCKET_URL = api.defaults.baseURL
  ? new URL(api.defaults.baseURL).origin
  : "http://localhost:3000";

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

  const currentGuestSessionId = getGuestSessionId();

  const handleDownload = (fileUrl, fileName = "uspomena") => {
    if (!fileUrl) return;

    const extension = selectedMedia?.fileType === "VIDEO" ? "mp4" : "jpg";
    const fullFileName = `${fileName}-${Date.now()}.${extension}`;

    const downloadApiUrl = `${api.defaults.baseURL}/media/download?url=${encodeURIComponent(
      fileUrl,
    )}&filename=${encodeURIComponent(fullFileName)}`;

    window.location.href = downloadApiUrl;
  };

  const handleDeleteMedia = async (mediaId, pinCode = "") => {
    try {
      const headers = {
        "x-guest-session-id": currentGuestSessionId,
      };

      if (pinCode) {
        headers["x-pin-code"] = pinCode;
      }

      await api.delete(`/media/${mediaId}`, { headers });

      setMediaList((prev) => prev.filter((item) => item.id !== mediaId));
      setSelectedIndex(null);
    } catch (err) {
      console.error("Greška pri brisanju medija:", err);
      alert(err.response?.data?.message || "Greška pri brisanju fajla.");
      throw err;
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

  useEffect(() => {
    if (!event?.id) return;

    const socket = io(SOCKET_URL, {
      transports: ["websocket", "polling"],
    });

    socket.emit("join_event_room", event.id);

    socket.on("media_uploaded", (newMedia) => {
      setMediaList((prevList) => {
        const exists = prevList.some((item) => item.id === newMedia.id);
        if (exists) return prevList;
        return [newMedia, ...prevList];
      });
    });

    socket.on("media_deleted", (deletedMediaId) => {
      setMediaList((prevList) =>
        prevList.filter((item) => item.id !== deletedMediaId),
      );

      setSelectedIndex((prevIndex) => {
        if (prevIndex === null) return null;
        return prevIndex;
      });
    });

    return () => {
      socket.disconnect();
    };
  }, [event?.id]);

  const fetchMedia = async (eventId) => {
    try {
      setLoadingMedia(true);
      const response = await api.get(`/media/event/${eventId}`);
      const rawMedia = response.data.data || [];
      const sortedMedia = [...rawMedia].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
      );
      setMediaList(sortedMedia);
    } catch (err) {
      console.error("Greška pri dohvatanju medija:", err);
    } finally {
      setLoadingMedia(false);
    }
  };

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0 || !event?.id) return;

    const MAX_FILES = 10;
    if (files.length > MAX_FILES) {
      alert(`Možete poslati najviše ${MAX_FILES} fajlova odjednom.`);
      e.target.value = "";
      return;
    }

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("eventId", event.id);
      formData.append("guestSessionId", currentGuestSessionId);

      if (files.length === 1) {
        formData.append("file", files[0]);
        await api.post("/media/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            "x-guest-session-id": currentGuestSessionId,
          },
        });
      } else {
        files.forEach((file) => formData.append("files", file));
        await api.post("/media/upload-many", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            "x-guest-session-id": currentGuestSessionId,
          },
        });
      }
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
            sx={{ mb: 3, gap: "10px", flexWrap: "wrap" }}
          >
            <Box>
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
            </Box>
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
          currentGuestSessionId={currentGuestSessionId}
          onClose={() => setSelectedIndex(null)}
          onNext={handleNext}
          onPrev={handlePrev}
          onDownload={handleDownload}
          onDelete={handleDeleteMedia}
        />
      </Container>
    </Box>
  );
};

export default Event;
