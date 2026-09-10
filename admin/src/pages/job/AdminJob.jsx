import React, { useState, useEffect } from "react";

export default function AdminJob() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [msg, setMsg] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    companyName: "",
    category: "Business Development Executive",
    city: "Pan India",
    salaryMin: 350000,
    salaryMax: 600000,
    description: "",
    workplaceType: "hybrid",
    experienceLevel: "fresher",
  });

  const backendUrl = process.env.REACT_APP_BACKEND_SERVER || "http://localhost:8000";

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${backendUrl}/api/jobs?limit=100`);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      const token = localStorage.getItem("token");
      const nextStatus = currentStatus === "active" ? "closed" : "active";
      const res = await fetch(`${backendUrl}/api/jobs/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify({ status: nextStatus }),
      });
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
      const res = await fetch(`${backendUrl}/api/jobs/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      });
      const data = await res.json();
      if (data.success) {
        setJobs((prev) => prev.filter((j) => j._id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleOpenEdit = (job) => {
    setEditingJob(job);
    setFormData({
      title: job.title || "",
      companyName: job.companyName || "",
      category: job.category || "B2B Sales",
      city: job.location?.city || "Pan India",
      salaryMin: job.salary?.min || 350000,
      salaryMax: job.salary?.max || 600000,
      description: job.description || "",
      workplaceType: job.workplaceType || "hybrid",
      experienceLevel: job.experienceLevel || "fresher",
    });
    setShowModal(true);
  };

  const handleOpenCreate = () => {
    setEditingJob(null);
    setFormData({
      title: "",
      companyName: "",
      category: "Business Development Executive",
      city: "Pan India",
      salaryMin: 350000,
      salaryMax: 600000,
      description: "",
      workplaceType: "hybrid",
      experienceLevel: "fresher",
    });
    setShowModal(true);
  };

  const handleSaveJob = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMsg("");
    try {
      const token = localStorage.getItem("token");
      const payload = {
        title: formData.title,
        companyName: formData.companyName,
        category: formData.category,
        location: { city: formData.city, state: "India", country: "India" },
        salary: { min: Number(formData.salaryMin), max: Number(formData.salaryMax), currency: "INR" },
        description: formData.description || "Exciting career opportunity at CareerPlacify partner firm.",
        workplaceType: formData.workplaceType,
        experienceLevel: formData.experienceLevel,
      };

      const url = editingJob ? `${backendUrl}/api/jobs/${editingJob._id}` : `${backendUrl}/api/jobs`;
      const method = editingJob ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        setMsg(editingJob ? "Job updated successfully!" : "Job vacancy created successfully!");
        setShowModal(false);
        fetchJobs();
      } else {
        setMsg(data.message || "Failed to save job");
      }
    } catch (err) {
      console.error(err);
      setMsg("Server error saving job");
    } finally {
      setSubmitting(false);
    }
  };

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
          <h3 className="fw-bold mb-1">Job Vacancies Moderation</h3>
          <p className="text-muted small mb-0">Manage employer & recruiter posted Non-IT openings.</p>
        </div>
        <button onClick={handleOpenCreate} className="btn btn-primary d-flex align-items-center gap-2">
          <i className="bi bi-plus-circle-fill"></i>
          <span>Post New Job</span>
        </button>
      </div>

      <div className="card border-0 shadow-sm rounded-4">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th>Job Title & Company</th>
                <th>Category</th>
                <th>Location & Type</th>
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
                    <td>
                      <span className="badge bg-primary-subtle text-primary border">{j.category}</span>
                    </td>
                    <td>
                      <div>{j.location?.city || "Pan India"}</div>
                      <small className="text-muted text-capitalize">{j.workplaceType || "On-site"}</small>
                    </td>
                    <td>
                      <strong>₹{((j.salary?.min || 300000) / 100000).toFixed(1)} - ₹{((j.salary?.max || 500000) / 100000).toFixed(1)} LPA</strong>
                    </td>
                    <td>
                      <span className={`badge ${j.status === "active" ? "bg-success" : "bg-secondary"}`}>
                        {j.status}
                      </span>
                    </td>
                    <td className="text-end">
                      <button
                        onClick={() => handleOpenEdit(j)}
                        className="btn btn-sm btn-outline-primary me-2"
                        title="Edit Job"
                      >
                        <i className="bi bi-pencil-square"></i>
                      </button>
                      <button
                        onClick={() => handleToggleStatus(j._id, j.status)}
                        className="btn btn-sm btn-outline-secondary me-2"
                      >
                        {j.status === "active" ? "Close" : "Reactivate"}
                      </button>
                      <button
                        onClick={() => handleDelete(j._id)}
                        className="btn btn-sm btn-outline-danger"
                        title="Delete Job"
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

      {/* Add / Edit Job Modal */}
      {showModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content rounded-4 border-0 shadow">
              <div className="modal-header border-bottom">
                <h5 className="modal-title fw-bold">
                  {editingJob ? "Edit Job Vacancy" : "Post New Job Vacancy"}
                </h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <form onSubmit={handleSaveJob}>
                <div className="modal-body space-y-3">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label small fw-bold">Job Title</label>
                      <input
                        type="text"
                        required
                        className="form-control"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        placeholder="e.g. Business Development Executive"
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-bold">Hiring Company Name</label>
                      <input
                        type="text"
                        required
                        className="form-control"
                        value={formData.companyName}
                        onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                        placeholder="e.g. Nexus Global"
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-bold">Job Category</label>
                      <select
                        className="form-select"
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      >
                        <option value="Business Development Executive">Business Development Executive</option>
                        <option value="Sales Executive">Sales Executive</option>
                        <option value="HR Recruiter">HR Recruiter</option>
                        <option value="Talent Acquisition Executive">Talent Acquisition Executive</option>
                        <option value="Operations Executive">Operations Executive</option>
                        <option value="Marketing Executive">Marketing Executive</option>
                        <option value="Customer Relationship Executive">Customer Relationship Executive</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-bold">City / Location</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        placeholder="e.g. Gurugram, Delhi NCR"
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-bold">Minimum CTC (₹ / annum)</label>
                      <input
                        type="number"
                        className="form-control"
                        value={formData.salaryMin}
                        onChange={(e) => setFormData({ ...formData, salaryMin: e.target.value })}
                        placeholder="350000"
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-bold">Maximum CTC (₹ / annum)</label>
                      <input
                        type="number"
                        className="form-control"
                        value={formData.salaryMax}
                        onChange={(e) => setFormData({ ...formData, salaryMax: e.target.value })}
                        placeholder="600000"
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-bold">Workplace Type</label>
                      <select
                        className="form-select"
                        value={formData.workplaceType}
                        onChange={(e) => setFormData({ ...formData, workplaceType: e.target.value })}
                      >
                        <option value="on-site">On-site</option>
                        <option value="hybrid">Hybrid</option>
                        <option value="remote">Remote</option>
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-bold">Experience Level</label>
                      <select
                        className="form-select"
                        value={formData.experienceLevel}
                        onChange={(e) => setFormData({ ...formData, experienceLevel: e.target.value })}
                      >
                        <option value="fresher">Fresher (0 Years)</option>
                        <option value="1-3 years">1-3 Years</option>
                        <option value="3-5 years">3-5 Years</option>
                      </select>
                    </div>
                    <div className="col-12">
                      <label className="form-label small fw-bold">Job Role Summary & Requirements</label>
                      <textarea
                        rows="3"
                        className="form-control"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Key responsibilities, required skills, tools..."
                      ></textarea>
                    </div>
                  </div>
                </div>
                <div className="modal-footer border-top">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" disabled={submitting} className="btn btn-primary">
                    {submitting ? "Saving..." : editingJob ? "Save Changes" : "Create Job Vacancy"}
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
