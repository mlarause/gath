export default class UserModel {
    constructor() {
        this.users = this.loadUsers();
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
        
        const storedUsers = localStorage.getItem('users');
        const users = storedUsers ? JSON.parse(storedUsers) : [defaultUser];
        
        if (!storedUsers) {
            localStorage.setItem('users', JSON.stringify(users));
        }
        
        return users;
    }

    getAllUsers() {
        return this.users;
    }

    getUserByDocNumber(docNumber) {
        const user = this.users.find(user => user.documentNumber === docNumber.toString());
        if (!user) throw new Error('Usuario no encontrado');
        return user;
    }

    createUser(userData) {
        if (!userData.documentNumber || !userData.firstName || !userData.lastName || !userData.email || !userData.password) {
            throw new Error('Todos los campos son obligatorios');
        }

        if (this.users.some(user => user.email === userData.email)) {
            throw new Error('El correo ya está registrado');
        }

        if (this.users.some(user => user.documentNumber === userData.documentNumber)) {
            throw new Error('El documento ya está registrado');
        }

        this.users.push(userData);
        this.saveUsers();
        return true;
    }

    updateUser(docNumber, userData) {
        const index = this.users.findIndex(user => user.documentNumber === docNumber.toString());
        if (index === -1) throw new Error('Usuario no encontrado');

        if (this.users.some((user, i) => i !== index && user.email === userData.email)) {
            throw new Error('El correo ya está en uso por otro usuario');
        }

        // Mantener la contraseña original si no se proporciona una nueva
        if (!userData.password) {
            userData.password = this.users[index].password;
        }

        this.users[index] = { ...this.users[index], ...userData };
        this.saveUsers();
        return true;
    }

    deleteUser(docNumber) {
        if (docNumber === "123456789") {
            throw new Error('No se puede eliminar al administrador principal');
        }

        const initialLength = this.users.length;
        this.users = this.users.filter(user => user.documentNumber !== docNumber.toString());
        
        if (this.users.length === initialLength) {
            throw new Error('Usuario no encontrado');
        }

        this.saveUsers();
        return true;
    }

    saveUsers() {
        localStorage.setItem('users', JSON.stringify(this.users));
    }
}