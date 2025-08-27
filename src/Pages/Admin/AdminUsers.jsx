import React, { useEffect, useState } from "react";
import apiRequest from "../../Services/ApiRequest";
import "./AdminUsers.css";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [newUser, setNewUser] = useState({ name: "", email: "", password: "" });

  // For delete confirmation modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  // Fetch users from backend
  const fetchUsers = async () => {
    try {
      const res = await apiRequest("GET", "/users");
      setUsers(res.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Create user
  const handleCreate = async () => {
    try {
      await apiRequest("POST", "/users", newUser);
      setNewUser({ name: "", email: "", password: "" });
      fetchUsers();
    } catch (error) {
      console.error("Error creating user:", error);
    }
  };

  // Update user
  const handleUpdate = async () => {
    try {
      await apiRequest("PUT", `/users/${editingUser.id}`, editingUser);
      setEditingUser(null);
      fetchUsers();
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  // Delete user (with confirmation modal)
  const confirmDelete = (user) => {
    setUserToDelete(user);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    try {
      if (userToDelete) {
        await apiRequest("DELETE", `/users/${userToDelete.id}`);
        fetchUsers();
      }
    } catch (error) {
      console.error("Error deleting user:", error);
    } finally {
      setShowDeleteModal(false);
      setUserToDelete(null);
    }
  };

  // Assign Role
  const handleAssignRole = async (id) => {
    try {
      await apiRequest("POST", `/users/${id}/assign-role`, { role: "admin" });
      fetchUsers();
    } catch (error) {
      console.error("Error assigning role:", error);
    }
  };

  // Remove Role
  const handleRemoveRole = async (id) => {
    try {
      await apiRequest("POST", `/users/${id}/remove-role`, { role: "admin" });
      fetchUsers();
    } catch (error) {
      console.error("Error removing role:", error);
    }
  };

  // Approve User
  const handleApprove = async (id) => {
    try {
      await apiRequest("POST", `/users/${id}/approve`);
      fetchUsers();
    } catch (error) {
      console.error("Error approving user:", error);
    }
  };

  // Reject User
  const handleReject = async (id) => {
    try {
      await apiRequest("POST", `/users/${id}/reject`);
      fetchUsers();
    } catch (error) {
      console.error("Error rejecting user:", error);
    }
  };

  return (
    <div className="admin-users">
      <h2>User Management</h2>

      {/* Create User */}
      <div className="form-section">
        <input
          type="text"
          placeholder="Name"
          value={newUser.name}
          onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
        />
        <input
          type="email"
          placeholder="Email"
          value={newUser.email}
          onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
        />
        <input
          type="password"
          placeholder="Password"
          value={newUser.password}
          onChange={(e) =>
            setNewUser({ ...newUser, password: e.target.value })
          }
        />
        <button onClick={handleCreate}>Add User</button>
      </div>

      {/* Users Table */}
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Admin</th>
            <th>Approved</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.length > 0 ? (
            users.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>
                  {editingUser?.id === user.id ? (
                    <input
                      type="text"
                      value={editingUser.name}
                      onChange={(e) =>
                        setEditingUser({
                          ...editingUser,
                          name: e.target.value,
                        })
                      }
                    />
                  ) : (
                    user.name
                  )}
                </td>
                <td>
                  {editingUser?.id === user.id ? (
                    <input
                      type="email"
                      value={editingUser.email}
                      onChange={(e) =>
                        setEditingUser({
                          ...editingUser,
                          email: e.target.value,
                        })
                      }
                    />
                  ) : (
                    user.email
                  )}
                </td>
                <td>{user.is_admin ? "✅ Yes" : "❌ No"}</td>
                <td>{user.is_approved ? "✅ Approved" : "❌ Pending"}</td>
                <td>
                  <div className="action-buttons">
                    {editingUser?.id === user.id ? (
                      <button className="btn save" onClick={handleUpdate}>
                        Save
                      </button>
                    ) : (
                      <button
                        className="btn edit"
                        onClick={() => setEditingUser(user)}
                      >
                        Edit
                      </button>
                    )}

                    <button
                      className="btn delete"
                      onClick={() => confirmDelete(user)}
                    >
                      Delete
                    </button>

                    {user.is_admin ? (
                      <button
                        className="btn role remove"
                        onClick={() => handleRemoveRole(user.id)}
                      >
                        Remove Admin
                      </button>
                    ) : (
                      <button
                        className="btn role assign"
                        onClick={() => handleAssignRole(user.id)}
                      >
                        Make Admin
                      </button>
                    )}

                    <button
                      className="btn approve"
                      onClick={() => handleApprove(user.id)}
                      disabled={user.is_approved}
                    >
                      Approve
                    </button>
                    <button
                      className="btn reject"
                      onClick={() => handleReject(user.id)}
                      disabled={!user.is_approved}
                    >
                      Reject
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6">No users found.</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal">
            <p>
              Are you sure you want to delete{" "}
              <strong>{userToDelete?.name}</strong>?
            </p>
            <div className="modal-actions">
              <button className="btn confirm" onClick={handleDelete}>
                Yes
              </button>
              <button
                className="btn cancel"
                onClick={() => setShowDeleteModal(false)}
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
