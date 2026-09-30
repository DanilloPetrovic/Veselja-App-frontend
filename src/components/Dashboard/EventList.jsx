import { Box, Typography, TextField, Grid, Pagination } from "@mui/material";
import EventCard from "./EventCard";

const EventList = ({
  filteredEvents,
  searchTerm,
  onSearchChange,
  paginatedEvents,
  page,
  totalPages,
  onPageChange,
  onNavigate,
  onDownloadQR,
}) => {
  return (
    <>
      <Box
        sx={{
          mt: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 1,
        }}
      >
        <Box sx={{ flex: 1 }}>
          <Typography
            variant="h6"
            sx={{
              fontSize: { xs: "14px", sm: "16px", md: "20px" },
              fontWeight: 600,
            }}
          >
            Ukupno: {filteredEvents.length}
          </Typography>
        </Box>

        <Box sx={{ width: "50%", display: "flex", justifyContent: "flex-end" }}>
          <TextField
            size="small"
            fullWidth
            placeholder="Pretraga po naslovu"
            value={searchTerm}
            onChange={onSearchChange}
            inputProps={{ style: { fontSize: "13px" } }}
          />
        </Box>
      </Box>

      <Box
        sx={{
          mt: 2,
          display: "flex",
          flexDirection: "column",
          gap: 2,
          width: "100%",
        }}
      >
        {paginatedEvents.map((event) => (
          <EventCard
            key={event.id}
            event={event}
            onClick={() => onNavigate(`/${event.slug}`)}
            onDownloadQR={onDownloadQR}
          />
        ))}
      </Box>
      {totalPages > 1 && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 3, mb: 3 }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={onPageChange}
            color="primary"
            size="small"
            siblingCount={0}
            boundaryCount={1}
          />
        </Box>
      )}
    </>
  );
};

export default EventList;
