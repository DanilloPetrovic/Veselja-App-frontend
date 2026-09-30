import { Box, CircularProgress, Stack } from "@mui/material";

const LoadingScreen = ({
  message = "Učitavanje u toku...",
  fullScreen = true,
  minHeight = "400px",
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        ...(fullScreen
          ? {
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: (theme) => theme.zIndex.modal + 1,
              backgroundColor: "rgba(250, 249, 246, 0.85)",
              backdropFilter: "blur(8px)",
              WebkitBackdropFilter: "blur(8px)",
            }
          : {
              minHeight: minHeight,
              py: 6,
            }),
      }}
    >
      <Stack alignItems="center" spacing={2.5}>
        <Box
          sx={{
            position: "relative",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CircularProgress
            variant="determinate"
            value={100}
            size={52}
            thickness={4}
            sx={{
              color: "#e2e8f0",
            }}
          />
          <CircularProgress
            variant="indeterminate"
            disableShrink
            size={52}
            thickness={4}
            sx={{
              color: "#0f172a",
              animationDuration: "800ms",
              position: "absolute",
              left: 0,
              "& .MuiCircularProgress-circle": {
                strokeLinecap: "round",
              },
            }}
          />
        </Box>
      </Stack>
    </Box>
  );
};

export default LoadingScreen;
