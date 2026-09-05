import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import api from "../services/api";
import "./Products.css";

function Products() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const searchQuery = searchParams.get("search") || "";
  const categoryFilter = searchParams.get("category") || "";
  const genderFilter = searchParams.get("gender") || "";

  useEffect(() => {
    loadProducts();
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

  const handleSearchChange = (event) => {
    const value = event.target.value;

    const params = new URLSearchParams(searchParams);

    if (value.trim()) {
      params.set("search", value);
    } else {
      params.delete("search");
    }

    setSearchParams(params);
  };

  const filteredProducts = products.filter((product) => {
    const searchText = searchQuery.toLowerCase().trim();

    const matchesSearch =
      !searchText ||
      product.name?.toLowerCase().includes(searchText) ||
      product.brand?.toLowerCase().includes(searchText) ||
      product.description?.toLowerCase().includes(searchText);

    const matchesGender =
      !genderFilter ||
      product.gender?.toLowerCase() === genderFilter.toLowerCase();

    const matchesCategory =
      !categoryFilter ||
      product.category?.name?.toLowerCase() ===
        categoryFilter.toLowerCase();

    return (
      matchesSearch &&
      matchesGender &&
      matchesCategory
    );
  });

  const clearFilters = () => {
    setSearchParams({});
  };

  if (loading) {
    return (
      <main className="products-page">
        <div className="products-container">
          <div className="products-message">
            Loading products...
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="products-page">
        <div className="products-container">
          <div className="products-message">
            <p>{error}</p>

            <button
              onClick={loadProducts}
              className="products-retry-button"
            >
              Try Again
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="products-page">

      <div className="products-container">

        <div className="products-header">

          <div>
            <p className="products-eyebrow">
              SOLESTYLE COLLECTION
            </p>

            <h1>Shop Shoes</h1>

            <p>
              Find your perfect pair.
            </p>
          </div>

        </div>

        {/* Search and Filters */}

        <div className="products-toolbar">

          <div className="products-search">

            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search shoes, brands..."
            />

          </div>

          <div className="products-filter-links">

            <Link
              to="/products"
              className={
                !categoryFilter && !genderFilter
                  ? "active"
                  : ""
              }
            >
              All
            </Link>

            <Link
              to="/products?gender=Men"
              className={
                genderFilter.toLowerCase() === "men"
                  ? "active"
                  : ""
              }
            >
              Men
            </Link>

            <Link
              to="/products?gender=Women"
              className={
                genderFilter.toLowerCase() === "women"
                  ? "active"
                  : ""
              }
            >
              Women
            </Link>

            <Link
              to="/products?category=Sneakers"
              className={
                categoryFilter.toLowerCase() === "sneakers"
                  ? "active"
                  : ""
              }
            >
              Sneakers
            </Link>

          </div>

        </div>

        {/* Current Filter */}

        {(searchQuery ||
          categoryFilter ||
          genderFilter) && (
          <div className="products-active-filter">

            <span>
              {searchQuery &&
                `Search: "${searchQuery}"`}

              {!searchQuery &&
                genderFilter &&
                `Gender: ${genderFilter}`}

              {!searchQuery &&
                !genderFilter &&
                categoryFilter &&
                `Category: ${categoryFilter}`}
            </span>

            <button onClick={clearFilters}>
              Clear
            </button>

          </div>
        )}

        <div className="products-result-count">
          {filteredProducts.length} product
          {filteredProducts.length !== 1
            ? "s"
            : ""}
        </div>

        {/* Product Grid */}

        {filteredProducts.length === 0 ? (
          <div className="products-message">

            <h2>No products found</h2>

            <p>
              Try a different search or filter.
            </p>

            <button
              onClick={clearFilters}
              className="products-retry-button"
            >
              Clear Filters
            </button>

          </div>
        ) : (
          <div className="products-grid">

            {filteredProducts.map((product) => (
              <Link
                to={`/products/${product.id}`}
                className="product-card"
                key={product.id}
              >

                <div className="product-image-wrapper">

                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="product-image"
                  />

                </div>

                <div className="product-card-info">

                  <p className="product-brand">
                    {product.brand}
                  </p>

                  <h2>
                    {product.name}
                  </h2>

                  <div className="product-card-bottom">

                    <strong>
                      ₹
                      {Number(
                        product.price
                      ).toLocaleString("en-IN")}
                    </strong>

                    <span>
                      {product.category?.name || ""}
                    </span>

                  </div>

                </div>

              </Link>
            ))}

          </div>
        )}

      </div>

    </main>
  );
}

export default Products;