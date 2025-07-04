class DashboardView {
    constructor() {
        console.log("Inicializando DashboardView");
        
        this.modal = this._initModal();
        this.currentUserElement = document.getElementById('currentUser');
        this.alertsContainer = document.getElementById('alertsContainer') || this._createAlertsContainer();
        
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

    displayRoles(roles) {
        try {
            const tableBody = document.querySelector('#rolesTable tbody');
            if (!tableBody) throw new Error("Tabla de roles no encontrada");

            tableBody.innerHTML = roles.map(role => this._createRoleRow(role)).join('');
        } catch (error) {
            console.error("Error al mostrar roles:", error);
            this.showError("Error al mostrar roles");
        }
    }

    _createRoleRow(role) {
        return `
            <tr>
                <td>${role.id}</td>
                <td>${this._escapeHtml(role.description)}</td>
                <td>
                    <button class="btn btn-sm btn-primary edit-role" data-id="${role.id}">
                        <i class="bi bi-pencil-square"></i> Editar
                    </button>
                    <button class="btn btn-sm btn-danger delete-role" data-id="${role.id}">
                        <i class="bi bi-trash"></i> Eliminar
                    </button>
                </td>
            </tr>
        `;
    }

    displayVacancies(vacancies) {
    try {
        const tableBody = document.querySelector('#vacanciesTable tbody');
        if (!tableBody) throw new Error("Tabla de vacantes no encontrada");

        tableBody.innerHTML = vacancies.map(vacancy => this._createVacancyRow(vacancy)).join('');
    } catch (error) {
        console.error("Error al mostrar vacantes:", error);
        this.showError("No se pudieron cargar las vacantes");
    }
}

_createVacancyRow(vacancy) {
    return `
        <tr>
            <td>${this._escapeHtml(vacancy.title)}</td>
            <td>${this._escapeHtml(vacancy.description)}</td>
            <td>${this._escapeHtml(vacancy.categoryName)}</td>
            <td>${this._escapeHtml(vacancy.professionName)}</td>
            <td>${this._escapeHtml(vacancy.status)}</td>
            <td>
                <button class="btn btn-sm btn-primary edit-vacancy" data-id="${vacancy.id}">
                    <i class="bi bi-pencil-square"></i> Editar
                </button>
                <button class="btn btn-sm btn-danger delete-vacancy" data-id="${vacancy.id}">
                    <i class="bi bi-trash"></i> Eliminar
                </button>
            </td>
        </tr>
    `;
}

displayCategories(categories) {
    try {
        const tableBody = document.querySelector('#categoriesTable tbody');
        if (!tableBody) throw new Error("Tabla de categorías no encontrada");

        tableBody.innerHTML = categories.map(category => this._createCategoryRow(category)).join('');
    } catch (error) {
        console.error("Error al mostrar categorías:", error);
        this.showError("No se pudieron cargar las categorías");
    }
}

_createCategoryRow(category) {
    return `
        <tr>
            <td>${this._escapeHtml(category.name)}</td>
            <td>${this._escapeHtml(category.description)}</td>
            <td>
                <button class="btn btn-sm btn-primary edit-category" data-id="${category.id}">
                    <i class="bi bi-pencil-square"></i> Editar
                </button>
                <button class="btn btn-sm btn-danger delete-category" data-id="${category.id}">
                    <i class="bi bi-trash"></i> Eliminar
                </button>
            </td>
        </tr>
    `;
}

displayProfessions(professions) {
    try {
        const tableBody = document.querySelector('#professionsTable tbody');
        if (!tableBody) throw new Error("Tabla de profesiones no encontrada");

        tableBody.innerHTML = professions.map(profession => this._createProfessionRow(profession)).join('');
    } catch (error) {
        console.error("Error al mostrar profesiones:", error);
        this.showError("No se pudieron cargar las profesiones");
    }
}

_createProfessionRow(profession) {
    return `
        <tr>
            <td>${this._escapeHtml(profession.name)}</td>
            <td>${this._escapeHtml(profession.description)}</td>
            <td>
                <button class="btn btn-sm btn-primary edit-profession" data-id="${profession.id}">
                    <i class="bi bi-pencil-square"></i> Editar
                </button>
                <button class="btn btn-sm btn-danger delete-profession" data-id="${profession.id}">
                    <i class="bi bi-trash"></i> Eliminar
                </button>
            </td>
        </tr>
    `;
}

showVacancyForm(vacancy = null, categories = [], professions = []) {
    const modalTitle = document.getElementById('vacancyModalLabel');
    const form = document.getElementById('vacancyForm');
    
    if (!modalTitle || !form) {
        console.error("Elementos del modal no encontrados");
        return;
    }

    modalTitle.textContent = vacancy ? 'Editar Vacante' : 'Nueva Vacante';
    form.innerHTML = vacancy ? this._getEditVacancyFormHTML(vacancy, categories, professions) 
                           : this._getAddVacancyFormHTML(categories, professions);
    
    const modal = new bootstrap.Modal(document.getElementById('vacancyModal'));
    modal.show();
}

_getAddVacancyFormHTML(categories, professions) {
    const categoryOptions = categories.map(c => 
        `<option value="${c.id}">${this._escapeHtml(c.name)}</option>`
    ).join('');
    
    const professionOptions = professions.map(p => 
        `<option value="${p.id}">${this._escapeHtml(p.name)}</option>`
    ).join('');

    return `
        <div class="mb-3">
            <label class="form-label">Título</label>
            <input type="text" class="form-control" name="title" required>
        </div>
        <div class="mb-3">
            <label class="form-label">Descripción</label>
            <textarea class="form-control" name="description" rows="3" required></textarea>
        </div>
        <div class="mb-3">
            <label class="form-label">Categoría</label>
            <select class="form-select" name="categoryId" required>
                ${categoryOptions}
            </select>
        </div>
        <div class="mb-3">
            <label class="form-label">Profesión</label>
            <select class="form-select" name="professionId" required>
                ${professionOptions}
            </select>
        </div>
        <div class="mb-3">
            <label class="form-label">Estado</label>
            <select class="form-select" name="status" required>
                <option value="active">Activa</option>
                <option value="inactive">Inactiva</option>
                <option value="closed">Cerrada</option>
            </select>
        </div>
    `;
}

_getEditVacancyFormHTML(vacancy, categories, professions) {
    const categoryOptions = categories.map(c => 
        `<option value="${c.id}" ${c.id === vacancy.categoryId ? 'selected' : ''}>
            ${this._escapeHtml(c.name)}
        </option>`
    ).join('');
    
    const professionOptions = professions.map(p => 
        `<option value="${p.id}" ${p.id === vacancy.professionId ? 'selected' : ''}>
            ${this._escapeHtml(p.name)}
        </option>`
    ).join('');

    return `
        <input type="hidden" name="id" value="${vacancy.id}">
        <div class="mb-3">
            <label class="form-label">Título</label>
            <input type="text" class="form-control" name="title" 
                   value="${this._escapeHtml(vacancy.title)}" required>
        </div>
        <div class="mb-3">
            <label class="form-label">Descripción</label>
            <textarea class="form-control" name="description" rows="3" required>
                ${this._escapeHtml(vacancy.description)}
            </textarea>
        </div>
        <div class="mb-3">
            <label class="form-label">Categoría</label>
            <select class="form-select" name="categoryId" required>
                ${categoryOptions}
            </select>
        </div>
        <div class="mb-3">
            <label class="form-label">Profesión</label>
            <select class="form-select" name="professionId" required>
                ${professionOptions}
            </select>
        </div>
        <div class="mb-3">
            <label class="form-label">Estado</label>
            <select class="form-select" name="status" required>
                <option value="active" ${vacancy.status === 'active' ? 'selected' : ''}>Activa</option>
                <option value="inactive" ${vacancy.status === 'inactive' ? 'selected' : ''}>Inactiva</option>
                <option value="closed" ${vacancy.status === 'closed' ? 'selected' : ''}>Cerrada</option>
            </select>
        </div>
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