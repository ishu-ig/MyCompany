import React, { useState, useEffect } from "react";

export default function AdminPlacement() {
  const [placements, setPlacements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState("");

  const [formData, setFormData] = useState({
    candidateName: "Priya Sharma",
    candidateEmail: "priya.sharma@gmail.com",
    jobTitle: "Business Development Executive",
    companyName: "Nexus Global Technologies",
    offeredSalary: 550000,
    joiningDate: new Date().toISOString().split("T")[0],
    status: "offered",
  });

  const backendUrl = process.env.REACT_APP_BACKEND_SERVER || "http://localhost:8000";

  const fetchPlacements = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${backendUrl}/api/placements`);
      const data = await res.json();
      if (data.success) {
        setPlacements(data.data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlacements();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAddPlacement = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMsg("");
    try {
      const token = localStorage.getItem("token");
      const payload = {
        candidateName: formData.candidateName,
        candidateEmail: formData.candidateEmail,
        jobTitle: formData.jobTitle,
        companyName: formData.companyName,
        offeredSalary: Number(formData.offeredSalary),
        joiningDate: formData.joiningDate,
        status: formData.status,
      };

      const res = await fetch(`${backendUrl}/api/placements`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        setMsg("Placement record added successfully!");
        setShowModal(false);
        fetchPlacements();
      } else {
        setMsg(data.message || "Failed to record placement");
      }
    } catch (err) {
      console.error(err);
      setMsg("Server error recording placement");
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
          <h3 className="fw-bold mb-1">Master Placements & CTC Ledger</h3>
          <p className="text-muted small mb-0">Record of verified candidate offers and CTC packages.</p>
        </div>
        <button
          onClick={() => {
            setFormData({
              candidateName: "",
              candidateEmail: "",
              jobTitle: "Business Development Executive",
              companyName: "Nexus Global Technologies",
              offeredSalary: 550000,
              joiningDate: new Date().toISOString().split("T")[0],
              status: "offered",
            });
            setShowModal(true);
          }}
          className="btn btn-primary d-flex align-items-center gap-2"
        >
          <i className="bi bi-trophy-fill"></i>
          <span>Record New Placement</span>
        </button>
      </div>

      <div className="card border-0 shadow-sm rounded-4">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th>Placed Candidate</th>
                <th>Role & Corporate Employer</th>
                <th>Offered CTC (₹)</th>
                <th>Joining Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" className="text-center py-4">Loading placements...</td>
                </tr>
              ) : placements.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-4 text-muted">No placement records.</td>
                </tr>
              ) : (
                placements.map((p) => (
                  <tr key={p._id}>
                    <td>
                      <strong>{p.candidate?.name || p.candidateName || "Placed Candidate"}</strong>
                      <div className="small text-muted">{p.candidate?.email || p.candidateEmail}</div>
                    </td>
                    <td>
                      <div>{p.jobTitle || p.job?.title}</div>
                      <small className="text-primary">{p.companyName || p.employer?.name}</small>
                    </td>
                    <td>
                      <span className="badge bg-success-subtle text-success border border-success-subtle px-2 py-1">
                        ₹{((p.offeredSalary || 450000) / 100000).toFixed(1)} LPA
                      </span>
                    </td>
                    <td>
                      {p.joiningDate ? new Date(p.joiningDate).toLocaleDateString() : "Immediate"}
                    </td>
                    <td>
                      <span className="badge bg-success text-capitalize">{p.status || "joined"}</span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Record Placement Modal */}
      {showModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content rounded-4 border-0 shadow">
              <div className="modal-header border-bottom">
                <h5 className="modal-title fw-bold">Record Candidate Placement Offer</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <form onSubmit={handleAddPlacement}>
                <div className="modal-body space-y-3">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label small fw-bold">Candidate Full Name</label>
                      <input
                        type="text"
                        required
                        className="form-control"
                        value={formData.candidateName}
                        onChange={(e) => setFormData({ ...formData, candidateName: e.target.value })}
                        placeholder="e.g. Priya Sharma"
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-bold">Candidate Email</label>
                      <input
                        type="email"
                        required
                        className="form-control"
                        value={formData.candidateEmail}
                        onChange={(e) => setFormData({ ...formData, candidateEmail: e.target.value })}
                        placeholder="e.g. priya.sharma@gmail.com"
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-bold">Designation / Job Role</label>
                      <input
                        type="text"
                        required
                        className="form-control"
                        value={formData.jobTitle}
                        onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
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
                    <div className="col-md-4">
                      <label className="form-label small fw-bold">Annual CTC Offered (₹)</label>
                      <input
                        type="number"
                        required
                        className="form-control"
                        value={formData.offeredSalary}
                        onChange={(e) => setFormData({ ...formData, offeredSalary: e.target.value })}
                        placeholder="550000"
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label small fw-bold">Joining Date</label>
                      <input
                        type="date"
                        className="form-control"
                        value={formData.joiningDate}
                        onChange={(e) => setFormData({ ...formData, joiningDate: e.target.value })}
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label small fw-bold">Placement Status</label>
                      <select
                        className="form-select"
                        value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      >
                        <option value="offered">Offer Extended</option>
                        <option value="accepted">Offer Accepted</option>
                        <option value="joined">Joined Company</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="modal-footer border-top">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" disabled={submitting} className="btn btn-primary">
                    {submitting ? "Saving..." : "Record Placement"}
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
