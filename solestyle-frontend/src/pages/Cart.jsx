import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

import api from "../services/api";

function Cart() {

  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const savedUser = localStorage.getItem("solestyleUser");
  const user = savedUser ? JSON.parse(savedUser) : null;

  useEffect(() => {
    if (user) {
      fetchCart();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchCart = async () => {

    try {

      setLoading(true);
      setError("");

      const response = await api.get(`/cart/${user.id}`);

      setCart(response.data);

    } catch (error) {

      console.error("Error fetching cart:", error);

      setError("Unable to load your cart.");

    } finally {

      setLoading(false);
    }
  };

  const updateQuantity = async (cartItemId, quantity) => {

    try {

      await api.put(
        `/cart/item/${cartItemId}`,
        null,
        {
          params: {
            quantity: quantity
          }
        }
      );

      await fetchCart();

    } catch (error) {

      console.error("Error updating quantity:", error);

      alert("Unable to update quantity.");
    }
  };

  const removeItem = async (cartItemId) => {

    try {

      await api.delete(`/cart/item/${cartItemId}`);

      await fetchCart();

    } catch (error) {

      console.error("Error removing item:", error);

      alert("Unable to remove item.");
    }
  };

  const clearCart = async () => {

    try {

      await api.delete(`/cart/clear/${user.id}`);

      await fetchCart();

    } catch (error) {

      console.error("Error clearing cart:", error);

      alert("Unable to clear cart.");
    }
  };

  const calculateSubtotal = () => {

    if (!cart?.items) {
      return 0;
    }

    return cart.items.reduce(
      (total, item) =>
        total +
        item.product.price * item.quantity,
      0
    );
  };

  const subtotal = calculateSubtotal();

  const deliveryCharge =
    subtotal > 999 || subtotal === 0
      ? 0
      : 99;

  const total = subtotal + deliveryCharge;

  if (!user) {

    return (
      <div className="empty-cart">

        <div className="empty-cart-icon">
          👤
        </div>

        <h2>Please login</h2>

        <p>
          Login to view your shopping cart.
        </p>

        <Link
          to="/login"
          className="continue-shopping"
        >
          LOGIN
        </Link>

      </div>
    );
  }

  if (loading) {

    return (
      <div className="products-status">
        <p>Loading your cart...</p>
      </div>
    );
  }

  if (error) {

    return (
      <div className="products-status">

        <p>{error}</p>

        <button
          className="retry-button"
          onClick={fetchCart}
        >
          Try Again
        </button>

      </div>
    );
  }

  if (!cart || !cart.items || cart.items.length === 0) {

    return (
      <div className="cart-page">

        <div className="cart-container">

          <div className="cart-header">

            <div>

              <p className="section-label">
                YOUR SHOPPING BAG
              </p>

              <h1>Your Cart</h1>

            </div>

          </div>

          <div className="empty-cart">

            <div className="empty-cart-icon">
              🛒
            </div>

            <h2>Your cart is empty</h2>

            <p>
              Looks like you haven't added any shoes yet.
            </p>

            <Link
              to="/products"
              className="continue-shopping"
            >
              CONTINUE SHOPPING
            </Link>

          </div>

        </div>

      </div>
    );
  }

  return (
    <div className="cart-page">

      <div className="cart-container">

        <div className="cart-header">

          <div>

            <p className="section-label">
              YOUR SHOPPING BAG
            </p>

            <h1>Your Cart</h1>

          </div>

          <span className="cart-count">
            {cart.items.length} items
          </span>

        </div>

        <div className="cart-layout">

          <div className="cart-items">

            {cart.items.map((item) => {

              const itemTotal =
                item.product.price *
                item.quantity;

              return (
                <div
                  className="cart-item"
                  key={item.id}
                >

                  <div className="cart-item-image">

                    <img
                      src={item.product.imageUrl}
                      alt={item.product.name}
                    />

                  </div>

                  <div className="cart-item-details">

                    <p className="cart-item-brand">
                      {item.product.brand}
                    </p>

                    <h3>
                      {item.product.name}
                    </h3>

                    <p className="cart-item-size">
                      Size: {item.size}
                    </p>

                    <button
                      className="remove-item"
                      onClick={() =>
                        removeItem(item.id)
                      }
                    >
                      Remove
                    </button>

                  </div>

                  <div className="cart-item-actions">

                    <p className="cart-item-price">
                      ₹{Number(
                        item.product.price
                      ).toLocaleString("en-IN")}
                    </p>

                    <div className="cart-quantity">

                      <button
                        onClick={() =>
                          updateQuantity(
                            item.id,
                            item.quantity - 1
                          )
                        }
                        disabled={item.quantity <= 1}
                      >
                        −
                      </button>

                      <span>
                        {item.quantity}
                      </span>

                      <button
                        onClick={() =>
                          updateQuantity(
                            item.id,
                            item.quantity + 1
                          )
                        }
                        disabled={
                          item.quantity >=
                          item.product.stock
                        }
                      >
                        +
                      </button>

                    </div>

                    <p className="cart-item-total">
                      ₹{Number(
                        itemTotal
                      ).toLocaleString("en-IN")}
                    </p>

                  </div>

                </div>
              );
            })}

            <button
              className="clear-cart-button"
              onClick={clearCart}
            >
              CLEAR CART
            </button>

          </div>

          <div className="cart-summary">

            <h2>Order Summary</h2>

            <div className="summary-row">

              <span>Subtotal</span>

              <span>
                ₹{subtotal.toLocaleString("en-IN")}
              </span>

            </div>

            <div className="summary-row">

              <span>Delivery</span>

              <span>
                {deliveryCharge === 0
                  ? "FREE"
                  : `₹${deliveryCharge}`}
              </span>

            </div>

            <div className="summary-divider" />

            <div className="summary-total">

              <span>Total</span>

              <strong>
                ₹{total.toLocaleString("en-IN")}
              </strong>

            </div>

            <Link
              to="/checkout"
              className="checkout-button"
            >
              PROCEED TO CHECKOUT
            </Link>

            <Link
              to="/products"
              className="continue-shopping-link"
            >
              ← Continue Shopping
            </Link>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Cart;