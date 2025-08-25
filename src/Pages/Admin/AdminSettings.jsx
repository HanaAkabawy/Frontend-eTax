import React, { useEffect, useState } from "react";
import {
  getSettings,
  createSetting,
  updateSetting,
  deleteSetting,
} from "./../../Services/settingsApi";
import Button from "../../Components/Ui/Button/Button";

import "./AdminSettings.css";

export default function AdminSettings() {
  const [settings, setSettings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newSetting, setNewSetting] = useState({ key: "", value: "", label: "" });

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
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    try {
      await createSetting(newSetting);
      setNewSetting({ key: "", value: "", label: "" });
      fetchSettings();
    } catch (error) {
      alert("Failed to create setting: " + (error.message || "Unknown error"));
    }
  };

  const handleUpdate = async (id, updated) => {
    try {
      await updateSetting(id, updated);
      fetchSettings();
    } catch (error) {
      alert("Failed to update setting");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this setting?")) return;
    try {
      await deleteSetting(id);
      fetchSettings();
    } catch (error) {
      alert("Failed to delete setting");
    }
  };

  if (loading) return <p>Loading settings...</p>;

  return (
    <div className="settings-page">
      <h1 className="settings-title">⚙️ Admin-Settings</h1>

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
                      onClick={() =>
                        handleUpdate(setting.id, {
                          key: setting.key,
                          value:
                            prompt("Enter new value:", setting.value) ||
                            setting.value,
                          label: setting.label,
                        })
                      }
                      className="mr-2"
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
    </div>
  );
}
