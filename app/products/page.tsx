"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabase";
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

export default function ProductsPage() {
  const router = useRouter();
  const { addToCart } = useCart();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  /* =========================================
     FETCH PRODUCTS FROM SUPABASE
  ========================================= */

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    setLoading(true);
    setError("");

    try {
      const { data, error } = await supabase
        .from("produce")
        .select("*")
        .order("name", { ascending: true });

      if (error) {
        console.error("SUPABASE ERROR:", error);

        const errorMessage =
          error.message ||
          error.details ||
          error.hint ||
          JSON.stringify(error) ||
          "Unable to load products from Supabase.";

        setError(errorMessage);
        setLoading(false);
        return;
      }

      console.log("PRODUCE DATA:", data);

      setProducts(data || []);
      setLoading(false);
    } catch (err) {
      console.error("FETCH ERROR:", err);

      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Something went wrong while loading products.");
      }

      setLoading(false);
    }
  }

  /* =========================================
     CATEGORIES
  ========================================= */

  const categories = useMemo(() => {
    const uniqueCategories = products
      .map((product) => product.category)
      .filter(
        (category): category is string =>
          Boolean(category && category.trim())
      );

    return ["All", ...Array.from(new Set(uniqueCategories))];
  }, [products]);

  /* =========================================
     SEARCH + CATEGORY FILTER
  ========================================= */

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const searchTerm = search.toLowerCase().trim();

      const matchesSearch =
        product.name.toLowerCase().includes(searchTerm) ||
        (product.category || "").toLowerCase().includes(searchTerm) ||
        (product.description || "").toLowerCase().includes(searchTerm);

      const matchesCategory =
        selectedCategory === "All" ||
        product.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [products, search, selectedCategory]);

  /* =========================================
     ADD TO CART
  ========================================= */

  function handleAddToCart(product: Product) {
    if (product.stock <= 0) {
      return;
    }

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

    router.push("/cart");
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


        <div className="nav-actions">

          <Link href="/cart" className="cart-button">
            🛒 <span>Cart</span>
          </Link>

        </div>

      </nav>


      {/* =========================================
          SHOP HEADER
      ========================================= */}

      <section className="products-header">

        <span className="section-label">
          ZION AGRO ALLIED
        </span>

        <h1>
          Freshness, <em>Delivered.</em>
        </h1>

        <p>
          Explore our carefully selected range of frozen foods,
          livestock and fresh agricultural produce. Quality products,
          convenient ordering and trusted service.
        </p>

      </section>


      {/* =========================================
          SEARCH + FILTERS
      ========================================= */}

      <section className="product-controls">

        <div className="category-filters">

          {categories.map((category) => (

            <button
              key={category}
              className={`category-filter ${
                selectedCategory === category
                  ? "active"
                  : ""
              }`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>

          ))}

        </div>


        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: "250px",
            padding: "12px 15px",
            border: "1px solid #dbe4dc",
            borderRadius: "8px",
            outline: "none",
            background: "white",
            color: "#173b25",
            fontSize: "11px",
          }}
        />

      </section>


      {/* =========================================
          PRODUCTS GRID
      ========================================= */}

      <section className="products-grid">

        {/* LOADING */}

        {loading && (

          <div
            style={{
              gridColumn: "1 / -1",
              textAlign: "center",
              padding: "100px 20px",
            }}
          >

            <div
              style={{
                fontSize: "45px",
                marginBottom: "15px",
              }}
            >
              🌱
            </div>

            <h3
              style={{
                fontFamily: "Georgia, serif",
                fontWeight: "normal",
                fontSize: "25px",
                color: "#173b25",
              }}
            >
              Loading fresh products...
            </h3>

            <p
              style={{
                marginTop: "8px",
                color: "#68766c",
                fontSize: "11px",
              }}
            >
              Please wait while we load our current stock.
            </p>

          </div>

        )}


        {/* ERROR */}

        {!loading && error && (

          <div
            style={{
              gridColumn: "1 / -1",
              textAlign: "center",
              padding: "90px 20px",
            }}
          >

            <div
              style={{
                fontSize: "45px",
                marginBottom: "15px",
              }}
            >
              ⚠️
            </div>

            <h3
              style={{
                fontFamily: "Georgia, serif",
                fontWeight: "normal",
                fontSize: "25px",
                color: "#9c3838",
              }}
            >
              Unable to load products
            </h3>

            <p
              style={{
                margin: "12px auto 20px",
                maxWidth: "650px",
                color: "#68766c",
                fontSize: "11px",
                lineHeight: "1.7",
              }}
            >
              {error}
            </p>

            <button
              onClick={fetchProducts}
              className="add-cart"
            >
              Try Again
            </button>

          </div>

        )}


        {/* PRODUCTS */}

        {!loading &&
          !error &&
          filteredProducts.map((product) => {

            const isOutOfStock =
              Number(product.stock) <= 0;

            return (

              <article
                className="product-card"
                key={product.id}
              >

                {/* PRODUCT IMAGE */}

                <div className="product-image">

                  {product.image ? (

                    <img
                      src={product.image}
                      alt={product.name}
                    />

                  ) : (

                    <div
                      style={{
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "60px",
                      }}
                    >
                      🌾
                    </div>

                  )}


                  {/* CATEGORY BADGE */}

                  <span className="stock-badge">

                    {product.category ||
                      "Produce"}

                  </span>


                  {/* STOCK */}

                  <span
                    style={{
                      position: "absolute",
                      bottom: "12px",
                      left: "12px",
                      padding: "6px 10px",
                      borderRadius: "20px",
                      background: isOutOfStock
                        ? "#fff0f0"
                        : "#ffffff",
                      color: isOutOfStock
                        ? "#b33b3b"
                        : "#287443",
                      fontSize: "8px",
                      fontWeight: "bold",
                    }}
                  >

                    {isOutOfStock
                      ? "Out of Stock"
                      : `${product.stock} ${
                          product.unit || "available"
                        }`}

                  </span>

                </div>


                {/* PRODUCT INFORMATION */}

                <div className="product-info">

                  <span className="product-category">
                    {product.category ||
                      "Agricultural Produce"}
                  </span>


                  <h3>
                    {product.name}
                  </h3>


                  <p className="product-description">

                    {product.description ||
                      "Quality agricultural product carefully selected by Zion Agro Allied."}

                  </p>


                  {/* PRICE + CART */}

                  <div className="product-bottom">

                    <div>

                      <span
                        style={{
                          display: "block",
                          fontSize: "8px",
                          color: "#879189",
                          marginBottom: "3px",
                        }}
                      >
                        PRICE
                      </span>

                      <div className="product-price">
                        ₦
                        {Number(
                          product.price
                        ).toLocaleString()}
                      </div>

                      {product.unit && (

                        <span
                          style={{
                            display: "block",
                            fontSize: "8px",
                            color: "#879189",
                            marginTop: "3px",
                          }}
                        >
                          per {product.unit}
                        </span>

                      )}

                    </div>


                    <button
                      className="add-cart"
                      disabled={isOutOfStock}
                      onClick={() =>
                        handleAddToCart(product)
                      }
                    >

                      {isOutOfStock
                        ? "Unavailable"
                        : "Add to Cart"}

                    </button>

                  </div>

                </div>

              </article>

            );
          })}


        {/* NO PRODUCTS */}

        {!loading &&
          !error &&
          filteredProducts.length === 0 && (

            <div
              style={{
                gridColumn: "1 / -1",
                textAlign: "center",
                padding: "100px 20px",
              }}
            >

              <div
                style={{
                  fontSize: "45px",
                  marginBottom: "15px",
                }}
              >
                🔎
              </div>

              <h3
                style={{
                  fontFamily: "Georgia, serif",
                  fontWeight: "normal",
                  fontSize: "25px",
                  color: "#173b25",
                }}
              >
                No products found
              </h3>

              <p
                style={{
                  marginTop: "8px",
                  color: "#68766c",
                  fontSize: "11px",
                }}
              >
                Try another search or category.
              </p>

              {search && (

                <button
                  onClick={() => setSearch("")}
                  className="add-cart"
                  style={{
                    marginTop: "20px",
                  }}
                >
                  Clear Search
                </button>

              )}

            </div>

          )}

      </section>


      {/* =========================================
          SHOP CONFIDENCE SECTION
      ========================================= */}

      <section className="categories">

        <div className="section-heading">

          <div>

            <span className="section-label">
              SHOP WITH CONFIDENCE
            </span>

            <h2>
              From Our <em>Farm</em>
              <br />
              To Your Table
            </h2>

          </div>


          <p
            style={{
              maxWidth: "380px",
              color: "#68766c",
              fontSize: "12px",
              lineHeight: "1.8",
            }}
          >
            We make it easy to access quality agricultural
            products without the stress of traditional shopping.
          </p>

        </div>


        <div className="category-grid">

          {/* FARM PRODUCE */}

          <div className="category-card">

            <div
              style={{
                height: "100%",
                background:
                  "linear-gradient(135deg, #dcebdc, #edf5ed)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "80px",
              }}
            >
              🌾
            </div>

            <div className="category-overlay">

              <div>

                <h3>
                  Fresh Produce
                </h3>

                <p>
                  Quality farm produce for your everyday needs.
                </p>

              </div>

            </div>

          </div>


          {/* FROZEN FOOD */}

          <div className="category-card">

            <div
              style={{
                height: "100%",
                background:
                  "linear-gradient(135deg, #dce5dc, #eef2ee)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "80px",
              }}
            >
              🥩
            </div>

            <div className="category-overlay">

              <div>

                <h3>
                  Frozen Foods
                </h3>

                <p>
                  Carefully handled frozen food products.
                </p>

              </div>

            </div>

          </div>


          {/* LIVESTOCK */}

          <div className="category-card">

            <div
              style={{
                height: "100%",
                background:
                  "linear-gradient(135deg, #e5eadf, #f1f3ec)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "80px",
              }}
            >
              🐄
            </div>

            <div className="category-overlay">

              <div>

                <h3>
                  Livestock
                </h3>

                <p>
                  Quality livestock sourced from trusted farms.
                </p>

              </div>

            </div>

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

                <strong>
                  ZION
                </strong>

                <span>
                  AGRO ALLIED
                </span>

              </div>

            </Link>


            <p>
              Connecting customers with quality agricultural
              products, frozen foods and livestock.
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
              Contact
            </h4>

            <p>
              Zion Agro Allied
            </p>

            <p>
              Quality • Freshness • Trust
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