import { useState, useEffect } from "react";
import api from "../../functions/axios";
import { Navigate, useNavigate } from "react-router-dom";
import { Container } from "@mui/material";

import DashboardHeader from "../../components/Dashboard/DashboardHeader";
import DashboardFilters from "../../components/Dashboard/DashboardFilters";
import EventList from "../../components/Dashboard/EventList";

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [events, setEvents] = useState([]);
  const token = localStorage.getItem("token");

  const [creatorFilter, setCreatorFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("newest");
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  const getMyProfile = async (token) => {
    try {
      if (!token) return;

      const response = await api.get("/admin/me");
      setUser(response.data);
    } catch (error) {
      console.error(
        "Failed to fetch user profile:",
        error.response?.data || error.message,
      );
    }
  };

  const fetchEvents = async () => {
    try {
      const response = await api.get("/event/events", {
        params: {
          creatorFilter,
          statusFilter,
          sortOrder,
        },
      });
      setEvents(response.data);
    } catch (error) {
      console.error("Greška pri dohvatanju događaja:", error);
    }
  };

  const handleDeleteEvent = async (eventId) => {
    try {
      await api.delete(`/event/${eventId}`);
      fetchEvents();
    } catch (error) {
      console.error("Greška pri brisanju događaja:", error);
      alert(error.response?.data?.message || "Greška pri brisanju događaja.");
    }
  };

  const logout = async () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      const initDashboard = async () => {
        await getMyProfile(token);
        await fetchEvents();
      };

      initDashboard();
    }
  }, []);

  if (!token) {
    return <Navigate to="/login" replace={true} />;
  }

  const handleDownloadQR = async (e, eventItem) => {
    e.stopPropagation();

    const qrImageUrl = eventItem.qrCode || eventItem.qrCodeUrl;

    if (!qrImageUrl) {
      alert("QR kod nije dostupan za ovaj događaj.");
      return;
    }

    try {
      const response = await fetch(qrImageUrl);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = `QR-${eventItem.slug || eventItem.title || "kod"}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Greška pri preuzimanju QR koda:", error);
      window.open(qrImageUrl, "_blank");
    }
  };

  const filteredEvents = events.filter((event) =>
    event.title?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const totalPages = Math.ceil(filteredEvents.length / itemsPerPage);
  const paginatedEvents = filteredEvents.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage,
  );

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setPage(1);
  };

  return (
    <Container maxWidth="xl" sx={{ px: { xs: 1, sm: 2, md: 3 } }}>
      <DashboardHeader userName={user?.name} onLogout={logout} />

      <DashboardFilters
        creatorFilter={creatorFilter}
        setCreatorFilter={setCreatorFilter}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
        onApplyFilters={fetchEvents}
      />

      <EventList
        filteredEvents={filteredEvents}
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        paginatedEvents={paginatedEvents}
        page={page}
        totalPages={totalPages}
        onPageChange={(e, value) => setPage(value)}
        onNavigate={navigate}
        onDownloadQR={handleDownloadQR}
        onDeleteEvent={handleDeleteEvent}
      />
    </Container>
  );
};

export default Dashboard;
