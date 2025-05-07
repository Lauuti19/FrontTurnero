import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import AdminPage from "./pages/AdminPage";
import ProfesorPage from "./pages/ProfesorPage";
import AlumnoPage from "./pages/AlumnoPage";
import Header from "./components/Header";
import Footer from "./components/Footer";
import './App.css';

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/profesor" element={<ProfesorPage />} />
        <Route path="/alumno" element={<AlumnoPage />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
