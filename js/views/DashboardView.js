// DashboardView.js - Versión funcional completa
class DashboardView {
    constructor() {
        this.modal = new bootstrap.Modal(document.getElementById('userModal'));
        this.alertsContainer = document.getElementById('alertsContainer');
    }

    showUsers(users) {
        const tbody = document.querySelector('#usersTable tbody');
        if (!tbody) return;

        tbody.innerHTML = users.map(user => `
            <tr>
                <td>${this._escape(user.documentNumber)}</td>
                <td>${this._escape(user.firstName)} ${this._escape(user.lastName)}</td>
                <td>${this._escape(user.email)}</td>
                <td>${this._escape(user.role)}</td>
                <td>
                    <button class="btn btn-sm btn-primary edit-user" data-id="${user.id}">
                        <i class="bi bi-pencil"></i> Editar
                    </button>
                    <button class="btn btn-sm btn-danger delete-user" data-id="${user.id}">
                        <i class="bi bi-trash"></i> Eliminar
                    </button>
                </td>
            </tr>
        `).join('');
    }

    showUserForm(user = null) {
        const title = document.getElementById('userModalLabel');
        const form = document.getElementById('userForm');
        
        title.textContent = user ? 'Editar Usuario' : 'Nuevo Usuario';
        form.innerHTML = user ? this._getEditForm(user) : this._getAddForm();
        this.modal.show();
    }

    _getAddForm() {
        return `
            <div class="mb-3">
                <label class="form-label">Documento</label>
                <input type="text" class="form-control" name="documentNumber" required>
            </div>
            <div class="mb-3">
                <label class="form-label">Nombres</label>
                <input type="text" class="form-control" name="firstName" required>
            </div>
            <div class="mb-3">
                <label class="form-label">Apellidos</label>
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

    _getEditForm(user) {
        return `
            <input type="hidden" name="id" value="${user.id}">
            <div class="mb-3">
                <label class="form-label">Documento</label>
                <input type="text" class="form-control" name="documentNumber" 
                       value="${this._escape(user.documentNumber)}" readonly>
            </div>
            <div class="mb-3">
                <label class="form-label">Nombres</label>
                <input type="text" class="form-control" name="firstName" 
                       value="${this._escape(user.firstName)}" required>
            </div>
            <div class="mb-3">
                <label class="form-label">Apellidos</label>
                <input type="text" class="form-control" name="lastName" 
                       value="${this._escape(user.lastName)}" required>
            </div>
            <div class="mb-3">
                <label class="form-label">Correo</label>
                <input type="email" class="form-control" name="email" 
                       value="${this._escape(user.email)}" required>
            </div>
            <div class="mb-3">
                <label class="form-label">Contraseña</label>
                <input type="password" class="form-control" name="password" 
                       placeholder="Dejar vacío para no cambiar">
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
        const alert = document.createElement('div');
        alert.className = `alert alert-${type} alert-dismissible fade show`;
        alert.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        this.alertsContainer.prepend(alert);
        setTimeout(() => alert.remove(), 5000);
    }

    _escape(text) {
        return text ? text.toString()
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;') : '';
    }
}