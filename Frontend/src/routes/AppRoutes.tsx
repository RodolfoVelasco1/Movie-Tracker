import { BrowserRouter, Route, Routes } from "react-router-dom";
import SeriesPage from "../components/screens/SeriesPage";
import MoviesPage from "../components/screens/MoviesPage";
import Home from "../components/screens/Home";
import LoginPage from "../components/screens/LoginPage";
import RegisterPage from "../components/screens/RegisterPage";
import ProtectedRoute from "./ProtectedRoute";

export const AppRoutes = () => {
    return (
      <BrowserRouter>
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="*" element={<LoginPage />} />

            <Route path="/home" element={
                <ProtectedRoute><Home /></ProtectedRoute>
            } />
            <Route path="/movies" element={
                <ProtectedRoute><MoviesPage /></ProtectedRoute>
            } />
            <Route path="/series" element={
                <ProtectedRoute><SeriesPage /></ProtectedRoute>
            } />
          </Routes>
      </BrowserRouter>
    );
}