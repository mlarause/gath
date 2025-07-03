// Inicializar la aplicación
document.addEventListener('DOMContentLoaded', () => {
    const model = new UserModel();
    const view = new AuthView();
    new AuthController(model, view);
});