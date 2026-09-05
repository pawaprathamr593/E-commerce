import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="footer">

      <div className="footer-container">

        <div className="footer-main">

          {/* Brand */}
          <div className="footer-brand">

            <Link to="/" className="footer-logo">
              SOLESTYLE
            </Link>

            <p>
              Step into your style with comfortable,
              modern shoes designed for everyday movement.
            </p>

          </div>

          {/* Shop */}
          <div className="footer-column">

            <h3>Shop</h3>

            <Link to="/products">
              All Shoes
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

          </div>

          {/* Help */}
          <div className="footer-column">

            <h3>Help</h3>

            <Link to="/orders">
              My Orders
            </Link>

            <Link to="/cart">
              Cart
            </Link>

            <Link to="/login">
              Account
            </Link>

            <Link to="/products">
              Contact
            </Link>

          </div>

          {/* About */}
          <div className="footer-column">

            <h3>SoleStyle</h3>

            <Link to="/">
              About Us
            </Link>

            <Link to="/">
              Delivery
            </Link>

            <Link to="/">
              Returns
            </Link>

            <Link to="/">
              Privacy
            </Link>

          </div>

        </div>

        <div className="footer-bottom">

          <p>
            © {new Date().getFullYear()} SoleStyle. All rights reserved.
          </p>

          <div className="footer-socials">

            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
            >
              Instagram
            </a>

            <a
              href="https://facebook.com"
              target="_blank"
              rel="noreferrer"
            >
              Facebook
            </a>

          </div>

        </div>

      </div>

    </footer>
  );
}

export default Footer;