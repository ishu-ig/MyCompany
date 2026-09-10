import React, { useState, useEffect } from "react";

export default function AdminUser() {
  const [users, setUsers] = useState([]);
  const [roleFilter, setRoleFilter] = useState("All");
  const [keyword, setKeyword] = useState("");
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "candidate",
    password: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState("");

  const backendUrl = process.env.REACT_APP_BACKEND_SERVER || "http://localhost:8000";

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const url = new URL(`${backendUrl}/api/admin/users`);
      if (roleFilter !== "All") url.searchParams.append("role", roleFilter);
      if (keyword) url.searchParams.append("keyword", keyword);

      const res = await fetch(url.toString(), {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      });
      const data = await res.json();
      if (data.success) {
        setUsers(data.data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roleFilter]);

  const handleToggleStatus = async (id, currentActive) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${backendUrl}/api/admin/users/${id}/toggle-status`, {
        method: "PATCH",
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      });
      const data = await res.json();
      if (data.success) {
        setUsers((prev) =>
          prev.map((u) => (u._id === id ? { ...u, isActive: !currentActive } : u))
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${backendUrl}/api/admin/users/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      });
      const data = await res.json();
      if (data.success) {
        setUsers((prev) => prev.filter((u) => u._id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMsg("");
    try {
      const res = await fetch(`${backendUrl}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success) {
        setMsg("User created successfully!");
        setShowModal(false);
        setFormData({
          name: "",
          email: "",
          phone: "",
          role: "candidate",
          password: "",
        });
        fetchUsers();
      } else {
        setMsg(data.message || "Failed to create user");
      }
    } catch (err) {
      console.error(err);
      setMsg("Server error creating user");
    } finally {
      setSubmitting(false);
    }
  };

  const roles = ["All", "candidate", "employer", "recruiter", "trainer", "college", "admin"];

  return (
    <div className="container-fluid px-3 px-lg-4 py-4">
      {msg && (
        <div className="alert alert-info alert-dismissible fade show" role="alert">
          {msg}
          <button type="button" className="btn-close" onClick={() => setMsg("")}></button>
        </div>
      )}

      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <h3 className="fw-bold mb-1">User Management (6 Platform Roles)</h3>
          <p className="text-muted small mb-0">
            Control accounts for Candidates, Employers, Recruiters, Trainers, Colleges, and Admins.
          </p>
        </div>

        <div className="d-flex align-items-center gap-2">
          <button
            onClick={() => setShowModal(true)}
            className="btn btn-primary d-flex align-items-center gap-2"
          >
            <i className="bi bi-person-plus-fill"></i>
            <span>Add New User</span>
          </button>
        </div>
      </div>

      {/* Role Filters & Search */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div className="btn-group flex-wrap">
          {roles.map((r) => (
            <button
              key={r}
              className={`btn btn-sm text-capitalize ${
                roleFilter === r ? "btn-primary" : "btn-outline-secondary"
              }`}
              onClick={() => setRoleFilter(r)}
            >
              {r}
            </button>
          ))}
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            fetchUsers();
          }}
          className="d-flex gap-2"
          style={{ maxWidth: "350px" }}
        >
          <input
            type="text"
            className="form-control form-control-sm"
            placeholder="Search by name or email..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
          <button type="submit" className="btn btn-sm btn-primary">
            Search
          </button>
        </form>
      </div>

      {/* Users Table */}
      <div className="card border-0 shadow-sm rounded-4">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th>User Details</th>
                <th>Role</th>
                <th>Phone</th>
                <th>Status</th>
                <th>Joined Date</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="text-center py-4">
                    Loading users...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-4 text-muted">
                    No users found for this role filter.
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u._id}>
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        <img
                          src={
                            u.avatar ||
                            "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100"
                          }
                          alt={u.name}
                          className="rounded-circle"
                          style={{ width: "36px", height: "36px", objectFit: "cover" }}
                        />
                        <div>
                          <strong>{u.name}</strong>
                          <div className="small text-muted">{u.email}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={`badge text-uppercase ${
                        u.role === "admin" ? "bg-danger" :
                        u.role === "employer" ? "bg-primary" :
                        u.role === "recruiter" ? "bg-info text-dark" :
                        u.role === "trainer" ? "bg-warning text-dark" :
                        u.role === "college" ? "bg-purple bg-opacity-75 text-white" : "bg-secondary"
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td>{u.phone || "N/A"}</td>
                    <td>
                      <span
                        className={`badge ${
                          u.isActive ? "bg-success" : "bg-danger"
                        }`}
                      >
                        {u.isActive ? "Active" : "Suspended"}
                      </span>
                    </td>
                    <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                    <td className="text-end">
                      <button
                        onClick={() => handleToggleStatus(u._id, u.isActive)}
                        className="btn btn-sm btn-outline-secondary me-2"
                      >
                        {u.isActive ? "Suspend" : "Activate"}
                      </button>
                      <button
                        onClick={() => handleDelete(u._id)}
                        className="btn btn-sm btn-outline-danger"
                        title="Delete User"
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add User Modal */}
      {showModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content rounded-4 border-0 shadow">
              <div className="modal-header border-bottom">
                <h5 className="modal-title fw-bold">Create New Platform User</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <form onSubmit={handleCreateUser}>
                <div className="modal-body space-y-3">
                  <div className="mb-3">
                    <label className="form-label small fw-bold">Full Name</label>
                    <input
                      type="text"
                      required
                      className="form-control"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. John Doe"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label small fw-bold">Email Address</label>
                    <input
                      type="email"
                      required
                      className="form-control"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="e.g. john@example.com"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label small fw-bold">Phone Number</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="e.g. +91 9876543210"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label small fw-bold">Platform Role</label>
                    <select
                      className="form-select"
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    >
                      <option value="candidate">Candidate (Job Seeker)</option>
                      <option value="employer">Employer (Company)</option>
                      <option value="recruiter">Recruiter / Agency</option>
                      <option value="trainer">Trainer (Faculty)</option>
                      <option value="college">College / University</option>
                      <option value="admin">System Admin</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label small fw-bold">Password</label>
                    <input
                      type="password"
                      required
                      minLength={6}
                      className="form-control"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      placeholder="Min 6 characters"
                    />
                  </div>
                </div>
                <div className="modal-footer border-top">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="btn btn-primary"
                  >
                    {submitting ? "Creating..." : "Create User"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}