// dashboardController.js - Versión completa y corregida

import UserModel from '../models/UserModel.js';
import RoleModel from '../models/roleModel.js';
import DashboardView from '../views/dashboardView.js';

export default class DashboardController {
    constructor() {
        this.view = new DashboardView();
        this.userModel = new UserModel();
        this.roleModel = new RoleModel();
        this.currentEditingId = null;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.showUsersSection(); // Mostrar usuarios por defecto al cargar
        this.showCurrentUser();
    }

    setupEventListeners() {
        // Delegación de eventos para elementos dinámicos
        document.addEventListener('click', (e) => {
            // Menú lateral
            if (e.target.matches('[data-section]')) {
                e.preventDefault();
                const section = e.target.getAttribute('data-section');
                this.loadSection(section);
            }

            // CRUD Usuarios
            if (e.target.matches('#addUserBtn')) {
                this.showUserForm();
            } else if (e.target.matches('.edit-user')) {
                const docNumber = e.target.dataset.id;
                this.showUserForm(docNumber);
            } else if (e.target.matches('.delete-user')) {
                const docNumber = e.target.dataset.id;
                this.deleteUser(docNumber);
            }

            // Modal
            if (e.target.matches('#modalSave')) {
                this.saveUser();
            }
        });

        // Sidebar toggle
        document.getElementById('sidebarCollapse')?.addEventListener('click', () => {
            document.getElementById('sidebar').classList.toggle('active');
        });
    }

    showCurrentUser() {
        const user = JSON.parse(sessionStorage.getItem('currentUser'));
        if (user) {
            this.view.showCurrentUser(`${user.firstName} ${user.lastName}`);
        }
    }

    loadSection(section) {
        switch(section) {
            case 'users':
                this.showUsersSection();
                break;
            case 'roles':
                this.showRolesSection();
                break;
            default:
                this.view.showDefaultSection(section);
        }
    }

    // Sección Usuarios
    showUsersSection() {
        try {
            const users = this.userModel.getAllUsers();
            this.view.showUsersSection(users);
        } catch (error) {
            this.view.showError(error.message);
        }
    }

    showUserForm(docNumber = null) {
        this.currentEditingId = docNumber;
        const user = docNumber ? this.userModel.getUserByDocNumber(docNumber) : null;
        this.view.showUserForm(user);
    }

    async saveUser() {
        try {
            const formId = this.currentEditingId ? 'editUserForm' : 'addUserForm';
            const form = document.getElementById(formId);
            const formData = new FormData(form);
            const userData = Object.fromEntries(formData.entries());

            if (this.currentEditingId) {
                await this.userModel.updateUser(this.currentEditingId, userData);
                this.view.showSuccess('Usuario actualizado correctamente');
            } else {
                if (!userData.password) {
                    throw new Error('La contraseña es requerida');
                }
                await this.userModel.createUser(userData);
                this.view.showSuccess('Usuario creado correctamente');
            }

            this.view.hideModal();
            this.showUsersSection();
        } catch (error) {
            this.view.showError(error.message);
        }
    }

    async deleteUser(docNumber) {
        if (!confirm('¿Está seguro de eliminar este usuario?')) return;

        try {
            await this.userModel.deleteUser(docNumber);
            this.view.showSuccess('Usuario eliminado correctamente');
            this.showUsersSection();
        } catch (error) {
            this.view.showError(error.message);
        }
    }

    // Sección Roles
    showRolesSection() {
        try {
            const roles = this.roleModel.getAllRoles();
            this.view.showRolesSection(roles);
        } catch (error) {
            this.view.showError(error.message);
        }
    }
}