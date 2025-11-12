// hooks/useModifierClass.js
import { useEffect, useState } from 'react';
import { useAuth } from '../AuthContext';
import { classService } from '../services/classService';
import { disciplineService } from '../services/disciplinaService';

const daysOptions = [
  { id: 1, label: 'Lunes' },
  { id: 2, label: 'Martes' },
  { id: 3, label: 'Miércoles' },
  { id: 4, label: 'Jueves' },
  { id: 5, label: 'Viernes' },
  { id: 6, label: 'Sábado' },
  { id: 7, label: 'Domingo' },
];

export const useModifierClass = () => {
  const { getToken } = useAuth();
  const token = getToken ? getToken() : localStorage.getItem('token');

  // create / edit
  const [mode, setMode] = useState('create');        // 'create' | 'edit'
  const [classType, setClassType] = useState('normal'); // 'normal' | 'especial'

  // form fields
  const [disciplines, setDisciplines] = useState([]);
  const [selectedDiscipline, setSelectedDiscipline] = useState('');
  const [selectedDay, setSelectedDay] = useState('');
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [hora, setHora] = useState('');
  const [capacidad, setCapacidad] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [activa, setActiva] = useState(true);

  // listado para editar/eliminar
  const [classesList, setClassesList] = useState([]);
  const [selectedClassId, setSelectedClassId] = useState(null);

  // ui state
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  // cargar disciplinas
  useEffect(() => {
    const loadDisciplines = async () => {
      try {
        const data = await disciplineService.getDisciplinas(token);
        setDisciplines(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Error cargando disciplinas', err);
      }
    };
    if (token) loadDisciplines();
  }, [token]);

  const resetMessages = () => {
    setMessage(null);
    setErrorMsg(null);
  };

  const resetForm = () => {
    setSelectedDiscipline('');
    setSelectedDay('');
    setHora('');
    setCapacidad('');
    setDescripcion('');
    setActiva(true);
    setSelectedClassId(null);
  };

  // CREAR normal / especial
  const handleCreate = async (e) => {
    e.preventDefault();
    resetMessages();

    if (!selectedDiscipline || !hora || !capacidad) {
      setErrorMsg('Completá disciplina, hora y capacidad.');
      return;
    }

    try {
      setLoading(true);

      if (classType === 'normal') {
        if (!selectedDay) {
          setErrorMsg('Elegí un día para la clase normal.');
          return;
        }

        await classService.createClass(token, {
          id_disciplina: Number(selectedDiscipline),
          id_dia: Number(selectedDay),
          hora,
          capacidad_max: Number(capacidad),
        });

        setMessage('Clase normal creada correctamente.');
      } else {
        if (!selectedDate) {
          setErrorMsg('Elegí una fecha para la clase especial / feriado.');
          return;
        }

        await classService.createSpecialClass(token, {
          fecha: selectedDate,
          id_disciplina: Number(selectedDiscipline),
          hora,
          capacidad_max: Number(capacidad),
          descripcion: descripcion || 'Clase especial / feriado',
        });

        setMessage('Clase especial / feriado creada correctamente.');
      }

      resetForm();
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || 'Error al crear la clase.');
    } finally {
      setLoading(false);
    }
  };

  // Cargar clases para EDITAR
  const handleLoadClassesForEdit = async () => {
    resetMessages();
    setClassesList([]);
    setSelectedClassId(null);

    try {
      setLoading(true);

      if (classType === 'normal') {
        if (!selectedDay) {
          setErrorMsg('Elegí un día para listar clases normales.');
          return;
        }

        const data = await classService.getClassesByDay(
          token,
          Number(selectedDay)
        );
        setClassesList(Array.isArray(data) ? data : []);
      } else {
        if (!selectedDate) {
          setErrorMsg('Elegí una fecha para listar clases especiales.');
          return;
        }

        const data = await classService.getAllClasses(token, selectedDate);
        const specials = (Array.isArray(data) ? data : []).filter(
          (c) => c.tipo === 'especial' || c.is_especial
        );
        setClassesList(specials);
      }
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || 'Error al cargar las clases.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectClass = (clase) => {
    resetMessages();

    const id =
      clase.id_clase_especial ||
      clase.id_original ||
      clase.id_clase;

    setSelectedClassId(id);

    if (clase.id_disciplina) {
      setSelectedDiscipline(String(clase.id_disciplina));
    } else if (clase.disciplina && disciplines.length > 0) {
      const match = disciplines.find(
        (d) => d.disciplina === clase.disciplina
      );
      if (match) setSelectedDiscipline(String(match.id_disciplina));
    }

    setHora(clase.hora ? String(clase.hora).substring(0, 5) : '');
    setCapacidad(clase.capacidad_max || clase.total || '');
    setDescripcion(clase.descripcion || '');

    if (typeof clase.activa !== 'undefined') {
      setActiva(Boolean(clase.activa));
    }
  };

  const handleUpdate = async () => {
    resetMessages();

    if (!selectedClassId) {
      setErrorMsg('Elegí una clase para editar.');
      return;
    }

    try {
      setLoading(true);

      if (classType === 'normal') {
        await classService.updateClass(token, selectedClassId, {
          id_disciplina: selectedDiscipline
            ? Number(selectedDiscipline)
            : undefined,
          id_dia: selectedDay ? Number(selectedDay) : undefined,
          hora: hora || undefined,
          capacidad_max: capacidad ? Number(capacidad) : undefined,
        });

        setMessage('Clase normal actualizada correctamente.');
      } else {
        await classService.updateSpecialClass(token, selectedClassId, {
          fecha: selectedDate || undefined,
          id_disciplina: selectedDiscipline
            ? Number(selectedDiscipline)
            : undefined,
          hora: hora || undefined,
          capacidad_max: capacidad ? Number(capacidad) : undefined,
          descripcion: descripcion || undefined,
          activa,
        });

        setMessage('Clase especial / feriado actualizada correctamente.');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || 'Error al actualizar la clase.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    resetMessages();

    if (!selectedClassId) {
      setErrorMsg('Elegí una clase para eliminar.');
      return;
    }

    if (!window.confirm('¿Seguro que querés eliminar esta clase?')) return;

    try {
      setLoading(true);

      if (classType === 'normal') {
        await classService.deleteClass(token, selectedClassId);
        setMessage('Clase normal eliminada correctamente.');
      } else {
        await classService.deleteSpecialClass(token, selectedClassId);
        setMessage('Clase especial / feriado eliminada correctamente.');
      }

      await handleLoadClassesForEdit();
      resetForm();
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || 'Error al eliminar la clase.');
    } finally {
      setLoading(false);
    }
  };

  return {
    // estado general
    mode,
    setMode,
    classType,
    setClassType,

    // selects
    disciplines,
    selectedDiscipline,
    setSelectedDiscipline,
    selectedDay,
    setSelectedDay,
    selectedDate,
    setSelectedDate,

    // campos
    hora,
    setHora,
    capacidad,
    setCapacidad,
    descripcion,
    setDescripcion,
    activa,
    setActiva,

    // edición
    classesList,
    selectedClassId,

    // ui
    loading,
    message,
    errorMsg,

    // handlers
    handleCreate,
    handleLoadClassesForEdit,
    handleSelectClass,
    handleUpdate,
    handleDelete,

    daysOptions,
};
};
