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
import ClassSchedule from "./components/ClassSchedule.js";
import DisciplinasPage from "./pages/DisciplinasPage.js";
import SobreNosotrosPage from "./pages/SobreNosotrosPage.js";
import ContactoPage from "./pages/ContactoPage.js";
import BuyCredits from './components/BuyCredits';
import RegistrarCuota from './components/RegistrarCuota';
import UserProfile from "./pages/UserProfile.js";
import TimerPage from './pages/TimerPage.js';
import './App.css';
import EditProfile from "./pages/EditProfile.js";

function AppContent() {
  const { usuario } = useAuth();

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
        <Route path="/disciplinas" element={<DisciplinasPage />} />
        <Route path="/sobrenosotros" element={<SobreNosotrosPage />} />
        <Route path="/contacto" element={<ContactoPage />} />
        <Route path="/clasesTodos" element={<ClassSchedule />} />
        <Route path="/comprar-creditos" element={<BuyCredits />} />
        <Route path="/registrar-cuota" element={<RegistrarCuota />} />
        <Route path="/perfil" element={<UserProfile />} />
        <Route path="/editar" element={<EditProfile />} />
        <Route path="/timer" element={<TimerPage />} />

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
