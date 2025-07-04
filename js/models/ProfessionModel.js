class ProfessionModel {
    constructor() {
        this.STORAGE_KEY = 'gath_professions';
        this._initialize();
    }

    _initialize() {
        if (!localStorage.getItem(this.STORAGE_KEY)) {
            const defaultProfessions = [
                { id: 1, name: "Desarrollador", description: "Profesionales en desarrollo de software" },
                { id: 2, name: "Médico", description: "Profesionales de la salud" }
            ];
            this._saveAll(defaultProfessions);
        }
    }

    _saveAll(professions) {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(professions));
    }

    getAllProfessions() {
        return JSON.parse(localStorage.getItem(this.STORAGE_KEY)) || [];
    }

    getProfessionById(id) {
        const professions = this.getAllProfessions();
        return professions.find(p => p.id === id);
    }

    createProfession(professionData) {
        const professions = this.getAllProfessions();
        const newId = professions.length > 0 ? Math.max(...professions.map(p => p.id)) + 1 : 1;
        
        const newProfession = {
            id: newId,
            ...professionData
        };
        
        professions.push(newProfession);
        this._saveAll(professions);
        return newProfession;
    }

    updateProfession(updatedProfession) {
        const professions = this.getAllProfessions();
        const index = professions.findIndex(p => p.id === updatedProfession.id);
        
        if (index === -1) throw new Error("Profesión no encontrada");
        
        professions[index] = { ...professions[index], ...updatedProfession };
        this._saveAll(professions);
        return professions[index];
    }

    deleteProfession(id) {
        const professions = this.getAllProfessions();
        const newProfessions = professions.filter(p => p.id !== id);
        
        if (newProfessions.length === professions.length) {
            throw new Error("Profesión no encontrada");
        }
        
        this._saveAll(newProfessions);
        return true;
    }
}