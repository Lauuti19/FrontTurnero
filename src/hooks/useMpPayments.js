import { useCallback, useState } from "react";
import { mpPaymentsService } from "../services/mpPaymentsService";

export function useMpPayments() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const createByPlan = useCallback(async (token, id_plan) => {
    setLoading(true);
    setError("");
    try {
      const res = await mpPaymentsService.createPreferenceByPlan(token, id_plan);
      return res;
    } catch (e) {
  const msg =
    e?.response?.data?.error ||   // ✅ mensaje real del back
    e?.message ||
    "Error creando preferencia de Mercado Pago";

  setError(msg);
  throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, error, setError, createByPlan };
}
