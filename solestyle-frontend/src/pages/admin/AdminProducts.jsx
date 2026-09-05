import { useEffect, useState } from "react";
import api from "../../services/api";
import "./Admin.css";

function AdminProducts() {
  const [products, setProducts] = useState([]);

  const [categories, setCategories] = useState([]);

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");

  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    imageUrl: "",
    brand: "",
    gender: "",
    sizes: "",
    categoryId: ""
  });

  useEffect(() => {
    loadProducts();
    loadCategories();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/products");

      setProducts(response.data || []);
    } catch (error) {
      console.error("Error loading products:", error);
      setError("Unable to load products.");
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const response = await api.get("/categories");

      setCategories(response.data || []);
    } catch (error) {
      console.error("Error loading categories:", error);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value
    }));
  };

  const resetForm = () => {
    setEditingId(null);

    setFormData({
      name: "",
      description: "",
      price: "",
      stock: "",
      imageUrl: "",
      brand: "",
      gender: "",
      sizes: "",
      categoryId: ""
    });
  };

  const handleEdit = (product) => {
    setEditingId(product.id);

    setFormData({
      name: product.name || "",
      description: product.description || "",
      price: product.price ?? "",
      stock: product.stock ?? "",
      imageUrl: product.imageUrl || "",
      brand: product.brand || "",
      gender: product.gender || "",
      sizes: product.sizes || "",
      categoryId: product.category?.id
        ? String(product.category.id)
        : ""
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (
      !formData.name.trim() ||
      !formData.price ||
      !formData.stock ||
      !formData.brand.trim() ||
      !formData.gender ||
      !formData.sizes.trim() ||
      !formData.categoryId
    ) {
      alert("Please fill in all required fields.");
      return;
    }

    try {
      setSaving(true);

      const productData = {
        name: formData.name,
        description: formData.description,
        price: Number(formData.price),
        stock: Number(formData.stock),
        imageUrl: formData.imageUrl,
        brand: formData.brand,
        gender: formData.gender,
        sizes: formData.sizes,
        category: {
          id: Number(formData.categoryId)
        }
      };

      if (editingId) {
        await api.put(
          `/products/${editingId}`,
          productData
        );

        alert("Product updated successfully.");
      } else {
        await api.post(
          "/products",
          productData
        );

        alert("Product added successfully.");
      }

      resetForm();

      await loadProducts();
    } catch (error) {
      console.error("Error saving product:", error);

      if (error.response) {
        console.error(
          "Backend response:",
          error.response.data
        );
      }

      alert(
        editingId
          ? "Unable to update product."
          : "Unable to add product."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (productId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await api.delete(`/products/${productId}`);

      alert("Product deleted successfully.");

      await loadProducts();
    } catch (error) {
      console.error("Error deleting product:", error);

      alert("Unable to delete product.");
    }
  };

  if (loading) {
    return (
      <main className="admin-page">
        <div className="admin-container">
          <div className="admin-message">
            Loading products...
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

            <h1>Products</h1>

            <p>
              Add, edit and manage your shoe collection.
            </p>
          </div>

        </div>

        {error && (
          <div className="admin-error">
            {error}

            <button onClick={loadProducts}>
              Try Again
            </button>
          </div>
        )}

        {/* Product Form */}

        <div className="admin-card">

          <div className="admin-card-header">

            <div>
              <h2>
                {editingId
                  ? "Edit Product"
                  : "Add New Product"}
              </h2>

              <p>
                {editingId
                  ? "Update the selected shoe."
                  : "Add a new shoe to your store."}
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
            className="admin-product-form"
            onSubmit={handleSubmit}
          >

            <div className="admin-form-grid">

              <div className="admin-field">
                <label htmlFor="name">
                  Product Name *
                </label>

                <input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Nike Air Max"
                />
              </div>

              <div className="admin-field">
                <label htmlFor="brand">
                  Brand *
                </label>

                <input
                  id="brand"
                  name="brand"
                  value={formData.brand}
                  onChange={handleChange}
                  placeholder="Nike"
                />
              </div>

              <div className="admin-field">
                <label htmlFor="price">
                  Price *
                </label>

                <input
                  id="price"
                  name="price"
                  type="number"
                  min="0"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="4999"
                />
              </div>

              <div className="admin-field">
                <label htmlFor="stock">
                  Stock *
                </label>

                <input
                  id="stock"
                  name="stock"
                  type="number"
                  min="0"
                  value={formData.stock}
                  onChange={handleChange}
                  placeholder="20"
                />
              </div>

              <div className="admin-field">
                <label htmlFor="gender">
                  Gender *
                </label>

                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                >
                  <option value="">
                    Select Gender
                  </option>

                  <option value="Men">
                    Men
                  </option>

                  <option value="Women">
                    Women
                  </option>

                  <option value="Unisex">
                    Unisex
                  </option>
                </select>
              </div>

              <div className="admin-field">
                <label htmlFor="categoryId">
                  Category *
                </label>

                <select
                  id="categoryId"
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleChange}
                >
                  <option value="">
                    Select Category
                  </option>

                  {categories.map((category) => (
                    <option
                      value={category.id}
                      key={category.id}
                    >
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="admin-field">
                <label htmlFor="sizes">
                  Available Sizes *
                </label>

                <input
                  id="sizes"
                  name="sizes"
                  value={formData.sizes}
                  onChange={handleChange}
                  placeholder="7,8,9,10,11"
                />
              </div>

              <div className="admin-field">
                <label htmlFor="imageUrl">
                  Image URL
                </label>

                <input
                  id="imageUrl"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleChange}
                  placeholder="https://..."
                />
              </div>

              <div className="admin-field admin-full-width">
                <label htmlFor="description">
                  Description
                </label>

                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe the shoe..."
                  rows="4"
                />
              </div>

            </div>

            <div className="admin-form-actions">

              <button
                type="submit"
                className="admin-primary-button"
                disabled={saving}
              >
                {saving
                  ? "Saving..."
                  : editingId
                    ? "Update Product"
                    : "Add Product"}
              </button>

              {editingId && (
                <button
                  type="button"
                  className="admin-secondary-button"
                  onClick={resetForm}
                >
                  Clear
                </button>
              )}

            </div>

          </form>

        </div>

        {/* Products List */}

        <div className="admin-card">

          <div className="admin-card-header">

            <div>
              <h2>All Products</h2>

              <p>
                {products.length} product
                {products.length !== 1 ? "s" : ""}
              </p>
            </div>

          </div>

          {products.length === 0 ? (
            <div className="admin-empty">
              <h3>No products found</h3>

              <p>
                Add your first shoe using the form above.
              </p>
            </div>
          ) : (
            <div className="admin-products-table">

              <div className="admin-table-header">

                <span>Product</span>
                <span>Brand</span>
                <span>Price</span>
                <span>Stock</span>
                <span>Category</span>
                <span>Actions</span>

              </div>

              {products.map((product) => (

                <div
                  className="admin-table-row"
                  key={product.id}
                >

                  <div className="admin-product-cell">

                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="admin-product-image"
                    />

                    <div>

                      <strong>
                        {product.name}
                      </strong>

                      <span>
                        {product.gender}
                      </span>

                    </div>

                  </div>

                  <span>
                    {product.brand}
                  </span>

                  <strong>
                    ₹
                    {Number(
                      product.price
                    ).toLocaleString("en-IN")}
                  </strong>

                  <span>
                    {product.stock}
                  </span>

                  <span>
                    {product.category?.name || "-"}
                  </span>

                  <div className="admin-table-actions">

                    <button
                      type="button"
                      className="admin-edit-button"
                      onClick={() =>
                        handleEdit(product)
                      }
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      className="admin-delete-button"
                      onClick={() =>
                        handleDelete(product.id)
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

export default AdminProducts;