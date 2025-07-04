// app.js modificado
document.addEventListener('DOMContentLoaded', () => {
    // Solo ejecutar en dashboard.html
    if (window.location.pathname.includes('dashboard.html')) {
        const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
        
        if (!currentUser) {
            window.location.href = 'index.html';
            return;
        }

        try {
            console.log("Iniciando dashboard para:", currentUser.email);
            
            const loadScript = (src) => {
                return new Promise((resolve, reject) => {
                    const script = document.createElement('script');
                    script.src = src;
                    script.onload = resolve;
                    script.onerror = reject;
                    document.head.appendChild(script);
                });
            };

            Promise.all([
                loadScript('js/models/UserModel.js'),
                loadScript('js/views/DashboardView.js'),
                loadScript('js/controllers/DashboardController.js')
            ]).then(() => {
                const model = new UserModel();
                const view = new DashboardView();
                new DashboardController(view, model);
            }).catch(error => {
                console.error("Error al cargar scripts:", error);
                alert("Error al cargar la aplicación. Recarga la página.");
            });

        } catch (error) {
            console.error("Error crítico:", error);
            sessionStorage.removeItem('currentUser');
            window.location.href = 'index.html';
        }
    }
});