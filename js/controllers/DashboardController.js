class DashboardController {
    constructor(view) {
        this.view = view;
        this.userModel = new UserModel();
        this.roleModel = new RoleModel();
        this.vacancyModel = new VacancyModel();
        this.categoryModel = new CategoryModel();
        this.professionModel = new ProfessionModel();
        this.resumeModel = new ResumeModel();
        this.experienceModel = new ExperienceModel();
        this.studyModel = new StudyModel();
        this.vacationModel = new VacationModel();
        this.peaceSafeModel = new PeaceSafeModel();
        this.disabilityModel = new DisabilityModel();
        this.postulationModel = new PostulationModel();
        
        // Configurar event listeners para el menú
        this.setupMenuListeners();
    }
    
    setupMenuListeners() {
        document.querySelectorAll('[data-section]').forEach(item => {
            item.addEventListener('click', e => {
                e.preventDefault();
                const section = e.target.getAttribute('data-section');
                this.loadSection(section);
            });
        });
    }
    
    loadSection(section) {
        switch(section) {
            case 'users':
                this.showUsersSection();
                break;
            case 'roles':
                this.showRolesSection();
                break;
            // Agregar más casos para otras secciones
            default:
                this.view.mainContent.innerHTML = `
                    <div class="jumbotron bg-light p-5 rounded">
                        <h1 class="display-4">${section.charAt(0).toUpperCase() + section.slice(1)}</h1>
                        <p class="lead">Contenido de la sección ${section}.</p>
                    </div>`;
        }
    }
    
    showUsersSection() {
        const users = this.userModel.getAllUsers();
        this.view.showUsersSection(users);
        
        // Configurar event listeners para los botones
        document.getElementById('addUserBtn')?.addEventListener('click', () => {
            this.handleShowUserForm();
        });
        
        // Delegación de eventos para los botones de editar y eliminar
        document.addEventListener('click', (e) => {
            if (e.target.closest('.edit-user')) {
                const docNumber = e.target.closest('.edit-user').getAttribute('data-id');
                this.handleShowUserForm(docNumber);
            }
            
            if (e.target.closest('.delete-user')) {
                const docNumber = e.target.closest('.delete-user').getAttribute('data-id');
                this.handleDeleteUser(docNumber);
            }
        });
        
        // Configurar el botón de guardar del modal
        document.getElementById('modalSave')?.addEventListener('click', () => {
            this.handleSaveUser();
        });
    }

    handleShowUserForm(docNumber = null) {
        const user = docNumber ? this.userModel.getUserByDocNumber(docNumber) : null;
        this.view.showUserForm(user);
        this.currentEditingUser = docNumber;
    }

    handleSaveUser() {
        const form = document.getElementById(this.currentEditingUser ? 'editUserForm' : 'addUserForm');
        const formData = new FormData(form);
        
        const userData = {
            documentNumber: formData.get('documentNumber'),
            firstName: formData.get('firstName'),
            lastName: formData.get('lastName'),
            email: formData.get('email'),
            role: formData.get('role')
        };
        
        // Solo actualizar contraseña si se proporcionó
        const password = formData.get('password');
        if (password) {
            userData.password = password;
        }
        
        try {
            if (this.currentEditingUser) {
                // Editar usuario existente
                this.userModel.updateUser(this.currentEditingUser, userData);
                this.view.showSuccess('Usuario actualizado correctamente');
            } else {
                // Crear nuevo usuario (requiere contraseña)
                if (!password) {
                    throw new Error('La contraseña es requerida para nuevos usuarios');
                }
                this.userModel.createUser(userData);
                this.view.showSuccess('Usuario creado correctamente');
            }
            
            this.view.modal.hide();
            this.showUsersSection(); // Refrescar la lista
        } catch (error) {
            this.view.showError(error.message);
        }
    }

    handleDeleteUser(docNumber) {
        if (confirm('¿Está seguro de eliminar este usuario?')) {
            try {
                // No permitir eliminar al usuario admin
                if (docNumber === "123456789") {
                    throw new Error('No se puede eliminar al usuario administrador principal');
                }
                
                this.userModel.deleteUser(docNumber);
                this.view.showSuccess('Usuario eliminado correctamente');
                this.showUsersSection();
            } catch (error) {
                this.view.showError(error.message);
            }
        }
    }
    
    showRolesSection() {
        const roles = this.roleModel.getAllRoles();
        this.view.showRolesSection(roles);
        
        // Configurar event listeners para los botones
        document.getElementById('addRoleBtn')?.addEventListener('click', () => {
            this.view.showRoleForm();
        });
        
        // Agregar listeners para editar/eliminar roles
    }
    
    // Métodos para otras secciones...
}