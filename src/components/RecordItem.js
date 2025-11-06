// components/RecordItem.jsx
import React from "react";
import { FiEdit } from "react-icons/fi";

const RecordItem = ({ record, index, onEdit }) => {
  return (
    <div className="record-item" key={record.id_ejercicio || index}>
      <div className="record-info">
        <h4>{record.nombre_ejercicio || record.ejercicio || `Ejercicio ${record.id_ejercicio}`}</h4>
        <p>{record.repeticiones} rep · {record.peso}kg</p>
        {record.notas && <p>Notas: {record.notas}</p>}
      </div>
      <button 
        className="edit-record-btn" 
        onClick={() => onEdit(record)}
        aria-label={`Editar record de ${record.nombre_ejercicio || record.ejercicio}`}
      >
        <FiEdit />
      </button>
    </div>
  );
};

export default RecordItem;