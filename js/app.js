// app.js - Versión garantizada para funcionar
document.addEventListener('DOMContentLoaded', function() {
    try {
        console.log("Iniciando aplicación GATH...");
        
        // Cargar scripts en orden
        const loadScript = (src) => {
            return new Promise((resolve, reject) => {
                const script = document.createElement('script');
                script.src = src;
                script.onload = resolve;
                script.onerror = () => reject(new Error(`Error al cargar ${src}`));
                document.head.appendChild(script);
            });
        };

        // Cargar dependencias en orden
        Promise.all([
            loadScript('js/models/UserModel.js'),
            loadScript('js/views/DashboardView.js'),
            loadScript('js/controllers/DashboardController.js')
        ]).then(() => {
            // Inicialización
            const model = new UserModel();
            const view = new DashboardView();
            new DashboardController(view, model);
            console.log("Aplicación iniciada correctamente");
        }).catch(error => {
            console.error("Error al cargar scripts:", error);
            alert("Error al cargar la aplicación. Recarga la página.");
        });

    } catch (error) {
        console.error("Error crítico:", error);
        alert("Error crítico. Contacta al soporte.");
    }
});