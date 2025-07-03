class AuthController {
    constructor(model, view) {
        this.model = model;
        this.view = view;
        
        // Configurar event listeners
        if (this.view.loginForm) {
            this.view.loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }
        
        if (this.view.registerForm) {
            this.view.registerForm.addEventListener('submit', (e) => this.handleRegister(e));
        }
    }

    // Manejar el evento de login
    handleLogin(e) {
        e.preventDefault();
        
        const { email, password } = this.view.getLoginData();
        
        // Validar campos
        if (!email || !password) {
            this.view.showLoginError('Todos los campos son obligatorios');
            return;
        }
        
        // Autenticar usuario
        const user = this.model.authenticate(email, password);
        
        if (user) {
            // Guardar usuario en sessionStorage
            sessionStorage.setItem('currentUser', JSON.stringify(user));
            
            // Redirigir según el rol
            if (user.role === 'admin') {
                window.location.href = 'dashboard.html'; // A implementar en siguiente fase
            } else {
                window.location.href = 'user-dashboard.html'; // A implementar en siguiente fase
            }
        } else {
            this.view.showLoginError('Credenciales incorrectas');
            this.view.clearLoginForm();
        }
    }

    // Manejar el evento de registro
    handleRegister(e) {
        e.preventDefault();
        
        const userData = this.view.getRegisterData();
        
        // Validar campos
        if (userData.email !== userData.confirmEmail) {
            this.view.showRegisterError('Los correos electrónicos no coinciden');
            return;
        }
        
        if (userData.password !== userData.confirmPassword) {
            this.view.showRegisterError('Las contraseñas no coinciden');
            return;
        }
        
        // Registrar usuario
        const success = this.model.register(userData);
        
        if (success) {
            this.view.showRegisterSuccess();
        } else {
            this.view.showRegisterError('El usuario ya existe (correo o documento)');
        }
    }
}