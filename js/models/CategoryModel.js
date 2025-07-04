class CategoryModel {
    constructor() {
        this.STORAGE_KEY = 'gath_categories';
        this._initialize();
    }

    _initialize() {
        if (!localStorage.getItem(this.STORAGE_KEY)) {
            const defaultCategories = [
                { id: 1, name: "Tecnología", description: "Vacantes relacionadas con tecnología" },
                { id: 2, name: "Salud", description: "Vacantes relacionadas con salud" }
            ];
            this._saveAll(defaultCategories);
        }
    }

    _saveAll(categories) {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(categories));
    }

    getAllCategories() {
        return JSON.parse(localStorage.getItem(this.STORAGE_KEY)) || [];
    }

    getCategoryById(id) {
        const categories = this.getAllCategories();
        return categories.find(c => c.id === id);
    }

    createCategory(categoryData) {
        const categories = this.getAllCategories();
        const newId = categories.length > 0 ? Math.max(...categories.map(c => c.id)) + 1 : 1;
        
        const newCategory = {
            id: newId,
            ...categoryData
        };
        
        categories.push(newCategory);
        this._saveAll(categories);
        return newCategory;
    }

    updateCategory(updatedCategory) {
        const categories = this.getAllCategories();
        const index = categories.findIndex(c => c.id === updatedCategory.id);
        
        if (index === -1) throw new Error("Categoría no encontrada");
        
        categories[index] = { ...categories[index], ...updatedCategory };
        this._saveAll(categories);
        return categories[index];
    }

    deleteCategory(id) {
        const categories = this.getAllCategories();
        const newCategories = categories.filter(c => c.id !== id);
        
        if (newCategories.length === categories.length) {
            throw new Error("Categoría no encontrada");
        }
        
        this._saveAll(newCategories);
        return true;
    }
}