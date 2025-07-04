class ResumeController {
    constructor(view, model, userModel) {
        this.view = view;
        this.model = model;
        this.userModel = userModel;
        this.currentUserId = null;
        this.init();
    }

    init() {
        this.bindEvents();
        this.loadCurrentUser();
    }

    bindEvents() {
        document.getElementById('saveResumeBtn')?.addEventListener('click', () => this.saveResume());
        document.getElementById('resumePhoto')?.addEventListener('change', (e) => this.handlePhotoUpload(e));
    }

    loadCurrentUser() {
        const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
        if (currentUser) {
            this.currentUserId = currentUser.id;
            this.loadResume();
        }
    }

    async loadResume() {
        try {
            const resume = await this.model.getResumeByUserId(this.currentUserId);
            const user = await this.userModel.getUserById(this.currentUserId);
            
            if (resume) {
                this.view.displayResume(resume);
            } else if (user) {
                // Crear hoja de vida básica con datos del usuario
                const basicResume = {
                    userId: this.currentUserId,
                    personalInfo: {
                        firstName: user.firstName,
                        lastName: user.lastName,
                        documentNumber: user.documentNumber,
                        email: user.email,
                        phone: user.phone,
                        address: user.address,
                        gender: user.gender
                    }
                };
                this.view.displayResume(basicResume);
            }
        } catch (error) {
            console.error("Error loading resume:", error);
            this.view.showError("Error al cargar hoja de vida");
        }
    }

    async saveResume() {
        try {
            const form = document.getElementById('resumeForm');
            const formData = new FormData(form);
            
            const resumeData = {
                userId: this.currentUserId,
                personalInfo: {
                    firstName: formData.get('firstName'),
                    lastName: formData.get('lastName'),
                    documentType: formData.get('documentType'),
                    documentNumber: formData.get('documentNumber'),
                    birthDate: formData.get('birthDate'),
                    gender: formData.get('gender'),
                    address: formData.get('address'),
                    phone: formData.get('phone'),
                    email: formData.get('email')
                }
            };

            await this.model.createOrUpdateResume(resumeData);
            this.view.showSuccess("Hoja de vida guardada correctamente");
        } catch (error) {
            console.error("Error saving resume:", error);
            this.view.showError(error.message);
        }
    }

    async handlePhotoUpload(event) {
        try {
            const file = event.target.files[0];
            if (!file) return;
            
            if (!file.type.match('image.*')) {
                throw new Error("Solo se permiten archivos de imagen");
            }
            
            const reader = new FileReader();
            reader.onload = async (e) => {
                const photoData = e.target.result;
                await this.model.updateResumePhoto(this.currentUserId, photoData);
                this.view.updatePhotoPreview(photoData);
                this.view.showSuccess("Foto actualizada correctamente");
            };
            reader.readAsDataURL(file);
        } catch (error) {
            console.error("Error uploading photo:", error);
            this.view.showError(error.message);
        }
    }
}