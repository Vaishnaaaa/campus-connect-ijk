// frontend/src/App.js
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Nav from "./components/Nav";
import Home from "./pages/Home";
import HostelHub from "./pages/HostelHub";
import CampusDeals from "./pages/CampusDeals";
import Events from "./pages/Events";
import MapPage from "./pages/MapPage";
import About from "./pages/About";
import Reviews from "./pages/Reviews";
import Profile from "./pages/Profile";
import Footer from "./components/Footer";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Nav />
        <Routes>
          <Route path="/"        element={<Home />} />
          <Route path="/hostel"  element={<HostelHub />} />
          <Route path="/deals"   element={<CampusDeals />} />
          <Route path="/events"  element={<Events />} />
          <Route path="/map"     element={<MapPage />} />
          <Route path="/about"   element={<About />} />
          <Route path="/reviews" element={<Reviews />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="*"        element={<Navigate to="/" replace />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </AuthProvider>
  );
}
