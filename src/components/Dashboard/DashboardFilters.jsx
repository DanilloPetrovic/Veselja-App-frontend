import { Link as RouterLink } from "react-router-dom";
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
} from "@mui/material";

const DashboardFilters = ({
  creatorFilter,
  setCreatorFilter,
  statusFilter,
  setStatusFilter,
  sortOrder,
  setSortOrder,
  onApplyFilters,
}) => {
  return (
    <>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          py: 1.5,
          overflowX: "auto",
          "::-webkit-scrollbar": { display: "none" },
          msOverflowStyle: "none",
          scrollbarWidth: "none",
        }}
      >
        <FormControl
          size="small"
          sx={{ minWidth: { xs: "110px", md: "130px" }, flexShrink: 0 }}
        >
          <InputLabel id="creator-label">Kreator</InputLabel>
          <Select
            labelId="creator-label"
            label="Kreator"
            value={creatorFilter}
            onChange={(e) => setCreatorFilter(e.target.value)}
          >
            <MenuItem value="all">Svi kreatori</MenuItem>
            <MenuItem value={1}>Danilo</MenuItem>
            <MenuItem value={2}>Branko</MenuItem>
          </Select>
        </FormControl>

        <FormControl
          size="small"
          sx={{ minWidth: { xs: "110px", md: "130px" }, flexShrink: 0 }}
        >
          <InputLabel id="status-label">Status</InputLabel>
          <Select
            labelId="status-label"
            label="Status"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <MenuItem value="all">Sva</MenuItem>
            <MenuItem value="today">Aktivno danas</MenuItem>
            <MenuItem value="upcoming">Predstojeća</MenuItem>
            <MenuItem value="finished">Završena</MenuItem>
          </Select>
        </FormControl>

        <FormControl
          size="small"
          sx={{ minWidth: { xs: "110px", md: "130px" }, flexShrink: 0 }}
        >
          <InputLabel id="sort-label">Sortiranje</InputLabel>
          <Select
            labelId="sort-label"
            label="Sortiranje"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
          >
            <MenuItem value="newest">Najnovije</MenuItem>
            <MenuItem value="oldest">Najstarije</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Box
        sx={{
          display: "flex",
          gap: 1.5,
          pb: 2,
          justifyContent: "space-between",
        }}
      >
        <Button
          onClick={onApplyFilters}
          variant="outlined"
          size="medium"
          sx={{
            flex: { xs: "1 1 48%", md: "initial" },
            padding: { xs: "6px 8px", md: "6px 16px" },
            fontSize: { xs: "12px", md: "14px" },
            fontWeight: 600,
            textTransform: "none",
            borderRadius: "6px",
            borderColor: "#111827",
            color: "#111827",
            whiteSpace: "nowrap",
            "&:hover": {
              backgroundColor: "#f3f4f6",
              borderColor: "#111827",
            },
          }}
        >
          Primeni filtere
        </Button>

        <Button
          component={RouterLink}
          to="/kreiranje-veselja"
          variant="contained"
          size="medium"
          sx={{
            flex: { xs: "1 1 48%", md: "initial" },
            padding: { xs: "6px 8px", md: "6px 16px" },
            fontSize: { xs: "12px", md: "14px" },
            fontWeight: 600,
            textTransform: "none",
            borderRadius: "6px",
            backgroundColor: "#111827",
            color: "white",
            whiteSpace: "nowrap",
            "&:hover": {
              backgroundColor: "#1f2937",
            },
          }}
        >
          Kreiraj novo veselje
        </Button>
      </Box>
    </>
  );
};

export default DashboardFilters;
