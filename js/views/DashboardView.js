class DashboardView {
    constructor() {
        console.log("Inicializando DashboardView");
        
        // Inicialización segura de elementos del DOM
        this.modal = this._initModal();
        this.currentUserElement = document.getElementById('currentUser');
        this.alertsContainer = document.getElementById('alertsContainer') || this._createAlertsContainer();
        
        // Mostrar usuario actual
        this._showCurrentUser();
    }

    _initModal() {
        const modalElement = document.getElementById('userModal');
        if (!modalElement) {
            console.error("ERROR: No se encontró el modal con ID 'userModal'");
            return {
                show: () => console.warn("Modal no disponible"),
                hide: () => console.warn("Modal no disponible")
            };
        }
        return new bootstrap.Modal(modalElement);
    }

    _createAlertsContainer() {
        const container = document.createElement('div');
        container.id = 'alertsContainer';
        container.className = 'position-fixed top-0 end-0 p-3';
        container.style.zIndex = '1100';
        document.body.prepend(container);
        return container;
    }

    _showCurrentUser() {
        try {
            const userData = JSON.parse(sessionStorage.getItem('currentUser'));
            if (this.currentUserElement && userData) {
                this.currentUserElement.textContent = 
                    `${userData.firstName} ${userData.lastName}`;
            }
        } catch (error) {
            console.error("Error al mostrar usuario actual:", error);
        }
    }

    displayUsers(users) {
        try {
            const tableBody = document.querySelector('#usersTable tbody');
            if (!tableBody) throw new Error("Tabla de usuarios no encontrada");

            tableBody.innerHTML = users.map(user => this._createUserRow(user)).join('');
            console.log(`${users.length} usuarios mostrados correctamente`);
        } catch (error) {
            console.error("Error al mostrar usuarios:", error);
            this.showError("No se pudieron cargar los usuarios");
        }
    }

    _createUserRow(user) {
        return `
            <tr>
                <td>${this._escapeHtml(user.documentNumber)}</td>
                <td>${this._escapeHtml(user.firstName)} ${this._escapeHtml(user.lastName)}</td>
                <td>${this._escapeHtml(user.email)}</td>
                <td>${this._escapeHtml(user.role)}</td>
                <td>
                    <button class="btn btn-sm btn-primary edit-user" data-id="${this._escapeHtml(user.id)}">
                        <i class="bi bi-pencil-square"></i> Editar
                    </button>
                    <button class="btn btn-sm btn-danger delete-user" data-id="${this._escapeHtml(user.id)}">
                        <i class="bi bi-trash"></i> Eliminar
                    </button>
                </td>
            </tr>
        `;
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
                    <option value="recruiter">Reclutador</option>
                </select>
            </div>
        `;
    }

    _getEditFormHTML(user) {
        return `
            <input type="hidden" name="id" value="${this._escapeHtml(user.id)}">
            <div class="mb-3">
                <label class="form-label">Número de Documento</label>
                <input type="text" class="form-control" name="documentNumber" 
                       value="${this._escapeHtml(user.documentNumber)}" readonly>
            </div>
            <div class="mb-3">
                <label class="form-label">Primer Nombre</label>
                <input type="text" class="form-control" name="firstName" 
                       value="${this._escapeHtml(user.firstName)}" required>
            </div>
            <div class="mb-3">
                <label class="form-label">Primer Apellido</label>
                <input type="text" class="form-control" name="lastName" 
                       value="${this._escapeHtml(user.lastName)}" required>
            </div>
            <div class="mb-3">
                <label class="form-label">Correo Electrónico</label>
                <input type="email" class="form-control" name="email" 
                       value="${this._escapeHtml(user.email)}" required>
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
                    <option value="user" ${user.role === 'user' ? 'selected' : ''}>Usuario</option>
                    <option value="recruiter" ${user.role === 'recruiter' ? 'selected' : ''}>Reclutador</option>
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
        const alertId = 'alert-' + Date.now();
        const alertHtml = `
            <div id="${alertId}" class="alert alert-${type} alert-dismissible fade show">
                ${message}
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            </div>
        `;
        
        this.alertsContainer.insertAdjacentHTML('afterbegin', alertHtml);
        
        setTimeout(() => {
            const alert = document.getElementById(alertId);
            if (alert) {
                alert.classList.remove('show');
                setTimeout(() => alert.remove(), 150);
            }
        }, 5000);
    }

    _escapeHtml(unsafe) {
        if (unsafe === undefined || unsafe === null) return '';
        return unsafe.toString()
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }
}

// Exportación para módulos (si es necesario)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DashboardView;
}