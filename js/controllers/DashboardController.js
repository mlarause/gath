class DashboardController {
    constructor(view, model) {
        this.view = view;
        this.model = model;
        this.currentEditingId = null;
        this._init();
    }

    _init() {
        this._bindEvents();
        this._loadUsers();
    }

    _bindEvents() {
        document.addEventListener('click', (e) => {
            if (e.target.closest('#addUserBtn')) {
                this._showUserForm();
            } else if (e.target.closest('.edit-user')) {
                const id = e.target.closest('.edit-user').dataset.id;
                this._showEditForm(id);
            } else if (e.target.closest('.delete-user')) {
                const id = e.target.closest('.delete-user').dataset.id;
                this._deleteUser(id);
            } else if (e.target.closest('#modalSave')) {
                this._saveUser();
            }
        });
    }

    async _loadUsers() {
        try {
            const users = await this.model.getAllUsers();
            this.view.displayUsers(users);
        } catch (error) {
            console.error("Error al cargar usuarios:", error);
            this.view.showError("Error al cargar usuarios");
        }
    }

    _showUserForm() {
        this.currentEditingId = null;
        this.view.showUserForm();
    }

    async _showEditForm(id) {
        try {
            const user = await this.model.getUserById(id);
            this.currentEditingId = id;
            this.view.showUserForm(user);
        } catch (error) {
            console.error("Error al editar usuario:", error);
            this.view.showError(error.message);
        }
    }

    async _saveUser() {
        try {
            const form = document.getElementById('userForm');
            const formData = new FormData(form);
            
            const userData = {
                id: this.currentEditingId || 'user_' + Date.now(),
                documentNumber: formData.get('documentNumber'),
                firstName: formData.get('firstName'),
                lastName: formData.get('lastName'),
                email: formData.get('email'),
                role: formData.get('role')
            };

            const password = formData.get('password');
            if (password) userData.password = password;

            if (this.currentEditingId) {
                await this.model.updateUser(userData);
                this.view.showSuccess("Usuario actualizado correctamente");
            } else {
                if (!password) throw new Error("La contraseña es requerida");
                await this.model.createUser(userData);
                this.view.showSuccess("Usuario creado correctamente");
            }

            this.view.hideModal();
            await this._loadUsers();
        } catch (error) {
            console.error("Error al guardar usuario:", error);
            this.view.showError(error.message);
        }
    }

    async _deleteUser(id) {
        if (!confirm("¿Está seguro que desea eliminar este usuario?")) return;

        try {
            await this.model.deleteUser(id);
            this.view.showSuccess("Usuario eliminado correctamente");
            await this._loadUsers();
        } catch (error) {
            console.error("Error al eliminar usuario:", error);
            this.view.showError(error.message);
        }
    }
}