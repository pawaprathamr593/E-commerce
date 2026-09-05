import { useEffect, useState } from "react";
import api from "../../services/api";

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/orders");

      setOrders(response.data || []);
    } catch (error) {
      console.error("Error loading orders:", error);
      setError("Unable to load orders.");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderId, status) => {
    try {
      await api.put(`/orders/${orderId}/status`, null, {
        params: {
          status
        }
      });

      alert("Order status updated successfully.");

      await loadOrders();
    } catch (error) {
      console.error("Error updating order status:", error);
      alert("Unable to update order status.");
    }
  };

  if (loading) {
    return (
      <main className="admin-page">
        <div className="admin-container">
          <div className="admin-message">
            Loading orders...
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

            <h1>Orders</h1>

            <p>
              View customer orders and manage their status.
            </p>
          </div>
        </div>

        {error && (
          <div className="admin-error">
            <span>{error}</span>

            <button onClick={loadOrders}>
              Try Again
            </button>
          </div>
        )}

        <div className="admin-card">

          <div className="admin-card-header">
            <div>
              <h2>All Orders</h2>

              <p>
                {orders.length} order
                {orders.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>

          {orders.length === 0 ? (
            <div className="admin-empty">

              <h3>No orders found</h3>

              <p>
                Customer orders will appear here.
              </p>

            </div>
          ) : (
            <div className="admin-orders-list">

              {orders.map((order) => (
                <div
                  className="admin-order-card"
                  key={order.id}
                >

                  <div className="admin-order-header">

                    <div>
                      <span className="admin-order-label">
                        Order
                      </span>

                      <h3>
                        #{order.id}
                      </h3>
                    </div>

                    <div className="admin-order-statuses">

                      <span
                        className={`order-status ${(
                          order.status || ""
                        ).toLowerCase()}`}
                      >
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

                  <div className="admin-order-info">

                    <div>
                      <span>Customer</span>

                      <strong>
                        {order.customerName || "-"}
                      </strong>

                      <small>
                        {order.customerEmail || "-"}
                      </small>
                    </div>

                    <div>
                      <span>Phone</span>

                      <strong>
                        {order.phone || "-"}
                      </strong>
                    </div>

                    <div>
                      <span>Location</span>

                      <strong>
                        {order.city || "-"},{" "}
                        {order.state || ""}
                      </strong>

                      <small>
                        {order.pincode || ""}
                      </small>
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

                  </div>

                  <div className="admin-order-address">

                    <span>Delivery Address</span>

                    <p>
                      {order.address || "-"}
                    </p>

                  </div>

                  <div className="admin-order-footer">

                    <span>
                      {order.orderDate
                        ? new Date(
                            order.orderDate
                          ).toLocaleString("en-IN")
                        : "-"}
                    </span>

                    <div className="admin-order-actions">

                      <label htmlFor={`status-${order.id}`}>
                        Update Status
                      </label>

                      <select
                        id={`status-${order.id}`}
                        value={order.status || "PENDING"}
                        onChange={(event) =>
                          updateStatus(
                            order.id,
                            event.target.value
                          )
                        }
                      >
                        <option value="PENDING">
                          PENDING
                        </option>

                        <option value="PAID">
                          PAID
                        </option>

                        <option value="PROCESSING">
                          PROCESSING
                        </option>

                        <option value="SHIPPED">
                          SHIPPED
                        </option>

                        <option value="DELIVERED">
                          DELIVERED
                        </option>

                        <option value="CANCELLED">
                          CANCELLED
                        </option>
                      </select>

                    </div>

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

export default AdminOrders;