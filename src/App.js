// src/App.js
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider, useAuth } from "./AuthContext";
import { AnimatePresence } from 'framer-motion';
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Sidebar from "./components/Sidebar";
import RegisterPage from "./pages/RegisterPage";
import ClassesPage from "./pages/ClassesPage";
import ClassesPageUser from "./pages/ClassesPageUser.js";
import ClassSchedule from "./components/ClassSchedule.js";
import DisciplinasPage from "./pages/DisciplinasPage.js";
import ContactoPage from "./pages/ContactoPage.js";
import BuyCredits from './components/BuyCredits';
import RegistrarCuota from './components/RegistrarCuota';
import UserProfile from "./pages/UserProfile.js";
import TimerPage from './pages/TimerPage.js';
import UserRoutines from './components/UserRoutines/UserRoutines.js';
import RoutinesManager from './pages/Manager/RoutineManagerPage.js';
import ClassesManagerPage from './pages/Manager/ClassesManagerPage.js';
import PlansManagerPage from "./pages/Manager/PlansManagerPage.js";
import DisciplinesManagerPage from "./pages/Manager/DisciplinesManagerPage.js";
import UsersManagerPage from "./pages/Manager/UsersManagerPage.js";
import ExcercisesManagerPage from "./pages/Manager/ExcercisesManagerPage.js"; 
import CashMovementsPage from "./pages/CashMovementsPage.js"; 
import WorkHoursPage from "./pages/WorkHoursPage.js"; 
import AdministradoresPage from "./pages/AdministradoresPage.js"; 
import UserCashMovementsPage from "./pages/UserCashMovementsPage.js"; 
import EditProfile from "./pages/EditProfile.js";
import MiCuota from "./pages/MiCuota/MiCuota.jsx";
import ExpiredTokenPage from "./pages/ExpiredTokenPage.js";

import PaymentSuccess from "./pages/Payments/PaymentSuccess";
import PaymentPending from "./pages/Payments/PaymentPending";
import PaymentFailure from "./pages/Payments/PaymentFailure";
import "./styles/MiCuota.css";

import './App.css';

function AppContent() {
  const { usuario, loading } = useAuth(); 

  return (
    <Router>
      <Header />
      {usuario && <Sidebar />}
      <AnimatePresence mode='wait'>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/registerUser" element={<RegisterPage />} />
          <Route path="/clases" element={<ClassesPage />} />
          <Route path="/clasesUser" element={<ClassesPageUser />} />
          <Route path="/disciplinas" element={<DisciplinasPage />} />
          <Route path="/contacto" element={<ContactoPage />} />
          <Route path="/clasesTodos" element={<ClassSchedule />} />
          <Route path="/comprar-creditos" element={<MiCuota />} />
          <Route path="/registrar-cuota" element={<RegistrarCuota />} />
          <Route path="/perfil" element={<UserProfile />} />
          <Route path="/editar" element={<EditProfile />} />
          <Route path="/timer" element={<TimerPage />} />
          <Route path="/rutina" element={<UserRoutines />} />
          <Route path="/manager/rutinas" element={<RoutinesManager />} />
          <Route path="/manager/clases" element={<ClassesManagerPage />} />
          <Route path="/manager/planes" element={<PlansManagerPage />} />
          <Route path="/manager/disciplinas" element={<DisciplinesManagerPage />} />
          <Route path="/manager/usuarios" element={<UsersManagerPage />} />
          <Route path="/manager/ejercicios" element={<ExcercisesManagerPage />} />
          <Route path="/manager/work_hours" element={<WorkHoursPage />} />
          <Route path="/manager/admins" element={<AdministradoresPage />} />
          <Route path="/mismovimientos" element={<UserCashMovementsPage />} />
          <Route path="/Movimientos" element={<CashMovementsPage />} />
          <Route path="/Expired" element={<ExpiredTokenPage />} />
          <Route path="/mi-cuota" element={<MiCuota />} />

          {/* 👇 nuevas rutas para back_urls de MP */}
          <Route path="/payments/success" element={<PaymentSuccess />} />
          <Route path="/payments/pending" element={<PaymentPending />} />
          <Route path="/payments/failure" element={<PaymentFailure />} />
        </Routes>
      </AnimatePresence>
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
