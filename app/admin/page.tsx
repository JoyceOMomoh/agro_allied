"use client";

import Link from "next/link";

export default function AdminDashboard() {
  return (
    <main className="admin-page">
      {/* SIDEBAR */}
      <aside className="sidebar">
        <div className="logo">
          <div className="logo-icon">🌱</div>
          <div>
            <h2>Zion Agro</h2>
            <span>Admin Panel</span>
          </div>
        </div>

        <nav className="navigation">
          <Link href="/admin" className="nav-item active">
            <span>📊</span>
            Dashboard
          </Link>

          <Link href="/admin/produce" className="nav-item">
            <span>📦</span>
            Produce
          </Link>

          <Link href="/admin/inventory" className="nav-item">
            <span>🏷️</span>
            Inventory
          </Link>

          <Link href="/admin/orders" className="nav-item">
            <span>🛒</span>
            Orders
          </Link>

          <Link href="/admin/customers" className="nav-item">
            <span>👥</span>
            Customers
          </Link>

          <Link href="/admin/settings" className="nav-item">
            <span>⚙️</span>
            Settings
          </Link>
        </nav>

        <div className="sidebar-bottom">
          <button className="logout-btn">
            🚪 Logout
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <section className="main-content">
        {/* TOP BAR */}
        <header className="topbar">
          <div>
            <p className="small-title">ADMIN DASHBOARD</p>
            <h1>Good morning, Admin 👋</h1>
            <p className="subtitle">
              Here's what's happening with your store today.
            </p>
          </div>

          <div className="admin-profile">
            <div className="notification">🔔</div>

            <div className="profile-avatar">
              A
            </div>

            <div className="profile-info">
              <strong>Administrator</strong>
              <span>Admin</span>
            </div>
          </div>
        </header>

        {/* STATISTICS */}
        <section className="stats-grid">
          <div className="stat-card">
            <div className="stat-top">
              <span>Total Sales</span>
              <div className="stat-icon green">₦</div>
            </div>

            <h2>₦1,245,000</h2>
            <p className="positive">↗ 12.5% from last month</p>
          </div>

          <div className="stat-card">
            <div className="stat-top">
              <span>Total Orders</span>
              <div className="stat-icon blue">🛒</div>
            </div>

            <h2>128</h2>
            <p className="positive">↗ 8.2% from last month</p>
          </div>

          <div className="stat-card">
            <div className="stat-top">
              <span>Total Products</span>
              <div className="stat-icon orange">📦</div>
            </div>

            <h2>42</h2>
            <p className="neutral">Currently listed</p>
          </div>

          <div className="stat-card">
            <div className="stat-top">
              <span>Pending Orders</span>
              <div className="stat-icon red">⏳</div>
            </div>

            <h2>14</h2>
            <p className="warning">Needs attention</p>
          </div>
        </section>

        {/* CONTENT GRID */}
        <section className="content-grid">
          {/* RECENT ORDERS */}
          <div className="panel orders-panel">
            <div className="panel-header">
              <div>
                <h2>Recent Orders</h2>
                <p>Latest customer orders</p>
              </div>

              <Link href="/admin/orders" className="view-all">
                View All →
              </Link>
            </div>

            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Order</th>
                    <th>Customer</th>
                    <th>Amount</th>
                    <th>Status</th>
                  </tr>
                </thead>

                <tbody>
                  <tr>
                    <td>
                      <strong>#ZA00125</strong>
                    </td>
                    <td>Joyce Momoh</td>
                    <td>₦85,000</td>
                    <td>
                      <span className="status pending">
                        Pending
                      </span>
                    </td>
                  </tr>

                  <tr>
                    <td>
                      <strong>#ZA00124</strong>
                    </td>
                    <td>Daniel Okafor</td>
                    <td>₦120,000</td>
                    <td>
                      <span className="status processing">
                        Processing
                      </span>
                    </td>
                  </tr>

                  <tr>
                    <td>
                      <strong>#ZA00123</strong>
                    </td>
                    <td>Mary Johnson</td>
                    <td>₦45,500</td>
                    <td>
                      <span className="status delivered">
                        Delivered
                      </span>
                    </td>
                  </tr>

                  <tr>
                    <td>
                      <strong>#ZA00122</strong>
                    </td>
                    <td>David Ibrahim</td>
                    <td>₦72,000</td>
                    <td>
                      <span className="status processing">
                        Processing
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* LOW STOCK */}
          <div className="panel stock-panel">
            <div className="panel-header">
              <div>
                <h2>Low Stock</h2>
                <p>Products that need attention</p>
              </div>

              <Link href="/admin/inventory" className="view-all">
                Manage →
              </Link>
            </div>

            <div className="stock-list">
              <div className="stock-item">
                <div className="stock-product">
                  <div className="product-icon">🍗</div>

                  <div>
                    <strong>Frozen Chicken</strong>
                    <span>Frozen Foods</span>
                  </div>
                </div>

                <div className="stock-number danger">
                  5 kg
                </div>
              </div>

              <div className="stock-item">
                <div className="stock-product">
                  <div className="product-icon">🐟</div>

                  <div>
                    <strong>Frozen Fish</strong>
                    <span>Frozen Foods</span>
                  </div>
                </div>

                <div className="stock-number warning-text">
                  8 kg
                </div>
              </div>

              <div className="stock-item">
                <div className="stock-product">
                  <div className="product-icon">🥚</div>

                  <div>
                    <strong>Farm Eggs</strong>
                    <span>Farm Produce</span>
                  </div>
                </div>

                <div className="stock-number warning-text">
                  12 crates
                </div>
              </div>

              <div className="stock-item">
                <div className="stock-product">
                  <div className="product-icon">🍅</div>

                  <div>
                    <strong>Fresh Tomatoes</strong>
                    <span>Farm Produce</span>
                  </div>
                </div>

                <div className="stock-number danger">
                  4 baskets
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* QUICK ACTIONS */}
        <section className="panel quick-panel">
          <div className="panel-header">
            <div>
              <h2>Quick Actions</h2>
              <p>Manage your store quickly</p>
            </div>
          </div>

          <div className="quick-actions">
            <Link href="/admin/produce" className="quick-action">
              <div>➕</div>
              <span>Add Product</span>
            </Link>

            <Link href="/admin/inventory" className="quick-action">
              <div>📦</div>
              <span>Update Stock</span>
            </Link>

            <Link href="/admin/orders" className="quick-action">
              <div>🛒</div>
              <span>View Orders</span>
            </Link>

            <Link href="/admin/customers" className="quick-action">
              <div>👥</div>
              <span>Customers</span>
            </Link>
          </div>
        </section>
      </section>

      <style jsx>{`
        .admin-page {
          min-height: 100vh;
          background: #f5f8f5;
          color: #173d24;
          display: flex;
          font-family: Arial, sans-serif;
        }

        /* SIDEBAR */

        .sidebar {
          width: 250px;
          background: #073d1c;
          color: white;
          min-height: 100vh;
          padding: 25px 18px;
          display: flex;
          flex-direction: column;
          position: sticky;
          top: 0;
          height: 100vh;
        }

        .logo {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px;
          margin-bottom: 45px;
        }

        .logo-icon {
          width: 45px;
          height: 45px;
          background: white;
          color: #08752c;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 23px;
        }

        .logo h2 {
          margin: 0;
          font-size: 19px;
        }

        .logo span {
          font-size: 11px;
          color: #c8dfcf;
        }

        .navigation {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .nav-item {
          color: #dcece0;
          text-decoration: none;
          padding: 14px 15px;
          border-radius: 9px;
          display: flex;
          align-items: center;
          gap: 13px;
          font-size: 14px;
          transition: 0.2s;
        }

        .nav-item:hover,
        .nav-item.active {
          background: #159447;
          color: white;
        }

        .nav-item span {
          width: 22px;
          text-align: center;
        }

        .sidebar-bottom {
          margin-top: auto;
        }

        .logout-btn {
          width: 100%;
          border: 1px solid rgba(255,255,255,0.2);
          background: transparent;
          color: white;
          padding: 13px;
          border-radius: 9px;
          cursor: pointer;
          font-size: 14px;
        }

        /* MAIN */

        .main-content {
          flex: 1;
          padding: 35px 45px;
          min-width: 0;
        }

        .topbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 35px;
          gap: 20px;
        }

        .small-title {
          color: #159447;
          font-size: 11px;
          font-weight: bold;
          letter-spacing: 2px;
          margin: 0 0 7px;
        }

        .topbar h1 {
          margin: 0;
          font-size: 29px;
          color: #103b20;
        }

        .subtitle {
          margin: 8px 0 0;
          color: #738077;
          font-size: 14px;
        }

        .admin-profile {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .notification {
          width: 42px;
          height: 42px;
          background: white;
          border: 1px solid #e0e8e1;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .profile-avatar {
          width: 42px;
          height: 42px;
          background: #159447;
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
        }

        .profile-info {
          display: flex;
          flex-direction: column;
          gap: 3px;
        }

        .profile-info strong {
          font-size: 14px;
        }

        .profile-info span {
          font-size: 12px;
          color: #7a877d;
        }

        /* STAT CARDS */

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 18px;
          margin-bottom: 25px;
        }

        .stat-card {
          background: white;
          border: 1px solid #e1e9e2;
          border-radius: 14px;
          padding: 22px;
        }

        .stat-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          color: #69756d;
          font-size: 13px;
        }

        .stat-icon {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
        }

        .stat-icon.green {
          background: #e7f6ec;
          color: #08752c;
        }

        .stat-icon.blue {
          background: #eaf2ff;
        }

        .stat-icon.orange {
          background: #fff2df;
        }

        .stat-icon.red {
          background: #ffebeb;
        }

        .stat-card h2 {
          font-size: 25px;
          margin: 17px 0 7px;
          color: #103b20;
        }

        .stat-card p {
          font-size: 12px;
          margin: 0;
        }

        .positive {
          color: #159447;
        }

        .neutral {
          color: #7b877e;
        }

        .warning {
          color: #d47b00;
        }

        /* PANELS */

        .content-grid {
          display: grid;
          grid-template-columns: 1.5fr 1fr;
          gap: 22px;
          margin-bottom: 22px;
        }

        .panel {
          background: white;
          border: 1px solid #e1e9e2;
          border-radius: 14px;
          overflow: hidden;
        }

        .panel-header {
          padding: 22px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 15px;
          border-bottom: 1px solid #edf1ed;
        }

        .panel-header h2 {
          margin: 0 0 5px;
          color: #103b20;
          font-size: 18px;
        }

        .panel-header p {
          margin: 0;
          color: #7a877d;
          font-size: 12px;
        }

        .view-all {
          color: #08752c;
          font-size: 13px;
          font-weight: bold;
          text-decoration: none;
        }

        /* TABLE */

        .table-container {
          overflow-x: auto;
        }

        table {
          width: 100%;
          border-collapse: collapse;
          min-width: 500px;
        }

        th,
        td {
          padding: 16px 20px;
          text-align: left;
          border-bottom: 1px solid #edf1ed;
          font-size: 13px;
        }

        th {
          color: #7a877d;
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        td {
          color: #46534a;
        }

        td strong {
          color: #173d24;
        }

        .status {
          padding: 6px 10px;
          border-radius: 20px;
          font-size: 11px;
          font-weight: bold;
        }

        .status.pending {
          background: #fff3d8;
          color: #a96800;
        }

        .status.processing {
          background: #e8f1ff;
          color: #2861a8;
        }

        .status.delivered {
          background: #e5f7ea;
          color: #08752c;
        }

        /* STOCK */

        .stock-list {
          padding: 8px 20px;
        }

        .stock-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 15px 0;
          border-bottom: 1px solid #edf1ed;
        }

        .stock-item:last-child {
          border-bottom: none;
        }

        .stock-product {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .product-icon {
          width: 42px;
          height: 42px;
          background: #f1f6f2;
          border-radius: 9px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
        }

        .stock-product strong {
          display: block;
          font-size: 13px;
          margin-bottom: 4px;
        }

        .stock-product span {
          display: block;
          color: #849087;
          font-size: 11px;
        }

        .stock-number {
          font-size: 12px;
          font-weight: bold;
        }

        .danger {
          color: #d54848;
        }

        .warning-text {
          color: #c47b00;
        }

        /* QUICK ACTIONS */

        .quick-panel {
          margin-bottom: 30px;
        }

        .quick-actions {
          padding: 22px;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 15px;
        }

        .quick-action {
          text-decoration: none;
          color: #173d24;
          border: 1px solid #e1e9e2;
          border-radius: 10px;
          padding: 18px;
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 13px;
          font-weight: bold;
          transition: 0.2s;
        }

        .quick-action:hover {
          border-color: #159447;
          transform: translateY(-2px);
        }

        .quick-action div {
          width: 35px;
          height: 35px;
          background: #e8f6ec;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* RESPONSIVE */

        @media (max-width: 1100px) {
          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .content-grid {
            grid-template-columns: 1fr;
          }

          .quick-actions {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 800px) {
          .sidebar {
            width: 75px;
            padding: 20px 10px;
          }

          .logo div:not(.logo-icon),
          .nav-item:not(.active) span + *,
          .nav-item {
            font-size: 0;
          }

          .logo {
            justify-content: center;
          }

          .nav-item {
            justify-content: center;
          }

          .nav-item span {
            font-size: 18px;
          }

          .main-content {
            padding: 25px 18px;
          }

          .topbar {
            align-items: flex-start;
          }

          .profile-info {
            display: none;
          }
        }

        @media (max-width: 600px) {
          .stats-grid {
            grid-template-columns: 1fr;
          }

          .quick-actions {
            grid-template-columns: 1fr;
          }

          .topbar h1 {
            font-size: 23px;
          }

          .notification {
            display: none;
          }
        }
      `}</style>
    </main>
  );
}