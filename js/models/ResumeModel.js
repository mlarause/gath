class ResumeModel {
    constructor() {
        this.STORAGE_KEY = 'gath_resumes';
        this._initialize();
    }

    _initialize() {
        if (!localStorage.getItem(this.STORAGE_KEY)) {
            const defaultResumes = [{
                id: 'res_1',
                userId: 'admin001',
                photo: '',
                personalInfo: {
                    firstName: 'Admin',
                    lastName: 'Sistema',
                    documentType: 'CC',
                    documentNumber: '123456789',
                    birthDate: '1990-01-01',
                    gender: 'masculino',
                    address: 'Calle 123',
                    phone: '3001234567',
                    email: 'admin@colsanitas.com'
                },
                createdAt: new Date().toISOString()
            }];
            this._saveAll(defaultResumes);
        }
    }

    _saveAll(resumes) {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(resumes));
    }

    getResumeByUserId(userId) {
        const resumes = JSON.parse(localStorage.getItem(this.STORAGE_KEY)) || [];
        return resumes.find(r => r.userId === userId);
    }

    createOrUpdateResume(resumeData) {
        const resumes = this.getAllResumes();
        const existingIndex = resumes.findIndex(r => r.userId === resumeData.userId);
        
        if (existingIndex >= 0) {
            // Actualizar hoja de vida existente
            resumes[existingIndex] = { ...resumes[existingIndex], ...resumeData };
        } else {
            // Crear nueva hoja de vida
            resumeData.id = 'res_' + Date.now();
            resumeData.createdAt = new Date().toISOString();
            resumes.push(resumeData);
        }
        
        this._saveAll(resumes);
        return resumeData;
    }

    updateResumePhoto(userId, photoData) {
        const resumes = this.getAllResumes();
        const resume = resumes.find(r => r.userId === userId);
        
        if (resume) {
            resume.photo = photoData;
            this._saveAll(resumes);
            return true;
        }
        
        return false;
    }

    getAllResumes() {
        return JSON.parse(localStorage.getItem(this.STORAGE_KEY)) || [];
    }
}