
"use client";

import { useEffect, useState, type FormEvent } from "react";
import { supabase } from "../../lib/supabase";

type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  unit: string;
  image: string | null;
  description: string | null;
};

const emptyProduct = {
  name: "",
  category: "Frozen Foods",
  price: "",
  stock: "",
  unit: "kg",
  image: "",
  description: "",
};

export default function ProducePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [form, setForm] = useState(emptyProduct);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  // FETCH PRODUCTS
  const fetchProducts = async () => {
    setLoading(true);

    try {
      const { data, error } = await supabase
        .from("produce")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      setProducts((data || []) as Product[]);
    } catch (error) {
      console.error("FETCH PRODUCTS ERROR:", error);
      setMessage(
        error instanceof Error
          ? error.message
          : "Unable to load products."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // OPEN ADD FORM
  const openAddForm = () => {
    setEditingId(null);
    setForm({ ...emptyProduct });
    setSelectedImage(null);
    setImagePreview("");
    setMessage("");
    setShowForm(true);
  };

  // OPEN EDIT FORM
  const openEditForm = (product: Product) => {
    console.log("EDIT BUTTON CLICKED:", product);

    setEditingId(product.id);

    setForm({
      name: product.name || "",
      category: product.category || "Frozen Foods",
      price: String(product.price ?? ""),
      stock: String(product.stock ?? ""),
      unit: product.unit || "kg",
      image: product.image || "",
      description: product.description || "",
    });

    setSelectedImage(null);
    setImagePreview(product.image || "");
    setMessage("");
    setShowForm(true);
  };

  // UPLOAD PRODUCT IMAGE
  const uploadProductImage = async (file: File) => {
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      throw new Error("Please select a JPG, PNG or WEBP image.");
    }

    if (file.size > 5 * 1024 * 1024) {
      throw new Error("Image must be smaller than 5MB.");
    }

    const extension =
      file.name.split(".").pop()?.toLowerCase() || "jpg";

    const filePath = `${crypto.randomUUID()}.${extension}`;

    const { error } = await supabase.storage
      .from("product-images")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
        contentType: file.type,
      });

    if (error) throw error;

    const { data } = supabase.storage
      .from("product-images")
      .getPublicUrl(filePath);

    return data.publicUrl;
  };

  // SAVE OR UPDATE PRODUCT
  const saveProduct = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (
      !form.name.trim() ||
      form.price === "" ||
      form.stock === ""
    ) {
      setMessage("Please fill in all required fields.");
      return;
    }

    if (
      !Number.isFinite(Number(form.price)) ||
      !Number.isFinite(Number(form.stock)) ||
      Number(form.price) < 0 ||
      Number(form.stock) < 0
    ) {
      setMessage("Enter valid price and stock values.");
      return;
    }

    setSaving(true);
    setMessage("");

    try {
      let imageUrl = form.image || null;

      if (selectedImage) {
        imageUrl = await uploadProductImage(selectedImage);
      }

      const productData = {
        name: form.name.trim(),
        category: form.category,
        price: Number(form.price),
        stock: Number(form.stock),
        unit: form.unit,
        image: imageUrl,
        description: form.description.trim() || null,
      };

      if (editingId) {
        const { data, error } = await supabase
          .from("produce")
          .update(productData)
          .eq("id", editingId)
          .select("id")
          .maybeSingle();

        if (error) throw error;

        if (!data) {
          throw new Error(
            "Product was not updated. Check your Supabase permissions."
          );
        }
      } else {
        const { error } = await supabase
          .from("produce")
          .insert([productData]);

        if (error) throw error;
      }

      const wasEditing = Boolean(editingId);

      setForm({ ...emptyProduct });
      setSelectedImage(null);
      setImagePreview("");
      setEditingId(null);
      setShowForm(false);

      await fetchProducts();

      setMessage(
        wasEditing
          ? "Product updated successfully!"
          : "Product added successfully!"
      );
    } catch (error) {
      console.error("SAVE PRODUCT ERROR:", error);

      setMessage(
        error instanceof Error
          ? error.message
          : "Unable to save product."
      );
    } finally {
      setSaving(false);
    }
  };

  // DELETE PRODUCT
  const deleteProduct = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmed) return;

    try {
      const { data, error } = await supabase
        .from("produce")
        .delete()
        .eq("id", id)
        .select("id")
        .maybeSingle();

      if (error) throw error;

      if (!data) {
        throw new Error(
          "Product was not deleted. Check your Supabase permissions."
        );
      }

      await fetchProducts();
      setMessage("Product deleted successfully!");
    } catch (error) {
      console.error("DELETE PRODUCT ERROR:", error);

      setMessage(
        error instanceof Error
          ? error.message
          : "Unable to delete product."
      );
    }
  };

  return (
    <main className="page">
      {/* HEADER */}
      <div className="header">
        <div>
          <p className="eyebrow">PRODUCT MANAGEMENT</p>
          <h1>Produce</h1>
          <p className="subtitle">
            Manage agricultural products available in your store.
          </p>
        </div>

        <button
          type="button"
          className="addButton"
          onClick={openAddForm}
        >
          + Add Produce
        </button>
      </div>

      {/* MESSAGE */}
      {message && (
        <div className="message">
          {message}
        </div>
      )}

      {/* ADD / EDIT FORM */}
      {showForm && (
        <section className="formCard">
          <div className="formHeader">
            <div>
              <h2>
                {editingId ? "Edit Produce" : "Add New Produce"}
              </h2>

              <p>
                Enter the product information below.
              </p>
            </div>

            <button
              type="button"
              className="closeButton"
              onClick={() => setShowForm(false)}
            >
              ×
            </button>
          </div>

          <form onSubmit={saveProduct}>
            <div className="formGrid">
              <div className="field">
                <label>Product Name *</label>

                <input
                  required
                  value={form.name}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      name: e.target.value,
                    })
                  }
                  placeholder="e.g. Frozen Chicken"
                />
              </div>

              <div className="field">
                <label>Category *</label>

                <select
                  value={form.category}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      category: e.target.value,
                    })
                  }
                >
                  <option>Frozen Foods</option>
                  <option>Farm Produce</option>
                  <option>Livestock</option>
                  <option>Grains</option>
                  <option>Other</option>
                </select>
              </div>

              <div className="field">
                <label>Price (₦) *</label>

                <input
                  required
                  type="number"
                  min="0"
                  value={form.price}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      price: e.target.value,
                    })
                  }
                  placeholder="18000"
                />
              </div>

              <div className="field">
                <label>Available Stock *</label>

                <input
                  required
                  type="number"
                  min="0"
                  value={form.stock}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      stock: e.target.value,
                    })
                  }
                  placeholder="25"
                />
              </div>

              <div className="field">
                <label>Unit *</label>

                <select
                  value={form.unit}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      unit: e.target.value,
                    })
                  }
                >
                  <option>kg</option>
                  <option>crate</option>
                  <option>basket</option>
                  <option>bag</option>
                  <option>piece</option>
                  <option>litre</option>
                </select>
              </div>

              <div className="field">
                <label>Image URL</label>

                <input
                  value={form.image}
                  onChange={(e) => {
                    setForm({
                      ...form,
                      image: e.target.value,
                    });

                    setImagePreview(e.target.value);
                    setSelectedImage(null);
                  }}
                  placeholder="https://..."
                />
              </div>

              <div className="field full">
                <label>
                  Upload Product Image (JPG, PNG or WEBP, max 5MB)
                </label>

                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null;

                    setSelectedImage(file);

                    if (file) {
                      setImagePreview(URL.createObjectURL(file));
                    }
                  }}
                />

                {imagePreview && (
                  <img
                    src={imagePreview}
                    alt="Product preview"
                    className="imagePreview"
                  />
                )}
              </div>

              <div className="field full">
                <label>Description</label>

                <textarea
                  rows={4}
                  value={form.description}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      description: e.target.value,
                    })
                  }
                  placeholder="Describe this product..."
                />
              </div>
            </div>

            <div className="formActions">
              <button
                type="button"
                className="cancelButton"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="saveButton"
                disabled={saving}
              >
                {saving
                  ? "Saving..."
                  : editingId
                  ? "Update Produce"
                  : "Add Produce"}
              </button>
            </div>
          </form>
        </section>
      )}

      {/* PRODUCT LIST */}
      <section className="productsCard">
        <div className="cardHeader">
          <div>
            <h2>All Produce</h2>
            <p>Products currently registered in your inventory.</p>
          </div>

          <span className="count">
            {products.length} products
          </span>
        </div>

        {loading ? (
          <div className="loading">
            Loading products...
          </div>
        ) : products.length === 0 ? (
          <div className="empty">
            <div className="emptyIcon">🌱</div>
            <h3>No produce yet</h3>
            <p>Add your first agricultural product.</p>

            <button
              type="button"
              className="addButton"
              onClick={openAddForm}
            >
              + Add Produce
            </button>
          </div>
        ) : (
          <div className="productGrid">
            {products.map((product) => (
              <div className="productCard" key={product.id}>
                <div className="productImage">
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.name}
                    />
                  ) : (
                    <span>🌱</span>
                  )}
                </div>

                <div className="productContent">
                  <span className="category">
                    {product.category}
                  </span>

                  <h3>{product.name}</h3>

                  <p className="description">
                    {product.description || "No description added."}
                  </p>

                  <div className="productInfo">
                    <div>
                      <small>Price</small>
                      <strong>
                        ₦{Number(product.price).toLocaleString()}
                      </strong>
                    </div>

                    <div>
                      <small>Stock</small>

                      <strong
                        className={
                          Number(product.stock) === 0
                            ? "outOfStock"
                            : Number(product.stock) <= 5
                            ? "lowStock"
                            : ""
                        }
                      >
                        {product.stock} {product.unit}
                      </strong>
                    </div>
                  </div>

                  <div className="actions">
                    <button
                      type="button"
                      className="editButton"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        openEditForm(product);
                      }}
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      className="deleteButton"
                      onClick={() => deleteProduct(product.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* STYLES */}
      <style jsx>{`
        .page {
          min-height: 100vh;
          background: #f5f8f5;
          padding: 40px;
          color: #173d24;
          font-family: Arial, sans-serif;
        }

        .header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          gap: 20px;
          margin-bottom: 25px;
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
          font-size: 32px;
          color: #103b20;
        }

        .subtitle {
          margin-top: 8px;
          color: #718078;
          font-size: 14px;
        }

        .addButton {
          border: none;
          background: #08752c;
          color: white;
          padding: 12px 18px;
          border-radius: 8px;
          cursor: pointer;
          font-weight: bold;
        }

        .addButton:hover {
          background: #065d22;
        }

        .message {
          margin-bottom: 20px;
          padding: 13px 16px;
          border-radius: 8px;
          background: #e5f7ea;
          color: #08752c;
          font-size: 13px;
          font-weight: bold;
          overflow-wrap: anywhere;
        }

        .formCard,
        .productsCard {
          background: white;
          border: 1px solid #e1e9e2;
          border-radius: 14px;
          margin-bottom: 25px;
          overflow: hidden;
        }

        .formHeader,
        .cardHeader {
          padding: 23px;
          border-bottom: 1px solid #edf1ed;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 20px;
        }

        .formHeader h2,
        .cardHeader h2 {
          margin: 0 0 5px;
          color: #103b20;
          font-size: 18px;
        }

        .formHeader p,
        .cardHeader p {
          margin: 0;
          color: #7a877d;
          font-size: 12px;
        }

        .closeButton {
          border: none;
          background: #f1f4f1;
          width: 35px;
          height: 35px;
          border-radius: 50%;
          font-size: 22px;
          cursor: pointer;
        }

        form {
          padding: 25px;
        }

        .formGrid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }

        .field {
          display: flex;
          flex-direction: column;
          gap: 8px;
          min-width: 0;
        }

        .field.full {
          grid-column: 1 / -1;
        }

        .field label {
          font-size: 12px;
          font-weight: bold;
          color: #34483a;
        }

        .field input,
        .field select,
        .field textarea {
          box-sizing: border-box;
          width: 100%;
          padding: 12px;
          border: 1px solid #dce5dd;
          border-radius: 8px;
          outline: none;
          font-family: inherit;
          font-size: 13px;
        }

        .field input:focus,
        .field select:focus,
        .field textarea:focus {
          border-color: #159447;
        }

        .imagePreview {
          width: 160px;
          height: 120px;
          object-fit: cover;
          border-radius: 8px;
          border: 1px solid #dce5dd;
          margin-top: 8px;
        }

        .formActions {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
          margin-top: 25px;
        }

        .cancelButton,
        .saveButton {
          padding: 11px 18px;
          border-radius: 8px;
          cursor: pointer;
          font-weight: bold;
        }

        .cancelButton {
          border: 1px solid #dce5dd;
          background: white;
          color: #526057;
        }

        .saveButton {
          border: none;
          background: #08752c;
          color: white;
        }

        .saveButton:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .count {
          background: #e8f6ec;
          color: #08752c;
          padding: 7px 11px;
          border-radius: 20px;
          font-size: 11px;
          font-weight: bold;
        }

        .loading,
        .empty {
          padding: 70px 20px;
          text-align: center;
          color: #7a877d;
        }

        .emptyIcon {
          font-size: 45px;
          margin-bottom: 10px;
        }

        .empty h3 {
          margin: 5px 0;
          color: #173d24;
        }

        .empty p {
          font-size: 13px;
          margin-bottom: 20px;
        }

        .productGrid {
          padding: 25px;
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 20px;
        }

        .productCard {
          border: 1px solid #e1e9e2;
          border-radius: 12px;
          overflow: hidden;
          background: white;
          min-width: 0;
        }

        .productImage {
          height: 170px;
          background: #edf6ef;
          display: flex;
          justify-content: center;
          align-items: center;
          overflow: hidden;
        }

        .productImage img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .productImage span {
          font-size: 50px;
        }

        .productContent {
          padding: 17px;
        }

        .category {
          display: inline-block;
          background: #e8f6ec;
          color: #08752c;
          padding: 5px 8px;
          border-radius: 5px;
          font-size: 9px;
          font-weight: bold;
        }

        .productContent h3 {
          margin: 10px 0 6px;
          color: #103b20;
          font-size: 16px;
        }

        .description {
          min-height: 35px;
          margin: 0;
          color: #7a877d;
          font-size: 11px;
          line-height: 1.5;
        }

        .productInfo {
          display: flex;
          justify-content: space-between;
          gap: 10px;
          padding: 15px 0;
          margin-top: 10px;
          border-top: 1px solid #edf1ed;
        }

        .productInfo small {
          display: block;
          color: #89938d;
          font-size: 9px;
          margin-bottom: 4px;
        }

        .productInfo strong {
          font-size: 13px;
          color: #173d24;
        }

        .lowStock {
          color: #c47b00 !important;
        }

        .outOfStock {
          color: #d54848 !important;
        }

        .actions {
          display: flex;
          gap: 8px;
        }

        .editButton,
        .deleteButton {
          flex: 1;
          padding: 9px;
          border-radius: 7px;
          cursor: pointer;
          font-size: 11px;
          font-weight: bold;
        }

        .editButton {
          border: 1px solid #cfe3d4;
          background: #f1f8f3;
          color: #08752c;
        }

        .deleteButton {
          border: 1px solid #f1cccc;
          background: #fff5f5;
          color: #d54848;
        }

        @media (max-width: 1000px) {
          .productGrid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 700px) {
          .page {
            padding: 20px;
          }

          .header {
            align-items: flex-start;
            flex-direction: column;
          }

          .formGrid {
            grid-template-columns: 1fr;
          }

          .field.full {
            grid-column: auto;
          }

          .productGrid {
            grid-template-columns: 1fr;
            padding: 15px;
          }

          .formHeader,
          .cardHeader {
            padding: 17px;
          }

          form {
            padding: 17px;
          }
        }
      `}</style>
    </main>
  );
}
