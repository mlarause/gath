// dashboardView.js - Versión corregida
class DashboardView {
    constructor() {
        console.log("Inicializando DashboardView");
        
        // Elementos principales
        this.modal = this._initModal();
        this.currentUserElement = document.getElementById('currentUser');
        this.alertsContainer = document.getElementById('alertsContainer') || document.body;
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

    displayUsers(users) {
        try {
            const tableBody = document.querySelector('#usersTable tbody');
            if (!tableBody) {
                throw new Error("No se encontró la tabla de usuarios");
            }

            tableBody.innerHTML = users.map(user => this._createUserRow(user)).join('');
            console.log(`${users.length} usuarios mostrados correctamente`);
        } catch (error) {
            console.error("Error al mostrar usuarios:", error);
            this.showError("No se pudieron cargar los usuarios");
        }
    }

    // ... (resto de los métodos se mantienen igual que en la versión anterior)
}

// Exportación para módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DashboardView;
}