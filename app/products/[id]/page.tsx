"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";
import { useCart } from "@/context/CartContext";

type Product = {
  id: string;
  name: string;
  category: string | null;
  price: number;
  stock: number;
  unit: string | null;
  image: string | null;
  description: string | null;
};

export default function ProductDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { addToCart } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    fetchProduct();
  }, [params.id]);

  async function fetchProduct() {
    setLoading(true);
    setError("");

    try {
      const { data, error } = await supabase
        .from("produce")
        .select("*")
        .eq("id", params.id)
        .single();

      if (error) {
        console.error("SUPABASE PRODUCT ERROR:", error);

        setError(
          error.message ||
            error.details ||
            error.hint ||
            "Unable to load this product."
        );

        setLoading(false);
        return;
      }

      setProduct(data);
      setLoading(false);
    } catch (err) {
      console.error("FETCH PRODUCT ERROR:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while loading this product."
      );

      setLoading(false);
    }
  }

  function increaseQuantity() {
    if (!product) return;

    if (quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  }

  function decreaseQuantity() {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  }

  function handleAddToCart() {
    if (!product || product.stock <= 0) return;

    for (let i = 0; i < quantity; i++) {
      addToCart({
        id: product.id,
        name: product.name,
        category: product.category || "Agricultural Produce",
        price: Number(product.price),
        image: product.image || "",
        description: product.description || "",
        stock: Number(product.stock),
        unit: product.unit || "",
      } as any);
    }

    setAdded(true);

    setTimeout(() => {
      router.push("/cart");
    }, 700);
  }

  if (loading) {
    return (
      <main className="products-page">
        <div
          style={{
            minHeight: "70vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
          }}
        >
          <div>
            <div style={{ fontSize: "50px", marginBottom: "20px" }}>
              🌱
            </div>

            <h2
              style={{
                fontFamily: "Georgia, serif",
                fontWeight: "normal",
                color: "#173b25",
              }}
            >
              Loading product...
            </h2>

            <p
              style={{
                marginTop: "8px",
                color: "#68766c",
                fontSize: "12px",
              }}
            >
              Getting the freshest details for you.
            </p>
          </div>
        </div>
      </main>
    );
  }

  if (error || !product) {
    return (
      <main className="products-page">
        <nav className="navbar">
          <Link href="/" className="logo">
            <div className="logo-mark">Z</div>

            <div>
              <strong>ZION</strong>
              <span>AGRO ALLIED</span>
            </div>
          </Link>

          <Link href="/products" className="cart-button">
            ← Back to Shop
          </Link>
        </nav>

        <div
          style={{
            minHeight: "65vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            padding: "40px",
          }}
        >
          <div>
            <div style={{ fontSize: "50px", marginBottom: "20px" }}>
              ⚠️
            </div>

            <h2
              style={{
                fontFamily: "Georgia, serif",
                fontWeight: "normal",
                fontSize: "30px",
                color: "#173b25",
              }}
            >
              Product not found
            </h2>

            <p
              style={{
                margin: "12px auto 25px",
                maxWidth: "500px",
                color: "#68766c",
                fontSize: "12px",
                lineHeight: "1.7",
              }}
            >
              {error || "This product could not be found."}
            </p>

            <Link href="/products" className="add-cart">
              Back to Shop
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const isOutOfStock = Number(product.stock) <= 0;

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

        <Link href="/cart" className="cart-button">
          🛒 Cart
        </Link>

      </nav>


      {/* =========================================
          BREADCRUMB
      ========================================= */}

      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "25px 30px 0",
          width: "100%",
        }}
      >

        <Link
          href="/products"
          style={{
            color: "#68766c",
            textDecoration: "none",
            fontSize: "10px",
            letterSpacing: "1px",
          }}
        >
          SHOP
        </Link>

        <span
          style={{
            margin: "0 10px",
            color: "#b4beb6",
          }}
        >
          /
        </span>

        <span
          style={{
            color: "#173b25",
            fontSize: "10px",
          }}
        >
          {product.name}
        </span>

      </div>


      {/* =========================================
          PRODUCT DETAILS
      ========================================= */}

      <section
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "45px 30px 100px",
        }}
      >

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.05fr 0.95fr",
            gap: "70px",
            alignItems: "center",
          }}
        >

          {/* PRODUCT IMAGE */}

          <div
            style={{
              position: "relative",
              minHeight: "550px",
              borderRadius: "4px",
              overflow: "hidden",
              background:
                "linear-gradient(135deg, #e5eee5, #f4f7f3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >

            {product.image ? (

              <img
                src={product.image}
                alt={product.name}
                style={{
                  width: "100%",
                  height: "550px",
                  objectFit: "cover",
                }}
              />

            ) : (

              <div
                style={{
                  fontSize: "120px",
                }}
              >
                🌾
              </div>

            )}

            <span
              style={{
                position: "absolute",
                top: "20px",
                left: "20px",
                background: "#173b25",
                color: "#ffffff",
                padding: "9px 15px",
                fontSize: "9px",
                letterSpacing: "1px",
                textTransform: "uppercase",
              }}
            >
              {product.category || "Produce"}
            </span>

          </div>


          {/* PRODUCT INFO */}

          <div>

            <span className="section-label">
              ZION AGRO ALLIED
            </span>

            <h1
              style={{
                fontFamily: "Georgia, serif",
                fontSize: "48px",
                lineHeight: "1.1",
                fontWeight: "normal",
                color: "#173b25",
                margin: "15px 0",
              }}
            >
              {product.name}
            </h1>


            {/* PRICE */}

            <div
              style={{
                marginTop: "25px",
                paddingBottom: "25px",
                borderBottom: "1px solid #e1e7e2",
              }}
            >

              <span
                style={{
                  display: "block",
                  fontSize: "9px",
                  letterSpacing: "2px",
                  color: "#879189",
                  marginBottom: "7px",
                  textTransform: "uppercase",
                }}
              >
                Price
              </span>

              <strong
                style={{
                  fontFamily: "Georgia, serif",
                  fontSize: "32px",
                  color: "#287443",
                  fontWeight: "normal",
                }}
              >
                ₦{Number(product.price).toLocaleString()}
              </strong>

              {product.unit && (
                <span
                  style={{
                    marginLeft: "8px",
                    fontSize: "11px",
                    color: "#68766c",
                  }}
                >
                  per {product.unit}
                </span>
              )}

            </div>


            {/* STOCK */}

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                marginTop: "22px",
              }}
            >

              <span
                style={{
                  width: "9px",
                  height: "9px",
                  borderRadius: "50%",
                  background: isOutOfStock
                    ? "#b33b3b"
                    : "#3d9659",
                  display: "inline-block",
                }}
              />

              <span
                style={{
                  fontSize: "11px",
                  color: isOutOfStock
                    ? "#b33b3b"
                    : "#287443",
                  fontWeight: "600",
                }}
              >
                {isOutOfStock
                  ? "Out of Stock"
                  : `${product.stock} ${
                      product.unit || "available"
                    } in stock`}
              </span>

            </div>


            {/* DESCRIPTION */}

            <div
              style={{
                marginTop: "30px",
              }}
            >

              <h3
                style={{
                  fontFamily: "Georgia, serif",
                  fontSize: "20px",
                  fontWeight: "normal",
                  color: "#173b25",
                  marginBottom: "12px",
                }}
              >
                Product Details
              </h3>

              <p
                style={{
                  color: "#68766c",
                  fontSize: "12px",
                  lineHeight: "1.9",
                  maxWidth: "500px",
                }}
              >
                {product.description ||
                  "Quality agricultural product carefully selected and supplied by Zion Agro Allied."}
              </p>

            </div>


            {/* QUANTITY */}

            {!isOutOfStock && (

              <div
                style={{
                  marginTop: "30px",
                }}
              >

                <span
                  style={{
                    display: "block",
                    fontSize: "9px",
                    letterSpacing: "1.5px",
                    color: "#68766c",
                    marginBottom: "10px",
                    textTransform: "uppercase",
                  }}
                >
                  Quantity
                </span>


                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    width: "145px",
                    height: "48px",
                    border: "1px solid #d7dfd8",
                  }}
                >

                  <button
                    onClick={decreaseQuantity}
                    disabled={quantity <= 1}
                    style={{
                      width: "45px",
                      height: "100%",
                      border: "none",
                      background: "transparent",
                      fontSize: "18px",
                      color: "#173b25",
                      cursor:
                        quantity <= 1
                          ? "not-allowed"
                          : "pointer",
                      opacity:
                        quantity <= 1 ? 0.4 : 1,
                    }}
                  >
                    −
                  </button>


                  <span
                    style={{
                      flex: 1,
                      textAlign: "center",
                      fontSize: "13px",
                      color: "#173b25",
                    }}
                  >
                    {quantity}
                  </span>


                  <button
                    onClick={increaseQuantity}
                    disabled={
                      quantity >= product.stock
                    }
                    style={{
                      width: "45px",
                      height: "100%",
                      border: "none",
                      background: "transparent",
                      fontSize: "18px",
                      color: "#173b25",
                      cursor:
                        quantity >= product.stock
                          ? "not-allowed"
                          : "pointer",
                      opacity:
                        quantity >= product.stock
                          ? 0.4
                          : 1,
                    }}
                  >
                    +
                  </button>

                </div>

              </div>

            )}


            {/* ADD TO CART */}

            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock || added}
              style={{
                width: "100%",
                maxWidth: "500px",
                marginTop: "25px",
                height: "55px",
                border: "none",
                background: isOutOfStock
                  ? "#c7ceca"
                  : added
                  ? "#287443"
                  : "#173b25",
                color: "#ffffff",
                fontSize: "10px",
                letterSpacing: "2px",
                textTransform: "uppercase",
                cursor:
                  isOutOfStock || added
                    ? "default"
                    : "pointer",
                transition: "0.3s ease",
              }}
            >
              {isOutOfStock
                ? "Currently Unavailable"
                : added
                ? "✓ Added to Cart"
                : `Add ${quantity} ${
                    quantity === 1
                      ? "Item"
                      : "Items"
                  } to Cart`}
            </button>


            {/* CONTINUE SHOPPING */}

            <Link
              href="/products"
              style={{
                display: "block",
                marginTop: "18px",
                textAlign: "center",
                maxWidth: "500px",
                color: "#68766c",
                textDecoration: "none",
                fontSize: "10px",
                letterSpacing: "1px",
              }}
            >
              ← Continue Shopping
            </Link>

          </div>

        </div>

      </section>


      {/* =========================================
          TRUST FEATURES
      ========================================= */}

      <section
        style={{
          background: "#f4f7f3",
          padding: "65px 30px",
        }}
      >

        <div
          style={{
            maxWidth: "1000px",
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns:
              "repeat(3, 1fr)",
            gap: "30px",
            textAlign: "center",
          }}
        >

          <div>

            <div
              style={{
                fontSize: "28px",
                marginBottom: "12px",
              }}
            >
              🌱
            </div>

            <h3
              style={{
                fontFamily: "Georgia, serif",
                fontWeight: "normal",
                color: "#173b25",
                fontSize: "19px",
              }}
            >
              Quality Products
            </h3>

            <p
              style={{
                marginTop: "7px",
                fontSize: "10px",
                color: "#68766c",
                lineHeight: "1.7",
              }}
            >
              Carefully selected products.
            </p>

          </div>


          <div>

            <div
              style={{
                fontSize: "28px",
                marginBottom: "12px",
              }}
            >
              🤝
            </div>

            <h3
              style={{
                fontFamily: "Georgia, serif",
                fontWeight: "normal",
                color: "#173b25",
                fontSize: "19px",
              }}
            >
              Trusted Service
            </h3>

            <p
              style={{
                marginTop: "7px",
                fontSize: "10px",
                color: "#68766c",
                lineHeight: "1.7",
              }}
            >
              Your satisfaction matters to us.
            </p>

          </div>


          <div>

            <div
              style={{
                fontSize: "28px",
                marginBottom: "12px",
              }}
            >
              🚚
            </div>

            <h3
              style={{
                fontFamily: "Georgia, serif",
                fontWeight: "normal",
                color: "#173b25",
                fontSize: "19px",
              }}
            >
              Convenient Ordering
            </h3>

            <p
              style={{
                marginTop: "7px",
                fontSize: "10px",
                color: "#68766c",
                lineHeight: "1.7",
              }}
            >
              Simple ordering from anywhere.
            </p>

          </div>

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

            <h4>
              Explore
            </h4>

            <Link href="/">
              Home
            </Link>

            <Link href="/products">
              Shop
            </Link>

            <Link href="/cart">
              Cart
            </Link>

          </div>


          <div className="footer-column">

            <h4>
              Categories
            </h4>

            <p>
              Farm Produce
            </p>

            <p>
              Frozen Foods
            </p>

            <p>
              Livestock
            </p>

          </div>


          <div className="footer-column">

            <h4>
              Zion Agro Allied
            </h4>

            <p>
              Freshness
            </p>

            <p>
              Quality
            </p>

            <p>
              Trust
            </p>

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