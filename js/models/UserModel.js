export default class UserModel {
    constructor() {
        this.loadUsers();
    }

    loadUsers() {
        const defaultUser = {
            documentNumber: "123456789",
            firstName: "Admin",
            lastName: "Sistema",
            email: "admin@colsanitas.com",
            password: "admin123",
            role: "admin"
        };
        
        this.users = JSON.parse(localStorage.getItem('users')) || [defaultUser];
        
        if (!localStorage.getItem('users')) {
            this._saveToLocalStorage();
        }
    }

    getAllUsers() {
        return this.users;
    }

    getUserByDocNumber(docNumber) {
        return this.users.find(user => user.documentNumber === docNumber.toString());
    }

    createUser(userData) {
        if (this.users.some(user => user.email === userData.email)) {
            throw new Error('El correo ya está registrado');
        }
        if (this.users.some(user => user.documentNumber === userData.documentNumber)) {
            throw new Error('El documento ya está registrado');
        }

        this.users.push(userData);
        this._saveToLocalStorage();
        return true;
    }

    updateUser(docNumber, userData) {
        const index = this.users.findIndex(user => user.documentNumber === docNumber);
        if (index === -1) throw new Error('Usuario no encontrado');

        if (this.users.some((user, i) => i !== index && user.email === userData.email)) {
            throw new Error('El correo ya está en uso por otro usuario');
        }

        this.users[index] = { ...this.users[index], ...userData };
        this._saveToLocalStorage();
        return true;
    }

    deleteUser(docNumber) {
        if (docNumber === "123456789") {
            throw new Error('No se puede eliminar al administrador principal');
        }

        const initialLength = this.users.length;
        this.users = this.users.filter(user => user.documentNumber !== docNumber);
        
        if (this.users.length === initialLength) {
            throw new Error('Usuario no encontrado');
        }

        this._saveToLocalStorage();
        return true;
    }

    _saveToLocalStorage() {
        localStorage.setItem('users', JSON.stringify(this.users));
    }
}