import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider, useAuth } from "./AuthContext";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import AdminPage from "./pages/AdminPage";
import ProfesorPage from "./pages/ProfesorPage";
import AlumnoPage from "./pages/AlumnoPage";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Sidebar from "./components/Sidebar";
import RegisterPage from "./pages/RegisterPage";
import ClassesPage from "./pages/ClassesPage";
import ClassesPageUser from "./pages/ClassesPageUser.js";

import './App.css';

function AppContent() {
  const { usuario } = useAuth(); // ✅ Ahora sí dentro del contexto

  return (
    <Router>
      <Header />
      {usuario && <Sidebar />}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/profesor" element={<ProfesorPage />} />
        <Route path="/alumno" element={<AlumnoPage />} />
        <Route path="/registerUser" element={<RegisterPage />} />
        <Route path="/clases" element={<ClassesPage />} />
        <Route path="/clasesUser" element={<ClassesPageUser />} />

      </Routes>
      <Footer />
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
