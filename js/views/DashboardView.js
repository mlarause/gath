Class DashboardView {
    constructor() {
        console.log("Inicializando DashboardView");
        
        // Inicialización segura del modal
        const modalElement = document.getElementById('userModal');
        if (modalElement) {
            this.modal = new bootstrap.Modal(modalElement);
        } else {
            console.error("Elemento #userModal no encontrado");
            this.modal = {
                show: () => console.warn("Modal no disponible"),
                hide: () => console.warn("Modal no disponible")
            };
        }
        
        this.currentUserElement = document.getElementById('currentUser');
    }

    displayUsers(users) {
        console.log("Mostrando usuarios en la vista", users);
        const tableBody = document.querySelector('#usersTable tbody');
        
        if (!tableBody) {
            console.error("No se encontró el elemento #usersTable tbody");
            return;
        }

        tableBody.innerHTML = users.map(user => this._createUserRow(user)).join('');
        console.log("Usuarios renderizados correctamente");
    }

    _createUserRow(user) {
        return `
            <tr>
                <td>${user.documentNumber || ''}</td>
                <td>${(user.firstName || '') + ' ' + (user.lastName || '')}</td>
                <td>${user.email || ''}</td>
                <td>${user.role || 'user'}</td>
                <td>
                    <button class="btn btn-sm btn-primary edit-user" data-id="${user.id || ''}">
                        <i class="bi bi-pencil-square"></i> Editar
                    </button>
                    <button class="btn btn-sm btn-danger delete-user" data-id="${user.id || ''}">
                        <i class="bi bi-trash"></i> Eliminar
                    </button>
                </td>
            </tr>
        `;
    }

    showUserForm(user = null) {
        console.log("Mostrando formulario para usuario:", user);
        const modalTitle = document.getElementById('userModalLabel');
        const form = document.getElementById('userForm');
        
        if (!modalTitle || !form) {
            console.error("Elementos del modal no encontrados");
            return;
        }

        modalTitle.textContent = user ? 'Editar Usuario' : 'Crear Nuevo Usuario';
        form.innerHTML = user ? this._getEditFormHTML(user) : this._getAddFormHTML();
        
        this.modal.show();
    }

    _getAddFormHTML() {
        return `
            <div class="mb-3">
                <label class="form-label">Número de Documento</label>
                <input type="text" class="form-control" name="documentNumber" required>
            </div>
            <div class="mb-3">
                <label class="form-label">Primer Nombre</label>
                <input type="text" class="form-control" name="firstName" required>
            </div>
            <div class="mb-3">
                <label class="form-label">Primer Apellido</label>
                <input type="text" class="form-control" name="lastName" required>
            </div>
            <div class="mb-3">
                <label class="form-label">Correo Electrónico</label>
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
            <input type="hidden" name="id" value="${user.id || ''}">
            <div class="mb-3">
                <label class="form-label">Número de Documento</label>
                <input type="text" class="form-control" name="documentNumber" 
                       value="${user.documentNumber || ''}" readonly>
            </div>
            <div class="mb-3">
                <label class="form-label">Primer Nombre</label>
                <input type="text" class="form-control" name="firstName" 
                       value="${user.firstName || ''}" required>
            </div>
            <div class="mb-3">
                <label class="form-label">Primer Apellido</label>
                <input type="text" class="form-control" name="lastName" 
                       value="${user.lastName || ''}" required>
            </div>
            <div class="mb-3">
                <label class="form-label">Correo Electrónico</label>
                <input type="email" class="form-control" name="email" 
                       value="${user.email || ''}" required>
            </div>
            <div class="mb-3">
                <label class="form-label">Contraseña</label>
                <input type="password" class="form-control" name="password" 
                       placeholder="Dejar en blanco para no cambiar">
            </div>
            <div class="mb-3">
                <label class="form-label">Rol</label>
                <select class="form-select" name="role" required>
                    <option value="admin" ${user.role === 'admin' ? 'selected' : ''}>Administrador</option>
                    <option value="user" ${!user.role || user.role === 'user' ? 'selected' : ''}>Usuario</option>
                </select>
            </div>
        `;
    }

    hideModal() {
        console.log("Ocultando modal");
        this.modal.hide();
    }

    showSuccess(message) {
        this._showAlert(message, 'success');
    }

    showError(message) {
        this._showAlert(message, 'danger');
    }

    _showAlert(message, type) {
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
        alertDiv.role = 'alert';
        alertDiv.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;

        const container = document.getElementById('alertsContainer') || document.body;
        container.prepend(alertDiv);

        setTimeout(() => {
            alertDiv.classList.remove('show');
            setTimeout(() => alertDiv.remove(), 150);
        }, 5000);
    }

    showCurrentUser(userInfo) {
        if (this.currentUserElement) {
            this.currentUserElement.textContent = userInfo;
        }
    }
}

// Exportación para módulos (si es necesario)
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = DashboardView;
}