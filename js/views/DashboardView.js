export default class DashboardView {
    constructor() {
        console.log("Inicializando DashboardView");
        this.modal = new bootstrap.Modal(document.getElementById('userModal'));
        this.currentUserElement = document.getElementById('currentUser');
    }

    displayUsers(users) {
        console.log("Mostrando usuarios en la vista", users);
        const tableBody = document.querySelector('#usersTable tbody');
        
        if (!tableBody) {
            console.error("No se encontró el elemento #usersTable tbody");
            return;
        }

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

        console.log("Usuarios renderizados correctamente");
    }

    showUserForm(user = null) {
        console.log("Mostrando formulario para usuario:", user);
        const modalTitle = document.getElementById('userModalLabel');
        const form = document.getElementById('userForm');
        
        if (!modalTitle || !form) {
            console.error("Elementos del modal no encontrados");
            return;
        }

        if (user) {
            modalTitle.textContent = 'Editar Usuario';
            form.innerHTML = this.getEditFormHTML(user);
        } else {
            modalTitle.textContent = 'Crear Nuevo Usuario';
            form.innerHTML = this.getAddFormHTML();
        }

        this.modal.show();
    }

    getAddFormHTML() {
        return `
            <div class="mb-3">
                <label for="documentNumber" class="form-label">Número de Documento</label>
                <input type="text" class="form-control" id="documentNumber" name="documentNumber" required>
            </div>
            <div class="mb-3">
                <label for="firstName" class="form-label">Primer Nombre</label>
                <input type="text" class="form-control" id="firstName" name="firstName" required>
            </div>
            <div class="mb-3">
                <label for="lastName" class="form-label">Primer Apellido</label>
                <input type="text" class="form-control" id="lastName" name="lastName" required>
            </div>
            <div class="mb-3">
                <label for="email" class="form-label">Correo Electrónico</label>
                <input type="email" class="form-control" id="email" name="email" required>
            </div>
            <div class="mb-3">
                <label for="password" class="form-label">Contraseña</label>
                <input type="password" class="form-control" id="password" name="password" required>
            </div>
            <div class="mb-3">
                <label for="role" class="form-label">Rol</label>
                <select class="form-select" id="role" name="role" required>
                    <option value="admin">Administrador</option>
                    <option value="user" selected>Usuario</option>
                    <option value="recruiter">Reclutador</option>
                </select>
            </div>
        `;
    }

    getEditFormHTML(user) {
        return `
            <input type="hidden" name="id" value="${user.id}">
            <div class="mb-3">
                <label for="documentNumber" class="form-label">Número de Documento</label>
                <input type="text" class="form-control" id="documentNumber" 
                       name="documentNumber" value="${user.documentNumber}" readonly>
            </div>
            <div class="mb-3">
                <label for="firstName" class="form-label">Primer Nombre</label>
                <input type="text" class="form-control" id="firstName" 
                       name="firstName" value="${user.firstName}" required>
            </div>
            <div class="mb-3">
                <label for="lastName" class="form-label">Primer Apellido</label>
                <input type="text" class="form-control" id="lastName" 
                       name="lastName" value="${user.lastName}" required>
            </div>
            <div class="mb-3">
                <label for="email" class="form-label">Correo Electrónico</label>
                <input type="email" class="form-control" id="email" 
                       name="email" value="${user.email}" required>
            </div>
            <div class="mb-3">
                <label for="password" class="form-label">Contraseña</label>
                <input type="password" class="form-control" id="password" 
                       name="password" placeholder="Dejar en blanco para no cambiar">
            </div>
            <div class="mb-3">
                <label for="role" class="form-label">Rol</label>
                <select class="form-select" id="role" name="role" required>
                    <option value="admin" ${user.role === 'admin' ? 'selected' : ''}>Administrador</option>
                    <option value="user" ${user.role === 'user' ? 'selected' : ''}>Usuario</option>
                    <option value="recruiter" ${user.role === 'recruiter' ? 'selected' : ''}>Reclutador</option>
                </select>
            </div>
        `;
    }

    hideModal() {
        console.log("Ocultando modal");
        this.modal.hide();
    }

    showSuccess(message) {
        console.log("Mostrando mensaje de éxito:", message);
        this.showAlert(message, 'success');
    }

    showError(message) {
        console.error("Mostrando mensaje de error:", message);
        this.showAlert(message, 'danger');
    }

    showAlert(message, type) {
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
        alertDiv.role = 'alert';
        alertDiv.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
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

    setupSidebarToggle() {
        const sidebarToggle = document.getElementById('sidebarCollapse');
        if (sidebarToggle) {
            sidebarToggle.addEventListener('click', () => {
                document.getElementById('sidebar').classList.toggle('active');
            });
        }
    }
}