document.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname.includes('dashboard.html')) {
        const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
        
        if (!currentUser) {
            window.location.href = 'index.html';
            return;
        }

        try {
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
                loadScript('js/models/RoleModel.js'),
                loadScript('js/models/VacancyModel.js'),
                loadScript('js/models/CategoryModel.js'),
                loadScript('js/models/ProfessionModel.js'),
                loadScript('js/views/DashboardView.js'),
                loadScript('js/controllers/DashboardController.js'),
                loadScript('js/controllers/RoleController.js'),
                loadScript('js/controllers/VacancyController.js'),
                loadScript('js/controllers/CategoryController.js'),
                loadScript('js/controllers/ProfessionController.js')
            ]).then(() => {
                const view = new DashboardView();
                
                // Inicializar todos los controladores
                new DashboardController(view, new UserModel());
                new RoleController(view, new RoleModel());
                
                // Inicializar controladores de vacantes, categorías y profesiones
                const categoryModel = new CategoryModel();
                const professionModel = new ProfessionModel();
                new VacancyController(
                    view, 
                    new VacancyModel(), 
                    categoryModel, 
                    professionModel
                );
                new CategoryController(view, categoryModel);
                new ProfessionController(view, professionModel);
            });
        } catch (error) {
            console.error("Error:", error);
        }
    }
});