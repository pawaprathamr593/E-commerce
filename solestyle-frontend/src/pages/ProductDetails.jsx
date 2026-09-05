import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "./ProductDetails.css";

import api from "../services/api";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(`/products/${id}`);

      setProduct(response.data);
    } catch (error) {
      console.error("Error fetching product:", error);
      setError("Unable to load product.");
    } finally {
      setLoading(false);
    }
  };

  const getSizes = () => {
    if (!product?.sizes) {
      return [];
    }

    return product.sizes
      .split(",")
      .map((size) => size.trim())
      .filter((size) => size !== "");
  };

  const increaseQuantity = () => {
    if (product && quantity < product.stock) {
      setQuantity((current) => current + 1);
    }
  };

  const decreaseQuantity = () => {
    setQuantity((current) => (current > 1 ? current - 1 : 1));
  };

  const handleAddToCart = async () => {
    if (!selectedSize) {
      alert("Please select a size.");
      return;
    }

    const savedUser = localStorage.getItem("solestyleUser");

    if (!savedUser) {
      alert("Please login to add products to your cart.");
      navigate("/login");
      return;
    }

    const user = JSON.parse(savedUser);

    try {
      setAddingToCart(true);

      await api.post("/cart/add", null, {
        params: {
          userId: user.id,
          productId: product.id,
          quantity: quantity,
          size: selectedSize,
        },
      });

      alert("Product added to cart!");
    } catch (error) {
      console.error("Error adding product to cart:", error);

      if (error.response) {
        console.error("Backend response:", error.response.data);
      }

      alert("Unable to add product to cart.");
    } finally {
      setAddingToCart(false);
    }
  };

  if (loading) {
    return (
      <div className="product-details-status">
        <p>Loading product...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="product-details-status">
        <h2>Product not found</h2>

        <p>{error}</p>

        <Link to="/products">
          Back to Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="product-details-page">
      <div className="product-details-container">

        {/* Product Image */}
        <div className="product-details-image">

          <img
            src={product.imageUrl}
            alt={product.name}
          />

          <span className="product-details-badge">
            NEW
          </span>

        </div>

        {/* Product Information */}
        <div className="product-details-info">

          <p className="product-details-brand">
            {product.brand}
          </p>

          <h1>{product.name}</h1>

          <p className="product-details-price">
            ₹{Number(product.price).toLocaleString("en-IN")}
          </p>

          <div className="product-rating">
            ⭐ 4.5
            <span>(24 reviews)</span>
          </div>

          <div className="product-description">
            {product.description}
          </div>

          {/* Size */}
          <div className="detail-section">

            <div className="detail-heading">

              <span>
                SELECT SIZE
              </span>

              <span className="size-guide">
                Size Guide
              </span>

            </div>

            <div className="size-options">

              {getSizes().map((size) => (
                <button
                  type="button"
                  key={size}
                  className={
                    selectedSize === size
                      ? "size-button selected"
                      : "size-button"
                  }
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </button>
              ))}

            </div>

          </div>

          {/* Quantity */}
          <div className="detail-section">

            <div className="detail-heading">
              QUANTITY
            </div>

            <div className="quantity-selector">

              <button
                type="button"
                onClick={decreaseQuantity}
                disabled={quantity <= 1}
              >
                −
              </button>

              <span>{quantity}</span>

              <button
                type="button"
                onClick={increaseQuantity}
                disabled={quantity >= product.stock}
              >
                +
              </button>

            </div>

            <p className="stock-info">
              {product.stock > 0
                ? `${product.stock} available`
                : "Out of stock"}
            </p>

          </div>

          {/* Add to Cart */}
          <button
            type="button"
            className="add-to-cart-large"
            onClick={handleAddToCart}
            disabled={product.stock <= 0 || addingToCart}
          >
            {addingToCart
              ? "ADDING..."
              : product.stock > 0
                ? "ADD TO CART"
                : "OUT OF STOCK"}
          </button>

          {/* Features */}
          <div className="product-features">

            <div>
              <strong>Free Delivery</strong>
              <span>On orders above ₹999</span>
            </div>

            <div>
              <strong>Easy Returns</strong>
              <span>7 day return policy</span>
            </div>

            <div>
              <strong>Secure Payment</strong>
              <span>Powered by Razorpay</span>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}

export default ProductDetails;