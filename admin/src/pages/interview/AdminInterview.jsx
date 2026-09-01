import React, { useState, useEffect } from "react";

export default function AdminInterview() {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchInterviews = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${process.env.REACT_APP_BACKEND_SERVER || "http://localhost:5001"}/api/interviews`,
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        }
      );
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
  }, []);

  return (
    <div className="container-fluid px-3 px-lg-4 py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="fw-bold mb-1">Corporate Interviews Oversight</h3>
          <p className="text-muted small mb-0">Monitor scheduled video rounds and ratings.</p>
        </div>
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
                      <strong>{item.candidate?.name || "Candidate"}</strong>
                    </td>
                    <td>
                      <div>{item.job?.title}</div>
                      <small className="text-primary">{item.interviewType}</small>
                    </td>
                    <td>{item.employer?.name || "Employer"}</td>
                    <td>
                      {new Date(item.scheduledDate).toLocaleDateString()} at {item.scheduledTime}
                    </td>
                    <td>
                      <span className="badge bg-info text-capitalize">{item.status}</span>
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
    </div>
  );
}
