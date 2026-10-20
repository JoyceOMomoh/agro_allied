"use client";

import { useState } from "react";

type InventoryItem = {
  id: number;
  name: string;
  category: string;
  stock: number;
  unit: string;
  minimum: number;
};

export default function InventoryPage() {
  const [inventory, setInventory] = useState<InventoryItem[]>([
    {
      id: 1,
      name: "Frozen Chicken",
      category: "Frozen Foods",
      stock: 25,
      unit: "kg",
      minimum: 10,
    },
    {
      id: 2,
      name: "Frozen Fish",
      category: "Frozen Foods",
      stock: 8,
      unit: "kg",
      minimum: 10,
    },
    {
      id: 3,
      name: "Farm Eggs",
      category: "Farm Produce",
      stock: 12,
      unit: "crates",
      minimum: 10,
    },
    {
      id: 4,
      name: "Fresh Beef",
      category: "Livestock",
      stock: 30,
      unit: "kg",
      minimum: 10,
    },
    {
      id: 5,
      name: "Goat Meat",
      category: "Livestock",
      stock: 18,
      unit: "kg",
      minimum: 10,
    },
    {
      id: 6,
      name: "Fresh Tomatoes",
      category: "Farm Produce",
      stock: 0,
      unit: "baskets",
      minimum: 10,
    },
  ]);

  const [editingId, setEditingId] = useState<number | null>(null);
  const [newStock, setNewStock] = useState("");

  const updateStock = (id: number) => {
    const amount = Number(newStock);

    if (newStock === "" || amount < 0) {
      alert("Please enter a valid stock quantity.");
      return;
    }

    setInventory(
      inventory.map((item) =>
        item.id === id
          ? {
              ...item,
              stock: amount,
            }
          : item
      )
    );

    setEditingId(null);
    setNewStock("");
  };

  const getStatus = (stock: number, minimum: number) => {
    if (stock === 0) return "Out of Stock";
    if (stock <= minimum) return "Low Stock";
    return "In Stock";
  };

  const inStock = inventory.filter(
    (item) => getStatus(item.stock, item.minimum) === "In Stock"
  ).length;

  const lowStock = inventory.filter(
    (item) => getStatus(item.stock, item.minimum) === "Low Stock"
  ).length;

  const outOfStock = inventory.filter(
    (item) => getStatus(item.stock, item.minimum) === "Out of Stock"
  ).length;

  return (
    <main className="inventory-page">
      <header className="page-header">
        <div>
          <p className="eyebrow">INVENTORY MANAGEMENT</p>
          <h1>Inventory</h1>
          <p className="subtitle">
            Monitor and update the stock available in your store.
          </p>
        </div>
      </header>

      {/* SUMMARY */}

      <section className="summary-grid">
        <div className="summary-card">
          <span>Total Items</span>
          <strong>{inventory.length}</strong>
        </div>

        <div className="summary-card green-card">
          <span>In Stock</span>
          <strong>{inStock}</strong>
        </div>

        <div className="summary-card orange-card">
          <span>Low Stock</span>
          <strong>{lowStock}</strong>
        </div>

        <div className="summary-card red-card">
          <span>Out of Stock</span>
          <strong>{outOfStock}</strong>
        </div>
      </section>

      {/* ALERT */}

      {outOfStock > 0 && (
        <div className="alert">
          <span>⚠️</span>

          <div>
            <strong>Stock Alert</strong>
            <p>
              {outOfStock} product
              {outOfStock > 1 ? "s are" : " is"} currently out of stock.
            </p>
          </div>
        </div>
      )}

      {/* INVENTORY TABLE */}

      <section className="inventory-card">
        <div className="card-header">
          <div>
            <h2>Stock Overview</h2>
            <p>Current stock levels for all products.</p>
          </div>

          <input
            className="search"
            placeholder="Search inventory..."
          />
        </div>

        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Current Stock</th>
                <th>Minimum Stock</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {inventory.map((item) => {
                const status = getStatus(
                  item.stock,
                  item.minimum
                );

                return (
                  <tr key={item.id}>
                    <td>
                      <div className="product">
                        <div className="product-icon">
                          🌱
                        </div>

                        <strong>{item.name}</strong>
                      </div>
                    </td>

                    <td>
                      <span className="category">
                        {item.category}
                      </span>
                    </td>

                    <td>
                      {editingId === item.id ? (
                        <div className="edit-stock">
                          <input
                            type="number"
                            min="0"
                            value={newStock}
                            onChange={(e) =>
                              setNewStock(e.target.value)
                            }
                            autoFocus
                          />

                          <span>{item.unit}</span>
                        </div>
                      ) : (
                        <strong>
                          {item.stock} {item.unit}
                        </strong>
                      )}
                    </td>

                    <td>
                      {item.minimum} {item.unit}
                    </td>

                    <td>
                      <span
                        className={`status ${
                          status === "In Stock"
                            ? "in-stock"
                            : status === "Low Stock"
                            ? "low-stock"
                            : "out-stock"
                        }`}
                      >
                        {status}
                      </span>
                    </td>

                    <td>
                      {editingId === item.id ? (
                        <div className="actions">
                          <button
                            className="save"
                            onClick={() =>
                              updateStock(item.id)
                            }
                          >
                            Save
                          </button>

                          <button
                            className="cancel"
                            onClick={() => {
                              setEditingId(null);
                              setNewStock("");
                            }}
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          className="update"
                          onClick={() => {
                            setEditingId(item.id);
                            setNewStock(
                              String(item.stock)
                            );
                          }}
                        >
                          Update Stock
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <style jsx>{`
        .inventory-page {
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
          font-size: 28px;
          color: #103b20;
        }

        .green-card strong {
          color: #08752c;
        }

        .orange-card strong {
          color: #c47b00;
        }

        .red-card strong {
          color: #d54848;
        }

        .alert {
          background: #fff7e6;
          border: 1px solid #f1dfb6;
          border-radius: 12px;
          padding: 16px 20px;
          display: flex;
          gap: 13px;
          align-items: center;
          margin-bottom: 25px;
          color: #7d5b15;
        }

        .alert span {
          font-size: 21px;
        }

        .alert strong {
          font-size: 13px;
        }

        .alert p {
          margin: 4px 0 0;
          font-size: 12px;
        }

        .inventory-card {
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
          min-width: 900px;
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

        .product {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .product-icon {
          width: 42px;
          height: 42px;
          background: #edf7ef;
          border-radius: 9px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .category {
          background: #eef6f0;
          color: #08752c;
          padding: 6px 9px;
          border-radius: 15px;
          font-size: 11px;
        }

        .status {
          padding: 6px 10px;
          border-radius: 20px;
          font-size: 11px;
          font-weight: bold;
        }

        .in-stock {
          background: #e5f7ea;
          color: #08752c;
        }

        .low-stock {
          background: #fff3d8;
          color: #a96800;
        }

        .out-stock {
          background: #ffebeb;
          color: #d54848;
        }

        .update,
        .save,
        .cancel {
          border-radius: 7px;
          padding: 8px 11px;
          cursor: pointer;
          font-size: 11px;
          font-weight: bold;
        }

        .update {
          border: 1px solid #cfe3d4;
          background: #f1f8f3;
          color: #08752c;
        }

        .save {
          border: none;
          background: #08752c;
          color: white;
        }

        .cancel {
          border: 1px solid #ddd;
          background: white;
          color: #555;
        }

        .actions {
          display: flex;
          gap: 6px;
        }

        .edit-stock {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .edit-stock input {
          width: 75px;
          padding: 7px;
          border: 1px solid #159447;
          border-radius: 6px;
          outline: none;
        }

        .edit-stock span {
          font-size: 11px;
        }

        @media (max-width: 900px) {
          .summary-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 600px) {
          .inventory-page {
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
        }
      `}</style>
    </main>
  );
}