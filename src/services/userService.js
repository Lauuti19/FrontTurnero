import { fetchWithAuth } from './api';

export const getUserActiveFees = async (token, userId) => {
  try {
    const response = await fetchWithAuth(`/payments/active-fees?id_usuario=${userId}`, token);
    return response.cuotas || [];
  } catch (error) {
    console.warn('❌ No se pudo obtener cuotas activas:', error.message);
    return [];
  }
};

export const getFullUserData = async (token, userId) => {
  console.log('🔄 Obteniendo datos completos del usuario...');

  let perfilData = {};
  let userData = {};
  let rmUserData = {};
  let recordsData = [];
  let cuotaData = null;

  // 1. Obtener perfil básico
  try {
    console.log('📝 Obteniendo perfil desde /auth/perfil');
    const perfil = await fetchWithAuth('/auth/perfil', token);
    perfilData = perfil.usuario || {};
    console.log('✅ Perfil obtenido');
  } catch (e) {
    console.warn('❌ No se pudo obtener perfil:', e.message);
  }

  // 2. Obtener datos generales del usuario
  try {
    console.log('👤 Obteniendo datos desde /usuarios/' + userId);
    const usuario = await fetchWithAuth(`/usuarios/${userId}`, token);
    userData = usuario.datos_usuario || usuario || {};
    console.log('✅ Datos usuario obtenidos');
  } catch (e) {
    console.warn('❌ No se pudo obtener datos de usuario:', e.message);
  }

  // 3. Obtener datos específicos de RM (incluyendo records)
  try {
    console.log('🏨 Obteniendo datos RM desde /rm/user/' + userId);
    const rmUser = await fetchWithAuth(`/rm/user/${userId}`, token);
    rmUserData = rmUser.datos_usuario || rmUser || {};
    const allRecords = [];
    
    for (const key in rmUser) {
      if (!isNaN(parseInt(key)) && rmUser[key] && typeof rmUser[key] === 'object') {
        allRecords.push(rmUser[key]);
      }
    }
    
    recordsData = allRecords;
    
    if (rmUser.records && Array.isArray(rmUser.records)) {
      recordsData = [...recordsData, ...rmUser.records];
    }
    if (rmUser.reservas && Array.isArray(rmUser.reservas)) {
      recordsData = [...recordsData, ...rmUser.reservas];
    }
    if (rmUser.historial && Array.isArray(rmUser.historial)) {
      recordsData = [...recordsData, ...rmUser.historial];
    }
    
    if (rmUser.cuota || rmUser.membresia) {
      cuotaData = rmUser.cuota || rmUser.membresia;
    }
    
    console.log('✅ Datos RM obtenidos, records encontrados:', recordsData.length);
  } catch (e) {
    console.warn('❌ No se pudo obtener datos RM:', e.message);
  }
  try {
    console.log('💰 Obteniendo cuotas activas para usuario:', userId);
    const cuotasActivas = await getUserActiveFees(token, userId);
    
    if (cuotasActivas.length > 0) {
      // Tomar la cuota más reciente o procesar todas
      const cuotaMasReciente = cuotasActivas[0]; // O puedes lógica más compleja
      cuotaData = {
        estado: 'activa',
        descripcion: `Cuota ${cuotaMasReciente.estado || 'Activa'}`,
        fecha_vencimiento: cuotaMasReciente.fecha_vencimiento,
        monto: cuotaMasReciente.monto,
        metodo_pago: cuotaMasReciente.metodo_pago,
        // Incluir todos los datos de la cuota
        ...cuotaMasReciente
      };
      console.log('✅ Cuotas activas obtenidas:', cuotasActivas.length);
    } else {
      console.log('ℹ️ No hay cuotas activas para el usuario');
      cuotaData = {
        estado: 'inactiva',
        descripcion: 'Sin cuotas activas'
      };
    }
  } catch (e) {
    console.warn('❌ No se pudo obtener cuotas activas:', e.message);
    cuotaData = {
      estado: 'error',
      descripcion: 'Error al cargar información de cuota'
    };
  }
  // Combinar todos los datos
  const combinedData = {
    // Datos básicos
    id_usuario: perfilData.id || rmUserData.id || userData.id || userId,
    nombre: perfilData.nombre || rmUserData.nombre || userData.nombre || '',
    email: perfilData.email || rmUserData.email || userData.email || '',
    dni: rmUserData.dni || userData.dni || '',
    celular: rmUserData.celular || userData.celular || '',
    id_rol: perfilData.id_rol || rmUserData.id_rol || userData.id_rol || 3,
    
    // Datos específicos de RM
    records: recordsData,
    cuota: cuotaData,
    
    // Campos adicionales de RM (excluyendo las propiedades numéricas que ya procesamos)
    ...Object.fromEntries(
      Object.entries(rmUserData).filter(([key]) => isNaN(parseInt(key)))
    ),
  };

  console.log('📊 Datos combinados finales:', combinedData);
  return combinedData;
};