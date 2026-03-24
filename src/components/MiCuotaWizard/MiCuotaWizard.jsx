// src/components/MiCuotaWizard/MiCuotaWizard.jsx
import React, { useMemo, useState } from "react";

const STEPS = [
  { id: 0, title: "Paso 1", desc: "Elegí tu plan" },
  { id: 1, title: "Paso 2", desc: "Confirmá y pagá con Mercado Pago" },
];

export default function MiCuotaWizard({
  plans,
  plansLoading,
  plansError,
  mpLoading,
  mpError,
  onCreatePreferenceByPlan,
}) {
  const token = localStorage.getItem("token");

  const [step, setStep] = useState(0);
  const [selectedPlanId, setSelectedPlanId] = useState("");
  const [localError, setLocalError] = useState("");

  const selectedPlan = useMemo(() => {
    const idNum = Number(selectedPlanId);
    return (plans || []).find((p) => Number(p.id_plan ?? p.id) === idNum);
  }, [plans, selectedPlanId]);

  const errorToShow = plansError || mpError || localError;

  const goToConfirm = () => {
    setLocalError("");
    if (!selectedPlanId) return setLocalError("Seleccioná un plan para continuar.");
    setStep(1);
  };

  const back = () => {
    setLocalError("");
    setStep(0);
  };

  const payWithMp = async () => {
    setLocalError("");
    if (!selectedPlanId) return setLocalError("Seleccioná un plan para continuar.");

    try {
      const res = await onCreatePreferenceByPlan(token, Number(selectedPlanId));
      if (res?.init_point) {
        window.location.href = res.init_point;
        return;
      }
      setLocalError("No se pudo obtener el link de Mercado Pago (init_point).");
    } catch {
      // mpError lo muestra el hook/page
    }
  };

  return (
    <div className="MiCuotaWrap">
      {/* Stepper profesional (usa clases del MiCuota.css que ya tenés) */}
      <div className="MiCuotaStepper">
        {STEPS.map((s, idx) => {
          const isActive = step === s.id;
          const isDone = step > s.id;
          const isTodo = step < s.id;

          const cls = `MiCuotaStepItem ${isActive ? "active" : ""} ${isDone ? "done" : ""} ${
            isTodo ? "todo" : ""
          }`;

          return (
            <div key={s.id} className={cls}>
              <div className="MiCuotaStepCircle">{idx + 1}</div>

              <div className="MiCuotaStepText">
                <div className="MiCuotaStepTitle">{s.title}</div>
                <div className="MiCuotaStepDesc">{s.desc}</div>
              </div>

              {/* Conector visual solo entre 1 y 2 */}
              {idx < STEPS.length - 1 && <div className="MiCuotaStepLine" />}
            </div>
          );
        })}
      </div>

      {errorToShow ? <div className="MiCuotaAlert error">{errorToShow}</div> : null}

      {/* PASO 1 */}
      {step === 0 && (
        <div className="MiCuotaCard">
          <h2 className="MiCuotaH2">Elegí tu plan</h2>

          {plansLoading ? (
            <div className="MiCuotaLoading">Cargando planes...</div>
          ) : (
            <>
              <label className="MiCuotaLabel">Plan</label>
              <select
                className="MiCuotaSelect"
                value={selectedPlanId}
                onChange={(e) => setSelectedPlanId(e.target.value)}
              >
                <option value="">Seleccionar...</option>
                {(plans || []).map((p) => {
                  const id = p.id_plan ?? p.id;
                  const nombre = p.nombre ?? `Plan #${id}`;
                  const monto = p.monto ?? p.precio ?? null;

                  return (
                    <option key={id} value={id}>
                      {nombre}
                      {monto ? ` — $${monto}` : ""}
                    </option>
                  );
                })}
              </select>

              {selectedPlan && (
                <div className="MiCuotaResumen">
                  <div>
                    <span>Plan:</span>{" "}
                    <b>{selectedPlan.nombre ?? `Plan #${selectedPlanId}`}</b>
                  </div>
                  <div>
                    <span>Monto:</span>{" "}
                    <b>${selectedPlan.monto ?? selectedPlan.precio ?? "—"}</b>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* PASO 2 */}
      {step === 1 && (
        <div className="MiCuotaCard">
          <h2 className="MiCuotaH2">Confirmación</h2>

          <div className="MiCuotaResumen">
            <div>
              <span>Plan:</span> <b>{selectedPlan?.nombre ?? `Plan #${selectedPlanId}`}</b>
            </div>
            <div>
              <span>Monto:</span> <b>${selectedPlan?.monto ?? selectedPlan?.precio ?? "—"}</b>
            </div>
          </div>

          <div className="MiCuotaInfo">
            Al continuar, se genera el pago y te redirigimos a Mercado Pago.
          </div>
        </div>
      )}

      {/* ACCIONES */}
      <div className="MiCuotaActions">
        {step === 1 && (
          <button className="MiCuotaBtn" onClick={back} disabled={mpLoading}>
            Atrás
          </button>
        )}

        {step === 0 ? (
          <button className="MiCuotaPrimaryBtn" onClick={goToConfirm} disabled={mpLoading}>
            Siguiente
          </button>
        ) : (
          <button className="MiCuotaPrimaryBtn" onClick={payWithMp} disabled={mpLoading}>
            {mpLoading ? "Redirigiendo..." : "Mercado Pago"}
          </button>
        )}
      </div>
    </div>
  );
}
