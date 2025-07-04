class RoleModel {
    constructor() {
        this.STORAGE_KEY = 'gath_roles';
        this.roles = JSON.parse(localStorage.getItem(this.STORAGE_KEY)) || [
            { id: 1, description: 'Administrador' },
            { id: 2, description: 'Usuario' },
            { id: 3, description: 'Reclutador' }
        ];
        this._saveAll();
    }

    _saveAll() {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.roles));
    }

    getAllRoles() {
        return this.roles;
    }

    createRole(description) {
        const newId = this.roles.length > 0 ? Math.max(...this.roles.map(r => r.id)) + 1 : 1;
        const newRole = { id: newId, description };
        this.roles.push(newRole);
        this._saveAll();
        return newRole;
    }
    
    updateRole(id, description) {
        const role = this.getRoleById(id);
        if (role) {
            role.description = description;
            localStorage.setItem('roles', JSON.stringify(this.roles));
            return true;
        }
        return false;
    }
    
    deleteRole(id) {
        const index = this.roles.findIndex(role => role.id === parseInt(id));
        if (index !== -1) {
            this.roles.splice(index, 1);
            localStorage.setItem('roles', JSON.stringify(this.roles));
            return true;
        }
        return false;
    }
}