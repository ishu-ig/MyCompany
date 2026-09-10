import React, { useState, useEffect } from "react";

export default function AdminCourse() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    category: "Business Development",
    duration: "6 Weeks",
    mode: "online",
    price: 24999,
    discountPrice: 14999,
    skillLevel: "Beginner to Advanced",
    description: "",
    status: "published",
  });

  const backendUrl = process.env.REACT_APP_BACKEND_SERVER || "http://localhost:8000";

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${backendUrl}/api/courses?limit=100`);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this training program?")) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${backendUrl}/api/courses/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      });
      const data = await res.json();
      if (data.success) {
        setCourses((prev) => prev.filter((c) => c._id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleOpenEdit = (course) => {
    setEditingCourse(course);
    setFormData({
      title: course.title || "",
      category: course.category || "B2B Sales",
      duration: course.duration || "6 Weeks",
      mode: course.mode || "online",
      price: course.price || 24999,
      discountPrice: course.discountPrice || 14999,
      skillLevel: course.skillLevel || "Beginner to Advanced",
      description: course.description || "",
      status: course.status || "published",
    });
    setShowModal(true);
  };

  const handleOpenCreate = () => {
    setEditingCourse(null);
    setFormData({
      title: "",
      category: "Business Development",
      duration: "6 Weeks",
      mode: "online",
      price: 24999,
      discountPrice: 14999,
      skillLevel: "Beginner to Advanced",
      description: "",
      status: "published",
    });
    setShowModal(true);
  };

  const handleSaveCourse = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMsg("");
    try {
      const token = localStorage.getItem("token");
      const payload = {
        title: formData.title,
        category: formData.category,
        shortDescription: formData.shortDescription || formData.title,
        duration: formData.duration || "6 Weeks",
        mode: formData.mode || "Hybrid",
        price: Number(formData.price) || 24999,
        discountPrice: Number(formData.discountPrice) || 14999,
        skillLevel: formData.skillLevel || "All Levels",
        description: formData.description || "Comprehensive Train-and-Hire corporate readiness track.",
        status: formData.status || "published",
      };

      const url = editingCourse
        ? `${backendUrl}/api/courses/${editingCourse._id}`
        : `${backendUrl}/api/courses`;
      const method = editingCourse ? "PUT" : "POST";

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
        setMsg(editingCourse ? "Course updated successfully!" : "Course created successfully!");
        setShowModal(false);
        fetchCourses();
      } else {
        setMsg(data.message || "Failed to save course");
      }
    } catch (err) {
      console.error(err);
      setMsg("Server error saving course");
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
          <h3 className="fw-bold mb-1">Non-IT Training Programs & Tracks</h3>
          <p className="text-muted small mb-0">Manage training bootcamps, pricing, duration, and certificates.</p>
        </div>
        <button onClick={handleOpenCreate} className="btn btn-primary d-flex align-items-center gap-2">
          <i className="bi bi-mortarboard-fill"></i>
          <span>Add New Course</span>
        </button>
      </div>

      <div className="card border-0 shadow-sm rounded-4">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th>Course Title</th>
                <th>Category</th>
                <th>Duration & Mode</th>
                <th>Pricing</th>
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
                    <td>
                      <span className="badge bg-indigo-subtle text-primary border">{c.category}</span>
                    </td>
                    <td>{c.duration} • <span className="text-capitalize">{c.mode}</span></td>
                    <td>
                      <strong>₹{(c.discountPrice || c.price || 0).toLocaleString("en-IN")}</strong>
                      {c.discountPrice && c.price && c.discountPrice < c.price && (
                        <small className="text-muted text-decoration-line-through ms-2">
                          ₹{c.price.toLocaleString("en-IN")}
                        </small>
                      )}
                    </td>
                    <td>
                      <span className={`badge ${c.status === "published" ? "bg-success" : "bg-warning text-dark"}`}>
                        {c.status || "published"}
                      </span>
                    </td>
                    <td className="text-end">
                      <button
                        onClick={() => handleOpenEdit(c)}
                        className="btn btn-sm btn-outline-primary me-2"
                        title="Edit Course"
                      >
                        <i className="bi bi-pencil-square"></i>
                      </button>
                      <button
                        onClick={() => handleDelete(c._id)}
                        className="btn btn-sm btn-outline-danger"
                        title="Delete Course"
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

      {/* Course Modal */}
      {showModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content rounded-4 border-0 shadow">
              <div className="modal-header border-bottom">
                <h5 className="modal-title fw-bold">
                  {editingCourse ? "Edit Training Program" : "Create New Training Track"}
                </h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <form onSubmit={handleSaveCourse}>
                <div className="modal-body space-y-3">
                  <div className="row g-3">
                    <div className="col-md-8">
                      <label className="form-label small fw-bold">Program Title</label>
                      <input
                        type="text"
                        required
                        className="form-control"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        placeholder="e.g. B2B Sales & Business Development Master Track"
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label small fw-bold">Category</label>
                      <select
                        className="form-select"
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      >
                        <option value="Business Development">Business Development</option>
                        <option value="HR Executive">HR Executive</option>
                        <option value="Sales & Marketing">Sales & Marketing</option>
                        <option value="Business Executive">Business Executive</option>
                        <option value="Operations Executive">Operations Executive</option>
                        <option value="Customer Relationship">Customer Relationship</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div className="col-md-4">
                      <label className="form-label small fw-bold">Duration</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.duration}
                        onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                        placeholder="e.g. 6 Weeks"
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label small fw-bold">Delivery Mode</label>
                      <select
                        className="form-select"
                        value={formData.mode}
                        onChange={(e) => setFormData({ ...formData, mode: e.target.value })}
                      >
                        <option value="online">Online Live Drills</option>
                        <option value="offline">In-Person Campus</option>
                        <option value="hybrid">Hybrid</option>
                      </select>
                    </div>
                    <div className="col-md-4">
                      <label className="form-label small fw-bold">Status</label>
                      <select
                        className="form-select"
                        value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      >
                        <option value="published">Published (Live)</option>
                        <option value="draft">Draft</option>
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-bold">Original Price (₹)</label>
                      <input
                        type="number"
                        className="form-control"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-bold">Offer / Bootcamp Fee (₹)</label>
                      <input
                        type="number"
                        className="form-control"
                        value={formData.discountPrice}
                        onChange={(e) => setFormData({ ...formData, discountPrice: e.target.value })}
                      />
                    </div>
                    <div className="col-12">
                      <label className="form-label small fw-bold">Curriculum Overview & Practical Drills</label>
                      <textarea
                        rows="3"
                        className="form-control"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Topics covered, real-world case simulations, tool certifications..."
                      ></textarea>
                    </div>
                  </div>
                </div>
                <div className="modal-footer border-top">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" disabled={submitting} className="btn btn-primary">
                    {submitting ? "Saving..." : editingCourse ? "Save Changes" : "Create Training Track"}
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
