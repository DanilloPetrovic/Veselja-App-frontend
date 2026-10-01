import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../functions/axios";
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Stack,
  CircularProgress,
  Alert,
  IconButton,
  Avatar,
  CardMedia,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import SaveIcon from "@mui/icons-material/Save";
import DownloadIcon from "@mui/icons-material/Download";

const FONT_OPTIONS = [
  { label: "Tangerine", value: "Tangerine" },
  { label: "Great Vibes", value: "Great Vibes" },
  { label: "Dancing Script", value: "Dancing Script" },
  { label: "Pacifico", value: "Pacifico" },
  { label: "Playfair Display", value: "Playfair Display" },
  { label: "Montserrat", value: "Montserrat" },
  { label: "Alex Brush (Elegantan rukopis)", value: "Alex Brush" },
  { label: "Caveat (Opušten rukopis)", value: "Caveat" },
  { label: "Cinzel (Elegatni serif)", value: "Cinzel" },
  { label: "Sacramento", value: "Sacramento" },
  { label: "Parisienne", value: "Parisienne" },
  { label: "Marck Script", value: "Marck Script" },
];

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

const EventEdit = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [pin, setPin] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [selectedFont, setSelectedFont] = useState("Tangerine");

  const [eventDataState, setEventDataState] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    welcomeMessage: "",
  });

  const [coverImage, setCoverImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    loadGoogleFont(selectedFont);
  }, [selectedFont]);

  useEffect(() => {
    const initEventData = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/event/${slug}`);
        const eventData = response.data.data;

        if (eventData) {
          setEventDataState(eventData);
          setFormData({
            title: eventData.title || "",
            welcomeMessage: eventData.welcomeMessage || "",
          });
          setImagePreview(eventData.coverImageUrl || null);

          if (eventData.fontFamily) {
            setSelectedFont(eventData.fontFamily);
          }

          const token = localStorage.getItem("token");
          if (token) {
            setIsAuthorized(true);
          }
        }
      } catch (err) {
        setErrorMessage(
          err.response?.data?.message || "Greška pri učitavanju događaja.",
        );
      } finally {
        setLoading(false);
      }
    };

    initEventData();
  }, [slug]);

  const handlePinSubmit = (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (
      eventDataState &&
      String(eventDataState.pinCode) === String(pin).trim()
    ) {
      setIsAuthorized(true);
    } else {
      setErrorMessage("Netačan PIN kod. Pokušajte ponovo.");
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCoverImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleFontChange = (e) => {
    const font = e.target.value;
    setSelectedFont(font);
    loadGoogleFont(font);
  };

  const handleDownloadAll = () => {
    if (!eventDataState?.id) {
      alert("Događaj nije pronađen.");
      return;
    }

    const downloadZipUrl = `${api.defaults.baseURL}/media/download-all/${eventDataState.id}`;
    window.location.href = downloadZipUrl;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    try {
      setSubmitting(true);

      const data = new FormData();
      data.append("title", formData.title);
      data.append("welcomeMessage", formData.welcomeMessage);

      data.append("fontFamily", selectedFont);

      if (coverImage) {
        data.append("coverImage", coverImage);
      }

      await api.patch(`/event/events/${eventDataState.id}`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setSuccessMessage("Događaj je uspešno ažuriran!");

      setTimeout(() => {
        navigate(`/${slug}`);
      }, 1500);
    } catch (err) {
      setErrorMessage(
        err.response?.data?.message || "Greška pri čuvanju izmena.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
        backgroundColor="#faf9f6"
      >
        <CircularProgress color="primary" />
      </Box>
    );
  }

  if (!isAuthorized) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          backgroundColor: "#faf9f6",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: 2,
        }}
      >
        <Container maxWidth="xs">
          <Paper
            elevation={0}
            sx={{
              p: 4,
              borderRadius: 4,
              boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
              textAlign: "center",
              backgroundColor: "#ffffff",
            }}
          >
            <Avatar
              sx={{
                m: "0 auto 16px auto",
                bgcolor: "#1e293b",
                width: 56,
                height: 56,
              }}
            >
              <LockOutlinedIcon fontSize="medium" />
            </Avatar>

            <Typography
              variant="h5"
              sx={{
                fontWeight: 700,
                color: "#1e293b",
                mb: 1,
                fontFamily: "NunitoVariableFont, sans-serif",
              }}
            >
              Unesite PIN kod
            </Typography>

            <Typography
              variant="body2"
              sx={{ color: "#64748b", mb: 3, fontSize: "0.9rem" }}
            >
              Da biste izmenili ovaj događaj, unesite 4-cifreni PIN kod.
            </Typography>

            {errorMessage && (
              <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
                {errorMessage}
              </Alert>
            )}

            <form onSubmit={handlePinSubmit}>
              <Stack spacing={2}>
                <TextField
                  fullWidth
                  type="password"
                  label="PIN Kod"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  inputProps={{
                    maxLength: 4,
                    style: {
                      textAlign: "center",
                      letterSpacing: "8px",
                      fontSize: "1.2rem",
                    },
                  }}
                  required
                />
                <Button
                  fullWidth
                  type="submit"
                  variant="contained"
                  disabled={pin.length < 4}
                  sx={{
                    py: 1.5,
                    borderRadius: 2.5,
                    backgroundColor: "#1e293b",
                    textTransform: "none",
                    fontWeight: 700,
                    fontSize: "1rem",
                    "&:hover": { backgroundColor: "#0f172a" },
                  }}
                >
                  Potvrdi PIN
                </Button>
                <Button
                  fullWidth
                  variant="text"
                  onClick={() => navigate(`/${slug}`)}
                  sx={{ color: "#64748b", textTransform: "none" }}
                >
                  Nazad na događaj
                </Button>
              </Stack>
            </form>
          </Paper>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "#faf9f6", py: 4 }}>
      <Container maxWidth="md">
        <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
          <IconButton
            onClick={() => navigate(`/${slug}`)}
            sx={{
              backgroundColor: "#ffffff",
              boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
              "&:hover": { backgroundColor: "#f1f5f9" },
            }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              color: "#1e293b",
              fontFamily: "NunitoVariableFont, sans-serif",
            }}
          >
            Izmena događaja
          </Typography>
        </Stack>

        <Paper
          elevation={0}
          sx={{
            p: { xs: 2.5, sm: 3 },
            mb: 3,
            borderRadius: 4,
            boxShadow: "0 10px 30px rgba(0,0,0,0.04)",
            backgroundColor: "#ffffff",
          }}
        >
          <Stack
            direction={{ xs: "column", sm: "row" }}
            justifyContent="space-between"
            alignItems={{ xs: "flex-start", sm: "center" }}
            spacing={2}
          >
            <Box>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  color: "#1e293b",
                  fontSize: "1.1rem",
                }}
              >
                Preuzimanje medija
              </Typography>
              <Typography variant="body2" sx={{ color: "#64748b" }}>
                Preuzmite sve slike i video zapise sa ovog događaja u jednoj ZIP
                arhivi.
              </Typography>
            </Box>
            <Button
              variant="contained"
              startIcon={<DownloadIcon />}
              onClick={handleDownloadAll}
              sx={{
                py: 1.2,
                px: 3,
                borderRadius: 2.5,
                backgroundColor: "#0f172a",
                color: "#ffffff",
                textTransform: "none",
                fontWeight: 700,
                whiteSpace: "nowrap",
                "&:hover": { backgroundColor: "#1e293b" },
              }}
            >
              Preuzmi sve medije (ZIP)
            </Button>
          </Stack>
        </Paper>

        <Paper
          elevation={0}
          sx={{
            p: { xs: 2.5, sm: 4 },
            borderRadius: 4,
            boxShadow: "0 10px 30px rgba(0,0,0,0.04)",
            backgroundColor: "#ffffff",
          }}
        >
          {errorMessage && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
              {errorMessage}
            </Alert>
          )}

          {successMessage && (
            <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>
              {successMessage}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <Stack spacing={3}>
              <Box>
                <Typography
                  variant="subtitle2"
                  sx={{ fontWeight: 700, color: "#334155", mb: 1 }}
                >
                  Naslovna slika (Cover)
                </Typography>
                {imagePreview && (
                  <CardMedia
                    component="img"
                    image={imagePreview}
                    alt="Cover preview"
                    sx={{
                      width: "100%",
                      height: 220,
                      objectFit: "cover",
                      borderRadius: 3,
                      mb: 2,
                    }}
                  />
                )}
                <Button
                  component="label"
                  variant="outlined"
                  startIcon={<CloudUploadIcon />}
                  sx={{
                    borderRadius: 2.5,
                    textTransform: "none",
                    borderColor: "#cbd5e1",
                    color: "#475569",
                  }}
                >
                  Izaberi novu sliku
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </Button>
              </Box>

              <TextField
                fullWidth
                label="Naziv događaja"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                required
              />

              <FormControl fullWidth>
                <InputLabel id="font-family-select-label">
                  Font poruke dobrodošlice
                </InputLabel>
                <Select
                  labelId="font-family-select-label"
                  id="font-family-select"
                  value={selectedFont}
                  label="Font poruke dobrodošlice"
                  onChange={handleFontChange}
                >
                  {FONT_OPTIONS.map((font) => (
                    <MenuItem
                      key={font.value}
                      value={font.value}
                      sx={{
                        fontFamily: `"${font.value}", cursive, sans-serif`,
                      }}
                    >
                      {font.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                fullWidth
                multiline
                rows={3}
                label="Poruka dobrodošlice"
                value={formData.welcomeMessage}
                onChange={(e) =>
                  setFormData({ ...formData, welcomeMessage: e.target.value })
                }
                inputProps={{
                  style: {
                    fontFamily: `"${selectedFont}", cursive, sans-serif`,
                    fontSize: "1.2rem",
                  },
                }}
              />

              <Button
                type="submit"
                variant="contained"
                disabled={submitting}
                startIcon={
                  submitting ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : (
                    <SaveIcon />
                  )
                }
                sx={{
                  py: 1.5,
                  borderRadius: 2.5,
                  backgroundColor: "#1e293b",
                  textTransform: "none",
                  fontWeight: 700,
                  fontSize: "1rem",
                  "&:hover": { backgroundColor: "#0f172a" },
                }}
              >
                {submitting ? "Čuvanje..." : "Sačuvaj izmene"}
              </Button>
            </Stack>
          </form>
        </Paper>
      </Container>
    </Box>
  );
};

export default EventEdit;
