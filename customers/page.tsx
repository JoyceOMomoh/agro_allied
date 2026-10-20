"use client";

import { useState } from "react";

type Customer = {
  id: number;
  name: string;
  email: string;
  phone: string;
  orders: number;
  spent: number;
  status: "Active" | "Inactive";
  joined: string;
};

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([
    {
      id: 1,
      name: "Joyce Momoh",
      email: "joyce@example.com",
      phone: "08012345678",
      orders: 8,
      spent: 156000,
      status: "Active",
      joined: "20 Aug 2026",
    },
    {
      id: 2,
      name: "Daniel Okafor",
      email: "daniel@example.com",
      phone: "08123456789",
      orders: 5,
      spent: 98000,
      status: "Active",
      joined: "22 Aug 2026",
    },
    {
      id: 3,
      name: "Mary Johnson",
      email: "mary@example.com",
      phone: "09012345678",
      orders: 12,
      spent: 245000,
      status: "Active",
      joined: "18 Aug 2026",
    },
    {
      id: 4,
      name: "David Ibrahim",
      email: "david@example.com",
      phone: "07012345678",
      orders: 2,
      spent: 43000,
      status: "Inactive",
      joined: "25 Aug 2026",
    },
    {
      id: 5,
      name: "Sarah Williams",
      email: "sarah@example.com",
      phone: "09087654321",
      orders: 6,
      spent: 121500,
      status: "Active",
      joined: "21 Aug 2026",
    },
  ]);

  const [selectedCustomer, setSelectedCustomer] =
    useState<Customer | null>(null);

  const totalCustomers = customers.length;

  const activeCustomers = customers.filter(
    (customer) => customer.status === "Active"
  ).length;

  const totalOrders = customers.reduce(
    (total, customer) => total + customer.orders,
    0
  );

  const totalRevenue = customers.reduce(
    (total, customer) => total + customer.spent,
    0
  );

  const toggleStatus = (id: number) => {
    setCustomers(
      customers.map((customer) =>
        customer.id === id
          ? {
              ...customer,
              status:
                customer.status === "Active"
                  ? "Inactive"
                  : "Active",
            }
          : customer
      )
    );

    if (selectedCustomer?.id === id) {
      setSelectedCustomer({
        ...selectedCustomer,
        status:
          selectedCustomer.status === "Active"
            ? "Inactive"
            : "Active",
      });
    }
  };

  return (
    <main className="customers-page">

      {/* HEADER */}

      <header className="page-header">
        <div>
          <p className="eyebrow">CUSTOMER MANAGEMENT</p>

          <h1>Customers</h1>

          <p className="subtitle">
            View and manage customers who use your store.
          </p>
        </div>
      </header>


      {/* SUMMARY */}

      <section className="summary-grid">

        <div className="summary-card">
          <span>Total Customers</span>
          <strong>{totalCustomers}</strong>
        </div>

        <div className="summary-card green">
          <span>Active Customers</span>
          <strong>{activeCustomers}</strong>
        </div>

        <div className="summary-card blue">
          <span>Total Orders</span>
          <strong>{totalOrders}</strong>
        </div>

        <div className="summary-card revenue">
          <span>Total Customer Spending</span>
          <strong>
            ₦{totalRevenue.toLocaleString()}
          </strong>
        </div>

      </section>


      {/* CUSTOMERS */}

      <section className="customers-card">

        <div className="card-header">

          <div>
            <h2>All Customers</h2>

            <p>
              Registered customers and their activity.
            </p>
          </div>

          <input
            className="search"
            placeholder="Search customers..."
          />

        </div>


        <div className="table-wrapper">

          <table>

            <thead>

              <tr>
                <th>Customer</th>
                <th>Phone</th>
                <th>Orders</th>
                <th>Total Spent</th>
                <th>Status</th>
                <th>Joined</th>
                <th>Action</th>
              </tr>

            </thead>


            <tbody>

              {customers.map((customer) => (

                <tr key={customer.id}>

                  <td>

                    <div className="customer">

                      <div className="avatar">
                        {customer.name.charAt(0)}
                      </div>

                      <div>
                        <strong>
                          {customer.name}
                        </strong>

                        <small>
                          {customer.email}
                        </small>
                      </div>

                    </div>

                  </td>


                  <td>
                    {customer.phone}
                  </td>


                  <td>
                    <strong>
                      {customer.orders}
                    </strong>
                  </td>


                  <td>
                    <strong>
                      ₦{customer.spent.toLocaleString()}
                    </strong>
                  </td>


                  <td>

                    <span
                      className={`status ${
                        customer.status === "Active"
                          ? "active"
                          : "inactive"
                      }`}
                    >
                      {customer.status}
                    </span>

                  </td>


                  <td>
                    {customer.joined}
                  </td>


                  <td>

                    <button
                      className="view-button"
                      onClick={() =>
                        setSelectedCustomer(customer)
                      }
                    >
                      View
                    </button>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </section>


      {/* CUSTOMER DETAILS MODAL */}

      {selectedCustomer && (

        <div
          className="modal-overlay"
          onClick={() => setSelectedCustomer(null)}
        >

          <div
            className="modal"
            onClick={(e) => e.stopPropagation()}
          >

            <div className="modal-header">

              <div className="customer-profile">

                <div className="large-avatar">
                  {selectedCustomer.name.charAt(0)}
                </div>

                <div>

                  <h2>
                    {selectedCustomer.name}
                  </h2>

                  <p>
                    {selectedCustomer.email}
                  </p>

                </div>

              </div>

              <button
                className="close"
                onClick={() =>
                  setSelectedCustomer(null)
                }
              >
                ×
              </button>

            </div>


            <div className="customer-details">

              <div className="detail-box">
                <span>Phone</span>
                <strong>
                  {selectedCustomer.phone}
                </strong>
              </div>

              <div className="detail-box">
                <span>Orders</span>
                <strong>
                  {selectedCustomer.orders}
                </strong>
              </div>

              <div className="detail-box">
                <span>Total Spent</span>
                <strong>
                  ₦{selectedCustomer.spent.toLocaleString()}
                </strong>
              </div>

              <div className="detail-box">
                <span>Joined</span>
                <strong>
                  {selectedCustomer.joined}
                </strong>
              </div>

            </div>


            <div className="customer-status">

              <div>
                <span>Account Status</span>

                <strong>
                  {selectedCustomer.status}
                </strong>
              </div>

              <button
                className={
                  selectedCustomer.status === "Active"
                    ? "deactivate"
                    : "activate"
                }
                onClick={() =>
                  toggleStatus(selectedCustomer.id)
                }
              >
                {selectedCustomer.status === "Active"
                  ? "Deactivate Account"
                  : "Activate Account"}
              </button>

            </div>


            <div className="modal-footer">

              <button
                className="close-button"
                onClick={() =>
                  setSelectedCustomer(null)
                }
              >
                Close
              </button>

            </div>

          </div>

        </div>

      )}


      <style jsx>{`

        .customers-page {
          min-height: 100vh;
          background: #f5f8f5;
          padding: 40px;
          color: #173d24;
          font-family: Arial, sans-serif;
        }

        .page-header {
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

        .summary-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 18px;
          margin-bottom: 25px;
        }

        .summary-card {
          background: white;
          border: 1px solid #e1e9e2;
          border-radius: 13px;
          padding: 22px;
        }

        .summary-card span {
          color: #758078;
          font-size: 13px;
        }

        .summary-card strong {
          display: block;
          margin-top: 12px;
          font-size: 25px;
          color: #103b20;
        }

        .summary-card.green strong {
          color: #08752c;
        }

        .summary-card.blue strong {
          color: #2861a8;
        }

        .summary-card.revenue strong {
          color: #159447;
          font-size: 22px;
        }

        .customers-card {
          background: white;
          border: 1px solid #e1e9e2;
          border-radius: 14px;
          overflow: hidden;
        }

        .card-header {
          padding: 23px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 20px;
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

        .search {
          width: 230px;
          padding: 11px 13px;
          border: 1px solid #dce5dd;
          border-radius: 8px;
          outline: none;
        }

        .search:focus {
          border-color: #159447;
        }

        .table-wrapper {
          overflow-x: auto;
        }

        table {
          width: 100%;
          min-width: 950px;
          border-collapse: collapse;
        }

        th,
        td {
          padding: 17px 20px;
          text-align: left;
          border-bottom: 1px solid #edf1ed;
          font-size: 13px;
        }

        th {
          color: #7a877d;
          font-size: 11px;
          text-transform: uppercase;
        }

        td {
          color: #536159;
        }

        .customer {
          display: flex;
          align-items: center;
          gap: 11px;
        }

        .avatar,
        .large-avatar {
          border-radius: 50%;
          background: #e8f6ec;
          color: #08752c;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
        }

        .avatar {
          width: 40px;
          height: 40px;
        }

        .large-avatar {
          width: 55px;
          height: 55px;
          font-size: 20px;
        }

        small {
          display: block;
          color: #89938d;
          font-size: 10px;
          margin-top: 4px;
        }

        .status {
          padding: 6px 10px;
          border-radius: 20px;
          font-size: 10px;
          font-weight: bold;
        }

        .active {
          background: #e5f7ea;
          color: #08752c;
        }

        .inactive {
          background: #f0f1f0;
          color: #747b76;
        }

        .view-button {
          border: 1px solid #cfe3d4;
          background: #f1f8f3;
          color: #08752c;
          padding: 8px 12px;
          border-radius: 7px;
          cursor: pointer;
          font-weight: bold;
          font-size: 11px;
        }

        /* MODAL */

        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.45);
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 20px;
          z-index: 1000;
        }

        .modal {
          width: 100%;
          max-width: 600px;
          background: white;
          border-radius: 16px;
          overflow: hidden;
        }

        .modal-header {
          padding: 25px;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          border-bottom: 1px solid #edf1ed;
        }

        .customer-profile {
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .customer-profile h2 {
          margin: 0;
          color: #103b20;
        }

        .customer-profile p {
          margin: 5px 0 0;
          color: #7a877d;
          font-size: 12px;
        }

        .close {
          width: 35px;
          height: 35px;
          border: none;
          border-radius: 50%;
          background: #f1f4f1;
          font-size: 22px;
          cursor: pointer;
        }

        .customer-details {
          padding: 25px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
        }

        .detail-box {
          padding: 15px;
          background: #f7faf7;
          border-radius: 9px;
        }

        .detail-box span,
        .customer-status span {
          display: block;
          color: #7a877d;
          font-size: 11px;
          margin-bottom: 6px;
        }

        .detail-box strong {
          color: #173d24;
          font-size: 13px;
        }

        .customer-status {
          margin: 0 25px;
          padding: 18px;
          background: #f7faf7;
          border-radius: 10px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 15px;
        }

        .activate,
        .deactivate {
          border: none;
          padding: 9px 13px;
          border-radius: 7px;
          cursor: pointer;
          font-size: 11px;
          font-weight: bold;
        }

        .activate {
          background: #08752c;
          color: white;
        }

        .deactivate {
          background: #fff0f0;
          color: #d54848;
        }

        .modal-footer {
          padding: 20px 25px;
          margin-top: 20px;
          border-top: 1px solid #edf1ed;
          display: flex;
          justify-content: flex-end;
        }

        .close-button {
          border: 1px solid #dce5dd;
          background: white;
          padding: 10px 18px;
          border-radius: 7px;
          cursor: pointer;
        }

        @media (max-width: 900px) {
          .summary-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 600px) {
          .customers-page {
            padding: 20px;
          }

          .summary-grid {
            grid-template-columns: 1fr;
          }

          .card-header {
            align-items: flex-start;
            flex-direction: column;
          }

          .search {
            width: 100%;
          }

          .customer-details {
            grid-template-columns: 1fr;
          }

          .customer-status {
            align-items: flex-start;
            flex-direction: column;
          }
        }

      `}</style>

    </main>
  );
}