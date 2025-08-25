import React, { useEffect, useState } from "react";
import { useAuth } from "../AuthContext"; 
import { AiOutlinePlus } from "react-icons/ai";
import { FiEdit } from "react-icons/fi";
import NewRecordForm from "./NewRecordForm";
import UpdateRecordForm from "./UpdateRecordForm";

const UserRecords = () => {
  const { getUserId } = useAuth();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showNewForm, setShowNewForm] = useState(false);
  const [recordToEdit, setRecordToEdit] = useState(null);

  useEffect(() => {
    fetchRecords();
  }, [getUserId]);

  const fetchRecords = () => {
    const id_usuario = getUserId();

    if (!id_usuario) {
      setError("No se encontró el ID del usuario.");
      setLoading(false);
      return;
    }

    fetch(`http://localhost:3001/api/rm/user/${id_usuario}`)
      .then(res => {
        if (!res.ok) throw new Error("Error al obtener records del usuario.");
        return res.json();
      })
      .then(data => {
        if (Array.isArray(data)) {
          setRecords(data);
        } else {
          setError("La API no devolvió un formato válido de records.");
        }
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  };

  if (loading) return <p>Cargando records...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="records">
      <h2>
        Records 
        <AiOutlinePlus 
          style={{ cursor: "pointer", marginLeft: "10px" }}
          onClick={() => setShowNewForm(true)}
        />
      </h2>

      {showNewForm && (
        <NewRecordForm 
          onClose={() => setShowNewForm(false)} 
          onSuccess={fetchRecords}
        />
      )}

      {recordToEdit && (
        <UpdateRecordForm 
          record={recordToEdit}
          onClose={() => setRecordToEdit(null)}
          onSuccess={fetchRecords}
        />
      )}

      {records.length === 0 ? (
        <p>No hay records cargados.</p>
      ) : (
        <div className="contenido-record">
          {records.map((rec) => (
            <p key={rec.id_ejercicio}>
              {rec.ejercicio} {rec.repeticiones} x {rec.peso}kg
              <FiEdit 
                style={{ cursor: "pointer", marginLeft: "8px" }}
                onClick={() => setRecordToEdit(rec)}
              />
            </p>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserRecords;
