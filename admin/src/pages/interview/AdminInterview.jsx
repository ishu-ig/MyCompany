import React, { useState, useEffect } from "react";

export default function AdminInterview() {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState("");

  const [formData, setFormData] = useState({
    candidateName: "Rahul Sharma",
    candidateEmail: "rahul.sharma@gmail.com",
    jobTitle: "Business Development Executive",
    employerName: "Nexus Global",
    interviewType: "HR Round",
    scheduledDate: new Date(Date.now() + 86400000).toISOString().split("T")[0],
    scheduledTime: "11:00 AM",
    meetingLink: "https://meet.google.com/abc-defg-hij",
  });

  const backendUrl = process.env.REACT_APP_BACKEND_SERVER || "http://localhost:8000";

  const fetchInterviews = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await fetch(`${backendUrl}/api/interviews`, {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      });
      const data = await res.json();
      if (data.success) {
        setInterviews(data.data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInterviews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleScheduleInterview = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMsg("");
    try {
      const token = localStorage.getItem("token");
      const payload = {
        candidateName: formData.candidateName,
        candidateEmail: formData.candidateEmail,
        jobTitle: formData.jobTitle,
        employerName: formData.employerName,
        interviewType: formData.interviewType,
        scheduledDate: formData.scheduledDate,
        scheduledTime: formData.scheduledTime,
        meetingLink: formData.meetingLink,
      };

      const res = await fetch(`${backendUrl}/api/interviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        setMsg("Interview scheduled successfully!");
        setShowModal(false);
        fetchInterviews();
      } else {
        setMsg(data.message || "Failed to schedule interview");
      }
    } catch (err) {
      console.error(err);
      setMsg("Server error scheduling interview");
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
          <h3 className="fw-bold mb-1">Corporate Interviews Oversight</h3>
          <p className="text-muted small mb-0">Monitor scheduled video rounds, live simulation calls, and candidate ratings.</p>
        </div>
        <button
          onClick={() => {
            setFormData({
              candidateName: "",
              candidateEmail: "",
              jobTitle: "Business Development Executive",
              employerName: "Nexus Global",
              interviewType: "HR Round",
              scheduledDate: new Date(Date.now() + 86400000).toISOString().split("T")[0],
              scheduledTime: "11:00 AM",
              meetingLink: "https://meet.google.com/abc-defg-hij",
            });
            setShowModal(true);
          }}
          className="btn btn-primary d-flex align-items-center gap-2"
        >
          <i className="bi bi-camera-video-fill"></i>
          <span>Schedule New Interview</span>
        </button>
      </div>

      <div className="card border-0 shadow-sm rounded-4">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th>Candidate</th>
                <th>Target Role & Round</th>
                <th>Employer</th>
                <th>Scheduled Date & Time</th>
                <th>Status</th>
                <th>Score</th>
                <th className="text-end">Meeting Link</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className="text-center py-4">Loading interviews...</td>
                </tr>
              ) : interviews.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-4 text-muted">No scheduled interviews.</td>
                </tr>
              ) : (
                interviews.map((item) => (
                  <tr key={item._id}>
                    <td>
                      <strong>{item.candidate?.name || item.candidateName || "Candidate"}</strong>
                      <div className="small text-muted">{item.candidate?.email || item.candidateEmail}</div>
                    </td>
                    <td>
                      <div>{item.job?.title || item.jobTitle}</div>
                      <small className="text-primary">{item.interviewType || "Simulation Round"}</small>
                    </td>
                    <td>{item.employer?.name || item.employerName || "Hiring Partner"}</td>
                    <td>
                      {new Date(item.scheduledDate).toLocaleDateString()} at {item.scheduledTime || "11:00 AM"}
                    </td>
                    <td>
                      <span className="badge bg-info text-capitalize">{item.status || "scheduled"}</span>
                    </td>
                    <td>
                      {item.rating ? (
                        <span className="text-warning fw-bold">★ {item.rating}/5</span>
                      ) : (
                        <span className="text-muted">Pending</span>
                      )}
                    </td>
                    <td className="text-end">
                      {item.meetingLink ? (
                        <a
                          href={item.meetingLink}
                          target="_blank"
                          rel="noreferrer"
                          className="btn btn-sm btn-primary"
                        >
                          Join Call
                        </a>
                      ) : (
                        <span className="text-muted">-</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Schedule Interview Modal */}
      {showModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content rounded-4 border-0 shadow">
              <div className="modal-header border-bottom">
                <h5 className="modal-title fw-bold">Schedule Corporate Interview Round</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <form onSubmit={handleScheduleInterview}>
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
                        placeholder="e.g. Rahul Sharma"
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
                        placeholder="e.g. rahul.sharma@gmail.com"
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-bold">Job Role / Designation</label>
                      <input
                        type="text"
                        required
                        className="form-control"
                        value={formData.jobTitle}
                        onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                        placeholder="e.g. Inside Sales Specialist"
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-bold">Hiring Employer / Partner</label>
                      <input
                        type="text"
                        required
                        className="form-control"
                        value={formData.employerName}
                        onChange={(e) => setFormData({ ...formData, employerName: e.target.value })}
                        placeholder="e.g. CloudScale Tech"
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label small fw-bold">Interview Round</label>
                      <select
                        className="form-select"
                        value={formData.interviewType}
                        onChange={(e) => setFormData({ ...formData, interviewType: e.target.value })}
                      >
                        <option value="Screening">Screening Round</option>
                        <option value="HR Round">HR & Culture Fit Round</option>
                        <option value="Technical">Technical & Tool Drill</option>
                        <option value="Managerial">Managerial Round</option>
                        <option value="Final Round">Final Round</option>
                      </select>
                    </div>
                    <div className="col-md-4">
                      <label className="form-label small fw-bold">Date</label>
                      <input
                        type="date"
                        required
                        className="form-control"
                        value={formData.scheduledDate}
                        onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label small fw-bold">Time</label>
                      <input
                        type="text"
                        required
                        className="form-control"
                        value={formData.scheduledTime}
                        onChange={(e) => setFormData({ ...formData, scheduledTime: e.target.value })}
                        placeholder="e.g. 11:30 AM"
                      />
                    </div>
                    <div className="col-12">
                      <label className="form-label small fw-bold">Meeting URL (Google Meet / Zoom / MS Teams)</label>
                      <input
                        type="url"
                        required
                        className="form-control"
                        value={formData.meetingLink}
                        onChange={(e) => setFormData({ ...formData, meetingLink: e.target.value })}
                        placeholder="https://meet.google.com/..."
                      />
                    </div>
                  </div>
                </div>
                <div className="modal-footer border-top">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" disabled={submitting} className="btn btn-primary">
                    {submitting ? "Scheduling..." : "Schedule Interview"}
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
