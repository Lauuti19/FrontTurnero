import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import AdminPage from "./pages/LoginPage";
import ProfesorPage from "./pages/LoginPage";
import AlumnoPage from "./pages/LoginPage";
import Header from "./components/Header";
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
    </Router>
  );
}

export default App;