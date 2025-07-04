class DashboardView {
    constructor() {
        console.log("Inicializando DashboardView");
        
        // Inicialización segura del modal
        this.modal = this._initModal();
        this.currentUserElement = document.getElementById('currentUser');
        this.alertsContainer = document.getElementById('alertsContainer') || document.body;
    }

    _initModal() {
        const modalElement = document.getElementById('userModal');
        if (!modalElement) {
            console.error("Modal no encontrado");
            return {
                show: () => console.warn("Modal no disponible"),
                hide: () => console.warn("Modal no disponible")
            };
        }
        return new bootstrap.Modal(modalElement);
    }

    displayUsers(users) {
        try {
            const tableBody = document.querySelector('#usersTable tbody');
            if (!tableBody) throw new Error("Tabla de usuarios no encontrada");

            tableBody.innerHTML = users.map(user => `
                <tr>
                    <td>${user.documentNumber}</td>
                    <td>${user.firstName} ${user.lastName}</td>
                    <td>${user.email}</td>
                    <td>${user.role}</td>
                    <td>
                        <button class="btn btn-sm btn-primary edit-user" data-id="${user.id}">
                            <i class="bi bi-pencil-square"></i> Editar
                        </button>
                        <button class="btn btn-sm btn-danger delete-user" data-id="${user.id}">
                            <i class="bi bi-trash"></i> Eliminar
                        </button>
                    </td>
                </tr>
            `).join('');
        } catch (error) {
            console.error("Error al mostrar usuarios:", error);
            this.showError("Error al cargar usuarios");
        }
    }

    showUserForm(user = null) {
        const modalTitle = document.getElementById('userModalLabel');
        const form = document.getElementById('userForm');
        
        if (!modalTitle || !form) {
            console.error("Elementos del modal no encontrados");
            return;
        }

        modalTitle.textContent = user ? 'Editar Usuario' : 'Nuevo Usuario';
        form.innerHTML = user ? this._getEditFormHTML(user) : this._getAddFormHTML();
        this.modal.show();
    }

    _getAddFormHTML() {
        return `
            <div class="mb-3">
                <label class="form-label">Documento</label>
                <input type="text" class="form-control" name="documentNumber" required>
            </div>
            <div class="mb-3">
                <label class="form-label">Nombre</label>
                <input type="text" class="form-control" name="firstName" required>
            </div>
            <div class="mb-3">
                <label class="form-label">Apellido</label>
                <input type="text" class="form-control" name="lastName" required>
            </div>
            <div class="mb-3">
                <label class="form-label">Correo</label>
                <input type="email" class="form-control" name="email" required>
            </div>
            <div class="mb-3">
                <label class="form-label">Contraseña</label>
                <input type="password" class="form-control" name="password" required>
            </div>
            <div class="mb-3">
                <label class="form-label">Rol</label>
                <select class="form-select" name="role" required>
                    <option value="admin">Administrador</option>
                    <option value="user" selected>Usuario</option>
                </select>
            </div>
        `;
    }

    _getEditFormHTML(user) {
        return `
            <input type="hidden" name="id" value="${user.id}">
            <div class="mb-3">
                <label class="form-label">Documento</label>
                <input type="text" class="form-control" name="documentNumber" 
                       value="${user.documentNumber}" readonly>
            </div>
            <div class="mb-3">
                <label class="form-label">Nombre</label>
                <input type="text" class="form-control" name="firstName" 
                       value="${user.firstName}" required>
            </div>
            <div class="mb-3">
                <label class="form-label">Apellido</label>
                <input type="text" class="form-control" name="lastName" 
                       value="${user.lastName}" required>
            </div>
            <div class="mb-3">
                <label class="form-label">Correo</label>
                <input type="email" class="form-control" name="email" 
                       value="${user.email}" required>
            </div>
            <div class="mb-3">
                <label class="form-label">Contraseña</label>
                <input type="password" class="form-control" name="password" 
                       placeholder="Dejar en blanco para no cambiar">
            </div>
            <div class="mb-3">
                <label class="form-label">Rol</label>
                <select class="form-select" name="role" required>
                    <option value="admin" ${user.role === 'admin' ? 'selected' : ''}>Admin</option>
                    <option value="user" ${user.role !== 'admin' ? 'selected' : ''}>Usuario</option>
                </select>
            </div>
        `;
    }

    hideModal() {
        this.modal.hide();
    }

    showSuccess(message) {
        this._showAlert(message, 'success');
    }

    showError(message) {
        this._showAlert(message, 'danger');
    }

    _showAlert(message, type) {
        const alert = `
            <div class="alert alert-${type} alert-dismissible fade show">
                ${message}
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            </div>
        `;
        this.alertsContainer.insertAdjacentHTML('afterbegin', alert);
    }

    showCurrentUser(name) {
        if (this.currentUserElement) {
            this.currentUserElement.textContent = name;
        }
    }
}