import { Box, Typography, Fade } from "@mui/material";
import PlayCircleFilledIcon from "@mui/icons-material/PlayCircleFilled";
import LoadingScreen from "../Common/LoadingScreen";

const MediaGrid = ({ mediaList, loadingMedia, onSelectMedia }) => {
  if (loadingMedia) {
    return (
      <LoadingScreen
        message="Učitavanje slika..."
        fullScreen={false}
        minHeight="300px"
      />
    );
  }

  if (mediaList.length === 0) {
    return (
      <Box
        sx={{
          py: 8,
          px: 3,
          textAlign: "center",
          backgroundColor: "#ffffff",
          borderRadius: 3,
          border: "1px dashed #e2e8f0",
        }}
      >
        <Typography
          variant="body1"
          sx={{ color: "#64748b", fontWeight: 500, mb: 0.5 }}
        >
          Galerija je još uvek prazna
        </Typography>
        <Typography variant="body2" sx={{ color: "#94a3b8" }}>
          Budi prvi koji će dodati fotografiju ili video zapis!
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        columnCount: 2,
        columnGap: { xs: 1.5, sm: 2 },
        width: "100%",
      }}
    >
      {mediaList.map((item, index) => (
        <Box
          key={item.id || index}
          sx={{
            breakInside: "avoid",
            marginBottom: { xs: 1.5, sm: 2 },
          }}
        >
          <Fade in timeout={300 + index * 50}>
            <Box
              onClick={() => onSelectMedia(item, index)}
              sx={{
                position: "relative",
                width: "100%",
                borderRadius: { xs: 2.5, sm: 3 },
                overflow: "hidden",
                cursor: "pointer",
                backgroundColor: "#f1f5f9",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: "0 12px 20px rgba(0, 0, 0, 0.12)",
                  "& .media-content": {
                    transform: "scale(1.03)",
                  },
                },
              }}
            >
              {item.fileType === "VIDEO" ? (
                <Box
                  sx={{
                    position: "relative",
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Box
                    component="video"
                    className="media-content"
                    // Dodajemo #t=0.1 da usmeri pregledač na prvi frejm videa
                    src={`${item.fileUrl}#t=0.1`}
                    preload="metadata"
                    playsInline
                    muted
                    sx={{
                      width: "100%",
                      height: "auto",
                      display: "block",
                      objectFit: "cover",
                      transition: "transform 0.4s ease",
                    }}
                  />
                  <Box
                    sx={{
                      position: "absolute",
                      inset: 0,
                      backgroundColor: "rgba(0, 0, 0, 0.2)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <PlayCircleFilledIcon
                      sx={{
                        color: "rgba(255, 255, 255, 0.9)",
                        fontSize: { xs: 32, sm: 44 },
                        filter: "drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3))",
                      }}
                    />
                  </Box>
                </Box>
              ) : (
                <Box
                  component="img"
                  className="media-content"
                  src={item.thumbnailUrl || item.fileUrl}
                  alt="Uspomena sa događaja"
                  loading="lazy"
                  onError={(e) =>
                    console.error("Greška pri učitavanju:", item.fileUrl)
                  }
                  sx={{
                    width: "100%",
                    height: "auto",
                    display: "block",
                    objectFit: "cover",
                    transition: "transform 0.4s ease",
                  }}
                />
              )}
            </Box>
          </Fade>
        </Box>
      ))}
    </Box>
  );
};

export default MediaGrid;
