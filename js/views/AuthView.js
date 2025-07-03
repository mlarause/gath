class AuthView {
    constructor() {
        this.loginForm = document.getElementById('loginForm');
        this.registerForm = document.getElementById('registerForm');
    }

    // Mostrar mensaje de error en el login
    showLoginError(message) {
        alert(`Error: ${message}`);
    }

    // Mostrar mensaje de éxito en el registro
    showRegisterSuccess() {
        alert('Registro exitoso. Ahora puedes iniciar sesión.');
        window.location.href = 'index.html';
    }

    // Mostrar mensaje de error en el registro
    showRegisterError(message) {
        alert(`Error: ${message}`);
    }

    // Obtener datos del formulario de login
    getLoginData() {
        return {
            email: document.getElementById('email').value,
            password: document.getElementById('password').value
        };
    }

    // Obtener datos del formulario de registro
    getRegisterData() {
        return {
            documentNumber: document.getElementById('documentNumber').value,
            firstName: document.getElementById('firstName').value,
            secondName: document.getElementById('secondName').value,
            lastName: document.getElementById('lastName').value,
            secondLastName: document.getElementById('secondLastName').value,
            gender: document.getElementById('gender').value,
            age: document.getElementById('age').value,
            email: document.getElementById('email').value,
            confirmEmail: document.getElementById('confirmEmail').value,
            password: document.getElementById('password').value,
            confirmPassword: document.getElementById('confirmPassword').value,
            address: document.getElementById('address').value,
            phone: document.getElementById('phone').value,
            landline: document.getElementById('landline').value,
            role: 'user' // Rol por defecto para nuevos usuarios
        };
    }

    // Limpiar formulario de login
    clearLoginForm() {
        this.loginForm.reset();
    }
}