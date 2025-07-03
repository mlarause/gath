class UserModel {
    constructor() {
        // Usuario predeterminado (admin)
        this.defaultUser = {
            documentNumber: "123456789",
            firstName: "Admin",
            lastName: "Sistema",
            email: "admin@colsanitas.com",
            password: "admin123",
            role: "admin"
        };
        
        this.users = JSON.parse(localStorage.getItem('users')) || [this.defaultUser];
    }

    // Obtener todos los usuarios
    getAllUsers() {
        return this.users;
    }

    // Obtener usuario por número de documento
    getUserByDocNumber(docNumber) {
        return this.users.find(user => user.documentNumber === docNumber.toString());
    }

    // Crear nuevo usuario
    createUser(userData) {
        // Verificar si el usuario ya existe
        const userExists = this.users.some(
            user => user.email === userData.email || 
                   user.documentNumber === userData.documentNumber
        );
        
        if (userExists) {
            throw new Error('El usuario ya existe (correo o documento)');
        }
        
        // Agregar nuevo usuario
        this.users.push(userData);
        this._saveToLocalStorage();
        return true;
    }

    // Actualizar usuario
    updateUser(docNumber, userData) {
        const userIndex = this.users.findIndex(
            user => user.documentNumber === docNumber.toString()
        );
        
        if (userIndex === -1) {
            throw new Error('Usuario no encontrado');
        }
        
        // Verificar si el nuevo email ya existe en otro usuario
        const emailExists = this.users.some(
            (user, index) => index !== userIndex && user.email === userData.email
        );
        
        if (emailExists) {
            throw new Error('El correo electrónico ya está en uso por otro usuario');
        }
        
        // Actualizar datos (excepto documento que es PK)
        this.users[userIndex] = {
            ...this.users[userIndex],
            ...userData,
            documentNumber: docNumber.toString() // Mantener el documento original
        };
        
        this._saveToLocalStorage();
        return true;
    }

    // Eliminar usuario
    deleteUser(docNumber) {
        const initialLength = this.users.length;
        this.users = this.users.filter(
            user => user.documentNumber !== docNumber.toString()
        );
        
        if (this.users.length === initialLength) {
            throw new Error('Usuario no encontrado');
        }
        
        this._saveToLocalStorage();
        return true;
    }

    // Autenticar usuario
    authenticate(email, password) {
        return this.users.find(
            user => user.email === email && user.password === password
        );
    }

    // Guardar en localStorage
    _saveToLocalStorage() {
        localStorage.setItem('users', JSON.stringify(this.users));
    }
}