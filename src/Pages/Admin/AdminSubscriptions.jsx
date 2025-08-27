import React, { useEffect, useState } from "react";
import apiRequest from "../../Services/ApiRequest"; 
import "./AdminSubscriptions.css";

// normalize backend values into true/false
const toBool = (v) => v === true || v === 1 || v === "1";

const normalizePlan = (p) => ({
  ...p,
  is_active: toBool(p?.is_active),
});

export default function AdminSubscriptions() {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    cost: "",
    no_of_posts: "",
    is_active: false,
  });

  // new state for delete confirmation
  const [deleteConfirm, setDeleteConfirm] = useState({ show: false, id: null });

  // ---- API ----
  const fetchSubscriptions = async () => {
    try {
      setLoading(true);
      const res = await apiRequest("GET", "/adminSubscription");
      const list = Array.isArray(res?.data) ? res.data.map(normalizePlan) : [];
      setSubscriptions(list);
    } catch (e) {
      console.error("Failed to fetch subscriptions:", e);
      setSubscriptions([]);
    } finally {
      setLoading(false);
    }
  };

  const savePlan = async (payload, id = null) => {
    const body = {
      ...payload,
      cost: payload.cost === "" ? "" : Number(payload.cost),
      no_of_posts:
        payload.no_of_posts === "" || payload.no_of_posts === null
          ? ""
          : Number(payload.no_of_posts),
      is_active: payload.is_active ? 1 : 0,
    };
    if (id) {
      return apiRequest("PUT", `/adminSubscription/${id}`, body);
    }
    return apiRequest("POST", "/adminSubscription", body);
  };

  const deletePlan = (id) =>
    apiRequest("DELETE", `/adminSubscription/${id}`);

  // ---- UI handlers ----
  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const openAddModal = () => {
    setEditingPlan(null);
    setFormData({
      name: "",
      cost: "",
      no_of_posts: "",
      is_active: false,
    });
    setShowModal(true);
  };

  const openEditModal = (plan) => {
    setEditingPlan(plan);
    setFormData({
      name: plan.name ?? "",
      cost: plan.cost ?? "",
      no_of_posts: plan.no_of_posts ?? "",
      is_active: toBool(plan.is_active),
    });
    setShowModal(true);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await savePlan(formData, editingPlan?.id || null);
      setShowModal(false);
      fetchSubscriptions();
    } catch (e) {
      console.error("Error saving plan:", e);
    }
  };

  // open confirm modal instead of direct delete
  const handleDelete = (id) => {
    setDeleteConfirm({ show: true, id });
  };

  const confirmDelete = async () => {
    try {
      await deletePlan(deleteConfirm.id);
      setSubscriptions((prev) => prev.filter((p) => p.id !== deleteConfirm.id));
    } catch (e) {
      console.error("Error deleting plan:", e);
    } finally {
      setDeleteConfirm({ show: false, id: null });
    }
  };

  const togglePlan = async (id) => {
    return apiRequest("PATCH",`/adminSubscription/${id}/toggle`);
  };

  const toggleActive = async (plan) => {
    const next = !toBool(plan.is_active);
    try {
      await togglePlan(plan.id);
      setSubscriptions((prev) =>
        prev.map((p) => (p.id === plan.id ? { ...p, is_active: next } : p))
      );
    } catch (e) {
      console.error("Error toggling status:", e);
    }
  };

  // ---- render ----
  return (
    <div className="subscriptions-container">
      <div className="header-row">
        <h2 className="subscriptions-title">Subscription Plans</h2>
        <button className="btn new-plan" onClick={openAddModal}>
          + New Plan
        </button>
      </div>

      {loading ? (
        <p>Loading…</p>
      ) : (
        <table className="subscriptions-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Cost</th>
              <th>No. of Posts</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {subscriptions.length ? (
              subscriptions.map((plan) => (
                <tr key={plan.id}>
                  <td>{plan.name}</td>
                  <td>{plan.cost}</td>
                  <td>{plan.no_of_posts}</td>
                  <td>
                    <button
                      className={`btn ${toBool(plan.is_active) ? "active" : "inactive"}`}
                      onClick={() => toggleActive(plan)}
                    >
                      {toBool(plan.is_active) ? "Active" : "Inactive"}
                    </button>
                  </td>
                  <td className="action-buttons">
                    <button className="btn edit" onClick={() => openEditModal(plan)}>
                      Edit
                    </button>
                    <button className="btn delete" onClick={() => handleDelete(plan.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" style={{ textAlign: "center" }}>
                  No subscription plans found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>{editingPlan ? "Edit Plan" : "Add New Plan"}</h3>
            <form onSubmit={handleSubmit}>
              <label>
                Name:
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </label>
              <label>
                Cost:
                <input
                  type="number"
                  name="cost"
                  value={formData.cost}
                  onChange={handleChange}
                  required
                />
              </label>
              <label>
                No. of Posts:
                <input
                  type="number"
                  name="no_of_posts"
                  value={formData.no_of_posts}
                  onChange={handleChange}
                />
              </label>
              <label className="checkbox">
                <input
                  type="checkbox"
                  name="is_active"
                  checked={!!formData.is_active}
                  onChange={handleChange}
                />
                Active
              </label>
              <div className="modal-actions">
                <button type="submit" className="btn save">
                  {editingPlan ? "Update" : "Add"}
                </button>
                <button
                  type="button"
                  className="btn cancel"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* delete confirmation modal */}
      {deleteConfirm.show && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Confirm Delete</h3>
            <p>Are you sure you want to delete this plan?</p>
            <div className="modal-actions">
              <button className="btn delete" onClick={confirmDelete}>Yes</button>
              <button
                className="btn cancel"
                onClick={() => setDeleteConfirm({ show: false, id: null })}
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
