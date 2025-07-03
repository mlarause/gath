import UserModel from '../models/UserModel.js';
import DashboardView from '../views/DashboardView.js';

export default class DashboardController {
    constructor() {
        this.view = new DashboardView();
        this.userModel = new UserModel();
        this.currentEditingId = null;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.showUsersSection();
        this.setupModalListener();
        this.setupSidebarToggle();
    }

    setupEventListeners() {
        // Delegación de eventos para elementos dinámicos
        document.addEventListener('click', (e) => {
            if (e.target.closest('#addUserBtn')) {
                this.showUserForm();
            } else if (e.target.closest('.edit-user')) {
                const docNumber = e.target.closest('.edit-user').dataset.id;
                this.showUserForm(docNumber);
            } else if (e.target.closest('.delete-user')) {
                const docNumber = e.target.closest('.delete-user').dataset.id;
                this.deleteUser(docNumber);
            }
        });
    }

    setupModalListener() {
        const modalSave = document.getElementById('modalSave');
        if (modalSave) {
            modalSave.addEventListener('click', () => {
                this.saveUser();
            });
        }
    }

    setupSidebarToggle() {
        const sidebarCollapse = document.getElementById('sidebarCollapse');
        if (sidebarCollapse) {
            sidebarCollapse.addEventListener('click', () => {
                document.getElementById('sidebar').classList.toggle('active');
            });
        }
    }

    showUsersSection() {
        try {
            const users = this.userModel.getAllUsers();
            this.view.showUsersSection(users);
        } catch (error) {
            console.error('Error al mostrar usuarios:', error);
            this.view.showError('Error al cargar usuarios');
        }
    }

    showUserForm(docNumber = null) {
        this.currentEditingId = docNumber;
        const user = docNumber ? this.userModel.getUserByDocNumber(docNumber) : null;
        this.view.showUserForm(user);
    }

    saveUser() {
        try {
            const formId = this.currentEditingId ? 'editUserForm' : 'addUserForm';
            const form = document.getElementById(formId);
            
            if (!form) {
                throw new Error('Formulario no encontrado');
            }

            const formData = new FormData(form);
            const userData = {
                documentNumber: formData.get('documentNumber'),
                firstName: formData.get('firstName'),
                lastName: formData.get('lastName'),
                email: formData.get('email'),
                role: formData.get('role')
            };

            const password = formData.get('password');
            if (password) userData.password = password;

            if (this.currentEditingId) {
                this.userModel.updateUser(this.currentEditingId, userData);
                this.view.showSuccess('Usuario actualizado correctamente');
            } else {
                if (!password) throw new Error('La contraseña es requerida');
                this.userModel.createUser(userData);
                this.view.showSuccess('Usuario creado correctamente');
            }

            this.view.hideModal();
            this.showUsersSection();
        } catch (error) {
            console.error('Error al guardar usuario:', error);
            this.view.showError(error.message);
        }
    }

    deleteUser(docNumber) {
        if (!confirm('¿Está seguro de eliminar este usuario?')) return;

        try {
            this.userModel.deleteUser(docNumber);
            this.view.showSuccess('Usuario eliminado correctamente');
            this.showUsersSection();
        } catch (error) {
            console.error('Error al eliminar usuario:', error);
            this.view.showError(error.message);
        }
    }
}