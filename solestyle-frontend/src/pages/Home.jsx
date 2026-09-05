import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

function Home() {
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  const categories = [
    {
      name: "Sneakers",
      image:
        "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80",
    },
    {
      name: "Running",
      image:
        "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?auto=format&fit=crop&w=600&q=80",
    },
    {
      name: "Sports",
      image:
        "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?auto=format&fit=crop&w=600&q=80",
    },
    {
      name: "Formal",
      image:
        "https://images.unsplash.com/photo-1614252369475-531eba835eb1?auto=format&fit=crop&w=600&q=80",
    },
  ];

  useEffect(() => {
    loadFeaturedProducts();
  }, []);

  const loadFeaturedProducts = async () => {
    try {
      setLoadingProducts(true);

      const response = await api.get("/products");

      // Show first 4 products as featured products
      setProducts((response.data || []).slice(0, 4));
    } catch (error) {
      console.error(
        "Error loading featured products:",
        error
      );
    } finally {
      setLoadingProducts(false);
    }
  };

  return (
    <div className="home">

      {/* Hero Section */}
      <section className="hero">

        <div className="hero-content">

          <p className="hero-small">
            NEW SEASON COLLECTION
          </p>

          <h1>
            STEP INTO
            <br />
            YOUR STYLE
          </h1>

          <p className="hero-description">
            Discover shoes designed for comfort, movement and everyday style.
          </p>

          <Link
            to="/products"
            className="hero-button"
          >
            SHOP NOW
          </Link>

        </div>

        <div className="hero-image">

          <img
            src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1000&q=85"
            alt="Featured shoe"
          />

        </div>

      </section>


      {/* Categories */}
      <section className="categories-section">

        <div className="section-header">

          <div>

            <p className="section-label">
              EXPLORE
            </p>

            <h2>
              Shop by Category
            </h2>

          </div>

          <Link
            to="/products"
            className="view-all"
          >
            View All →
          </Link>

        </div>


        <div className="category-grid">

          {categories.map((category) => (

            <Link
              to={`/products?category=${category.name}`}
              className="category-card"
              key={category.name}
            >

              <img
                src={category.image}
                alt={category.name}
              />

              <div className="category-overlay">

                <h3>
                  {category.name}
                </h3>

                <span>
                  Shop Now →
                </span>

              </div>

            </Link>

          ))}

        </div>

      </section>


      {/* Featured Products */}
      <section className="featured-section">

        <div className="section-header">

          <div>

            <p className="section-label">
              OUR PICKS
            </p>

            <h2>
              Featured Shoes
            </h2>

          </div>

          <Link
            to="/products"
            className="view-all"
          >
            Shop All →
          </Link>

        </div>


        {loadingProducts ? (

          <div className="home-products-loading">
            Loading featured shoes...
          </div>

        ) : products.length === 0 ? (

          <div className="home-products-empty">
            <p>
              No products available yet.
            </p>

            <Link
              to="/products"
              className="view-all"
            >
              Browse Collection →
            </Link>
          </div>

        ) : (

          <div className="product-grid">

            {products.map((product) => (

              <div
                className="product-card"
                key={product.id}
              >

                <Link
                  to={`/products/${product.id}`}
                >

                  <div className="product-image">

                    <img
                      src={product.imageUrl}
                      alt={product.name}
                    />

                    <span className="product-badge">
                      NEW
                    </span>

                  </div>

                </Link>


                <div className="product-info">

                  <p className="product-brand">
                    {product.brand}
                  </p>

                  <h3>
                    {product.name}
                  </h3>


                  <div className="product-bottom">

                    <p className="product-price">
                      ₹
                      {Number(
                        product.price
                      ).toLocaleString("en-IN")}
                    </p>

                    <Link
                      to={`/products/${product.id}`}
                      className="add-button"
                      aria-label={`View ${product.name}`}
                    >
                      +
                    </Link>

                  </div>

                </div>

              </div>

            ))}

          </div>

        )}

      </section>


      {/* Banner */}
      <section className="promo-section">

        <div className="promo-content">

          <p className="section-label">
            SOLESTYLE PICKS
          </p>

          <h2>
            MADE TO
            <br />
            MOVE.
          </h2>

          <p>
            Lightweight designs, everyday comfort and a style that keeps up
            with you.
          </p>

          <Link
            to="/products"
            className="promo-button"
          >
            EXPLORE COLLECTION
          </Link>

        </div>

      </section>

    </div>
  );
}

export default Home;