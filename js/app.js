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
                loadScript('js/models/ResumeModel.js'),
                loadScript('js/models/ExperienceModel.js'),
                loadScript('js/models/StudyModel.js'),
                loadScript('js/views/DashboardView.js'),
                loadScript('js/controllers/DashboardController.js'),
                loadScript('js/controllers/RoleController.js'),
                loadScript('js/controllers/VacancyController.js'),
                loadScript('js/controllers/CategoryController.js'),
                loadScript('js/controllers/ProfessionController.js'),
                loadScript('js/controllers/ResumeController.js'),
                loadScript('js/controllers/ExperienceController.js'),
                loadScript('js/controllers/StudyController.js')
            ]).then(() => {
                const view = new DashboardView();
                const userModel = new UserModel();
                const resumeModel = new ResumeModel();
                const experienceModel = new ExperienceModel();
                const studyModel = new StudyModel();
                
                // Inicializar controladores principales
                new DashboardController(view, userModel);
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
                
                // Inicializar controladores de hoja de vida
                const resumeController = new ResumeController(view, resumeModel, userModel);
                const experienceController = new ExperienceController(view, experienceModel);
                const studyController = new StudyController(view, studyModel);
                
                // Configurar carga de datos cuando se selecciona la sección
                document.querySelectorAll('.menu-link').forEach(link => {
                    link.addEventListener('click', function(e) {
                        const section = this.getAttribute('data-section');
                        
                        if (section === 'resumes') {
                            resumeController.loadResume();
                            const resume = resumeModel.getResumeByUserId(currentUser.id);
                            if (resume) {
                                experienceController.loadExperiences(resume.id);
                                studyController.loadStudies(resume.id);
                            }
                        }
                    });
                });
            });
        } catch (error) {
            console.error("Error:", error);
        }
    }
});