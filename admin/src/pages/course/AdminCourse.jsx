import React, { useState, useEffect } from "react";

export default function AdminCourse() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `${process.env.REACT_APP_BACKEND_SERVER || "http://localhost:5001"}/api/courses?limit=100`
      );
      const data = await res.json();
      if (data.success) {
        setCourses(data.data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this training program?")) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${process.env.REACT_APP_BACKEND_SERVER || "http://localhost:5001"}/api/courses/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        }
      );
      const data = await res.json();
      if (data.success) {
        setCourses((prev) => prev.filter((c) => c._id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container-fluid px-3 px-lg-4 py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="fw-bold mb-1">Non-IT Training Programs</h3>
          <p className="text-muted small mb-0">Manage training bootcamps, pricing, duration, and certificates.</p>
        </div>
      </div>

      <div className="card border-0 shadow-sm rounded-4">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th>Course Title</th>
                <th>Category</th>
                <th>Duration & Mode</th>
                <th>Price</th>
                <th>Status</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="text-center py-4">Loading courses...</td>
                </tr>
              ) : courses.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-4 text-muted">No courses found.</td>
                </tr>
              ) : (
                courses.map((c) => (
                  <tr key={c._id}>
                    <td>
                      <strong>{c.title}</strong>
                      <div className="small text-muted">{c.skillLevel}</div>
                    </td>
                    <td>{c.category}</td>
                    <td>{c.duration} • {c.mode}</td>
                    <td>
                      <strong>₹{(c.discountPrice || c.price || 0).toLocaleString("en-IN")}</strong>
                    </td>
                    <td>
                      <span className="badge bg-success">{c.status || "published"}</span>
                    </td>
                    <td className="text-end">
                      <button
                        onClick={() => handleDelete(c._id)}
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
