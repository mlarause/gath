import DashboardController from './controllers/DashboardController';

// Inicialización con verificación de carga
console.log("Inicializando aplicación...");

document.addEventListener('DOMContentLoaded', () => {
    try {
        console.log("DOM completamente cargado");
        const controller = new DashboardController();
        console.log("Controlador inicializado correctamente");
    } catch (error) {
        console.error("Error al inicializar:", error);
        alert("Error crítico: " + error.message);
    }
});