import React, { useState, useEffect } from "react";

export default function AdminJob() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `${process.env.REACT_APP_BACKEND_SERVER || "http://localhost:5001"}/api/jobs?limit=100`
      );
      const data = await res.json();
      if (data.success) {
        setJobs(data.data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      const token = localStorage.getItem("token");
      const nextStatus = currentStatus === "active" ? "closed" : "active";
      const res = await fetch(
        `${process.env.REACT_APP_BACKEND_SERVER || "http://localhost:5001"}/api/jobs/${id}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
          },
          body: JSON.stringify({ status: nextStatus }),
        }
      );
      const data = await res.json();
      if (data.success) {
        setJobs((prev) =>
          prev.map((j) => (j._id === id ? { ...j, status: nextStatus } : j))
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this job listing?")) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${process.env.REACT_APP_BACKEND_SERVER || "http://localhost:5001"}/api/jobs/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        }
      );
      const data = await res.json();
      if (data.success) {
        setJobs((prev) => prev.filter((j) => j._id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container-fluid px-3 px-lg-4 py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="fw-bold mb-1">Job Vacancies Moderation</h3>
          <p className="text-muted small mb-0">Manage employer & recruiter posted Non-IT openings.</p>
        </div>
      </div>

      <div className="card border-0 shadow-sm rounded-4">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th>Job Title & Company</th>
                <th>Category</th>
                <th>Location</th>
                <th>Offered CTC</th>
                <th>Status</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="text-center py-4">Loading jobs...</td>
                </tr>
              ) : jobs.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-4 text-muted">No jobs posted.</td>
                </tr>
              ) : (
                jobs.map((j) => (
                  <tr key={j._id}>
                    <td>
                      <strong>{j.title}</strong>
                      <div className="small text-muted">{j.companyName || "Employer"}</div>
                    </td>
                    <td>{j.category}</td>
                    <td>{j.location?.city || "Pan India"}</td>
                    <td>
                      ₹{((j.salary?.min || 300000) / 100000).toFixed(1)} - ₹{((j.salary?.max || 500000) / 100000).toFixed(1)} LPA
                    </td>
                    <td>
                      <span className={`badge ${j.status === "active" ? "bg-success" : "bg-secondary"}`}>
                        {j.status}
                      </span>
                    </td>
                    <td className="text-end">
                      <button
                        onClick={() => handleToggleStatus(j._id, j.status)}
                        className="btn btn-sm btn-outline-secondary me-2"
                      >
                        {j.status === "active" ? "Close" : "Reactivate"}
                      </button>
                      <button
                        onClick={() => handleDelete(j._id)}
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
