// app.js - Versión corregida
import dashboardcontroller from './controllers/dashboardcontroller.js';
import dashboardview from './views/dashboardview.js';
import usermodel from './models/usermodel.js';

document.addEventListener('DOMContentLoaded', () => {
    try {
        console.log("Iniciando aplicación...");
        
        // Inicialización con verificación
        const view = new dashboardview();
        const model = new usermodel();
        new dashboardcontroller(view, model);
        
        console.log("Aplicación iniciada correctamente");
    } catch (error) {
        console.error("Error al iniciar la aplicación:", error);
        alert("Error crítico al cargar la aplicación. Por favor recarga la página.");
    }
});