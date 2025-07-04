// UserModel.js - Versión funcional completa
class UserModel {
    constructor() {
        this.STORAGE_KEY = 'gath_users_v2';
        this._initialize();
    }

    _initialize() {
        if (!localStorage.getItem(this.STORAGE_KEY)) {
            const defaultUsers = [{
                id: 'admin001',
                documentNumber: "123456789",
                firstName: "Admin",
                lastName: "Sistema",
                email: "admin@colsanitas.com",
                password: "admin123",
                role: "admin",
                createdAt: new Date().toISOString()
            }];
            this._saveAll(defaultUsers);
        }
    }

    getAllUsers() {
        return JSON.parse(localStorage.getItem(this.STORAGE_KEY)) || [];
    }

    getUserById(id) {
        const users = this.getAllUsers();
        return users.find(user => user.id === id);
    }

    createUser(userData) {
        if (!userData.password) throw new Error("La contraseña es obligatoria");
        
        const users = this.getAllUsers();
        
        // Validar unicidad
        if (users.some(u => u.email === userData.email)) {
            throw new Error("El correo ya está registrado");
        }
        if (users.some(u => u.documentNumber === userData.documentNumber)) {
            throw new Error("El documento ya está registrado");
        }

        // Asignar ID si no viene
        if (!userData.id) {
            userData.id = 'user_' + Date.now();
        }

        userData.createdAt = new Date().toISOString();
        users.push(userData);
        this._saveAll(users);
        return userData;
    }

    updateUser(updatedUser) {
        const users = this.getAllUsers();
        const index = users.findIndex(u => u.id === updatedUser.id);
        
        if (index === -1) throw new Error("Usuario no encontrado");

        // Validar unicidad (excepto para el mismo usuario)
        if (users.some((u, i) => i !== index && u.email === updatedUser.email)) {
            throw new Error("El correo ya está en uso");
        }

        // Mantener contraseña si no se proporciona nueva
        if (!updatedUser.password) {
            updatedUser.password = users[index].password;
        }

        users[index] = { ...users[index], ...updatedUser };
        this._saveAll(users);
        return users[index];
    }

    deleteUser(id) {
        if (id === 'admin001') throw new Error("No se puede eliminar al administrador");
        
        const users = this.getAllUsers();
        const newUsers = users.filter(u => u.id !== id);
        
        if (newUsers.length === users.length) {
            throw new Error("Usuario no encontrado");
        }

        this._saveAll(newUsers);
        return true;
    }

    _saveAll(users) {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(users));
    }
}