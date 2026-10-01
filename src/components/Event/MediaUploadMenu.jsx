import { useRef, useState } from "react";
import { Fab, Menu, MenuItem, ListItemIcon, ListItemText } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ImageIcon from "@mui/icons-material/ImageOutlined";
import VideocamIcon from "@mui/icons-material/VideocamOutlined";
import PhotoCameraIcon from "@mui/icons-material/PhotoCameraOutlined";

const MediaUploadMenu = ({ onFileChange }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const openMenu = Boolean(anchorEl);

  const imageInputRef = useRef(null);
  const videoInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  const handleFabClick = (e) => setAnchorEl(e.currentTarget);
  const handleCloseMenu = () => setAnchorEl(null);

  return (
    <>
      <input
        type="file"
        accept="image/*"
        multiple
        ref={imageInputRef}
        style={{ display: "none" }}
        onChange={onFileChange}
      />
      <input
        type="file"
        accept="video/*"
        multiple
        ref={videoInputRef}
        style={{ display: "none" }}
        onChange={onFileChange}
      />
      <input
        type="file"
        accept="image/*"
        capture="environment"
        ref={cameraInputRef}
        style={{ display: "none" }}
        onChange={onFileChange}
      />

      <Fab
        color="primary"
        aria-label="dodaj"
        onClick={handleFabClick}
        sx={{
          position: "fixed",
          bottom: 28,
          right: 28,
          zIndex: 1000,
          backgroundColor: "#0f172a",
          color: "#ffffff",
          width: 58,
          height: 58,
          boxShadow: "0 10px 25px -5px rgba(15, 23, 42, 0.4)",
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          "&:hover": {
            backgroundColor: "#1e293b",
            transform: "scale(1.08)",
          },
        }}
      >
        <AddIcon sx={{ fontSize: 28 }} />
      </Fab>

      <Menu
        anchorEl={anchorEl}
        open={openMenu}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        transformOrigin={{ vertical: "bottom", horizontal: "center" }}
        PaperProps={{
          elevation: 0,
          sx: {
            borderRadius: 3,
            minWidth: 200,
            mb: 1.5,
            p: 1,
            backgroundColor: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(12px)",
            boxShadow:
              "0 20px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)",
            border: "1px solid rgba(226, 232, 240, 0.8)",
            "& .MuiMenuItem-root": {
              borderRadius: 2,
              py: 1.2,
              px: 1.5,
              my: 0.2,
              fontFamily: "NunitoVariableFont, sans-serif",
              fontWeight: 600,
              color: "#334155",
              "&:hover": {
                backgroundColor: "#f1f5f9",
              },
            },
          },
        }}
      >
        <MenuItem
          onClick={() => {
            handleCloseMenu();
            imageInputRef.current?.click();
          }}
        >
          <ListItemIcon sx={{ color: "#0f172a" }}>
            <ImageIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Dodaj sliku</ListItemText>
        </MenuItem>

        <MenuItem
          onClick={() => {
            handleCloseMenu();
            videoInputRef.current?.click();
          }}
        >
          <ListItemIcon sx={{ color: "#0f172a" }}>
            <VideocamIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Dodaj video</ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
};

export default MediaUploadMenu;
