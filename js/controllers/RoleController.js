class RoleController {
    constructor(view, model) {
        this.view = view;
        this.model = model;
        this.currentEditingId = null;
        this.init();
    }

    init() {
        this.bindEvents();
        this.loadRoles();
    }

    bindEvents() {
        document.getElementById('addRoleBtn')?.addEventListener('click', () => this.showRoleForm());
        document.addEventListener('click', (e) => {
            if (e.target.closest('.edit-role')) {
                const id = e.target.closest('.edit-role').dataset.id;
                this.showEditForm(id);
            } else if (e.target.closest('.delete-role')) {
                const id = e.target.closest('.delete-role').dataset.id;
                this.deleteRole(id);
            } else if (e.target.closest('#saveRoleBtn')) {
                this.saveRole();
            }
        });
    }

    async loadRoles() {
        try {
            const roles = await this.model.getAllRoles();
            this.view.displayRoles(roles);
        } catch (error) {
            console.error("Error loading roles:", error);
            this.view.showError("Error al cargar roles");
        }
    }

    showRoleForm(role = null) {
        this.currentEditingId = role?.id || null;
        const modal = new bootstrap.Modal(document.getElementById('roleModal'));
        const form = document.getElementById('roleForm');
        
        document.getElementById('roleModalLabel').textContent = 
            this.currentEditingId ? 'Editar Rol' : 'Nuevo Rol';
        
        if (role) {
            document.getElementById('roleDescription').value = role.description;
        } else {
            form.reset();
        }
        
        modal.show();
    }

    async saveRole() {
        try {
            const description = document.getElementById('roleDescription').value.trim();
            
            if (!description) {
                throw new Error("El nombre del rol es requerido");
            }

            if (this.currentEditingId) {
                await this.model.updateRole(this.currentEditingId, description);
                this.view.showSuccess("Rol actualizado correctamente");
            } else {
                await this.model.createRole(description);
                this.view.showSuccess("Rol creado correctamente");
            }

            bootstrap.Modal.getInstance(document.getElementById('roleModal')).hide();
            await this.loadRoles();
        } catch (error) {
            console.error("Error saving role:", error);
            this.view.showError(error.message);
        }
    }

    async deleteRole(id) {
        if (!confirm("¿Está seguro de eliminar este rol?")) return;
        
        try {
            await this.model.deleteRole(id);
            this.view.showSuccess("Rol eliminado correctamente");
            await this.loadRoles();
        } catch (error) {
            console.error("Error deleting role:", error);
            this.view.showError(error.message);
        }
    }
}