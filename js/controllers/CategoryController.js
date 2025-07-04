class CategoryController {
    constructor(view, model) {
        this.view = view;
        this.model = model;
        this.currentEditingId = null;
        this.init();
    }

    init() {
        this.bindEvents();
        this.loadCategories();
    }

    bindEvents() {
        document.getElementById('addCategoryBtn')?.addEventListener('click', () => this.showCategoryForm());
        document.addEventListener('click', (e) => {
            if (e.target.closest('.edit-category')) {
                const id = e.target.closest('.edit-category').dataset.id;
                this.showEditForm(id);
            } else if (e.target.closest('.delete-category')) {
                const id = e.target.closest('.delete-category').dataset.id;
                this.deleteCategory(id);
            } else if (e.target.closest('#saveCategoryBtn')) {
                this.saveCategory();
            }
        });
    }

    async loadCategories() {
        try {
            const categories = await this.model.getAllCategories();
            this.view.displayCategories(categories);
        } catch (error) {
            console.error("Error loading categories:", error);
            this.view.showError("Error al cargar categorías");
        }
    }

    showCategoryForm(category = null) {
        this.currentEditingId = category?.id || null;
        const modal = new bootstrap.Modal(document.getElementById('categoryModal'));
        const form = document.getElementById('categoryForm');
        
        document.getElementById('categoryModalLabel').textContent = 
            this.currentEditingId ? 'Editar Categoría' : 'Nueva Categoría';
        
        if (category) {
            document.getElementById('categoryName').value = category.name;
            document.getElementById('categoryDescription').value = category.description || '';
        } else {
            form.reset();
        }
        
        modal.show();
    }

    async showEditForm(id) {
        try {
            const category = await this.model.getCategoryById(id);
            this.currentEditingId = id;
            this.showCategoryForm(category);
        } catch (error) {
            console.error("Error editing category:", error);
            this.view.showError(error.message);
        }
    }

    async saveCategory() {
        try {
            const name = document.getElementById('categoryName').value.trim();
            const description = document.getElementById('categoryDescription').value.trim();
            
            if (!name) {
                throw new Error("El nombre de la categoría es requerido");
            }

            const categoryData = { name, description };

            if (this.currentEditingId) {
                categoryData.id = this.currentEditingId;
                await this.model.updateCategory(categoryData);
                this.view.showSuccess("Categoría actualizada correctamente");
            } else {
                await this.model.createCategory(categoryData);
                this.view.showSuccess("Categoría creada correctamente");
            }

            bootstrap.Modal.getInstance(document.getElementById('categoryModal')).hide();
            await this.loadCategories();
        } catch (error) {
            console.error("Error saving category:", error);
            this.view.showError(error.message);
        }
    }

    async deleteCategory(id) {
        if (!confirm("¿Está seguro de eliminar esta categoría?")) return;
        
        try {
            await this.model.deleteCategory(id);
            this.view.showSuccess("Categoría eliminada correctamente");
            await this.loadCategories();
        } catch (error) {
            console.error("Error deleting category:", error);
            this.view.showError(error.message);
        }
    }
}