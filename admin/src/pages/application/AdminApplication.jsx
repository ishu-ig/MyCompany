import React, { useState, useEffect } from "react";

export default function AdminApplication() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${process.env.REACT_APP_BACKEND_SERVER || "http://localhost:5001"}/api/applications`,
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        }
      );
      const data = await res.json();
      if (data.success) {
        setApplications(data.data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleUpdateStatus = async (id, status) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${process.env.REACT_APP_BACKEND_SERVER || "http://localhost:5001"}/api/applications/${id}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
          },
          body: JSON.stringify({ status }),
        }
      );
      const data = await res.json();
      if (data.success) {
        setApplications((prev) =>
          prev.map((a) => (a._id === id ? { ...a, status } : a))
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filtered = applications.filter((a) => {
    if (filter === "all") return true;
    return a.status === filter;
  });

  return (
    <div className="container-fluid px-3 px-lg-4 py-4">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <h3 className="fw-bold mb-1">Candidate Applications & Bootcamp Registrations</h3>
          <p className="text-muted small mb-0">Track and override candidate job & cohort applications.</p>
        </div>
        <div className="btn-group">
          {["all", "applied", "shortlisted", "selected", "rejected"].map((st) => (
            <button
              key={st}
              onClick={() => setFilter(st)}
              className={`btn btn-sm text-capitalize ${filter === st ? "btn-primary" : "btn-outline-secondary"}`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      <div className="card border-0 shadow-sm rounded-4">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th>Applicant Candidate</th>
                <th>Target Track & Details</th>
                <th>Resume / Link</th>
                <th>Applied Date</th>
                <th>Status</th>
                <th className="text-end">Status Override</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="text-center py-4">Loading applications...</td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-4 text-muted">No applications found.</td>
                </tr>
              ) : (
                filtered.map((app) => (
                  <tr key={app._id}>
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        <img
                          src={
                            app.candidate?.avatar ||
                            "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100"
                          }
                          alt={app.candidate?.name}
                          className="rounded-circle"
                          style={{ width: "36px", height: "36px", objectFit: "cover" }}
                        />
                        <div>
                          <strong>{app.candidate?.name || "Candidate"}</strong>
                          <div className="small text-muted">{app.candidate?.email} • {app.candidate?.phone}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <strong>{app.job?.title || app.candidateProfile?.preferredRoles?.[0] || "Bootcamp Candidate"}</strong>
                      <div className="small text-muted">{app.coverLetter || app.employer?.name || "Train-and-Hire Cohort"}</div>
                    </td>
                    <td>
                      {app.resume ? (
                        <a
                          href={app.resume}
                          target="_blank"
                          rel="noreferrer"
                          className="btn btn-xs btn-outline-primary py-1 px-2 text-xs"
                        >
                          <i className="bi bi-file-earmark-pdf me-1"></i> View Resume
                        </a>
                      ) : (
                        <span className="text-muted small">Not uploaded</span>
                      )}
                    </td>
                    <td>{new Date(app.appliedAt).toLocaleDateString()}</td>
                    <td>
                      <span className={`badge text-capitalize ${
                        app.status === "selected" ? "bg-success" :
                        app.status === "rejected" ? "bg-danger" :
                        app.status === "shortlisted" ? "bg-warning text-dark" : "bg-primary"
                      }`}>
                        {app.status}
                      </span>
                    </td>
                    <td className="text-end">
                      <button
                        onClick={() => handleUpdateStatus(app._id, "shortlisted")}
                        className="btn btn-sm btn-outline-warning me-1"
                      >
                        Shortlist
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(app._id, "selected")}
                        className="btn btn-sm btn-outline-success me-1"
                      >
                        Select
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(app._id, "rejected")}
                        className="btn btn-sm btn-outline-danger"
                      >
                        Reject
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
