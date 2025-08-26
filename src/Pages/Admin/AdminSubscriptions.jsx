import React, { useEffect, useState } from "react";
import apiRequest from "../../Services/ApiRequest";
import "./AdminSubscriptions.css";

function AdminSubscriptions() {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    id: null,
    name: "",
    cost: "",
    no_of_posts: "",
    is_active: false,
  });

  // GET all subscriptions
  const fetchSubscriptions = async () => {
    try {
      const response = await apiRequest("GET", "/adminSubscription");
      setSubscriptions(response.data);
    } catch (err) {
      setError("Failed to fetch subscriptions");
    } finally {
      setLoading(false);
    }
  };

  // Handle form input
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Open modal for Add
  const openAddModal = () => {
    setEditMode(false);
    setFormData({ id: null, name: "", cost: "", no_of_posts: "", is_active: false });
    setShowModal(true);
  };

  // Open modal for Edit
  const openEditModal = (plan) => {
    setEditMode(true);
    setFormData(plan);
    setShowModal(true);
  };

  // Submit form (Add or Edit)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editMode) {
        await apiRequest("PUT", `/adminSubscription/${formData.id}`, formData);
        alert("Plan updated!");
      } else {
        await apiRequest("POST", "/adminSubscription", formData);
        alert("New plan added!");
      }
      setShowModal(false);
      fetchSubscriptions();
    } catch (err) {
      console.error("Error submitting form:", err);
    }
  };

  // DELETE subscription
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this plan?")) return;
    try {
      await apiRequest("DELETE", `/adminSubscription/${id}`);
      setSubscriptions((prev) => prev.filter((plan) => plan.id !== id));
    } catch (err) {
      console.error("Error deleting subscription:", err);
    }
  };

  // View subscription
  const handleView = async (id) => {
    try {
      const res = await apiRequest("GET", `/adminSubscription/${id}`);
      alert(JSON.stringify(res.data, null, 2));
    } catch (err) {
      console.error("Error viewing subscription:", err);
    }
  };

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  if (loading) return <p>Loading subscriptions...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="subscriptions-container">
      <div className="header-row">
        <h2 className="subscriptions-title">Subscriptions</h2>
        <button className="btn add" onClick={openAddModal}>+ New Plan</button>
      </div>

      <table className="subscriptions-table">
        <thead>
          <tr>
            <th>Plan ID</th>
            <th>Plan Name</th>
            <th>Plan Cost</th>
            <th>No Plan Posts</th>
            <th>Plan Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {subscriptions.map((plan) => (
            <tr key={plan.id}>
              <td>{plan.id}</td>
              <td>{plan.name}</td>
              <td>{plan.cost}</td>
              <td>{plan.no_of_posts}</td>
              <td>{plan.is_active ? "Active" : "Inactive"}</td>
              <td className="action-buttons">
                {/* <button className="btn view" onClick={() => handleView(plan.id)}>View</button> */}
                <button className="btn edit" onClick={() => openEditModal(plan)}>Edit</button>
                <button className="btn delete" onClick={() => handleDelete(plan.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal for Add/Edit */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>{editMode ? "Edit Plan" : "Add New Plan"}</h3>
            <form onSubmit={handleSubmit}>
              <label>
                Name:
                <input type="text" name="name" value={formData.name} onChange={handleChange} required />
              </label>
              <label>
                Cost:
                <input type="number" name="cost" value={formData.cost} onChange={handleChange} required />
              </label>
              <label>
                No. of Posts:
                <input type="number" name="no_of_posts" value={formData.no_of_posts} onChange={handleChange} />
              </label>
              <label className="checkbox">
                <input type="checkbox" name="is_active" checked={formData.is_active} onChange={handleChange} />
                Active
              </label>
              <div className="modal-actions">
                <button type="submit" className="btn save">{editMode ? "Update" : "Add"}</button>
                <button type="button" className="btn cancel" onClick={() => setShowModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminSubscriptions;
