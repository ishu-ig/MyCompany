import React, { useState, useEffect } from "react";

export default function AdminContactUs() {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  const fetchEnquiries = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${process.env.REACT_APP_BACKEND_SERVER || "http://localhost:5001"}/api/contact`,
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        }
      );
      const data = await res.json();
      if (data.success) {
        setEnquiries(data.data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const handleResolve = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${process.env.REACT_APP_BACKEND_SERVER || "http://localhost:5001"}/api/contact/${id}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
          },
          body: JSON.stringify({ status: "resolved" }),
        }
      );
      const data = await res.json();
      if (data.success) {
        setEnquiries((prev) =>
          prev.map((e) => (e._id === id ? { ...e, status: "resolved" } : e))
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filteredEnquiries = enquiries.filter((e) => {
    if (filter === "all") return true;
    if (filter === "resolved") return e.status === "resolved";
    if (filter === "new") return e.status !== "resolved";
    return (
      (e.userType && e.userType.toLowerCase().includes(filter.toLowerCase())) ||
      (e.roleType && e.roleType.toLowerCase().includes(filter.toLowerCase()))
    );
  });

  return (
    <div className="container-fluid px-3 px-lg-4 py-4">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <h3 className="fw-bold mb-1">Inbound Contact & Corporate Leads</h3>
          <p className="text-muted small mb-0">Review inquiries submitted by enterprise employers, colleges, and candidates.</p>
        </div>
        <div className="btn-group">
          <button
            onClick={() => setFilter("all")}
            className={`btn btn-sm ${filter === "all" ? "btn-primary" : "btn-outline-secondary"}`}
          >
            All Leads ({enquiries.length})
          </button>
          <button
            onClick={() => setFilter("new")}
            className={`btn btn-sm ${filter === "new" ? "btn-primary" : "btn-outline-secondary"}`}
          >
            Pending
          </button>
          <button
            onClick={() => setFilter("resolved")}
            className={`btn btn-sm ${filter === "resolved" ? "btn-primary" : "btn-outline-secondary"}`}
          >
            Resolved
          </button>
        </div>
      </div>

      <div className="card border-0 shadow-sm rounded-4">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th>Sender & Organization</th>
                <th>Role / Category</th>
                <th>Subject & Requirements</th>
                <th>Date Received</th>
                <th>Status</th>
                <th className="text-end">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="text-center py-4">Loading enquiries...</td>
                </tr>
              ) : filteredEnquiries.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-4 text-muted">No enquiries found.</td>
                </tr>
              ) : (
                filteredEnquiries.map((e) => (
                  <tr key={e._id}>
                    <td>
                      <strong>{e.name}</strong>
                      {e.organization && (
                        <div className="small text-primary fw-semibold">
                          <i className="bi bi-building me-1"></i>
                          {e.organization}
                        </div>
                      )}
                      <div className="small text-muted">{e.email} • {e.phone || "No phone"}</div>
                    </td>
                    <td>
                      <span className="badge bg-indigo-subtle text-indigo border text-capitalize">
                        {e.userType || e.roleType || "Corporate Partner"}
                      </span>
                    </td>
                    <td style={{ maxWidth: "320px" }}>
                      <strong className="d-block">{e.subject || "Partnership Inquiry"}</strong>
                      <p className="small text-secondary mb-0" style={{ whiteSpace: "pre-wrap" }}>
                        {e.message}
                      </p>
                    </td>
                    <td>{new Date(e.createdAt).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })}</td>
                    <td>
                      <span className={`badge ${e.status === "resolved" ? "bg-success" : "bg-warning text-dark"}`}>
                        {e.status === "resolved" ? "✓ Resolved" : "Pending Review"}
                      </span>
                    </td>
                    <td className="text-end">
                      {e.status !== "resolved" ? (
                        <button
                          onClick={() => handleResolve(e._id)}
                          className="btn btn-sm btn-success"
                        >
                          Mark Resolved
                        </button>
                      ) : (
                        <span className="text-muted small">Completed</span>
                      )}
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