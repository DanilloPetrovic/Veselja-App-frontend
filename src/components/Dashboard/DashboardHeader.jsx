import { Box, Typography, Button } from "@mui/material";

const DashboardHeader = ({ userName, onLogout }) => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        pt: 2,
        pb: 1.5,
        borderBottom: "1px solid #e5e7eb",
        gap: "10px",
      }}
    >
      <Typography
        sx={{
          fontSize: { xs: "16px", sm: "18px", md: "20px" },
          fontWeight: 600,
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {userName}
      </Typography>

      <Button
        onClick={onLogout}
        variant="contained"
        size="medium"
        sx={{
          padding: { xs: "4px 12px", md: "6px 16px" },
          fontSize: { xs: "12px", md: "14px" },
          fontWeight: 600,
          textTransform: "none",
          borderRadius: "6px",
          backgroundColor: "#c12d2d",
          color: "white",
          whiteSpace: "nowrap",
          "&:hover": {
            backgroundColor: "#ac2a2a",
          },
        }}
      >
        Odjavi se
      </Button>
    </Box>
  );
};

export default DashboardHeader;
