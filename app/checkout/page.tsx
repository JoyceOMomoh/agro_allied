"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabase";
import { useCart } from "@/context/CartContext";

export default function CheckoutPage() {
  const router = useRouter();

  const {
    cart,
    subtotal,
    clearCart,
  } = useCart();

  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    state: "",
    notes: "",
  });

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const deliveryFee = subtotal > 0 ? 2000 : 0;
  const total = subtotal + deliveryFee;

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement |
      HTMLTextAreaElement |
      HTMLSelectElement
    >
  ) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (cart.length === 0) {
      setErrorMessage("Your cart is empty.");
      return;
    }

    setLoading(true);
    setErrorMessage("");

    try {
      /* =====================================
         1. CREATE CUSTOMER
      ===================================== */

      const { data: customer, error: customerError } =
        await supabase
          .from("customers")
          .insert({
            full_name: form.fullName,
            email: form.email || null,
            phone: form.phone,
          })
          .select()
          .single();

      if (customerError) {
        console.error(
          "Customer error:",
          customerError
        );

        throw new Error(
          customerError.message
        );
      }

      /* =====================================
         2. CREATE ORDER
      ===================================== */

     const { data: order, error: orderError } =
  await supabase
    .from("orders")
    .insert({
      customer_id: customer.id,
      total: total,
      status: "Pending",
      delivery_address: form.address,
      city: form.city,
      state: form.state,
      notes: form.notes || null,
    })
    .select()
    .single();

      if (orderError) {
        console.error(
          "Order error:",
          orderError
        );

        throw new Error(
          orderError.message
        );
      }

      /* =====================================
         3. CREATE ORDER ITEMS
      ===================================== */

      const orderItems = cart.map((item) => ({
        order_id: order.id,
        product_id: item.id,
        product_name: item.name,
        price: Number(item.price),
        quantity: Number(item.quantity),
        subtotal:
          Number(item.price) *
          Number(item.quantity),
      }));

      const {
        error: itemsError,
      } = await supabase
        .from("order_items")
        .insert(orderItems);

      if (itemsError) {
        console.error(
          "Order items error:",
          itemsError
        );

        throw new Error(
          itemsError.message
        );
      }

      /* =====================================
         4. REDUCE PRODUCT STOCK
      ===================================== */

      for (const item of cart) {
        const { data: product, error: productError } =
          await supabase
            .from("produce")
            .select("id, stock")
            .eq("id", item.id)
            .single();

        if (productError) {
          console.error(
            "Stock lookup error:",
            productError
          );

          continue;
        }

        const currentStock =
          Number(product.stock) || 0;

        const newStock = Math.max(
          0,
          currentStock -
            Number(item.quantity)
        );

        const { error: stockError } =
          await supabase
            .from("produce")
            .update({
              stock: newStock,
            })
            .eq("id", item.id);

        if (stockError) {
          console.error(
            "Stock update error:",
            stockError
          );
        }
      }

      /* =====================================
         5. SAVE DELIVERY INFORMATION
         
         Your current orders table does NOT
         have address/city/state/notes columns.

         We will add those to Supabase next.
      ===================================== */

      console.log(
        "Delivery information:",
        form.address,
        form.city,
        form.state,
        form.notes
      );

      /* =====================================
         6. CLEAR CART
      ===================================== */

      clearCart();

      /* =====================================
         7. GO TO SUCCESS PAGE
      ===================================== */

      router.push(
        `/order-success?order=${order.id}`
      );

    } catch (error) {
      console.error(
        "Checkout error:",
        error
      );

      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong while placing your order."
      );

      setLoading(false);
    }
  };

  /* =========================================
     EMPTY CART
  ========================================= */

  if (cart.length === 0) {
    return (
      <main className="products-page">

        <nav className="navbar">

          <Link
            href="/"
            className="logo"
          >
            <div className="logo-mark">
              Z
            </div>

            <div>
              <strong>ZION</strong>
              <span>AGRO ALLIED</span>
            </div>
          </Link>

          <Link
            href="/products"
            className="cart-button"
          >
            Continue Shopping
          </Link>

        </nav>

        <section
          style={{
            minHeight: "70vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            padding: "50px 20px",
          }}
        >

          <div>

            <div
              style={{
                fontSize: "60px",
                marginBottom: "20px",
              }}
            >
              🛒
            </div>

            <span className="section-label">
              CHECKOUT
            </span>

            <h1
              style={{
                fontFamily:
                  "Georgia, serif",
                fontWeight: "normal",
                fontSize: "40px",
                color: "#173b25",
                marginTop: "10px",
              }}
            >
              Your cart is empty
            </h1>

            <p
              style={{
                color: "#68766c",
                fontSize: "12px",
                margin:
                  "15px 0 30px",
              }}
            >
              Add some products before
              proceeding to checkout.
            </p>

            <Link
              href="/products"
              className="add-cart"
              style={{
                display: "inline-flex",
                textDecoration: "none",
                padding:
                  "15px 30px",
              }}
            >
              Browse Products
            </Link>

          </div>

        </section>

      </main>
    );
  }

  /* =========================================
     MAIN CHECKOUT
  ========================================= */

  return (
    <main className="products-page">

      {/* NAVBAR */}

      <nav className="navbar">

        <Link
          href="/"
          className="logo"
        >

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
          href="/cart"
          className="cart-button"
        >
          ← Cart
        </Link>

      </nav>


      {/* HEADER */}

      <section
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding:
            "60px 30px 35px",
          width: "100%",
        }}
      >

        <span className="section-label">
          ZION AGRO ALLIED
        </span>

        <h1
          style={{
            fontFamily:
              "Georgia, serif",
            fontWeight: "normal",
            fontSize: "48px",
            color: "#173b25",
            marginTop: "10px",
          }}
        >
          Checkout
        </h1>

        <p
          style={{
            color: "#68766c",
            fontSize: "12px",
            marginTop: "10px",
          }}
        >
          Complete your details and
          place your order.
        </p>

      </section>


      {/* CHECKOUT */}

      <section
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding:
            "0 30px 100px",
          width: "100%",
        }}
      >

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "1fr 380px",
            gap: "60px",
            alignItems: "start",
          }}
        >

          {/* FORM */}

          <form
            onSubmit={handleSubmit}
            style={{
              display: "flex",
              flexDirection:
                "column",
              gap: "22px",
            }}
          >

            <h2
              style={{
                fontFamily:
                  "Georgia, serif",
                fontWeight: "normal",
                fontSize: "27px",
                color: "#173b25",
                marginBottom:
                  "5px",
              }}
            >
              Delivery Information
            </h2>


            {/* NAME */}

            <div>

              <label style={labelStyle}>
                Full Name *
              </label>

              <input
                type="text"
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                required
                placeholder="Enter your full name"
                style={inputStyle}
              />

            </div>


            {/* PHONE + EMAIL */}

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "1fr 1fr",
                gap: "18px",
              }}
            >

              <div>

                <label style={labelStyle}>
                  Phone Number *
                </label>

                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  required
                  placeholder="08012345678"
                  style={inputStyle}
                />

              </div>

              <div>

                <label style={labelStyle}>
                  Email
                </label>

                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  style={inputStyle}
                />

              </div>

            </div>


            {/* ADDRESS */}

            <div>

              <label style={labelStyle}>
                Delivery Address *
              </label>

              <input
                type="text"
                name="address"
                value={form.address}
                onChange={handleChange}
                required
                placeholder="House number, street name..."
                style={inputStyle}
              />

            </div>


            {/* CITY + STATE */}

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "1fr 1fr",
                gap: "18px",
              }}
            >

              <div>

                <label style={labelStyle}>
                  City *
                </label>

                <input
                  type="text"
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  required
                  placeholder="City"
                  style={inputStyle}
                />

              </div>


              <div>

                <label style={labelStyle}>
                  State *
                </label>

                <select
                  name="state"
                  value={form.state}
                  onChange={handleChange}
                  required
                  style={inputStyle}
                >

                  <option value="">
                    Select State
                  </option>

                  <option value="Abia">
                    Abia
                  </option>

                  <option value="Adamawa">
                    Adamawa
                  </option>

                  <option value="Akwa Ibom">
                    Akwa Ibom
                  </option>

                  <option value="Anambra">
                    Anambra
                  </option>

                  <option value="Bauchi">
                    Bauchi
                  </option>

                  <option value="Bayelsa">
                    Bayelsa
                  </option>

                  <option value="Benue">
                    Benue
                  </option>

                  <option value="Borno">
                    Borno
                  </option>

                  <option value="Cross River">
                    Cross River
                  </option>

                  <option value="Delta">
                    Delta
                  </option>

                  <option value="Ebonyi">
                    Ebonyi
                  </option>

                  <option value="Edo">
                    Edo
                  </option>

                  <option value="Ekiti">
                    Ekiti
                  </option>

                  <option value="Enugu">
                    Enugu
                  </option>

                  <option value="Gombe">
                    Gombe
                  </option>

                  <option value="Imo">
                    Imo
                  </option>

                  <option value="Kaduna">
                    Kaduna
                  </option>

                  <option value="Kano">
                    Kano
                  </option>

                  <option value="Katsina">
                    Katsina
                  </option>

                  <option value="Kogi">
                    Kogi
                  </option>

                  <option value="Kwara">
                    Kwara
                  </option>

                  <option value="Lagos">
                    Lagos
                  </option>

                  <option value="Nasarawa">
                    Nasarawa
                  </option>

                  <option value="Niger">
                    Niger
                  </option>

                  <option value="Ogun">
                    Ogun
                  </option>

                  <option value="Ondo">
                    Ondo
                  </option>

                  <option value="Osun">
                    Osun
                  </option>

                  <option value="Oyo">
                    Oyo
                  </option>

                  <option value="Plateau">
                    Plateau
                  </option>

                  <option value="Rivers">
                    Rivers
                  </option>

                  <option value="Sokoto">
                    Sokoto
                  </option>

                  <option value="Taraba">
                    Taraba
                  </option>

                  <option value="Yobe">
                    Yobe
                  </option>

                  <option value="Zamfara">
                    Zamfara
                  </option>

                  <option value="FCT">
                    FCT Abuja
                  </option>

                </select>

              </div>

            </div>


            {/* NOTES */}

            <div>

              <label style={labelStyle}>
                Order Notes
              </label>

              <textarea
                name="notes"
                value={form.notes}
                onChange={handleChange}
                placeholder="Any special instructions?"
                rows={5}
                style={{
                  ...inputStyle,
                  height: "120px",
                  padding:
                    "14px",
                  resize: "vertical",
                }}
              />

            </div>


            {/* PAYMENT INFO */}

            <div
              style={{
                padding: "25px",
                background:
                  "#f3f6f2",
                borderLeft:
                  "3px solid #287443",
              }}
            >

              <span
                style={{
                  display: "block",
                  fontSize: "9px",
                  letterSpacing:
                    "1.5px",
                  color: "#287443",
                  textTransform:
                    "uppercase",
                  marginBottom:
                    "8px",
                }}
              >
                Payment
              </span>

              <strong
                style={{
                  fontFamily:
                    "Georgia, serif",
                  fontSize: "20px",
                  fontWeight:
                    "normal",
                  color: "#173b25",
                }}
              >
                Payment on confirmation
              </strong>

              <p
                style={{
                  marginTop: "7px",
                  color: "#68766c",
                  fontSize: "10px",
                  lineHeight:
                    "1.6",
                }}
              >
                Our team will contact
                you after your order
                has been received.
              </p>

            </div>


            {/* ERROR */}

            {errorMessage && (
              <div
                style={{
                  padding: "14px",
                  background: "#fff1f1",
                  border:
                    "1px solid #e5baba",
                  color: "#9a4444",
                  fontSize: "11px",
                }}
              >
                {errorMessage}
              </div>
            )}


            {/* BUTTON */}

            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                height: "55px",
                border: "none",
                background: loading
                  ? "#7e9685"
                  : "#173b25",
                color: "#ffffff",
                fontSize: "9px",
                letterSpacing:
                  "2px",
                textTransform:
                  "uppercase",
                cursor: loading
                  ? "wait"
                  : "pointer",
              }}
            >
              {loading
                ? "Placing Order..."
                : "Place Order"}
            </button>

          </form>


          {/* ORDER SUMMARY */}

          <aside
            style={{
              background:
                "#f3f6f2",
              padding: "30px",
              position:
                "sticky",
              top: "25px",
            }}
          >

            <span className="section-label">
              ORDER SUMMARY
            </span>

            <h2
              style={{
                fontFamily:
                  "Georgia, serif",
                fontWeight:
                  "normal",
                fontSize: "27px",
                color: "#173b25",
                margin:
                  "10px 0 25px",
              }}
            >
              Your Order
            </h2>


            {cart.map((item) => (

              <div
                key={item.id}
                style={{
                  display: "flex",
                  justifyContent:
                    "space-between",
                  gap: "15px",
                  marginBottom:
                    "18px",
                }}
              >

                <div>

                  <strong
                    style={{
                      display:
                        "block",
                      fontSize: "11px",
                      color:
                        "#173b25",
                    }}
                  >
                    {item.name}
                  </strong>

                  <span
                    style={{
                      fontSize: "9px",
                      color:
                        "#68766c",
                    }}
                  >
                    Qty:{" "}
                    {item.quantity}
                  </span>

                </div>

                <span
                  style={{
                    fontSize: "11px",
                    color:
                      "#287443",
                  }}
                >
                  ₦
                  {(
                    Number(item.price) *
                    Number(item.quantity)
                  ).toLocaleString()}
                </span>

              </div>

            ))}


            <div
              style={{
                borderTop:
                  "1px solid #d8e0da",
                margin:
                  "25px 0 15px",
              }}
            />


            <div
              style={summaryRow}
            >
              <span>
                Subtotal
              </span>

              <strong>
                ₦
                {subtotal.toLocaleString()}
              </strong>
            </div>


            <div
              style={summaryRow}
            >
              <span>
                Delivery
              </span>

              <strong>
                ₦
                {deliveryFee.toLocaleString()}
              </strong>
            </div>


            <div
              style={{
                display:
                  "flex",
                justifyContent:
                  "space-between",
                alignItems:
                  "center",
                marginTop:
                  "20px",
                paddingTop:
                  "20px",
                borderTop:
                  "1px solid #d8e0da",
              }}
            >

              <strong
                style={{
                  fontSize: "12px",
                  color:
                    "#173b25",
                }}
              >
                Total
              </strong>

              <strong
                style={{
                  fontFamily:
                    "Georgia, serif",
                  fontSize: "25px",
                  fontWeight:
                    "normal",
                  color:
                    "#287443",
                }}
              >
                ₦
                {total.toLocaleString()}
              </strong>

            </div>


            <Link
              href="/cart"
              style={{
                display:
                  "block",
                textAlign:
                  "center",
                marginTop:
                  "20px",
                color:
                  "#68766c",
                textDecoration:
                  "none",
                fontSize: "9px",
                letterSpacing:
                  "1px",
              }}
            >
              ← Edit Cart
            </Link>

          </aside>

        </div>

      </section>

    </main>
  );
}


/* =========================================
   STYLES
========================================= */

const labelStyle = {
  display: "block",
  fontSize: "9px",
  letterSpacing: "1.2px",
  color: "#68766c",
  marginBottom: "8px",
  textTransform:
    "uppercase" as const,
};

const inputStyle = {
  width: "100%",
  height: "48px",
  border:
    "1px solid #d8e0da",
  background: "#ffffff",
  padding:
    "0 14px",
  outline: "none",
  fontSize: "11px",
  color: "#173b25",
  boxSizing:
    "border-box" as const,
};

const summaryRow = {
  display: "flex",
  justifyContent:
    "space-between",
  marginBottom: "13px",
  fontSize: "10px",
  color: "#68766c",
};