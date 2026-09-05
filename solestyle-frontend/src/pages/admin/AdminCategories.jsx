import { useEffect, useState } from "react";
import api from "../../services/api";

function AdminCategories() {
  const [categories, setCategories] = useState([]);

  const [name, setName] = useState("");

  const [editingId, setEditingId] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/categories");

      setCategories(response.data || []);
    } catch (error) {
      console.error("Error loading categories:", error);
      setError("Unable to load categories.");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setName("");
    setEditingId(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!name.trim()) {
      alert("Please enter a category name.");
      return;
    }

    try {
      setSaving(true);

      if (editingId) {
        await api.put(`/categories/${editingId}`, {
          name: name.trim()
        });

        alert("Category updated successfully.");
      } else {
        await api.post("/categories", {
          name: name.trim()
        });

        alert("Category added successfully.");
      }

      resetForm();
      await loadCategories();
    } catch (error) {
      console.error("Error saving category:", error);

      if (error.response) {
        console.error(
          "Backend response:",
          error.response.data
        );
      }

      alert(
        editingId
          ? "Unable to update category."
          : "Unable to add category."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (category) => {
    setEditingId(category.id);
    setName(category.name || "");

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  const handleDelete = async (categoryId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this category?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await api.delete(`/categories/${categoryId}`);

      alert("Category deleted successfully.");

      if (editingId === categoryId) {
        resetForm();
      }

      await loadCategories();
    } catch (error) {
      console.error("Error deleting category:", error);

      alert(
        "Unable to delete category. Make sure no products are using this category."
      );
    }
  };

  if (loading) {
    return (
      <main className="admin-page">
        <div className="admin-container">
          <div className="admin-message">
            Loading categories...
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="admin-page">

      <div className="admin-container">

        <div className="admin-header">

          <div>
            <p className="admin-eyebrow">
              SOLESTYLE ADMIN
            </p>

            <h1>Categories</h1>

            <p>
              Create and manage product categories.
            </p>
          </div>

        </div>

        {error && (
          <div className="admin-error">
            <span>{error}</span>

            <button onClick={loadCategories}>
              Try Again
            </button>
          </div>
        )}

        {/* Category Form */}

        <div className="admin-card">

          <div className="admin-card-header">

            <div>
              <h2>
                {editingId
                  ? "Edit Category"
                  : "Add Category"}
              </h2>

              <p>
                {editingId
                  ? "Update the selected category."
                  : "Add a category for your shoes."}
              </p>
            </div>

            {editingId && (
              <button
                type="button"
                className="admin-secondary-button"
                onClick={resetForm}
              >
                Cancel Edit
              </button>
            )}

          </div>

          <form
            className="admin-category-form"
            onSubmit={handleSubmit}
          >

            <div className="admin-category-input-group">

              <div className="admin-field">

                <label htmlFor="categoryName">
                  Category Name
                </label>

                <input
                  id="categoryName"
                  type="text"
                  value={name}
                  onChange={(event) =>
                    setName(event.target.value)
                  }
                  placeholder="Sneakers"
                />

              </div>

              <button
                type="submit"
                className="admin-primary-button"
                disabled={saving}
              >
                {saving
                  ? "Saving..."
                  : editingId
                    ? "Update Category"
                    : "Add Category"}
              </button>

            </div>

          </form>

        </div>

        {/* Category List */}

        <div className="admin-card">

          <div className="admin-card-header">

            <div>
              <h2>All Categories</h2>

              <p>
                {categories.length} categor
                {categories.length === 1
                  ? "y"
                  : "ies"}
              </p>
            </div>

          </div>

          {categories.length === 0 ? (
            <div className="admin-empty">

              <h3>No categories found</h3>

              <p>
                Create your first category above.
              </p>

            </div>
          ) : (
            <div className="admin-category-list">

              {categories.map((category, index) => (
                <div
                  className="admin-category-row"
                  key={category.id}
                >

                  <div className="admin-category-info">

                    <span className="admin-category-number">
                      {index + 1}
                    </span>

                    <div>
                      <strong>
                        {category.name}
                      </strong>

                      <span>
                        Category ID: {category.id}
                      </span>
                    </div>

                  </div>

                  <div className="admin-table-actions">

                    <button
                      type="button"
                      className="admin-edit-button"
                      onClick={() =>
                        handleEdit(category)
                      }
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      className="admin-delete-button"
                      onClick={() =>
                        handleDelete(category.id)
                      }
                    >
                      Delete
                    </button>

                  </div>

                </div>
              ))}

            </div>
          )}

        </div>

      </div>

    </main>
  );
}

export default AdminCategories;