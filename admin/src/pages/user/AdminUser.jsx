import React, { useState, useEffect } from "react";

export default function AdminUser() {
  const [users, setUsers] = useState([]);
  const [roleFilter, setRoleFilter] = useState("All");
  const [keyword, setKeyword] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const url = new URL(
        `${process.env.REACT_APP_BACKEND_SERVER || "http://localhost:5001"}/api/admin/users`
      );
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
      const res = await fetch(
        `${process.env.REACT_APP_BACKEND_SERVER || "http://localhost:5001"}/api/admin/users/${id}/toggle-status`,
        {
          method: "PATCH",
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        }
      );
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
      const res = await fetch(
        `${process.env.REACT_APP_BACKEND_SERVER || "http://localhost:5001"}/api/admin/users/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        }
      );
      const data = await res.json();
      if (data.success) {
        setUsers((prev) => prev.filter((u) => u._id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const roles = ["All", "candidate", "employer", "recruiter", "trainer", "college", "admin"];

  return (
    <div className="container-fluid px-3 px-lg-4 py-4">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <h3 className="fw-bold mb-1">User Management (6 Platform Roles)</h3>
          <p className="text-muted small mb-0">
            Control accounts for Candidates, Employers, Recruiters, Trainers, Colleges, and Admins.
          </p>
        </div>

        {/* Role Filters */}
        <div className="btn-group">
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
      </div>

      {/* Search Bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          fetchUsers();
        }}
        className="mb-4 d-flex gap-2 max-w-md"
        style={{ maxWidth: "400px" }}
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
                      <span className="badge bg-secondary text-uppercase">{u.role}</span>
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
    </div>
  );
}