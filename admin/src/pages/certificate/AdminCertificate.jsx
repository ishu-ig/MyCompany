import React, { useState, useEffect } from "react";

export default function AdminCertificate() {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState("");

  const [formData, setFormData] = useState({
    candidateName: "Rahul Sharma",
    candidateEmail: "rahul.sharma@gmail.com",
    courseTitle: "Business Executive Master Track",
    courseCategory: "B2B Sales",
    certificateNumber: `TN-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
    verificationCode: `CERT-EXEC-${Math.floor(1000 + Math.random() * 9000)}`,
    grade: "Distinction (94%)",
    score: 94,
  });

  const backendUrl = process.env.REACT_APP_BACKEND_SERVER || "http://localhost:8000";

  const fetchCertificates = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${backendUrl}/api/certificates`);
      const data = await res.json();
      if (data.success) {
        setCertificates(data.data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCertificates();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleIssueCertificate = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMsg("");
    try {
      const token = localStorage.getItem("token");
      // Find candidate by email or create mock candidate structure
      const payload = {
        candidateName: formData.candidateName,
        candidateEmail: formData.candidateEmail,
        courseTitle: formData.courseTitle,
        courseCategory: formData.courseCategory,
        certificateNumber: formData.certificateNumber,
        verificationCode: formData.verificationCode.toUpperCase().trim(),
        grade: formData.grade,
        score: Number(formData.score) || 90,
      };

      const res = await fetch(`${backendUrl}/api/certificates`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        setMsg("Certificate issued and registered onto public ledger successfully!");
        setShowModal(false);
        fetchCertificates();
      } else {
        setMsg(data.message || "Failed to issue certificate");
      }
    } catch (err) {
      console.error(err);
      setMsg("Server error issuing certificate");
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
          <h3 className="fw-bold mb-1">Verifiable Credentials Registry</h3>
          <p className="text-muted small mb-0">Public credentials issued to CareerPlacify Non-IT bootcamp graduates.</p>
        </div>
        <button
          onClick={() => {
            setFormData({
              candidateName: "",
              candidateEmail: "",
              courseTitle: "Business Executive Master Track",
              courseCategory: "B2B Sales",
              certificateNumber: `TN-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
              verificationCode: `CERT-EXEC-${Math.floor(1000 + Math.random() * 9000)}`,
              grade: "Distinction (92%)",
              score: 92,
            });
            setShowModal(true);
          }}
          className="btn btn-primary d-flex align-items-center gap-2"
        >
          <i className="bi bi-patch-check-fill"></i>
          <span>Issue New Credential</span>
        </button>
      </div>

      <div className="card border-0 shadow-sm rounded-4">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th>Recipient Candidate</th>
                <th>Certified Program</th>
                <th>Certificate Number</th>
                <th>Verification Code</th>
                <th>Grade</th>
                <th className="text-end">Public Verification</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="text-center py-4">Loading certificates...</td>
                </tr>
              ) : certificates.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-4 text-muted">No certificates issued yet.</td>
                </tr>
              ) : (
                certificates.map((cert) => (
                  <tr key={cert._id}>
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        <img
                          src={
                            cert.candidate?.avatar ||
                            "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100"
                          }
                          alt={cert.candidate?.name || cert.candidateName}
                          className="rounded-circle"
                          style={{ width: "32px", height: "32px", objectFit: "cover" }}
                        />
                        <div>
                          <strong>{cert.candidate?.name || cert.candidateName || "Recipient"}</strong>
                          <div className="small text-muted">{cert.candidate?.email || cert.candidateEmail}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="fw-semibold text-primary">{cert.course?.title || cert.courseTitle || "Non-IT Training Track"}</span>
                      <div className="small text-muted">{cert.course?.category || cert.courseCategory || "Career Track"}</div>
                    </td>
                    <td><code>{cert.certificateNumber}</code></td>
                    <td>
                      <span className="badge bg-primary-subtle text-primary border px-2 font-monospace">
                        {cert.verificationCode}
                      </span>
                    </td>
                    <td>
                      <span className="badge bg-success">{cert.grade || "Distinction"}</span>
                    </td>
                    <td className="text-end">
                      <a
                        href={`http://localhost:3000/verify?id=${encodeURIComponent(cert.verificationCode || cert.certificateNumber)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="btn btn-sm btn-outline-primary"
                      >
                        <i className="bi bi-shield-check me-1"></i> Verify on Client
                      </a>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Issue Certificate Modal */}
      {showModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content rounded-4 border-0 shadow">
              <div className="modal-header border-bottom">
                <h5 className="modal-title fw-bold">Issue Official Digital Credential</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <form onSubmit={handleIssueCertificate}>
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
                    <div className="col-md-8">
                      <label className="form-label small fw-bold">Certified Training Program</label>
                      <input
                        type="text"
                        required
                        className="form-control"
                        value={formData.courseTitle}
                        onChange={(e) => setFormData({ ...formData, courseTitle: e.target.value })}
                        placeholder="e.g. B2B Sales & Business Development Master Track"
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label small fw-bold">Category</label>
                      <select
                        className="form-select"
                        value={formData.courseCategory}
                        onChange={(e) => setFormData({ ...formData, courseCategory: e.target.value })}
                      >
                        <option value="B2B Sales">B2B Sales</option>
                        <option value="HR & Talent Acquisition">HR & Talent Acquisition</option>
                        <option value="Operations & Client Relations">Operations & Client Relations</option>
                        <option value="Digital Marketing">Digital Marketing</option>
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-bold">Certificate Number (Alphanumeric)</label>
                      <input
                        type="text"
                        required
                        className="form-control font-monospace"
                        value={formData.certificateNumber}
                        onChange={(e) => setFormData({ ...formData, certificateNumber: e.target.value })}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-bold">Verification Code (Unique Public ID)</label>
                      <input
                        type="text"
                        required
                        className="form-control font-monospace text-uppercase"
                        value={formData.verificationCode}
                        onChange={(e) => setFormData({ ...formData, verificationCode: e.target.value })}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-bold">Final Grade / Distinction</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.grade}
                        onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                        placeholder="e.g. Distinction (92%)"
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-bold">Evaluation Score (%)</label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        className="form-control"
                        value={formData.score}
                        onChange={(e) => setFormData({ ...formData, score: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
                <div className="modal-footer border-top">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" disabled={submitting} className="btn btn-primary">
                    {submitting ? "Issuing..." : "Issue & Register Credential"}
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