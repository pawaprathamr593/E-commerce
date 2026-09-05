import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";

function AdminDashboard() {
  const { user } = useAuth();

  const [stats, setStats] = useState({
    products: 0,
    categories: 0,
    orders: 0,
    users: 0
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);

      const [
        productsResponse,
        categoriesResponse,
        ordersResponse,
        usersResponse
      ] = await Promise.all([
        api.get("/products"),
        api.get("/categories"),
        api.get("/orders"),
        api.get("/users")
      ]);

      setStats({
        products: productsResponse.data?.length || 0,
        categories: categoriesResponse.data?.length || 0,
        orders: ordersResponse.data?.length || 0,
        users: usersResponse.data?.length || 0
      });
    } catch (error) {
      console.error("Error loading dashboard statistics:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="admin-page">
      <div className="admin-container">

        {/* Header */}
        <div className="admin-header">

          <div>
            <p className="admin-eyebrow">
              SOLESTYLE ADMIN
            </p>

            <h1>Dashboard</h1>

            <p>
              Welcome back, {user?.name || "Admin"}.
            </p>
          </div>

          <Link
            to="/"
            className="admin-store-button"
          >
            View Store
          </Link>

        </div>

        {/* Statistics */}
        <div className="admin-stats">

          <Link
            to="/admin/products"
            className="admin-stat-card admin-stat-link"
          >
            <span>Products</span>

            <strong>
              {loading ? "..." : stats.products}
            </strong>

            <small>
              Manage products →
            </small>
          </Link>

          <Link
            to="/admin/categories"
            className="admin-stat-card admin-stat-link"
          >
            <span>Categories</span>

            <strong>
              {loading ? "..." : stats.categories}
            </strong>

            <small>
              Manage categories →
            </small>
          </Link>

          <Link
            to="/admin/orders"
            className="admin-stat-card admin-stat-link"
          >
            <span>Orders</span>

            <strong>
              {loading ? "..." : stats.orders}
            </strong>

            <small>
              Manage orders →
            </small>
          </Link>

          <Link
            to="/admin/users"
            className="admin-stat-card admin-stat-link"
          >
            <span>Users</span>

            <strong>
              {loading ? "..." : stats.users}
            </strong>

            <small>
              View users →
            </small>
          </Link>

        </div>

        {/* Management */}
        <div className="admin-section">

          <h2>Manage Store</h2>

          <div className="admin-menu-grid">

            <Link
              to="/admin/products"
              className="admin-menu-card"
            >
              <span className="admin-menu-icon">
                👟
              </span>

              <div>
                <h3>Products</h3>

                <p>
                  Add, edit and delete shoes.
                </p>
              </div>

              <span className="admin-menu-arrow">
                →
              </span>
            </Link>

            <Link
              to="/admin/categories"
              className="admin-menu-card"
            >
              <span className="admin-menu-icon">
                📂
              </span>

              <div>
                <h3>Categories</h3>

                <p>
                  Manage your shoe categories.
                </p>
              </div>

              <span className="admin-menu-arrow">
                →
              </span>
            </Link>

            <Link
              to="/admin/orders"
              className="admin-menu-card"
            >
              <span className="admin-menu-icon">
                📦
              </span>

              <div>
                <h3>Orders</h3>

                <p>
                  View and update customer orders.
                </p>
              </div>

              <span className="admin-menu-arrow">
                →
              </span>
            </Link>

            <Link
              to="/admin/users"
              className="admin-menu-card"
            >
              <span className="admin-menu-icon">
                👥
              </span>

              <div>
                <h3>Users</h3>

                <p>
                  View registered customers.
                </p>
              </div>

              <span className="admin-menu-arrow">
                →
              </span>
            </Link>

          </div>

        </div>

      </div>
    </main>
  );
}

export default AdminDashboard;