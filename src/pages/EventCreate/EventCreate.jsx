import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Container,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  CircularProgress,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import api from "../../functions/axios";

const EventCreate = () => {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState(null);

  const handleCreateEvent = async (values) => {
    try {
      const formData = new FormData();

      formData.append("title", values.title);
      formData.append("slug", values.slug);
      formData.append("adminId", values.adminId);
      formData.append("eventDate", values.eventDate);

      if (values.welcomeMessage) {
        formData.append("welcomeMessage", values.welcomeMessage);
      }

      if (selectedFile) {
        formData.append("coverImage", selectedFile);
      }

      const response = await api.post("/event/createevent", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return response.data;
    } catch (error) {
      console.error(
        "Greška pri kreiranju događaja:",
        error.response?.data || error.message,
      );
      alert(
        error.response?.data?.message ||
          "Došlo je do greške prilikom kreiranja događaja.",
      );
    }
  };

  const formik = useFormik({
    initialValues: {
      title: "",
      slug: "",
      adminId: "1",
      eventDate: "",
      welcomeMessage: "",
    },
    validationSchema: Yup.object({
      title: Yup.string().required("Naslov je obavezno polje"),
      slug: Yup.string()
        .matches(
          /^[a-z0-9-]+$/,
          "Slug sme sadržati samo mala slova, brojeve i crtice (npr. svadba-marko-milica)",
        )
        .required("Slug je obavezno polje"),
      adminId: Yup.string().required("Izbor admina je obavezan"),
      eventDate: Yup.date().required("Datum događaja je obavezno polje"),
      welcomeMessage: Yup.string().nullable(),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      const result = await handleCreateEvent(values);

      if (result) {
        alert("Događaj je uspešno kreiran!");
        navigate("/");
      }
      setSubmitting(false);
    },
  });

  const handleFileChange = (event) => {
    const file = event.currentTarget.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f4f6f8",
        py: 6,
        px: 2,
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={3}
          sx={{
            p: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            borderRadius: 3,
            backgroundColor: "#ffffff",
          }}
        >
          <Typography
            component="h1"
            variant="h5"
            sx={{ fontWeight: 600, color: "#1a202c", mb: 3 }}
          >
            Kreiraj novi događaj
          </Typography>

          <Box
            component="form"
            onSubmit={formik.handleSubmit}
            noValidate
            sx={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              gap: 2.5,
            }}
          >
            <TextField
              fullWidth
              id="title"
              name="title"
              label="Naziv događaja (npr. Svadba Marko & Milica)"
              variant="outlined"
              value={formik.values.title}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.title && Boolean(formik.errors.title)}
              helperText={formik.touched.title && formik.errors.title}
            />

            <TextField
              fullWidth
              id="slug"
              name="slug"
              label="URL Slug (npr. svadba-marko-milica)"
              variant="outlined"
              value={formik.values.slug}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.slug && Boolean(formik.errors.slug)}
              helperText={formik.touched.slug && formik.errors.slug}
            />

            <FormControl
              fullWidth
              error={formik.touched.adminId && Boolean(formik.errors.adminId)}
            >
              <InputLabel id="adminId-label">Izaberi admina</InputLabel>
              <Select
                labelId="adminId-label"
                id="adminId"
                name="adminId"
                value={formik.values.adminId}
                label="Izaberi admina"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              >
                <MenuItem value="1">Danilo</MenuItem>
                <MenuItem value="2">Branko</MenuItem>
              </Select>
              {formik.touched.adminId && formik.errors.adminId && (
                <FormHelperText>{formik.errors.adminId}</FormHelperText>
              )}
            </FormControl>

            <TextField
              fullWidth
              id="eventDate"
              name="eventDate"
              type="datetime-local"
              variant="outlined"
              InputLabelProps={{
                shrink: true,
              }}
              value={formik.values.eventDate}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.eventDate && Boolean(formik.errors.eventDate)
              }
              helperText={formik.touched.eventDate && formik.errors.eventDate}
            />

            <TextField
              fullWidth
              id="welcomeMessage"
              name="welcomeMessage"
              label="Poruka dobrodošlice (Opciono)"
              multiline
              rows={3}
              variant="outlined"
              value={formik.values.welcomeMessage}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.welcomeMessage &&
                Boolean(formik.errors.welcomeMessage)
              }
              helperText={
                formik.touched.welcomeMessage && formik.errors.welcomeMessage
              }
            />

            <Box>
              <Button
                component="label"
                variant="outlined"
                fullWidth
                startIcon={<CloudUploadIcon />}
                sx={{
                  py: 1.5,
                  textTransform: "none",
                  borderColor: "#d1d5db",
                  color: "#374151",
                  "&:hover": {
                    borderColor: "#9ca3af",
                    backgroundColor: "#f9fafb",
                  },
                }}
              >
                {selectedFile
                  ? `Izabrano: ${selectedFile.name}`
                  : "Izaberi naslovnu sliku (Opciono)"}
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </Button>
            </Box>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={formik.isSubmitting}
              sx={{
                mt: 1,
                py: 1.5,
                fontSize: "1rem",
                fontWeight: 600,
                textTransform: "none",
                borderRadius: 2,
                backgroundColor: "#111827",
                "&:hover": {
                  backgroundColor: "#1f2937",
                },
              }}
            >
              {formik.isSubmitting ? (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <CircularProgress size={20} color="inherit" />
                  Kreiranje događaja...
                </Box>
              ) : (
                "Kreiraj Događaj"
              )}
            </Button>

            <Button
              fullWidth
              variant="outlined"
              onClick={() => navigate(-1)}
              sx={{
                py: 1,
                fontSize: "0.9rem",
                fontWeight: 500,
                textTransform: "none",
                borderRadius: 2,
                color: "#4b5563",
                borderColor: "#d1d5db",
                "&:hover": {
                  backgroundColor: "#f3f4f6",
                  borderColor: "#9ca3af",
                },
              }}
            >
              Odustani
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default EventCreate;
