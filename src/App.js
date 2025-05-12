import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./AuthContext";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import AdminPage from "./pages/AdminPage";
import ProfesorPage from "./pages/ProfesorPage";
import AlumnoPage from "./pages/AlumnoPage";
import StateInfo from "./components/StateInfo";
import Header from "./components/Header";
import Footer from "./components/Footer";
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/profesor" element={<ProfesorPage />} />
          <Route path="/alumno" element={<AlumnoPage />} />
          <Route path="/estado" element={<StateInfo />} />
        </Routes>
        <Footer />
      </Router>
    </AuthProvider>
  );
}

export default App;
