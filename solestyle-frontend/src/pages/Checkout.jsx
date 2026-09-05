import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Checkout() {
  const navigate = useNavigate();

  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: ""
  });

  useEffect(() => {
    loadCheckout();
  }, []);

  const loadCheckout = async () => {
    const savedUser = localStorage.getItem("solestyleUser");

    if (!savedUser) {
      navigate("/login");
      return;
    }

    const user = JSON.parse(savedUser);

    // Pre-fill user information
    setFormData((current) => ({
      ...current,
      name: user.name || "",
      email: user.email || ""
    }));

    try {
      setLoading(true);
      setError("");

      const response = await api.get(`/cart/${user.id}`);

      if (
        !response.data ||
        !response.data.items ||
        response.data.items.length === 0
      ) {
        navigate("/cart");
        return;
      }

      setCart(response.data);
    } catch (error) {
      console.error("Error loading checkout:", error);
      setError("Unable to load checkout details.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value
    }));
  };

  const calculateSubtotal = () => {
    if (!cart?.items) {
      return 0;
    }

    return cart.items.reduce((total, item) => {
      return total + item.product.price * item.quantity;
    }, 0);
  };

  const calculateDelivery = () => {
    const subtotal = calculateSubtotal();

    if (subtotal === 0 || subtotal > 999) {
      return 0;
    }

    return 99;
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateDelivery();
  };

  // Load Razorpay JavaScript SDK
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const existingScript = document.querySelector(
        'script[src="https://checkout.razorpay.com/v1/checkout.js"]'
      );

      if (existingScript) {
        resolve(true);
        return;
      }

      const script = document.createElement("script");

      script.src = "https://checkout.razorpay.com/v1/checkout.js";

      script.onload = () => {
        resolve(true);
      };

      script.onerror = () => {
        resolve(false);
      };

      document.body.appendChild(script);
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const savedUser = localStorage.getItem("solestyleUser");

    if (!savedUser) {
      alert("Please login first.");
      navigate("/login");
      return;
    }

    const user = JSON.parse(savedUser);

    // Validate checkout fields
    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.phone.trim() ||
      !formData.address.trim() ||
      !formData.city.trim() ||
      !formData.state.trim() ||
      !formData.pincode.trim()
    ) {
      alert("Please fill in all checkout details.");
      return;
    }

    try {
      setPlacingOrder(true);

      // -------------------------------------------------
      // STEP 1: Create order in our database
      // -------------------------------------------------
      const orderResponse = await api.post(
        `/orders/create/${user.id}`,
        {
          customerName: formData.name,
          customerEmail: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode
        }
      );

      const shopOrder = orderResponse.data;

      console.log("Shop order created:", shopOrder);

      // -------------------------------------------------
      // STEP 2: Load Razorpay script
      // -------------------------------------------------
      const razorpayLoaded = await loadRazorpayScript();

      if (!razorpayLoaded) {
        alert(
          "Unable to load Razorpay. Please check your internet connection and try again."
        );

        setPlacingOrder(false);
        return;
      }

      // -------------------------------------------------
      // STEP 3: Create Razorpay order on backend
      // -------------------------------------------------
      const paymentResponse = await api.post(
        "/payment/create-order",
        null,
        {
          params: {
            orderId: shopOrder.id
          }
        }
      );

      const paymentData = paymentResponse.data;

      console.log("Payment data:", paymentData);

      if (!paymentData.success) {
        alert(
          paymentData.message ||
            "Unable to create payment order."
        );

        setPlacingOrder(false);
        return;
      }

      // -------------------------------------------------
      // STEP 4: Razorpay checkout options
      // -------------------------------------------------
      const options = {
        key: paymentData.razorpayKeyId,

        amount: paymentData.amount,

        currency: paymentData.currency,

        name: "SoleStyle",

        description: `SoleStyle Order #${shopOrder.id}`,

        order_id: paymentData.razorpayOrderId,

        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.phone
        },

        notes: {
          order_id: String(shopOrder.id)
        },

        theme: {
          color: "#111111"
        },

        // -------------------------------------------------
        // STEP 5: Razorpay payment successful
        // -------------------------------------------------
        handler: async function (response) {
          try {
            console.log(
              "Razorpay response:",
              response
            );

            // -------------------------------------------------
            // STEP 6: Verify payment with backend
            // -------------------------------------------------
            const verifyResponse = await api.post(
              "/payment/verify",
              null,
              {
                params: {
                  orderId: shopOrder.id,
                  razorpayOrderId:
                    response.razorpay_order_id,
                  razorpayPaymentId:
                    response.razorpay_payment_id,
                  razorpaySignature:
                    response.razorpay_signature
                }
              }
            );

            console.log(
              "Verification response:",
              verifyResponse.data
            );

            if (verifyResponse.data.success) {
              alert(
                "Payment successful! Your order has been placed."
              );

              navigate(`/orders/${shopOrder.id}`);
            } else {
              alert(
                "Payment verification failed. Please contact support."
              );

              setPlacingOrder(false);
            }
          } catch (error) {
            console.error(
              "Payment verification error:",
              error
            );

            if (error.response) {
              console.error(
                "Verification backend response:",
                error.response.data
              );
            }

            alert(
              "Payment was completed, but verification failed. Please contact support."
            );

            setPlacingOrder(false);
          }
        },

        // Razorpay window closed
        modal: {
          ondismiss: function () {
            console.log(
              "Razorpay checkout closed."
            );

            setPlacingOrder(false);
          }
        }
      };

      // -------------------------------------------------
      // STEP 7: Open Razorpay checkout
      // -------------------------------------------------
      const razorpay = new window.Razorpay(options);

      razorpay.on("payment.failed", function (response) {
        console.error(
          "Razorpay payment failed:",
          response.error
        );

        alert(
          response.error?.description ||
            "Payment failed. Please try again."
        );

        setPlacingOrder(false);
      });

      razorpay.open();
    } catch (error) {
      console.error(
        "Checkout/payment error:",
        error
      );

      if (error.response) {
        console.error(
          "Backend response:",
          error.response.data
        );
      }

      alert(
        "Unable to process your order. Please try again."
      );

      setPlacingOrder(false);
    }
  };

  if (loading) {
    return (
      <main className="checkout-page">
        <div className="checkout-container">
          <div className="checkout-message">
            <p>Loading checkout...</p>
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="checkout-page">
        <div className="checkout-container">
          <div className="checkout-message">
            <p>{error}</p>

            <button
              className="checkout-retry-button"
              onClick={loadCheckout}
            >
              Try Again
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="checkout-page">
      <div className="checkout-container">

        <div className="checkout-header">
          <p className="checkout-eyebrow">
            SOLESTYLE CHECKOUT
          </p>

          <h1>Complete Your Order</h1>

          <p>
            Enter your delivery details and continue to payment.
          </p>
        </div>

        <div className="checkout-layout">

          {/* Customer Details */}
          <div className="checkout-form-section">

            <div className="checkout-card">

              <h2>Delivery Details</h2>

              <form onSubmit={handleSubmit}>

                <div className="checkout-form-grid">

                  <div className="checkout-field">
                    <label htmlFor="name">
                      Full Name
                    </label>

                    <input
                      id="name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div className="checkout-field">
                    <label htmlFor="email">
                      Email
                    </label>

                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter your email"
                    />
                  </div>

                  <div className="checkout-field">
                    <label htmlFor="phone">
                      Phone Number
                    </label>

                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Enter your phone number"
                    />
                  </div>

                  <div className="checkout-field checkout-full-width">
                    <label htmlFor="address">
                      Address
                    </label>

                    <textarea
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="House number, street, area"
                      rows="4"
                    />
                  </div>

                  <div className="checkout-field">
                    <label htmlFor="city">
                      City
                    </label>

                    <input
                      id="city"
                      name="city"
                      type="text"
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="Enter your city"
                    />
                  </div>

                  <div className="checkout-field">
                    <label htmlFor="state">
                      State
                    </label>

                    <input
                      id="state"
                      name="state"
                      type="text"
                      value={formData.state}
                      onChange={handleChange}
                      placeholder="Enter your state"
                    />
                  </div>

                  <div className="checkout-field">
                    <label htmlFor="pincode">
                      Pincode
                    </label>

                    <input
                      id="pincode"
                      name="pincode"
                      type="text"
                      value={formData.pincode}
                      onChange={handleChange}
                      placeholder="Enter your pincode"
                    />
                  </div>

                </div>

                <button
                  type="submit"
                  className="checkout-submit-button"
                  disabled={placingOrder}
                >
                  {placingOrder
                    ? "Processing Payment..."
                    : "Continue to Payment"}
                </button>

              </form>

            </div>

          </div>

          {/* Order Summary */}
          <div className="checkout-summary-section">

            <div className="checkout-card checkout-summary-card">

              <h2>Order Summary</h2>

              <div className="checkout-items">

                {cart?.items?.map((item) => (
                  <div
                    className="checkout-item"
                    key={item.id}
                  >

                    <img
                      src={item.product.imageUrl}
                      alt={item.product.name}
                      className="checkout-item-image"
                    />

                    <div className="checkout-item-info">

                      <h3>
                        {item.product.name}
                      </h3>

                      <p>
                        {item.product.brand}
                      </p>

                      <span>
                        Size: {item.size} ×{" "}
                        {item.quantity}
                      </span>

                    </div>

                    <strong>
                      ₹
                      {(
                        item.product.price *
                        item.quantity
                      ).toLocaleString("en-IN")}
                    </strong>

                  </div>
                ))}

              </div>

              <div className="checkout-price-summary">

                <div>
                  <span>Subtotal</span>

                  <strong>
                    ₹
                    {calculateSubtotal().toLocaleString(
                      "en-IN"
                    )}
                  </strong>
                </div>

                <div>
                  <span>Delivery</span>

                  <strong>
                    {calculateDelivery() === 0
                      ? "FREE"
                      : `₹${calculateDelivery().toLocaleString(
                          "en-IN"
                        )}`}
                  </strong>
                </div>

                <div className="checkout-total">

                  <span>Total</span>

                  <strong>
                    ₹
                    {calculateTotal().toLocaleString(
                      "en-IN"
                    )}
                  </strong>

                </div>

              </div>

            </div>

          </div>

        </div>

      </div>
    </main>
  );
}

export default Checkout;