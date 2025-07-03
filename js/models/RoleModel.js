class RoleModel {
    constructor() {
        this.roles = JSON.parse(localStorage.getItem('roles')) || [
            { id: 1, description: 'Administrador' },
            { id: 2, description: 'Usuario' },
            { id: 3, description: 'Reclutador' }
        ];
    }
    
    getAllRoles() {
        return this.roles;
    }
    
    getRoleById(id) {
        return this.roles.find(role => role.id === parseInt(id));
    }
    
    createRole(description) {
        const newId = this.roles.length > 0 ? Math.max(...this.roles.map(r => r.id)) + 1 : 1;
        this.roles.push({ id: newId, description });
        localStorage.setItem('roles', JSON.stringify(this.roles));
        return newId;
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