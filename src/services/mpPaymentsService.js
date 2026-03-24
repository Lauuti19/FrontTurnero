import { fetchWithAuth } from "./api";

export const mpPaymentsService = {
  createPreferenceByPlan: async (token, id_plan) => {
    return await fetchWithAuth("/mp/preference-by-plan", token, {
      method: "POST",
      body: JSON.stringify({ id_plan }),
    });
  },
};
