class ProfessionController {
    constructor(view, model) {
        this.view = view;
        this.model = model;
        this.currentEditingId = null;
        this.init();
    }

    init() {
        this.bindEvents();
        this.loadProfessions();
    }

    bindEvents() {
        document.getElementById('addProfessionBtn')?.addEventListener('click', () => this.showProfessionForm());
        document.addEventListener('click', (e) => {
            if (e.target.closest('.edit-profession')) {
                const id = e.target.closest('.edit-profession').dataset.id;
                this.showEditForm(id);
            } else if (e.target.closest('.delete-profession')) {
                const id = e.target.closest('.delete-profession').dataset.id;
                this.deleteProfession(id);
            } else if (e.target.closest('#saveProfessionBtn')) {
                this.saveProfession();
            }
        });
    }

    async loadProfessions() {
        try {
            const professions = await this.model.getAllProfessions();
            this.view.displayProfessions(professions);
        } catch (error) {
            console.error("Error loading professions:", error);
            this.view.showError("Error al cargar profesiones");
        }
    }

    showProfessionForm(profession = null) {
        this.currentEditingId = profession?.id || null;
        const modal = new bootstrap.Modal(document.getElementById('professionModal'));
        const form = document.getElementById('professionForm');
        
        document.getElementById('professionModalLabel').textContent = 
            this.currentEditingId ? 'Editar Profesión' : 'Nueva Profesión';
        
        if (profession) {
            document.getElementById('professionName').value = profession.name;
            document.getElementById('professionDescription').value = profession.description || '';
        } else {
            form.reset();
        }
        
        modal.show();
    }

    async showEditForm(id) {
        try {
            const profession = await this.model.getProfessionById(id);
            this.currentEditingId = id;
            this.showProfessionForm(profession);
        } catch (error) {
            console.error("Error editing profession:", error);
            this.view.showError(error.message);
        }
    }

    async saveProfession() {
        try {
            const name = document.getElementById('professionName').value.trim();
            const description = document.getElementById('professionDescription').value.trim();
            
            if (!name) {
                throw new Error("El nombre de la profesión es requerido");
            }

            const professionData = { name, description };

            if (this.currentEditingId) {
                professionData.id = this.currentEditingId;
                await this.model.updateProfession(professionData);
                this.view.showSuccess("Profesión actualizada correctamente");
            } else {
                await this.model.createProfession(professionData);
                this.view.showSuccess("Profesión creada correctamente");
            }

            bootstrap.Modal.getInstance(document.getElementById('professionModal')).hide();
            await this.loadProfessions();
        } catch (error) {
            console.error("Error saving profession:", error);
            this.view.showError(error.message);
        }
    }

    async deleteProfession(id) {
        if (!confirm("¿Está seguro de eliminar esta profesión?")) return;
        
        try {
            await this.model.deleteProfession(id);
            this.view.showSuccess("Profesión eliminada correctamente");
            await this.loadProfessions();
        } catch (error) {
            console.error("Error deleting profession:", error);
            this.view.showError(error.message);
        }
    }
}