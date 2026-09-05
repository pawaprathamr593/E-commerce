import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

function Orders() {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    const savedUser = localStorage.getItem("solestyleUser");

    if (!savedUser) {
      navigate("/login");
      return;
    }

    const user = JSON.parse(savedUser);

    try {
      setLoading(true);
      setError("");

      const response = await api.get(`/orders/user/${user.id}`);

      setOrders(response.data || []);
    } catch (error) {
      console.error("Error loading orders:", error);
      setError("Unable to load your orders.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <main className="orders-page">
        <div className="orders-container">
          <div className="orders-message">
            <p>Loading your orders...</p>
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="orders-page">
        <div className="orders-container">
          <div className="orders-message">
            <p>{error}</p>

            <button
              className="checkout-retry-button"
              onClick={loadOrders}
            >
              Try Again
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="orders-page">
      <div className="orders-container">

        <div className="orders-header">
          <p className="orders-eyebrow">SOLESTYLE</p>

          <h1>My Orders</h1>

          <p>
            Track and view your SoleStyle purchases.
          </p>
        </div>

        {orders.length === 0 ? (
          <div className="orders-empty">
            <h2>No orders yet</h2>

            <p>
              You haven't placed any orders yet.
            </p>

            <Link
              to="/products"
              className="orders-shop-button"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="orders-list">

            {orders.map((order) => (
              <div
                className="order-card"
                key={order.id}
              >

                <div className="order-card-top">

                  <div>
                    <p className="order-label">
                      Order ID
                    </p>

                    <h2>
                      #{order.id}
                    </h2>
                  </div>

                  <div className="order-status-group">

                    <span className={`order-status ${(
                      order.status || ""
                    ).toLowerCase()}`}>
                      {order.status}
                    </span>

                    <span
                      className={`payment-status ${(
                        order.paymentStatus || ""
                      ).toLowerCase()}`}
                    >
                      {order.paymentStatus}
                    </span>

                  </div>

                </div>

                <div className="order-card-details">

                  <div>
                    <span>Order Date</span>

                    <strong>
                      {order.orderDate
                        ? new Date(
                            order.orderDate
                          ).toLocaleDateString(
                            "en-IN"
                          )
                        : "-"}
                    </strong>
                  </div>

                  <div>
                    <span>Total</span>

                    <strong>
                      ₹
                      {Number(
                        order.totalAmount
                      ).toLocaleString("en-IN")}
                    </strong>
                  </div>

                  <div>
                    <span>Delivery City</span>

                    <strong>
                      {order.city || "-"}
                    </strong>
                  </div>

                </div>

                <div className="order-card-bottom">

                  <span>
                    {order.customerName}
                  </span>

                  <Link
                    to={`/orders/${order.id}`}
                    className="order-view-button"
                  >
                    View Order
                  </Link>

                </div>

              </div>
            ))}

          </div>
        )}

      </div>
    </main>
  );
}

export default Orders;