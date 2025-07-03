import DashboardController from './controllers/DashboardController';

document.addEventListener('DOMContentLoaded', () => {
    try {
        new DashboardController();
        console.log('Aplicación inicializada correctamente');
    } catch (error) {
        console.error('Error al inicializar la aplicación:', error);
        alert('Error al cargar la aplicación. Por favor recarga la página.');
    }
});