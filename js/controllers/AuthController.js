class AuthController {
    constructor(view, model) {
        this.view = view;
        this.model = model;
        this.init();
    }

    init() {
        // Configurar event listeners
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }

        const registerForm = document.getElementById('registerForm');
        if (registerForm) {
            registerForm.addEventListener('submit', (e) => this.handleRegister(e));
        }
    }

    handleLogin(event) {
        event.preventDefault();
        
        try {
            // Obtener datos del formulario
            const { email, password } = this.view.getLoginData();

            // Validaciones básicas
            if (!email || !password) {
                throw new Error('Todos los campos son obligatorios');
            }

            // Autenticar usuario
            const user = this.model.authenticate(email, password);
            
            if (user) {
                // Guardar usuario en sessionStorage (sin información sensible)
                sessionStorage.setItem('currentUser', JSON.stringify({
                    id: user.id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    role: user.role
                }));

                // Redirección a dashboard
                window.location.href = 'dashboard.html';
            } else {
                throw new Error('Credenciales incorrectas');
            }
        } catch (error) {
            console.error('Error en login:', error);
            this.view.showError(error.message);
        }
    }

    handleRegister(event) {
        event.preventDefault();
        
        try {
            // Obtener datos del formulario
            const formData = this.view.getRegisterData();

            // Validaciones
            if (formData.password !== formData.confirmPassword) {
                throw new Error('Las contraseñas no coinciden');
            }

            // Crear usuario (eliminamos confirmPassword ya que no es necesario guardarlo)
            delete formData.confirmPassword;
            this.model.createUser(formData);

            // Mostrar mensaje de éxito y redirigir
            this.view.showSuccess('Registro exitoso. Redirigiendo...');
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1500);
        } catch (error) {
            console.error('Error en registro:', error);
            this.view.showError(error.message);
        }
    }
}

// Exportación para módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AuthController;
}