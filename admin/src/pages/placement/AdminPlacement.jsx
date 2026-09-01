import React, { useState, useEffect } from "react";

export default function AdminPlacement() {
  const [placements, setPlacements] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPlacements = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `${process.env.REACT_APP_BACKEND_SERVER || "http://localhost:5001"}/api/placements`
      );
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
  }, []);

  return (
    <div className="container-fluid px-3 px-lg-4 py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="fw-bold mb-1">Master Placements & CTC Ledger</h3>
          <p className="text-muted small mb-0">Record of verified candidate offers and CTC packages.</p>
        </div>
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
                      <strong>{p.candidate?.name || "Placed Candidate"}</strong>
                      <div className="small text-muted">{p.candidate?.email}</div>
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
    </div>
  );
}
