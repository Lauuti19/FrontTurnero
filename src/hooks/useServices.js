// hooks/useServices.js
import { useAuth } from '../AuthContext';
import { createAuthService } from '../services/authService';
import { createClassService } from '../services/classService';
// importa otros servicios...

export const useServices = () => {
  const { authFetch } = useAuth();
  
  const services = {
    auth: createAuthService(authFetch),
    classes: createClassService(authFetch),
    // otros servicios...
  };

  return services;
};