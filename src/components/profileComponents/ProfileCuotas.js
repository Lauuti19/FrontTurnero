import { GoAlertFill } from "react-icons/go";
import { MdPayments } from "react-icons/md";
import { CgSandClock } from "react-icons/cg";
import { BiSolidError } from "react-icons/bi";

export const ProfileCuota = ({ cuota }) => {
  if (!cuota) {
    return (
      <section className="profile-card">
        <h3>Estado de Cuota</h3>
        <p className="cuota-inactiva">
          <GoAlertFill /> Información de cuota no disponible
        </p>
      </section>
    );
  }

  const { estado, descripcion, fecha_vencimiento, monto, metodo_pago, nombre_plan } = cuota;

  const iconMap = {
    activa: <MdPayments id="active-fee-icon" />,
    pagada: <MdPayments id="active-fee-icon" />,
    pendiente: <CgSandClock id="pending-fee-icon" />,
    vencida: <BiSolidError id="unactive-fee-icon" />,
  };

  return (
    <section className="profile-card">
      <h3>Estado de Cuota</h3>
      <div className={`cuota-estado cuota-${estado || "inactiva"}`}>
        <span className="cuota-icon">{iconMap[estado] || <BiSolidError />}</span>
        <div className="cuota-info">
          <p>{descripcion || `Cuota ${estado}`}</p>
          {fecha_vencimiento && <p><strong>Vence:</strong> {new Date(fecha_vencimiento).toLocaleDateString()}</p>}
          {monto && <p><strong>Monto:</strong> ${monto}</p>}
          {metodo_pago && <p><strong>Método:</strong> {metodo_pago}</p>}
          {nombre_plan && <p><strong>Plan:</strong> {nombre_plan}</p>}
        </div>
      </div>
    </section>
  );
};
