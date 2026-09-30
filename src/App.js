import logo from "./logo.svg";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard/Dashboard";
import Login from "./pages/Login/Login";
import CreateEvent from "./pages/EventCreate/EventCreate";
import Event from "./pages/Event/Event";
import EventEdit from "./pages/EventEdit/EventEdit";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/kreiranje-veselja" element={<CreateEvent />} />
        <Route path="/:slug" element={<Event />} />
        <Route path="/:slug/edit" element={<EventEdit />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
