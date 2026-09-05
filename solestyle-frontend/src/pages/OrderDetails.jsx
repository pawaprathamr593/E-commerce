import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../services/api";

function OrderDetails() {
  const { id } = useParams();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadOrder();
  }, [id]);

  const loadOrder = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(`/orders/${id}`);

      setOrder(response.data);
    } catch (error) {
      console.error("Error loading order:", error);
      setError("Unable to load order details.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <main className="order-details-page">
        <div className="order-details-container">
          <div className="orders-message">
            <p>Loading order...</p>
          </div>
        </div>
      </main>
    );
  }

  if (error || !order) {
    return (
      <main className="order-details-page">
        <div className="order-details-container">
          <div className="orders-message">
            <p>{error || "Order not found."}</p>

            <Link
              to="/orders"
              className="orders-shop-button"
            >
              Back to Orders
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="order-details-page">

      <div className="order-details-container">

        {/* Header */}
        <div className="order-details-header">

          <div>
            <p className="orders-eyebrow">
              SOLESTYLE ORDER
            </p>

            <h1>
              Order #{order.id}
            </h1>

            <p>
              Thank you for shopping with SoleStyle.
            </p>
          </div>

          <Link
            to="/orders"
            className="order-back-button"
          >
            ← My Orders
          </Link>

        </div>

        {/* Payment Status */}
        <div className="order-success-banner">

          <div className="order-success-icon">
            {order.paymentStatus === "PAID" ? "✓" : "!"}
          </div>

          <div>
            <h2>
              {order.paymentStatus === "PAID"
                ? "Payment Successful"
                : "Payment Pending"}
            </h2>

            <p>
              {order.paymentStatus === "PAID"
                ? "Your order has been successfully placed."
                : "Your order is waiting for payment."}
            </p>
          </div>

        </div>

        {/* Purchased Products */}
        <div className="order-details-card">

          <h2>Items Ordered</h2>

          <div className="order-items-list">

            {order.items && order.items.length > 0 ? (
              order.items.map((item) => (
                <div
                  className="order-item"
                  key={item.id}
                >

                  <img
                    src={item.product.imageUrl}
                    alt={item.product.name}
                    className="order-item-image"
                  />

                  <div className="order-item-info">

                    <p className="order-item-brand">
                      {item.product.brand}
                    </p>

                    <h3>
                      {item.product.name}
                    </h3>

                    <p>
                      Size: {item.size}
                    </p>

                    <p>
                      Quantity: {item.quantity}
                    </p>

                  </div>

                  <div className="order-item-price">

                    <span>
                      ₹
                      {Number(
                        item.price
                      ).toLocaleString("en-IN")}{" "}
                      × {item.quantity}
                    </span>

                    <strong>
                      ₹
                      {Number(
                        item.price * item.quantity
                      ).toLocaleString("en-IN")}
                    </strong>

                  </div>

                </div>
              ))
            ) : (
              <p>No items found for this order.</p>
            )}

          </div>

        </div>

        {/* Order Information */}
        <div className="order-details-grid">

          <div className="order-details-card">

            <h2>Order Information</h2>

            <div className="order-info-list">

              <div>
                <span>Order ID</span>
                <strong>
                  #{order.id}
                </strong>
              </div>

              <div>
                <span>Order Date</span>

                <strong>
                  {order.orderDate
                    ? new Date(
                        order.orderDate
                      ).toLocaleString("en-IN")
                    : "-"}
                </strong>
              </div>

              <div>
                <span>Order Status</span>

                <strong
                  className={`order-status ${(
                    order.status || ""
                  ).toLowerCase()}`}
                >
                  {order.status}
                </strong>
              </div>

              <div>
                <span>Payment Status</span>

                <strong
                  className={`payment-status ${(
                    order.paymentStatus || ""
                  ).toLowerCase()}`}
                >
                  {order.paymentStatus}
                </strong>
              </div>

            </div>

          </div>

          {/* Delivery Information */}
          <div className="order-details-card">

            <h2>Delivery Information</h2>

            <div className="delivery-info">

              <h3>
                {order.customerName}
              </h3>

              <p>
                {order.customerEmail}
              </p>

              <p>
                {order.phone}
              </p>

              <p>
                {order.address}
              </p>

              <p>
                {order.city}, {order.state}
              </p>

              <p>
                Pincode: {order.pincode}
              </p>

            </div>

          </div>

        </div>

        {/* Total */}
        <div className="order-details-card">

          <h2>Order Total</h2>

          <div className="order-total-row">

            <span>Total Amount</span>

            <strong>
              ₹
              {Number(
                order.totalAmount
              ).toLocaleString("en-IN")}
            </strong>

          </div>

        </div>

      </div>

    </main>
  );
}

export default OrderDetails;