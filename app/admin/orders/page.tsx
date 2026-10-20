"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

type OrderStatus =
  | "Pending"
  | "Confirmed"
  | "Processing"
  | "Delivered"
  | "Cancelled";

type Order = {
  id: string;
  customer_id: string | null;
  total: number;
  status: string;
  created_at: string;
  delivery_address: string | null;
  city: string | null;
  state: string | null;
  notes: string | null;
};

type Customer = {
  id: string;
  full_name: string | null;
  email: string | null;
  phone: string | null;
};

type OrderItem = {
  id: string;
  order_id: string;
  product_id: string;
  product_name: string;
  price: number;
  quantity: number;
  subtotal: number;
};

type OrderWithDetails = Order & {
  customer: Customer | null;
  items: OrderItem[];
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<OrderWithDetails[]>([]);
  const [selectedOrder, setSelectedOrder] =
    useState<OrderWithDetails | null>(null);

  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");

  // ==========================================
  // FETCH ORDERS
  // ==========================================

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");

      // Get orders
      const {
        data: ordersData,
        error: ordersError,
      } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });

      if (ordersError) {
        throw ordersError;
      }

      // Get customers
      const {
        data: customersData,
        error: customersError,
      } = await supabase
        .from("customers")
        .select("*");

      if (customersError) {
        throw customersError;
      }

      // Get order items
      const {
        data: itemsData,
        error: itemsError,
      } = await supabase
        .from("order_items")
        .select("*");

      if (itemsError) {
        throw itemsError;
      }

      const customers =
        (customersData || []) as Customer[];

      const items =
        (itemsData || []) as OrderItem[];

      const formattedOrders: OrderWithDetails[] =
        (ordersData || []).map((order) => {
          const customer =
            customers.find(
              (customer) =>
                customer.id === order.customer_id
            ) || null;

          const orderItems = items.filter(
            (item) => item.order_id === order.id
          );

          return {
            ...(order as Order),
            customer,
            items: orderItems,
          };
        });

      setOrders(formattedOrders);
    } catch (err: any) {
      console.error("Error fetching orders:", err);

      setError(
        err?.message ||
          "Unable to load orders from Supabase."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // LOAD ORDERS
  // ==========================================

  useEffect(() => {
    fetchOrders();
  }, []);

  // ==========================================
  // UPDATE ORDER STATUS
  // ==========================================

  const updateStatus = async (
    orderId: string,
    newStatus: OrderStatus
  ) => {
    try {
      setUpdating(true);
      setError("");

      const { error } = await supabase
        .from("orders")
        .update({
          status: newStatus,
        })
        .eq("id", orderId);

      if (error) {
        throw error;
      }

      // Update page immediately
      setOrders((currentOrders) =>
        currentOrders.map((order) =>
          order.id === orderId
            ? {
                ...order,
                status: newStatus,
              }
            : order
        )
      );

      // Update modal
      setSelectedOrder((currentOrder) =>
        currentOrder?.id === orderId
          ? {
              ...currentOrder,
              status: newStatus,
            }
          : currentOrder
      );
    } catch (err: any) {
      console.error(
        "Error updating order:",
        err
      );

      setError(
        err?.message ||
          "Unable to update order status."
      );
    } finally {
      setUpdating(false);
    }
  };

  // ==========================================
  // SEARCH
  // ==========================================

  const filteredOrders = orders.filter((order) => {
    const customerName =
      order.customer?.full_name || "Guest Customer";

    const email =
      order.customer?.email || "";

    const phone =
      order.customer?.phone || "";

    const orderId =
      order.id || "";

    const searchText = search.toLowerCase();

    return (
      customerName
        .toLowerCase()
        .includes(searchText) ||
      email
        .toLowerCase()
        .includes(searchText) ||
      phone
        .toLowerCase()
        .includes(searchText) ||
      orderId
        .toLowerCase()
        .includes(searchText)
    );
  });

  // ==========================================
  // SUMMARY
  // ==========================================

  const totalOrders = orders.length;

  const pendingOrders = orders.filter(
    (order) => order.status === "Pending"
  ).length;

  const processingOrders = orders.filter(
    (order) =>
      order.status === "Processing"
  ).length;

  const deliveredOrders = orders.filter(
    (order) =>
      order.status === "Delivered"
  ).length;

  // ==========================================
  // FORMAT MONEY
  // ==========================================

  const formatMoney = (amount: number) => {
    return `₦${Number(amount || 0).toLocaleString()}`;
  };

  // ==========================================
  // FORMAT DATE
  // ==========================================

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString(
      "en-NG",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  // ==========================================
  // FORMAT ORDER NUMBER
  // ==========================================

  const formatOrderId = (id: string) => {
    return `#ZA${id
      .replace(/-/g, "")
      .slice(-6)
      .toUpperCase()}`;
  };

  return (
    <main className="orders-page">

      {/* ======================================
          HEADER
      ====================================== */}

      <header className="page-header">

        <div>
          <p className="eyebrow">
            ORDER MANAGEMENT
          </p>

          <h1>Orders</h1>

          <p className="subtitle">
            Manage customer orders directly
            from your Zion Agro Allied database.
          </p>
        </div>

        <button
          className="refresh-button"
          onClick={fetchOrders}
        >
          ↻ Refresh
        </button>

      </header>


      {/* ======================================
          ERROR
      ====================================== */}

      {error && (
        <div className="error-box">
          <strong>Something went wrong</strong>
          <span>{error}</span>
        </div>
      )}


      {/* ======================================
          SUMMARY
      ====================================== */}

      <section className="summary-grid">

        <div className="summary-card">

          <span>Total Orders</span>

          <strong>
            {totalOrders}
          </strong>

          <small>
            All customer orders
          </small>

        </div>


        <div className="summary-card orange">

          <span>Pending</span>

          <strong>
            {pendingOrders}
          </strong>

          <small>
            Awaiting confirmation
          </small>

        </div>


        <div className="summary-card blue">

          <span>Processing</span>

          <strong>
            {processingOrders}
          </strong>

          <small>
            Currently being prepared
          </small>

        </div>


        <div className="summary-card green">

          <span>Delivered</span>

          <strong>
            {deliveredOrders}
          </strong>

          <small>
            Successfully completed
          </small>

        </div>

      </section>


      {/* ======================================
          ORDERS CARD
      ====================================== */}

      <section className="orders-card">

        <div className="card-header">

          <div>
            <h2>Customer Orders</h2>

            <p>
              Orders received from your website.
            </p>
          </div>


          <input
            className="search"
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            placeholder="Search customer or order..."
          />

        </div>


        {/* ====================================
            LOADING
        ==================================== */}

        {loading ? (

          <div className="loading">

            <div className="loader"></div>

            <p>
              Loading orders...
            </p>

          </div>

        ) : filteredOrders.length === 0 ? (

          <div className="empty">

            <div className="empty-icon">
              🛒
            </div>

            <h3>
              No orders found
            </h3>

            <p>
              Customer orders will appear here
              once they place an order.
            </p>

          </div>

        ) : (

          <div className="table-wrapper">

            <table>

              <thead>

                <tr>

                  <th>
                    Order
                  </th>

                  <th>
                    Customer
                  </th>

                  <th>
                    Items
                  </th>

                  <th>
                    Total
                  </th>

                  <th>
                    Status
                  </th>

                  <th>
                    Action
                  </th>

                </tr>

              </thead>


              <tbody>

                {filteredOrders.map(
                  (order) => {

                    const customerName =
                      order.customer
                        ?.full_name ||
                      "Guest Customer";

                    const itemCount =
                      order.items.reduce(
                        (total, item) =>
                          total +
                          Number(
                            item.quantity
                          ),
                        0
                      );

                    return (

                      <tr
                        key={order.id}
                      >

                        {/* ORDER */}

                        <td>

                          <strong className="order-number">
                            {formatOrderId(
                              order.id
                            )}
                          </strong>

                          <small>
                            {formatDate(
                              order.created_at
                            )}
                          </small>

                        </td>


                        {/* CUSTOMER */}

                        <td>

                          <div className="customer">

                            <div className="avatar">

                              {customerName
                                .charAt(0)
                                .toUpperCase()}

                            </div>


                            <div>

                              <strong>
                                {customerName}
                              </strong>

                              <small>
                                {order.customer
                                  ?.phone ||
                                  "No phone number"}
                              </small>

                            </div>

                          </div>

                        </td>


                        {/* ITEMS */}

                        <td>

                          <strong>
                            {itemCount}
                          </strong>

                          <small>
                            {itemCount === 1
                              ? "item"
                              : "items"}
                          </small>

                        </td>


                        {/* TOTAL */}

                        <td>

                          <strong className="amount">
                            {formatMoney(
                              order.total
                            )}
                          </strong>

                        </td>


                        {/* STATUS */}

                        <td>

                          <span
                            className={`status ${order.status
                              .toLowerCase()
                              .replace(
                                /\s+/g,
                                "-"
                              )}`}
                          >
                            {order.status}
                          </span>

                        </td>


                        {/* ACTION */}

                        <td>

                          <button
                            className="view-button"
                            onClick={() =>
                              setSelectedOrder(
                                order
                              )
                            }
                          >
                            View Order →
                          </button>

                        </td>

                      </tr>

                    );
                  }
                )}

              </tbody>

            </table>

          </div>

        )}

      </section>


      {/* ======================================
          ORDER DETAILS MODAL
      ====================================== */}

      {selectedOrder && (

        <div
          className="modal-overlay"
          onClick={() =>
            setSelectedOrder(null)
          }
        >

          <div
            className="modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            {/* MODAL HEADER */}

            <div className="modal-header">

              <div>

                <p className="eyebrow">
                  ORDER DETAILS
                </p>

                <h2>
                  {formatOrderId(
                    selectedOrder.id
                  )}
                </h2>

                <p className="modal-date">
                  Placed{" "}
                  {formatDate(
                    selectedOrder.created_at
                  )}
                </p>

              </div>


              <button
                className="close"
                onClick={() =>
                  setSelectedOrder(null)
                }
              >
                ×
              </button>

            </div>


            <div className="modal-content">

              {/* CUSTOMER */}

              <div className="detail-card">

                <h3>
                  Customer Information
                </h3>

                <div className="customer-detail">

                  <div className="large-avatar">

                    {(selectedOrder.customer
                      ?.full_name ||
                      "G"
                    )
                      .charAt(0)
                      .toUpperCase()}

                  </div>


                  <div>

                    <strong>
                      {selectedOrder.customer
                        ?.full_name ||
                        "Guest Customer"}
                    </strong>

                    <p>
                      {selectedOrder.customer
                        ?.email ||
                        "No email provided"}
                    </p>

                    <p>
                      {selectedOrder.customer
                        ?.phone ||
                        "No phone number"}
                    </p>

                  </div>

                </div>

              </div>

              {/* DELIVERY INFORMATION */}

<div className="detail-card">

  <h3>
    Delivery Information
  </h3>

  <div className="delivery-info">

    <p>
      <strong>Address</strong>
      <span>
        {selectedOrder.delivery_address ||
          "No address provided"}
      </span>
    </p>

    <p>
      <strong>City</strong>
      <span>
        {selectedOrder.city ||
          "Not provided"}
      </span>
    </p>

    <p>
      <strong>State</strong>
      <span>
        {selectedOrder.state ||
          "Not provided"}
      </span>
    </p>

    {selectedOrder.notes && (

      <p>
        <strong>Order Notes</strong>
        <span>
          {selectedOrder.notes}
        </span>
      </p>

    )}

  </div>

</div>


              {/* ORDER ITEMS */}

              <div className="detail-card">

                <div className="section-heading">

                  <h3>
                    Items Ordered
                  </h3>

                  <span>
                    {selectedOrder.items.length}{" "}
                    product
                    {selectedOrder.items
                      .length !== 1
                      ? "s"
                      : ""}
                  </span>

                </div>


                {selectedOrder.items.length ===
                0 ? (

                  <p className="no-items">
                    No order items found.
                  </p>

                ) : (

                  <div className="items-list">

                    {selectedOrder.items.map(
                      (item) => (

                        <div
                          className="item-row"
                          key={item.id}
                        >

                          <div>

                            <strong>
                              {item.product_name}
                            </strong>

                            <small>
                              {formatMoney(
                                item.price
                              )}{" "}
                              ×{" "}
                              {item.quantity}
                            </small>

                          </div>


                          <strong>
                            {formatMoney(
                              item.subtotal
                            )}
                          </strong>

                        </div>

                      )
                    )}

                  </div>

                )}

              </div>


              {/* TOTAL */}

              <div className="total-box">

                <span>
                  Order Total
                </span>

                <strong>
                  {formatMoney(
                    selectedOrder.total
                  )}
                </strong>

              </div>


              {/* STATUS */}

              <div className="detail-card">

                <h3>
                  Update Order Status
                </h3>

                <select
                  value={
                    selectedOrder.status
                  }
                  disabled={updating}
                  onChange={(e) =>
                    updateStatus(
                      selectedOrder.id,
                      e.target
                        .value as OrderStatus
                    )
                  }
                >

                  <option value="Pending">
                    Pending
                  </option>

                  <option value="Confirmed">
                    Confirmed
                  </option>

                  <option value="Processing">
                    Processing
                  </option>

                  <option value="Delivered">
                    Delivered
                  </option>

                  <option value="Cancelled">
                    Cancelled
                  </option>

                </select>

                {updating && (
                  <p className="updating">
                    Updating order...
                  </p>
                )}

              </div>

            </div>


            {/* MODAL FOOTER */}

            <div className="modal-footer">

              <button
                className="close-button"
                onClick={() =>
                  setSelectedOrder(null)
                }
              >
                Close
              </button>

            </div>

          </div>

        </div>

      )}



      {/* ======================================
          STYLES
      ====================================== */}

      <style jsx>{`

        .orders-page {
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
          margin-bottom: 30px;
        }

        .eyebrow {
          margin: 0 0 7px;
          color: #159447;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 2px;
        }

        h1 {
          margin: 0;
          font-size: 34px;
          color: #103b20;
        }

        .subtitle {
          margin: 8px 0 0;
          color: #718078;
          font-size: 13px;
        }

        .refresh-button {
          border: 1px solid #cfe1d3;
          background: white;
          color: #08752c;
          padding: 11px 17px;
          border-radius: 8px;
          cursor: pointer;
          font-weight: bold;
        }

        .refresh-button:hover {
          background: #eef8f1;
        }

        .error-box {
          margin-bottom: 20px;
          padding: 15px 18px;
          background: #fff0f0;
          border: 1px solid #ffd0d0;
          border-radius: 10px;
          color: #b52b2b;
        }

        .error-box strong {
          display: block;
          margin-bottom: 4px;
          font-size: 13px;
        }

        .error-box span {
          font-size: 12px;
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
          font-size: 12px;
        }

        .summary-card strong {
          display: block;
          margin-top: 10px;
          font-size: 29px;
          color: #103b20;
        }

        .summary-card small {
          display: block;
          margin-top: 6px;
          color: #9aa39d;
          font-size: 10px;
        }

        .summary-card.orange strong {
          color: #c47b00;
        }

        .summary-card.blue strong {
          color: #2861a8;
        }

        .summary-card.green strong {
          color: #08752c;
        }

        .orders-card {
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
          width: 260px;
          padding: 11px 13px;
          border: 1px solid #dce5dd;
          border-radius: 8px;
          outline: none;
          font-size: 12px;
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
          font-size: 12px;
        }

        th {
          color: #7a877d;
          font-size: 9px;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        td {
          color: #536159;
        }

        td small {
          display: block;
          color: #89938d;
          font-size: 9px;
          margin-top: 5px;
        }

        .order-number {
          color: #173d24;
        }

        .customer {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .avatar {
          width: 37px;
          height: 37px;
          flex-shrink: 0;
          border-radius: 50%;
          background: #e8f6ec;
          color: #08752c;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
        }

        .amount {
          color: #173d24;
        }

        .status {
          display: inline-block;
          padding: 6px 10px;
          border-radius: 20px;
          font-size: 9px;
          font-weight: bold;
        }

        .status.pending {
          background: #fff3d8;
          color: #a96800;
        }

        .status.confirmed {
          background: #e8f6ec;
          color: #08752c;
        }

        .status.processing {
          background: #e8f1ff;
          color: #2861a8;
        }

        .status.delivered {
          background: #e5f7ea;
          color: #08752c;
        }

        .status.cancelled {
          background: #ffebeb;
          color: #d54848;
        }

        .view-button {
          border: 1px solid #cfe3d4;
          background: #f1f8f3;
          color: #08752c;
          padding: 8px 12px;
          border-radius: 7px;
          cursor: pointer;
          font-weight: bold;
          font-size: 10px;
        }

        .view-button:hover {
          background: #e4f3e8;
        }

        .loading,
        .empty {
          padding: 80px 20px;
          text-align: center;
        }

        .loading p,
        .empty p {
          color: #89938d;
          font-size: 12px;
        }

        .loader {
          width: 30px;
          height: 30px;
          margin: auto;
          border: 3px solid #dce9df;
          border-top-color: #159447;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        .empty-icon {
          font-size: 35px;
          margin-bottom: 10px;
        }

        .empty h3 {
          margin: 0;
          color: #173d24;
        }

        /* MODAL */

        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(10, 25, 15, 0.55);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          z-index: 1000;
        }

        .modal {
          width: 100%;
          max-width: 620px;
          max-height: 90vh;
          background: white;
          border-radius: 18px;
          overflow: hidden;
          box-shadow: 0 25px 80px rgba(0, 0, 0, 0.2);
        }

        .modal-header {
          padding: 25px;
          display: flex;
          justify-content: space-between;
          border-bottom: 1px solid #edf1ed;
        }

        .modal-header h2 {
          margin: 0;
          color: #103b20;
          font-size: 24px;
        }

        .modal-date {
          margin: 6px 0 0;
          color: #89938d;
          font-size: 10px;
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

        .modal-content {
          padding: 25px;
          max-height: 65vh;
          overflow-y: auto;
        }

        .detail-card {
          padding: 18px;
          margin-bottom: 15px;
          background: #f8faf8;
          border: 1px solid #e7eee8;
          border-radius: 12px;
        }

        .detail-card h3 {
          margin: 0 0 15px;
          font-size: 11px;
          color: #758078;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .customer-detail {
          display: flex;
          align-items: center;
          gap: 13px;
        }

        .large-avatar {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: #dff2e4;
          color: #08752c;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          font-weight: bold;
        }

        .customer-detail strong {
          color: #173d24;
          font-size: 14px;
        }

        .customer-detail p {
          margin: 4px 0;
          color: #758078;
          font-size: 11px;
        }

        .section-heading {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .section-heading span {
          color: #89938d;
          font-size: 10px;
        }

        .items-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .item-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-bottom: 12px;
          border-bottom: 1px solid #e5ebe6;
        }

        .item-row:last-child {
          border-bottom: none;
          padding-bottom: 0;
        }

        .item-row strong {
          display: block;
          color: #173d24;
          font-size: 12px;
        }

        .item-row small {
          display: block;
          margin-top: 5px;
          color: #89938d;
          font-size: 10px;
        }

        .no-items {
          margin: 0;
          color: #89938d;
          font-size: 11px;
        }

        .total-box {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px;
          margin-bottom: 15px;
          background: #173d24;
          color: white;
          border-radius: 12px;
        }

        .total-box span {
          font-size: 11px;
        }

        .total-box strong {
          font-size: 20px;
        }

        .detail-card select {
          width: 100%;
          padding: 12px;
          border: 1px solid #dce5dd;
          border-radius: 8px;
          background: white;
          outline: none;
          color: #173d24;
          cursor: pointer;
        }

        .updating {
          margin: 8px 0 0;
          color: #159447;
          font-size: 10px;
        }

        .modal-footer {
          padding: 18px 25px;
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

          .orders-page {
            padding: 25px;
          }

          .summary-grid {
            grid-template-columns: repeat(2, 1fr);
          }

        }

        @media (max-width: 600px) {

          .orders-page {
            padding: 20px;
          }

          .page-header {
            align-items: flex-start;
            flex-direction: column;
            gap: 15px;
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
            box-sizing: border-box;
          }

          .modal-content {
            padding: 18px;
          }

        }

      `}</style>

    </main>
  );
}