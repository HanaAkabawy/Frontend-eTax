import React, { useEffect, useState } from "react";
import {
  getProfile,
  updateProfile, // service function
} from "./../../Services/profile";
import "./UserProfile.css";
import Button from "../../Components/Ui/Button/Button";
import Swal from "sweetalert2";

export default function UserProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    current_password: "",
    new_password: "",
    new_password_confirmation: "",
  });

  // ✅ Grab token from localStorage
  const token = localStorage.getItem("token");

  useEffect(() => {
    getProfile({
      
        Authorization: `Bearer ${token}`,
      
    })
      .then((res) => {
        if (res.status && res.data) {
          setProfile(res.data);
          setFormData({
            name: res.data.name,
            current_password: "",
            new_password: "",
            new_password_confirmation: "",
          });
        }
      })
      .catch((err) => {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: err.message || "Failed to load profile data.",
        });
      })
      .finally(() => setLoading(false));
  }, [token]);

  if (loading) {
    return <div className="profile-card">Loading...</div>;
  }

  if (!profile) {
    return <div className="profile-card">No profile data found</div>;
  }

  const profileImage =
    profile.profile_image_url ||
    profile.attachments?.find((a) => a.category !== "national_id")?.url ||
    "https://via.placeholder.com/100";

  const nationalIdImage =
    profile.attachments?.find((a) => a.category === "national_id")?.url || null;

  // ✅ Submit handler with token in headers
  const handleUpdate = (e) => {
    e.preventDefault();
    updateProfile(formData, {
      
        Authorization: `Bearer ${token}`,
      
    })
      .then((res) => {
        if (res.status && res.data) {
          setProfile(res.data);
          setShowModal(false);
          Swal.fire({
            icon: "success",
            title: "Profile Updated",
            text: "Your profile has been updated successfully!",
            timer: 2000,
            showConfirmButton: false,
          });
        }
      })
      .catch((err) => {
        let errorMessage = "An error occurred while updating your profile.";
        console.log(err.message);

        if (err.response) {
          const errors = Object.values(err.response.data.errors).flat();
          errorMessage = errors.join("\n");
        } else if (err.message) {
          errorMessage = err.message;
        }

        Swal.fire({
          icon: "error",
          title: "Update Failed",
          text: errorMessage,
        });
      });
  };

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-header">
          <h2 className="profile-title">{profile.name}</h2>
          <img src={profileImage} alt="Profile" className="profile-image" />
        </div>

        <div className="profile-details">
          <p>
            <span className="label">Email:</span> {profile.email}
          </p>

          {nationalIdImage && (
            <div className="national-id-section">
              <p className="label">National ID:</p>
              <img
                src={nationalIdImage}
                alt="National ID"
                className="national-id-image"
              />
            </div>
          )}
        </div>

        <div className="profile-footer">
          <Button variant="primary" size="md" onClick={() => setShowModal(true)}>
            Update
          </Button>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Update Profile</h3>
            <form onSubmit={handleUpdate}>
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>

              <div className="form-group">
                <label>Current Password</label>
                <input
                  type="password"
                  value={formData.current_password}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      current_password: e.target.value,
                    })
                  }
                />
              </div>

              <div className="form-group">
                <label>New Password</label>
                <input
                  type="password"
                  value={formData.new_password}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      new_password: e.target.value,
                    })
                  }
                />
              </div>

              <div className="form-group">
                <label>Confirm New Password</label>
                <input
                  type="password"
                  value={formData.new_password_confirmation}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      new_password_confirmation: e.target.value,
                    })
                  }
                />
              </div>

              <div className="modal-actions">
                <Button type="submit" variant="primary" size="md">
                  Save
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  size="md"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
