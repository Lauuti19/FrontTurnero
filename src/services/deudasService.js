import { fetchWithAuth } from "./api";

export const getUserDeudas = async (token, userId) => {
  if (!token) throw new Error("Token requerido");
  if (!userId) throw new Error("userId requerido");

  // GET /api/deudas/:userId
  const data = await fetchWithAuth(`/deudas/${userId}`, token);
  return data; // puede ser { deudas: [...] }
};

//  Movimientos del usuario (últimos X meses)
export const getUserMovements = async (token, meses = 6) => {
  if (!token) throw new Error("Token requerido");

  const safeMeses = Number.isFinite(meses) ? meses : 6;
  // GET /api/deudas/movimientos?meses=...
  const data = await fetchWithAuth(
    `/deudas/movimientos?meses=${safeMeses}`,
    token
  );
  return data; // puede ser { movimientos: [...] }
};

const deudasService = {
  getUserDeudas,
  getUserMovements,
};

export default deudasService;
