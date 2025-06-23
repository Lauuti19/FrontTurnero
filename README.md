# ⚙️FrontTurnero - Sistema de Turnos Gimnasio 

Aplicación React que consume la API de BackTurnero para gestionar turnos.  

▶️ **Cómo ejecutarlo**  

### **1**  
```bash
# 1. Clonar el repositorio
git clone https://github.com/Lauuti19/FrontTurnero.git
cd FrontTurnero

# 2. Crear la red Docker (solo una vez)
docker network create turnero-network

# 3. Iniciar el frontend
docker-compose up -d

## 🔗 **Dependencias del Sistema**  
Este frontend **NO funciona solo**, necesita:  
1. **[BackTurnero](https://github.com/Lauuti19/BackTurnero)** - API en Node.js (debe estar corriendo en `http://localhost:3001`)  
2. **[BDTurnero](https://github.com/Lauuti19/BDTurnero)** - Base de datos MySQL (requerida por el backend)  

📌 **Importante**:  
- Los 3 servicios deben estar en la misma red: `turnero-network`.  
- El orden de inicio recomendado es: **BD → Backend → Frontend**.  
