"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function OrderSuccessPage() {
  const searchParams = useSearchParams();

  const orderId = searchParams.get("order");

  return (
    <main className="success-page">

      {/* NAVBAR */}

      <nav className="navbar">

        <Link href="/" className="logo">

          <div className="logo-mark">
            Z
          </div>

          <div>
            <strong>ZION</strong>
            <span>AGRO ALLIED</span>
          </div>

        </Link>

        <div className="nav-links">

          <Link href="/">
            Home
          </Link>

          <Link href="/products">
            Shop
          </Link>

          <Link href="/#about">
            About
          </Link>

          <Link href="/#contact">
            Contact
          </Link>

        </div>

        <Link
          href="/products"
          className="cart-button"
        >
          Continue Shopping
        </Link>

      </nav>


      {/* SUCCESS CONTENT */}

      <section className="success-container">

        <div className="success-card">

          <div className="success-icon">
            ✓
          </div>

          <span className="section-label">
            ORDER RECEIVED
          </span>

          <h1>
            Thank You
          </h1>

          <p className="success-message">
            Your order has been successfully
            received by Zion Agro Allied.
          </p>

          {orderId && (
            <div className="order-number">

              <span>
                ORDER NUMBER
              </span>

              <strong>
                #{orderId.slice(0, 8).toUpperCase()}
              </strong>

            </div>
          )}

          <p className="next-message">
            Our team will review your order
            and contact you shortly to confirm
            your order and delivery details.
          </p>


          {/* ACTIONS */}

          <div className="success-actions">

            <Link
              href="/products"
              className="primary-success-button"
            >
              Continue Shopping
            </Link>

            <Link
              href="/"
              className="secondary-success-button"
            >
              Back Home
            </Link>

          </div>

        </div>

      </section>


      {/* FOOTER */}

      <footer className="success-footer">

        <div className="footer-brand">
          ZION AGRO ALLIED
        </div>

        <p>
          Quality food. Trusted supply.
          Better living.
        </p>

        <span>
          © {new Date().getFullYear()}
          {" "}
          Zion Agro Allied
        </span>

      </footer>

    </main>
  );
}