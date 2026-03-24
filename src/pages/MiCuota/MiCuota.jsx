import React, { useEffect } from "react";
import "./../../styles/MiCuota.css";

import MiCuotaWizard from "../../components/MiCuotaWizard/MiCuotaWizard";
import { usePlans } from "../../hooks/usePlans";
import { useMpPayments } from "../../hooks/useMpPayments";

export default function MiCuota() {
  const token = localStorage.getItem("token");

  const { plans, loading: plansLoading, error: plansError, getPlanes } = usePlans();
  const { loading: mpLoading, error: mpError, createByPlan } = useMpPayments();

  useEffect(() => {
    if (token) getPlanes(token);
  }, [token, getPlanes]);

  return (
    <div className="MiCuotaPage">
      <h1 className="MiCuotaTitle">Mi Cuota</h1>

      <MiCuotaWizard
        plans={plans}
        plansLoading={plansLoading}
        plansError={plansError}
        mpLoading={mpLoading}
        mpError={mpError}
        onCreatePreferenceByPlan={createByPlan}
      />
    </div>
  );
}
