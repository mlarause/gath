class VacancyModel {
    constructor() {
        this.STORAGE_KEY = 'gath_vacancies';
        this._initialize();
    }

    _initialize() {
        if (!localStorage.getItem(this.STORAGE_KEY)) {
            const defaultVacancies = [{
                id: 1,
                title: "Desarrollador Frontend",
                description: "Desarrollo de interfaces web con React",
                categoryId: 1,
                professionId: 1,
                status: "active",
                createdAt: new Date().toISOString()
            }];
            this._saveAll(defaultVacancies);
        }
    }

    _saveAll(vacancies) {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(vacancies));
    }

    getAllVacancies() {
        return JSON.parse(localStorage.getItem(this.STORAGE_KEY)) || [];
    }

    getVacancyById(id) {
        const vacancies = this.getAllVacancies();
        return vacancies.find(v => v.id === id);
    }

    createVacancy(vacancyData) {
        const vacancies = this.getAllVacancies();
        const newId = vacancies.length > 0 ? Math.max(...vacancies.map(v => v.id)) + 1 : 1;
        
        const newVacancy = {
            id: newId,
            ...vacancyData,
            createdAt: new Date().toISOString()
        };
        
        vacancies.push(newVacancy);
        this._saveAll(vacancies);
        return newVacancy;
    }

    updateVacancy(updatedVacancy) {
        const vacancies = this.getAllVacancies();
        const index = vacancies.findIndex(v => v.id === updatedVacancy.id);
        
        if (index === -1) throw new Error("Vacante no encontrada");
        
        vacancies[index] = { ...vacancies[index], ...updatedVacancy };
        this._saveAll(vacancies);
        return vacancies[index];
    }

    deleteVacancy(id) {
        const vacancies = this.getAllVacancies();
        const newVacancies = vacancies.filter(v => v.id !== id);
        
        if (newVacancies.length === vacancies.length) {
            throw new Error("Vacante no encontrada");
        }
        
        this._saveAll(newVacancies);
        return true;
    }
}