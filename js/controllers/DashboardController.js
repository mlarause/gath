class DashboardView {
    constructor() {
        this.mainContent = document.getElementById('mainContent');
        this.currentUserElement = document.getElementById('currentUser');
        this.modal = new bootstrap.Modal(document.getElementById('genericModal'));
        this.modalTitle = document.getElementById('modalTitle');
        this.modalBody = document.getElementById('modalBody');
        this.modalSaveBtn = document.getElementById('modalSave');
        
        // Configurar sidebar toggle
        document.getElementById('sidebarCollapse').addEventListener('click', () => {
            document.getElementById('sidebar').classList.toggle('active');
        });
        
        // Mostrar usuario actual
        this.showCurrentUser();
    }
    
    showCurrentUser() {
        const user = JSON.parse(sessionStorage.getItem('currentUser'));
        if (user) {
            this.currentUserElement.textContent = `${user.firstName} ${user.lastName}`;
        }
    }
    
    // Mostrar sección de gestión de usuarios
    showUsersSection(users) {
        let html = `
            <div class="card">
                <div class="card-header d-flex justify-content-between align-items-center">
                    <h5 class="mb-0">Gestión de Usuarios</h5>
                    <button class="btn btn-sm btn-success" id="addUserBtn">
                        <i class="bi bi-plus-lg"></i> Agregar Usuario
                    </button>
                </div>
                <div class="card-body">
                    <div class="table-responsive">
                        <table class="table table-striped table-hover">
                            <thead>
                                <tr>
                                    <th>Documento</th>
                                    <th>Nombre</th>
                                    <th>Correo</th>
                                    <th>Rol</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>`;
        
        users.forEach(user => {
            html += `
                <tr>
                    <td>${user.documentNumber}</td>
                    <td>${user.firstName} ${user.lastName}</td>
                    <td>${user.email}</td>
                    <td>${user.role}</td>
                    <td>
                        <button class="btn btn-sm btn-primary edit-user" data-id="${user.documentNumber}">
                            <i class="bi bi-pencil-square"></i>
                        </button>
                        <button class="btn btn-sm btn-danger delete-user" data-id="${user.documentNumber}">
                            <i class="bi bi-trash"></i>
                        </button>
                    </td>
                </tr>`;
        });
        
        html += `</tbody></table></div></div></div>`;
        
        this.mainContent.innerHTML = html;
    }
    
    // Mostrar formulario de usuario en modal
    showUserForm(user = null) {
        this.modalTitle.textContent = user ? 'Editar Usuario' : 'Agregar Usuario';
        
        const isEdit = !!user;
        const formId = isEdit ? 'editUserForm' : 'addUserForm';
        
        let html = `
            <form id="${formId}">
                <div class="row">
                    <div class="col-md-6">
                        <div class="mb-3">
                            <label for="documentNumber" class="form-label">Número de documento</label>
                            <input type="number" class="form-control" id="documentNumber" 
                                   value="${user ? user.documentNumber : ''}" ${isEdit ? 'readonly' : ''} required>
                        </div>
                        <div class="mb-3">
                            <label for="firstName" class="form-label">Primer nombre</label>
                            <input type="text" class="form-control" id="firstName" 
                                   value="${user ? user.firstName : ''}" required>
                        </div>
                        <div class="mb-3">
                            <label for="lastName" class="form-label">Primer apellido</label>
                            <input type="text" class="form-control" id="lastName" 
                                   value="${user ? user.lastName : ''}" required>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="mb-3">
                            <label for="email" class="form-label">Correo electrónico</label>
                            <input type="email" class="form-control" id="email" 
                                   value="${user ? user.email : ''}" required>
                        </div>
                        <div class="mb-3">
                            <label for="password" class="form-label">Contraseña</label>
                            <input type="password" class="form-control" id="password" ${isEdit ? 'placeholder="Dejar en blanco para no cambiar"' : 'required'}>
                        </div>
                        <div class="mb-3">
                            <label for="role" class="form-label">Rol</label>
                            <select class="form-select" id="role" required>
                                <option value="admin" ${user && user.role === 'admin' ? 'selected' : ''}>Administrador</option>
                                <option value="user" ${!user || user.role === 'user' ? 'selected' : ''}>Usuario</option>
                            </select>
                        </div>
                    </div>
                </div>
            </form>`;
        
        this.modalBody.innerHTML = html;
        this.modal.show();
    }
    
    // Mostrar sección de roles
    showRolesSection(roles) {
        let html = `
            <div class="card">
                <div class="card-header d-flex justify-content-between align-items-center">
                    <h5 class="mb-0">Gestión de Roles</h5>
                    <button class="btn btn-sm btn-success" id="addRoleBtn">
                        <i class="bi bi-plus-lg"></i> Agregar Rol
                    </button>
                </div>
                <div class="card-body">
                    <div class="table-responsive">
                        <table class="table table-striped table-hover">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Descripción</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>`;
        
        roles.forEach(role => {
            html += `
                <tr>
                    <td>${role.id}</td>
                    <td>${role.description}</td>
                    <td>
                        <button class="btn btn-sm btn-primary edit-role" data-id="${role.id}">
                            <i class="bi bi-pencil-square"></i>
                        </button>
                        <button class="btn btn-sm btn-danger delete-role" data-id="${role.id}">
                            <i class="bi bi-trash"></i>
                        </button>
                    </td>
                </tr>`;
        });
        
        html += `</tbody></table></div></div></div>`;
        
        this.mainContent.innerHTML = html;
    }
    
    // Mostrar mensaje de error
    showError(message) {
        alert(`Error: ${message}`);
    }
    
    // Mostrar mensaje de éxito
    showSuccess(message) {
        alert(`Éxito: ${message}`);
    }
}