class StudyModel {
    constructor() {
        this.STORAGE_KEY = 'gath_studies';
        this._initialize();
    }

    _initialize() {
        if (!localStorage.getItem(this.STORAGE_KEY)) {
            const defaultStudies = [{
                id: 'stu_1',
                resumeId: 'res_1',
                institution: 'Universidad Nacional',
                title: 'Ingeniero de Sistemas',
                startDate: '2015-01-01',
                endDate: '2020-12-31',
                completed: true,
                description: 'Estudios universitarios completos',
                attachments: [],
                createdAt: new Date().toISOString()
            }];
            this._saveAll(defaultStudies);
        }
    }

    _saveAll(studies) {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(studies));
    }

    getStudiesByResumeId(resumeId) {
        const studies = this.getAllStudies();
        return studies.filter(study => study.resumeId === resumeId);
    }

    addStudy(studyData) {
        const studies = this.getAllStudies();
        studyData.id = 'stu_' + Date.now();
        studyData.createdAt = new Date().toISOString();
        studies.push(studyData);
        this._saveAll(studies);
        return studyData;
    }

    updateStudy(updatedStudy) {
        const studies = this.getAllStudies();
        const index = studies.findIndex(study => study.id === updatedStudy.id);
        
        if (index === -1) throw new Error("Estudio no encontrado");
        
        studies[index] = { ...studies[index], ...updatedStudy };
        this._saveAll(studies);
        return studies[index];
    }

    deleteStudy(id) {
        const studies = this.getAllStudies();
        const newStudies = studies.filter(study => study.id !== id);
        
        if (newStudies.length === studies.length) {
            throw new Error("Estudio no encontrado");
        }
        
        this._saveAll(newStudies);
        return true;
    }

    addStudyAttachment(studyId, attachment) {
        const studies = this.getAllStudies();
        const study = studies.find(s => s.id === studyId);
        
        if (!study) throw new Error("Estudio no encontrado");
        
        if (!study.attachments) study.attachments = [];
        study.attachments.push(attachment);
        this._saveAll(studies);
        return study;
    }

    getAllStudies() {
        return JSON.parse(localStorage.getItem(this.STORAGE_KEY)) || [];
    }
}