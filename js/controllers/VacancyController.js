class VacancyController {
    constructor(view, model, categoryModel, professionModel) {
        this.view = view;
        this.model = model;
        this.categoryModel = categoryModel;
        this.professionModel = professionModel;
        this.currentEditingId = null;
        this.init();
    }

    init() {
        this.bindEvents();
        this.loadVacancies();
    }

    bindEvents() {
        document.getElementById('addVacancyBtn')?.addEventListener('click', () => this.showVacancyForm());
        document.addEventListener('click', (e) => {
            if (e.target.closest('.edit-vacancy')) {
                const id = e.target.closest('.edit-vacancy').dataset.id;
                this.showEditForm(id);
            } else if (e.target.closest('.delete-vacancy')) {
                const id = e.target.closest('.delete-vacancy').dataset.id;
                this.deleteVacancy(id);
            } else if (e.target.closest('#saveVacancyBtn')) {
                this.saveVacancy();
            }
        });
    }

    async loadVacancies() {
        try {
            const vacancies = await this.model.getAllVacancies();
            const categories = await this.categoryModel.getAllCategories();
            const professions = await this.professionModel.getAllProfessions();
            
            // Enriquecer datos con nombres de categorías y profesiones
            const enrichedVacancies = vacancies.map(vacancy => ({
                ...vacancy,
                categoryName: categories.find(c => c.id === vacancy.categoryId)?.name || 'Desconocida',
                professionName: professions.find(p => p.id === vacancy.professionId)?.name || 'Desconocida'
            }));
            
            this.view.displayVacancies(enrichedVacancies);
        } catch (error) {
            console.error("Error loading vacancies:", error);
            this.view.showError("Error al cargar vacantes");
        }
    }

    async showVacancyForm(vacancy = null) {
        this.currentEditingId = vacancy?.id || null;
        
        try {
            const categories = await this.categoryModel.getAllCategories();
            const professions = await this.professionModel.getAllProfessions();
            
            this.view.showVacancyForm(vacancy, categories, professions);
        } catch (error) {
            console.error("Error showing vacancy form:", error);
            this.view.showError(error.message);
        }
    }

    async showEditForm(id) {
        try {
            const vacancy = await this.model.getVacancyById(id);
            this.currentEditingId = id;
            await this.showVacancyForm(vacancy);
        } catch (error) {
            console.error("Error editing vacancy:", error);
            this.view.showError(error.message);
        }
    }

    async saveVacancy() {
        try {
            const form = document.getElementById('vacancyForm');
            const formData = new FormData(form);
            
            const vacancyData = {
                title: formData.get('title'),
                description: formData.get('description'),
                categoryId: parseInt(formData.get('categoryId')),
                professionId: parseInt(formData.get('professionId')),
                status: formData.get('status')
            };

            if (this.currentEditingId) {
                vacancyData.id = this.currentEditingId;
                await this.model.updateVacancy(vacancyData);
                this.view.showSuccess("Vacante actualizada correctamente");
            } else {
                await this.model.createVacancy(vacancyData);
                this.view.showSuccess("Vacante creada correctamente");
            }

            this.view.hideModal();
            await this.loadVacancies();
        } catch (error) {
            console.error("Error saving vacancy:", error);
            this.view.showError(error.message);
        }
    }

    async deleteVacancy(id) {
        if (!confirm("¿Está seguro de eliminar esta vacante?")) return;
        
        try {
            await this.model.deleteVacancy(id);
            this.view.showSuccess("Vacante eliminada correctamente");
            await this.loadVacancies();
        } catch (error) {
            console.error("Error deleting vacancy:", error);
            this.view.showError(error.message);
        }
    }
}