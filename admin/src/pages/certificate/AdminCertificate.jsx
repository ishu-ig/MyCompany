import React, { useState, useEffect } from "react";

export default function AdminCertificate() {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCertificates = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `${process.env.REACT_APP_BACKEND_SERVER || "http://localhost:5001"}/api/certificates`
      );
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
  }, []);

  return (
    <div className="container-fluid px-3 px-lg-4 py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="fw-bold mb-1">Verifiable Credentials Registry</h3>
          <p className="text-muted small mb-0">Public credentials issued to TalentNestro Non-IT bootcamp graduates.</p>
        </div>
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
                          alt={cert.candidate?.name}
                          className="rounded-circle"
                          style={{ width: "32px", height: "32px", objectFit: "cover" }}
                        />
                        <div>
                          <strong>{cert.candidate?.name || "Recipient"}</strong>
                          <div className="small text-muted">{cert.candidate?.email}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="fw-semibold text-primary">{cert.course?.title || "Non-IT Training Track"}</span>
                      <div className="small text-muted">{cert.course?.category || "Career Track"}</div>
                    </td>
                    <td><code>{cert.certificateNumber}</code></td>
                    <td>
                      <span className="badge bg-primary-subtle text-primary border px-2">
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
    </div>
  );
}