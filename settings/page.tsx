"use client";

import { useState } from "react";

export default function SettingsPage() {
  const [company, setCompany] = useState({
    name: "Zion Agro Allied",
    email: "info@zionagroallied.com",
    phone: "+234 800 000 0000",
    address: "Edo State, Nigeria",
    description:
      "Quality agricultural products, frozen foods, livestock and farm produce.",
  });

  const [delivery, setDelivery] = useState({
    fee: "2000",
    minimumOrder: "5000",
    deliveryTime: "1 - 3 business days",
  });

  const [saved, setSaved] = useState(false);

  const saveSettings = () => {
    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 3000);
  };

  return (
    <main className="settings-page">

      <header className="page-header">
        <div>
          <p className="eyebrow">ADMIN SETTINGS</p>

          <h1>Settings</h1>

          <p className="subtitle">
            Manage your company information and store settings.
          </p>
        </div>

        {saved && (
          <div className="success-message">
            ✓ Settings saved successfully
          </div>
        )}
      </header>


      {/* COMPANY INFORMATION */}

      <section className="settings-card">

        <div className="card-header">
          <div>
            <h2>Company Information</h2>

            <p>
              This information will be displayed to customers.
            </p>
          </div>
        </div>


        <div className="form-grid">

          <div className="input-group">
            <label>Company Name</label>

            <input
              value={company.name}
              onChange={(e) =>
                setCompany({
                  ...company,
                  name: e.target.value,
                })
              }
            />
          </div>


          <div className="input-group">
            <label>Business Email</label>

            <input
              type="email"
              value={company.email}
              onChange={(e) =>
                setCompany({
                  ...company,
                  email: e.target.value,
                })
              }
            />
          </div>


          <div className="input-group">
            <label>Phone Number</label>

            <input
              value={company.phone}
              onChange={(e) =>
                setCompany({
                  ...company,
                  phone: e.target.value,
                })
              }
            />
          </div>


          <div className="input-group">
            <label>Business Address</label>

            <input
              value={company.address}
              onChange={(e) =>
                setCompany({
                  ...company,
                  address: e.target.value,
                })
              }
            />
          </div>


          <div className="input-group full">
            <label>Business Description</label>

            <textarea
              rows={4}
              value={company.description}
              onChange={(e) =>
                setCompany({
                  ...company,
                  description: e.target.value,
                })
              }
            />
          </div>

        </div>

      </section>


      {/* DELIVERY SETTINGS */}

      <section className="settings-card">

        <div className="card-header">
          <div>
            <h2>Delivery Settings</h2>

            <p>
              Configure how deliveries work for customers.
            </p>
          </div>
        </div>


        <div className="form-grid">

          <div className="input-group">
            <label>Delivery Fee (₦)</label>

            <input
              type="number"
              value={delivery.fee}
              onChange={(e) =>
                setDelivery({
                  ...delivery,
                  fee: e.target.value,
                })
              }
            />
          </div>


          <div className="input-group">
            <label>Minimum Order Amount (₦)</label>

            <input
              type="number"
              value={delivery.minimumOrder}
              onChange={(e) =>
                setDelivery({
                  ...delivery,
                  minimumOrder: e.target.value,
                })
              }
            />
          </div>


          <div className="input-group">
            <label>Estimated Delivery Time</label>

            <input
              value={delivery.deliveryTime}
              onChange={(e) =>
                setDelivery({
                  ...delivery,
                  deliveryTime: e.target.value,
                })
              }
            />
          </div>

        </div>

      </section>


      {/* STORE SETTINGS */}

      <section className="settings-card">

        <div className="card-header">
          <div>
            <h2>Store Settings</h2>

            <p>
              Control how your online store operates.
            </p>
          </div>
        </div>


        <div className="setting-row">

          <div>
            <strong>Accept Orders</strong>

            <p>
              Allow customers to place new orders.
            </p>
          </div>

          <label className="switch">
            <input
              type="checkbox"
              defaultChecked
            />

            <span></span>
          </label>

        </div>


        <div className="setting-row">

          <div>
            <strong>Show Stock to Customers</strong>

            <p>
              Customers can see available stock quantities.
            </p>
          </div>

          <label className="switch">
            <input
              type="checkbox"
              defaultChecked
            />

            <span></span>
          </label>

        </div>


        <div className="setting-row">

          <div>
            <strong>Low Stock Notifications</strong>

            <p>
              Alert administrators when stock is running low.
            </p>
          </div>

          <label className="switch">
            <input
              type="checkbox"
              defaultChecked
            />

            <span></span>
          </label>

        </div>

      </section>


      {/* ADMIN ACCOUNT */}

      <section className="settings-card">

        <div className="card-header">
          <div>
            <h2>Admin Account</h2>

            <p>
              Information about the administrator account.
            </p>
          </div>
        </div>


        <div className="admin-account">

          <div className="admin-avatar">
            A
          </div>

          <div>
            <strong>Administrator</strong>

            <p>
              Full access to the Zion Agro Allied dashboard.
            </p>
          </div>

        </div>


        <div className="account-actions">

          <button
            className="password-button"
            onClick={() =>
              alert(
                "Password change will be connected to authentication next."
              )
            }
          >
            Change Password
          </button>

          <button
            className="logout-button"
            onClick={() =>
              alert("Logout will be connected to authentication next.")
            }
          >
            Logout
          </button>

        </div>

      </section>


      {/* SAVE */}

      <div className="bottom-actions">

        <button
          className="save-button"
          onClick={saveSettings}
        >
          Save Changes
        </button>

      </div>


      <style jsx>{`

        .settings-page {
          min-height: 100vh;
          background: #f5f8f5;
          padding: 40px;
          color: #173d24;
          font-family: Arial, sans-serif;
        }

        .page-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          gap: 20px;
          margin-bottom: 30px;
        }

        .eyebrow {
          margin: 0 0 7px;
          color: #159447;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 2px;
        }

        h1 {
          margin: 0;
          color: #103b20;
          font-size: 32px;
        }

        .subtitle {
          margin: 8px 0 0;
          color: #718078;
          font-size: 14px;
        }

        .success-message {
          background: #e5f7ea;
          color: #08752c;
          padding: 11px 15px;
          border-radius: 8px;
          font-size: 12px;
          font-weight: bold;
        }

        .settings-card {
          background: white;
          border: 1px solid #e1e9e2;
          border-radius: 14px;
          margin-bottom: 22px;
          overflow: hidden;
        }

        .card-header {
          padding: 23px;
          border-bottom: 1px solid #edf1ed;
        }

        .card-header h2 {
          margin: 0 0 5px;
          font-size: 18px;
          color: #103b20;
        }

        .card-header p {
          margin: 0;
          color: #7a877d;
          font-size: 12px;
        }

        .form-grid {
          padding: 25px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }

        .input-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .input-group.full {
          grid-column: 1 / -1;
        }

        .input-group label {
          color: #34483a;
          font-size: 12px;
          font-weight: bold;
        }

        .input-group input,
        .input-group textarea {
          width: 100%;
          box-sizing: border-box;
          border: 1px solid #dce5dd;
          border-radius: 8px;
          padding: 12px;
          outline: none;
          font-size: 13px;
          font-family: inherit;
        }

        .input-group textarea {
          resize: vertical;
        }

        .input-group input:focus,
        .input-group textarea:focus {
          border-color: #159447;
        }

        .setting-row {
          padding: 20px 25px;
          border-bottom: 1px solid #edf1ed;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 20px;
        }

        .setting-row:last-child {
          border-bottom: none;
        }

        .setting-row strong {
          font-size: 13px;
          color: #173d24;
        }

        .setting-row p {
          margin: 5px 0 0;
          color: #7a877d;
          font-size: 11px;
        }

        /* SWITCH */

        .switch {
          position: relative;
          width: 46px;
          height: 25px;
          flex-shrink: 0;
        }

        .switch input {
          display: none;
        }

        .switch span {
          position: absolute;
          inset: 0;
          background: #cfd8d1;
          border-radius: 20px;
          cursor: pointer;
          transition: 0.2s;
        }

        .switch span::before {
          content: "";
          position: absolute;
          width: 19px;
          height: 19px;
          left: 3px;
          top: 3px;
          background: white;
          border-radius: 50%;
          transition: 0.2s;
        }

        .switch input:checked + span {
          background: #08752c;
        }

        .switch input:checked + span::before {
          transform: translateX(21px);
        }

        /* ADMIN ACCOUNT */

        .admin-account {
          padding: 25px;
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .admin-avatar {
          width: 55px;
          height: 55px;
          border-radius: 50%;
          background: #e8f6ec;
          color: #08752c;
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 20px;
          font-weight: bold;
        }

        .admin-account strong {
          color: #173d24;
          font-size: 14px;
        }

        .admin-account p {
          margin: 5px 0 0;
          color: #7a877d;
          font-size: 11px;
        }

        .account-actions {
          padding: 0 25px 25px;
          display: flex;
          gap: 10px;
        }

        .password-button,
        .logout-button {
          padding: 10px 14px;
          border-radius: 7px;
          cursor: pointer;
          font-size: 11px;
          font-weight: bold;
        }

        .password-button {
          border: 1px solid #cfe3d4;
          background: #f1f8f3;
          color: #08752c;
        }

        .logout-button {
          border: 1px solid #f1cccc;
          background: #fff5f5;
          color: #d54848;
        }

        .bottom-actions {
          display: flex;
          justify-content: flex-end;
          padding-bottom: 30px;
        }

        .save-button {
          border: none;
          background: #08752c;
          color: white;
          padding: 13px 24px;
          border-radius: 8px;
          font-weight: bold;
          cursor: pointer;
        }

        .save-button:hover {
          background: #065d22;
        }

        @media (max-width: 700px) {

          .settings-page {
            padding: 20px;
          }

          .page-header {
            align-items: flex-start;
            flex-direction: column;
          }

          .form-grid {
            grid-template-columns: 1fr;
          }

          .input-group.full {
            grid-column: auto;
          }

          .account-actions {
            flex-direction: column;
          }

          .password-button,
          .logout-button {
            width: 100%;
          }

        }

      `}</style>

    </main>
  );
}