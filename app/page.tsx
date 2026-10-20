import Link from "next/link";

export default function Home() {
  return (
    <main className="home">

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
          <Link href="/about">About Us</Link>
          <Link href="/contact">Contact</Link>
        </div>


        <div className="nav-actions">

          <Link href="/products" className="shop-button">
            Shop Now
          </Link>

          <Link href="/cart" className="cart-button">
            <span>🛒</span>
            <span>Cart</span>
          </Link>

        </div>

      </nav>


      {/* HERO */}

      <section className="hero">

        <div className="hero-content">

          <div className="badge">
            <span></span>
            FARM FRESH • QUALITY GUARANTEED
          </div>


          <h1>
            From the farm,
            <br />
            <em>straight to you.</em>
          </h1>


          <p>
            Premium frozen foods, fresh farm produce and quality
            livestock — carefully sourced and delivered to your door.
          </p>


          <div className="hero-buttons">

            <Link
              href="/products"
              className="primary-button"
            >
              Explore Our Produce
              <span>→</span>
            </Link>


            <Link
              href="/about"
              className="secondary-button"
            >
              Discover Our Story
            </Link>

          </div>


          <div className="hero-trust">

            <div>
              <strong>100%</strong>
              <span>Quality Products</span>
            </div>

            <div className="trust-line"></div>

            <div>
              <strong>Fresh</strong>
              <span>Farm Sourced</span>
            </div>

            <div className="trust-line"></div>

            <div>
              <strong>Fast</strong>
              <span>Delivery</span>
            </div>

          </div>

        </div>


        <div className="hero-image">

          <div className="image-glow"></div>

          <img
            src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=90"
            alt="Fresh agricultural produce"
          />


          <div className="floating-card">

            <div className="floating-icon">
              ✓
            </div>

            <div>
              <strong>Fresh & Trusted</strong>
              <span>Quality you can count on</span>
            </div>

          </div>


          <div className="organic-label">
            <span>✦</span>
            FARM
            <br />
            FRESH
          </div>

        </div>

      </section>


      {/* CATEGORIES */}

      <section className="categories">

        <div className="section-heading">

          <div>
            <span className="section-label">
              WHAT WE OFFER
            </span>

            <h2>
              Everything fresh,
              <br />
              <em>all in one place.</em>
            </h2>
          </div>

          <Link href="/products" className="view-all">
            View all products →
          </Link>

        </div>


        <div className="category-grid">


          <Link
            href="/products?category=Frozen Foods"
            className="category-card frozen"
          >

            <img
              src="https://images.unsplash.com/photo-1604503468506-a8da13d82791?auto=format&fit=crop&w=900&q=85"
              alt="Frozen food"
            />

            <div className="category-overlay">

              <span>01</span>

              <div>
                <h3>Frozen Foods</h3>
                <p>Quality meats & seafood</p>
              </div>

              <b>↗</b>

            </div>

          </Link>


          <Link
            href="/products?category=Farm Produce"
            className="category-card"
          >

            <img
              src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=900&q=85"
              alt="Fresh farm produce"
            />

            <div className="category-overlay">

              <span>02</span>

              <div>
                <h3>Farm Produce</h3>
                <p>Fresh from our farms</p>
              </div>

              <b>↗</b>

            </div>

          </Link>


          <Link
            href="/products?category=Livestock"
            className="category-card"
          >

            <img
              src="https://images.unsplash.com/photo-1500595046743-cd271d694d30?auto=format&fit=crop&w=900&q=85"
              alt="Livestock"
            />

            <div className="category-overlay">

              <span>03</span>

              <div>
                <h3>Livestock</h3>
                <p>Healthy & responsibly raised</p>
              </div>

              <b>↗</b>

            </div>

          </Link>

        </div>

      </section>


      {/* WHY US */}

      <section className="why-us">

        <div className="why-image">

          <img
            src="https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=1200&q=90"
            alt="Agricultural farm"
          />

          <div className="experience-card">
            <strong>01</strong>
            <span>
              QUALITY
              <br />
              FIRST
            </span>
          </div>

        </div>


        <div className="why-content">

          <span className="section-label">
            WHY ZION AGRO ALLIED
          </span>

          <h2>
            We believe good food
            <br />
            <em>starts with good farming.</em>
          </h2>

          <p>
            We connect customers with quality agricultural products
            sourced with care. From frozen foods to fresh produce and
            livestock, our focus is simple — quality, freshness and
            reliability.
          </p>


          <div className="features">

            <div className="feature">

              <div className="feature-icon">
                ✓
              </div>

              <div>
                <strong>Quality Assured</strong>
                <p>
                  Every product is carefully selected.
                </p>
              </div>

            </div>


            <div className="feature">

              <div className="feature-icon">
                ♢
              </div>

              <div>
                <strong>Farm Fresh</strong>
                <p>
                  Products sourced from trusted farms.
                </p>
              </div>

            </div>


            <div className="feature">

              <div className="feature-icon">
                →
              </div>

              <div>
                <strong>Reliable Delivery</strong>
                <p>
                  Your order gets to you safely.
                </p>
              </div>

            </div>

          </div>


          <Link
            href="/about"
            className="learn-button"
          >
            Learn More About Us →
          </Link>

        </div>

      </section>


      {/* CTA */}

      <section className="cta">

        <div className="cta-inner">

          <span className="section-label">
            FRESHNESS AWAITS
          </span>

          <h2>
            Ready to fill your
            <br />
            <em>basket?</em>
          </h2>

          <p>
            Explore our selection of quality agricultural products
            and place your order today.
          </p>

          <Link
            href="/products"
            className="cta-button"
          >
            Start Shopping →
          </Link>

        </div>

      </section>


      {/* FOOTER */}

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
              <br />
              from our farm to your table.
            </p>

          </div>


          <div className="footer-column">

            <h4>Explore</h4>

            <Link href="/products">Shop</Link>
            <Link href="/about">About Us</Link>
            <Link href="/contact">Contact</Link>

          </div>


          <div className="footer-column">

            <h4>Categories</h4>

            <Link href="/products?category=Frozen Foods">
              Frozen Foods
            </Link>

            <Link href="/products?category=Farm Produce">
              Farm Produce
            </Link>

            <Link href="/products?category=Livestock">
              Livestock
            </Link>

          </div>


          <div className="footer-column">

            <h4>Get in touch</h4>

            <p>Edo State, Nigeria</p>
            <p>info@zionagroallied.com</p>
            <p>+234 800 000 0000</p>

          </div>

        </div>


        <div className="footer-bottom">

          <span>
            © {new Date().getFullYear()} Zion Agro Allied.
            All rights reserved.
          </span>

          <span>
            Freshness you can trust.
          </span>

        </div>

      </footer>

    </main>
  );
}