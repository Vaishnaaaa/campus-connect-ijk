// frontend/src/services/api.js
import axios from "axios";
import { auth } from "../config/firebase";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000/api",
  headers: { "Content-Type": "application/json" },
});

// Auto-attach the Firebase ID token to every request
api.interceptors.request.use(async (config) => {
  const user = auth.currentUser;
  if (user) {
    const token = await user.getIdToken();
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ── Auth ──────────────────────────────────────────────────────────────────────
export const syncUser = (data) => api.post("/auth/sync", data);
export const getMe = () => api.get("/auth/me");
export const updateMe = (data) => api.put("/auth/me", data);

// ── Hostels ───────────────────────────────────────────────────────────────────
export const getHostels = (params) => api.get("/hostels", { params });
export const getHostel = (id) => api.get(`/hostels/${id}`);
export const createHostel = (data) => api.post("/hostels", data);
export const updateHostel = (id, data) => api.put(`/hostels/${id}`, data);
export const deleteHostel = (id) => api.delete(`/hostels/${id}`);
export const addHostelReview = (id, data) => api.post(`/hostels/${id}/reviews`, data);

// ── Bookings ──────────────────────────────────────────────────────────────────
export const createBooking = (data) => api.post("/bookings", data);
export const getMyBookings = () => api.get("/bookings/mine");
export const getHostelBookings = (hostelId) => api.get(`/bookings/hostel/${hostelId}`);
export const updateBookingStatus = (id, data) => api.put(`/bookings/${id}/status`, data);

// ── Deals ─────────────────────────────────────────────────────────────────────
export const getDeals = (params) => api.get("/deals", { params });
export const getDeal = (id) => api.get(`/deals/${id}`);
export const createDeal = (data) => api.post("/deals", data);
export const updateDeal = (id, data) => api.put(`/deals/${id}`, data);
export const deleteDeal = (id) => api.delete(`/deals/${id}`);
export const getMyDeals = () => api.get("/deals/mine");

// ── Events ────────────────────────────────────────────────────────────────────
export const getEvents = (params) => api.get("/events", { params });
export const getEvent = (id) => api.get(`/events/${id}`);
export const createEvent = (data) => api.post("/events", data);
export const updateEvent = (id, data) => api.put(`/events/${id}`, data);
export const deleteEvent = (id) => api.delete(`/events/${id}`);
export const registerForEvent = (id) => api.post(`/events/${id}/register`);

export default api;
