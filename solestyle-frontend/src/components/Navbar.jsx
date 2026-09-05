import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Navbar.css";
function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar">

      <div className="navbar-container">

        {/* Logo */}
        <Link to="/" className="logo">
          SOLESTYLE
        </Link>

        {/* Main Navigation */}
        <div className="nav-links">

          <Link to="/">
            Home
          </Link>

          <Link to="/products">
            Shop
          </Link>

          <Link to="/products?gender=Men">
            Men
          </Link>

          <Link to="/products?gender=Women">
            Women
          </Link>

          <Link to="/products?category=Sneakers">
            Sneakers
          </Link>

          <Link to="/products">
            Sale
          </Link>

        </div>

        {/* Right Side */}
        <div className="nav-actions">

          <Link
            to="/products"
            className="nav-icon"
            aria-label="Search"
          >
            🔍
          </Link>

          <Link
            to="/cart"
            className="nav-icon"
            aria-label="Cart"
          >
            🛒
          </Link>

          {user ? (
            <>
              {/* Orders */}
              <Link
                to="/orders"
                className="nav-user"
              >
                Orders
              </Link>

              {/* Admin / User */}
              <Link
                to={
                  user.role === "ADMIN"
                    ? "/admin"
                    : "/"
                }
                className="nav-user"
              >
                {user.name}
              </Link>

              {/* Logout */}
              <button
                onClick={logout}
                className="logout-button"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="nav-icon"
              aria-label="Login"
            >
              👤
            </Link>
          )}

        </div>

      </div>

    </nav>
  );
}

export default Navbar;