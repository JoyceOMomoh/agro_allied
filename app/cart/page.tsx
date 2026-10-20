"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useCart } from "@/context/CartContext";

export default function CartPage() {
  const {
    cart,
    removeFromCart,
    updateQuantity,
  } = useCart();

  const subtotal = useMemo(() => {
    return cart.reduce(
      (total, item) => total + Number(item.price) * Number(item.quantity),
      0
    );
  }, [cart]);

  // We will make this dynamic later.
  const deliveryFee = subtotal > 0 ? 2000 : 0;

  const total = subtotal + deliveryFee;

  if (cart.length === 0) {
    return (
      <main className="products-page">

        {/* NAVBAR */}
        <nav className="navbar">

          <Link href="/" className="logo">
            <div className="logo-mark">Z</div>

            <div>
              <strong>ZION</strong>
              <span>AGRO ALLIED</span>
            </div>
          </Link>

          <div className="nav-links">
            <Link href="/">Home</Link>
            <Link href="/products">Shop</Link>
            <Link href="/#about">About</Link>
            <Link href="/#contact">Contact</Link>
          </div>

          <Link href="/products" className="cart-button">
            Continue Shopping
          </Link>

        </nav>

        {/* EMPTY CART */}
        <section
          style={{
            minHeight: "70vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            padding: "60px 20px",
          }}
        >
          <div>

            <div
              style={{
                fontSize: "70px",
                marginBottom: "20px",
              }}
            >
              🛒
            </div>

            <span className="section-label">
              YOUR SHOPPING CART
            </span>

            <h1
              style={{
                fontFamily: "Georgia, serif",
                fontWeight: "normal",
                fontSize: "42px",
                color: "#173b25",
                marginTop: "12px",
              }}
            >
              Your cart is empty
            </h1>

            <p
              style={{
                maxWidth: "430px",
                margin: "15px auto 30px",
                color: "#68766c",
                fontSize: "12px",
                lineHeight: "1.8",
              }}
            >
              Discover our selection of fresh produce,
              frozen foods and quality agricultural products.
            </p>

            <Link
              href="/products"
              className="add-cart"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                textDecoration: "none",
                padding: "15px 30px",
              }}
            >
              Browse Products
            </Link>

          </div>
        </section>

      </main>
    );
  }

  return (
    <main className="products-page">

      {/* =========================================
          NAVBAR
      ========================================= */}

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


        <Link href="/products" className="cart-button">
          ← Continue Shopping
        </Link>

      </nav>


      {/* =========================================
          CART HEADER
      ========================================= */}

      <section
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "65px 30px 35px",
          width: "100%",
        }}
      >

        <span className="section-label">
          YOUR ORDER
        </span>

        <h1
          style={{
            fontFamily: "Georgia, serif",
            fontWeight: "normal",
            fontSize: "48px",
            color: "#173b25",
            marginTop: "12px",
          }}
        >
          Shopping Cart
        </h1>

        <p
          style={{
            marginTop: "10px",
            color: "#68766c",
            fontSize: "12px",
          }}
        >
          Review your selected products before checkout.
        </p>

      </section>


      {/* =========================================
          CART CONTENT
      ========================================= */}

      <section
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "0 30px 100px",
          width: "100%",
        }}
      >

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 360px",
            gap: "50px",
            alignItems: "start",
          }}
        >

          {/* =====================================
              CART ITEMS
          ===================================== */}

          <div>

            {cart.map((item) => (

              <div
                key={item.id}
                style={{
                  display: "grid",
                  gridTemplateColumns: "120px 1fr auto",
                  gap: "25px",
                  alignItems: "center",
                  padding: "20px 0",
                  borderBottom: "1px solid #e2e8e3",
                }}
              >

                {/* IMAGE */}

                <div
                  style={{
                    width: "120px",
                    height: "120px",
                    background:
                      "linear-gradient(135deg, #e5eee5, #f3f6f2)",
                    overflow: "hidden",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >

                  {item.image ? (

                    <img
                      src={item.image}
                      alt={item.name}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />

                  ) : (

                    <span style={{ fontSize: "45px" }}>
                      🌾
                    </span>

                  )}

                </div>


                {/* DETAILS */}

                <div>

                  <span
                    style={{
                      fontSize: "8px",
                      letterSpacing: "1.5px",
                      color: "#78907e",
                      textTransform: "uppercase",
                    }}
                  >
                    {item.category || "Produce"}
                  </span>

                  <h3
                    style={{
                      fontFamily: "Georgia, serif",
                      fontSize: "22px",
                      fontWeight: "normal",
                      color: "#173b25",
                      margin: "7px 0",
                    }}
                  >
                    {item.name}
                  </h3>

                  <p
                    style={{
                      color: "#68766c",
                      fontSize: "11px",
                    }}
                  >
                    ₦{Number(item.price).toLocaleString()}
                    {item.unit
                      ? ` per ${item.unit}`
                      : ""}
                  </p>


                  {/* QUANTITY */}

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginTop: "15px",
                      width: "115px",
                      height: "36px",
                      border: "1px solid #d8e0da",
                    }}
                  >

                    <button
                      onClick={() =>
                        updateQuantity(
                          item.id,
                          Math.max(1, item.quantity - 1)
                        )
                      }
                      style={{
                        width: "35px",
                        height: "100%",
                        border: "none",
                        background: "transparent",
                        cursor: "pointer",
                        fontSize: "16px",
                        color: "#173b25",
                      }}
                    >
                      −
                    </button>

                    <span
                      style={{
                        flex: 1,
                        textAlign: "center",
                        fontSize: "11px",
                        color: "#173b25",
                      }}
                    >
                      {item.quantity}
                    </span>

                    <button
                      onClick={() =>
                        updateQuantity(
                          item.id,
                          item.quantity + 1
                        )
                      }
                      style={{
                        width: "35px",
                        height: "100%",
                        border: "none",
                        background: "transparent",
                        cursor: "pointer",
                        fontSize: "16px",
                        color: "#173b25",
                      }}
                    >
                      +
                    </button>

                  </div>

                </div>


                {/* PRICE + REMOVE */}

                <div
                  style={{
                    textAlign: "right",
                    alignSelf: "stretch",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    alignItems: "flex-end",
                  }}
                >

                  <strong
                    style={{
                      fontFamily: "Georgia, serif",
                      fontWeight: "normal",
                      fontSize: "19px",
                      color: "#287443",
                    }}
                  >
                    ₦
                    {(
                      Number(item.price) *
                      Number(item.quantity)
                    ).toLocaleString()}
                  </strong>

                  <button
                    onClick={() =>
                      removeFromCart(item.id)
                    }
                    style={{
                      border: "none",
                      background: "transparent",
                      color: "#9a5555",
                      cursor: "pointer",
                      fontSize: "9px",
                      letterSpacing: "1px",
                      textTransform: "uppercase",
                    }}
                  >
                    Remove
                  </button>

                </div>

              </div>

            ))}

          </div>


          {/* =====================================
              ORDER SUMMARY
          ===================================== */}

          <aside
            style={{
              background: "#f3f6f2",
              padding: "35px",
              position: "sticky",
              top: "30px",
            }}
          >

            <span className="section-label">
              ORDER SUMMARY
            </span>

            <h2
              style={{
                fontFamily: "Georgia, serif",
                fontWeight: "normal",
                fontSize: "28px",
                color: "#173b25",
                margin: "10px 0 25px",
              }}
            >
              Your Order
            </h2>


            {/* SUBTOTAL */}

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                paddingBottom: "15px",
                borderBottom: "1px solid #dce3dd",
              }}
            >

              <span
                style={{
                  fontSize: "11px",
                  color: "#68766c",
                }}
              >
                Subtotal
              </span>

              <strong
                style={{
                  fontSize: "12px",
                  color: "#173b25",
                }}
              >
                ₦{subtotal.toLocaleString()}
              </strong>

            </div>


            {/* DELIVERY */}

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "15px 0",
                borderBottom: "1px solid #dce3dd",
              }}
            >

              <span
                style={{
                  fontSize: "11px",
                  color: "#68766c",
                }}
              >
                Delivery
              </span>

              <strong
                style={{
                  fontSize: "12px",
                  color: "#173b25",
                }}
              >
                ₦{deliveryFee.toLocaleString()}
              </strong>

            </div>


            {/* TOTAL */}

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "22px 0",
              }}
            >

              <span
                style={{
                  fontSize: "12px",
                  color: "#173b25",
                  fontWeight: "600",
                }}
              >
                Total
              </span>

              <strong
                style={{
                  fontFamily: "Georgia, serif",
                  fontWeight: "normal",
                  fontSize: "25px",
                  color: "#287443",
                }}
              >
                ₦{total.toLocaleString()}
              </strong>

            </div>


            {/* CHECKOUT */}

            <Link
              href="/checkout"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "100%",
                height: "52px",
                background: "#173b25",
                color: "#ffffff",
                textDecoration: "none",
                fontSize: "9px",
                letterSpacing: "2px",
                textTransform: "uppercase",
              }}
            >
              Proceed to Checkout
            </Link>


            <Link
              href="/products"
              style={{
                display: "block",
                textAlign: "center",
                marginTop: "17px",
                color: "#68766c",
                textDecoration: "none",
                fontSize: "9px",
                letterSpacing: "1px",
              }}
            >
              ← Continue Shopping
            </Link>

          </aside>

        </div>

      </section>


      {/* =========================================
          FOOTER
      ========================================= */}

      <footer>

        <div className="footer-main">

          <div className="footer-brand">

            <Link href="/" className="logo">

              <div className="logo-mark">
                Z
              </div>

              <div>
                <strong>ZION</strong>
                <span>AGRO ALLIED</span>
              </div>

            </Link>

            <p>
              Quality agricultural products,
              frozen foods and livestock.
            </p>

          </div>


          <div className="footer-column">

            <h4>Explore</h4>

            <Link href="/">Home</Link>

            <Link href="/products">Shop</Link>

            <Link href="/cart">Cart</Link>

          </div>


          <div className="footer-column">

            <h4>Categories</h4>

            <p>Farm Produce</p>
            <p>Frozen Foods</p>
            <p>Livestock</p>

          </div>


          <div className="footer-column">

            <h4>Zion Agro Allied</h4>

            <p>Freshness</p>
            <p>Quality</p>
            <p>Trust</p>

          </div>

        </div>


        <div className="footer-bottom">

          <span>
            © 2026 Zion Agro Allied
          </span>

          <span>
            All rights reserved.
          </span>

        </div>

      </footer>

    </main>
  );
}