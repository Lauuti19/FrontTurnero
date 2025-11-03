// services/recordService.js
const API_BASE = 'https://backturnero-vvk6.onrender.com/api';

export const recordService = {
  async createRecord(token, recordData) {
    const response = await fetch(`${API_BASE}/rm`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(recordData)
    });
    return response.json();
  },

  async updateRecord(token, recordData) {
    const response = await fetch(`${API_BASE}/rm/update`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(recordData)
    });
    return response.json();
  },

  async getUserRecords(userId) {
    const response = await fetch(`${API_BASE}/rm/user/${userId}`);
    if (!response.ok) throw new Error('Error al obtener records');
    return response.json();
  }
};