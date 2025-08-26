import React, { useEffect, useState } from "react";
import {
  getSettings,
  createSetting,
  updateSetting,
  deleteSetting,
} from "./../../Services/settingsApi";
import Button from "../../Components/Ui/Button/Button";
import Swal from "sweetalert2";

import "./AdminSettings.css";

export default function AdminSettings() {
  const [settings, setSettings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newSetting, setNewSetting] = useState({ key: "", value: "", label: "" });

  // --- popup states ---
  const [showModal, setShowModal] = useState(false);
  const [editingSetting, setEditingSetting] = useState(null); // full setting object
  // ---------------------

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const data = await getSettings();
      setSettings(data.data || []);
    } catch (error) {
      console.error("Failed to fetch settings:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to fetch settings",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    try {
      const res = await createSetting(newSetting);
      setSettings((prev) => [...prev, res.data]);
      setNewSetting({ key: "", value: "", label: "" });
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Setting created successfully!",
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (error) {
      
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message || "Failed to create setting",
      });
    }
  };

  const handleUpdate = async (id, updated) => {
    try {
      const res = await updateSetting(id, updated);
      setSettings((prev) =>
        prev.map((s) => (s.id === id ? res.data : s))
      );
      Swal.fire({
        icon: "success",
        title: "Updated!",
        text: "Setting updated successfully",
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.message || "Failed to update setting",
      });
    }
  };

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (!confirm.isConfirmed) return;

    try {
      await deleteSetting(id);
      setSettings((prev) => prev.filter((s) => s.id !== id));
      Swal.fire({
        icon: "success",
        title: "Deleted!",
        text: "Setting deleted successfully",
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.message || "Failed to delete setting",
      });
    }
  };

  // --- popup handlers ---
  const openModal = (setting) => {
    setEditingSetting({ ...setting }); // clone full object for editing
    setShowModal(true);
  };

  const saveModal = async () => {
    if (!editingSetting) return;
    await handleUpdate(editingSetting.id, {
      key: editingSetting.key,
      value: editingSetting.value,
      label: editingSetting.label,
    });
    setShowModal(false);
    setEditingSetting(null);
  };
  // ----------------------

  if (loading) return <p>Loading settings...</p>;

  return (
    <div className="settings-page">
      <h1 className="settings-title">Admin-Settings</h1>

      {/* Add New Setting */}
      <div className="card">
        <h2 className="section-title">Add New Setting</h2>
        <div className="form-row">
          <input
            type="text"
            placeholder="Key"
            value={newSetting.key}
            onChange={(e) => setNewSetting({ ...newSetting, key: e.target.value })}
          />
          <input
            type="text"
            placeholder="Value"
            value={newSetting.value}
            onChange={(e) => setNewSetting({ ...newSetting, value: e.target.value })}
          />
          <input
            type="text"
            placeholder="Label"
            value={newSetting.label}
            onChange={(e) => setNewSetting({ ...newSetting, label: e.target.value })}
          />
          <Button variant="primary" size="md" onClick={handleAdd}>
            Add
          </Button>
        </div>
      </div>

      {/* Existing Settings */}
      <div className="card">
        <h2 className="section-title">Existing Settings</h2>
        {settings.length === 0 ? (
          <p>No settings found.</p>
        ) : (
          <table className="settings-table">
            <thead>
              <tr>
                <th>Key</th>
                <th>Value</th>
                <th>Label</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {settings.map((setting) => (
                <tr key={setting.id}>
                  <td>{setting.key}</td>
                  <td>{setting.value}</td>
                  <td>{setting.label}</td>
                  <td>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => openModal(setting)}
                      className="mr-2"
                      disabled={setting.key === "free_posts"} // ✅ disable update for free_posts
                    >
                      Update
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(setting.id)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Popup modal */}
      {showModal && editingSetting && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
          }}
        >
          <div
            style={{
              background: "#fff",
              padding: 20,
              borderRadius: 10,
              maxWidth: 420,
              width: "100%",
              boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
            }}
          >
            <h3 style={{ margin: 0, marginBottom: 12, fontSize: 18, fontWeight: 600 }}>
              Edit Setting
            </h3>

            <input
              type="text"
              value={editingSetting.key}
              onChange={(e) =>
                setEditingSetting({ ...editingSetting, key: e.target.value })
              }
              placeholder="Key"
              style={{
                width: "100%",
                padding: "8px 10px",
                border: "1px solid #ddd",
                borderRadius: 6,
                marginBottom: 10,
              }}
            />
            <input
              type="text"
              value={editingSetting.value}
              onChange={(e) =>
                setEditingSetting({ ...editingSetting, value: e.target.value })
              }
              placeholder="Value"
              style={{
                width: "100%",
                padding: "8px 10px",
                border: "1px solid #ddd",
                borderRadius: 6,
                marginBottom: 10,
              }}
            />
            <input
              type="text"
              value={editingSetting.label}
              onChange={(e) =>
                setEditingSetting({ ...editingSetting, label: e.target.value })
              }
              placeholder="Label"
              style={{
                width: "100%",
                padding: "8px 10px",
                border: "1px solid #ddd",
                borderRadius: 6,
                marginBottom: 14,
              }}
            />

            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
              <Button variant="primary" size="sm" onClick={saveModal}>
                Save
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  setShowModal(false);
                  setEditingSetting(null);
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
