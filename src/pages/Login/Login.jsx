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
} from "@mui/material";
import api from "../../functions/axios";

const Login = () => {
  const navigate = useNavigate();

  const loginUser = async (values) => {
    try {
      const response = await api.post("/admin/login", values);

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
      }

      return response.data;
    } catch (error) {
      console.error("Login error:", error.response?.data || error.message);
    }
  };

  const formik = useFormik({
    initialValues: {
      name: "",
      password: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Obavezno polje"),
      password: Yup.string().required("Obavezno polje"),
    }),
    onSubmit: async (values) => {
      const user = await loginUser(values);

      if (user) {
        navigate("/");
      } else {
        alert("Login nije uspeo");
      }
    },
  });

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f4f6f8",
        px: 2,
      }}
    >
      <Container maxWidth="xs">
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
            Prijava na sistem
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
              id="name"
              name="name"
              label="Korisničko ime"
              variant="outlined"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={formik.touched.name && formik.errors.name}
            />

            <TextField
              fullWidth
              id="password"
              name="password"
              label="Šifra"
              type="password"
              variant="outlined"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
            />

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
              Prijavi se
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default Login;
