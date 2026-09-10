import React, { useState, useEffect } from "react";

export default function AdminBlog() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    category: "Interview Tips",
    author: "CareerPlacify Editorial",
    content: "",
    tags: "Interview Tips, B2B Sales, Placement",
    readTime: "5 min read",
  });

  const backendUrl = process.env.REACT_APP_BACKEND_SERVER || "http://localhost:8000";

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${backendUrl}/api/blogs`);
      const data = await res.json();
      if (data.success) {
        setBlogs(data.data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this career article?")) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${backendUrl}/api/blogs/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      });
      const data = await res.json();
      if (data.success) {
        setBlogs((prev) => prev.filter((b) => b._id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleOpenEdit = (blog) => {
    setEditingBlog(blog);
    setFormData({
      title: blog.title || "",
      category: blog.category || "Interview Prep",
      author: blog.author || "CareerPlacify Editorial",
      content: blog.content || "",
      tags: Array.isArray(blog.tags) ? blog.tags.join(", ") : (blog.tags || ""),
      readTime: blog.readTime || "5 min read",
    });
    setShowModal(true);
  };

  const handleOpenCreate = () => {
    setEditingBlog(null);
    setFormData({
      title: "",
      category: "Interview Tips",
      author: "CareerPlacify Editorial",
      content: "",
      tags: "Interview Tips, Non-IT Careers, Placement Drive",
      readTime: "5 min read",
    });
    setShowModal(true);
  };

  const handleSaveBlog = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMsg("");
    try {
      const token = localStorage.getItem("token");
      const payload = {
        title: formData.title,
        category: formData.category,
        author: formData.author,
        content: formData.content || "Valuable insights on non-IT career opportunities.",
        tags: formData.tags.split(",").map((t) => t.trim()),
        readTime: formData.readTime,
      };

      const url = editingBlog ? `${backendUrl}/api/blogs/${editingBlog._id}` : `${backendUrl}/api/blogs`;
      const method = editingBlog ? "PUT" : "POST";

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
        setMsg(editingBlog ? "Article updated successfully!" : "Article published successfully!");
        setShowModal(false);
        fetchBlogs();
      } else {
        setMsg(data.message || "Failed to save article");
      }
    } catch (err) {
      console.error(err);
      setMsg("Server error saving article");
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
          <h3 className="fw-bold mb-1">Career Resources & Articles</h3>
          <p className="text-muted small mb-0">Publish interview preparation tips and salary guides.</p>
        </div>
        <button onClick={handleOpenCreate} className="btn btn-primary d-flex align-items-center gap-2">
          <i className="bi bi-journal-plus"></i>
          <span>Write New Article</span>
        </button>
      </div>

      <div className="card border-0 shadow-sm rounded-4">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th>Article Title</th>
                <th>Category</th>
                <th>Author</th>
                <th>Published Date</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" className="text-center py-4">Loading articles...</td>
                </tr>
              ) : blogs.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-4 text-muted">No articles published.</td>
                </tr>
              ) : (
                blogs.map((b) => (
                  <tr key={b._id}>
                    <td>
                      <strong>{b.title}</strong>
                      <div className="small text-muted">{b.readTime || "4 min read"}</div>
                    </td>
                    <td><span className="badge bg-secondary">{b.category}</span></td>
                    <td>{b.author || "Editorial"}</td>
                    <td>{new Date(b.publishedAt || b.createdAt).toLocaleDateString()}</td>
                    <td className="text-end">
                      <button
                        onClick={() => handleOpenEdit(b)}
                        className="btn btn-sm btn-outline-primary me-2"
                        title="Edit Article"
                      >
                        <i className="bi bi-pencil-square"></i>
                      </button>
                      <button
                        onClick={() => handleDelete(b._id)}
                        className="btn btn-sm btn-outline-danger"
                        title="Delete Article"
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

      {/* Blog Modal */}
      {showModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content rounded-4 border-0 shadow">
              <div className="modal-header border-bottom">
                <h5 className="modal-title fw-bold">
                  {editingBlog ? "Edit Career Article" : "Publish Career Resource"}
                </h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <form onSubmit={handleSaveBlog}>
                <div className="modal-body space-y-3">
                  <div className="row g-3">
                    <div className="col-12">
                      <label className="form-label small fw-bold">Article Title</label>
                      <input
                        type="text"
                        required
                        className="form-control"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        placeholder="e.g. 5 Strategies to Ace Your B2B Sales Simulation Round"
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-bold">Category</label>
                      <select
                        className="form-select"
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      >
                        <option value="Interview Tips">Interview Tips</option>
                        <option value="Career Advice">Career Advice</option>
                        <option value="Sales Careers">Sales Careers</option>
                        <option value="HR Careers">HR Careers</option>
                        <option value="Business Careers">Business Careers</option>
                        <option value="Resume Tips">Resume Tips</option>
                        <option value="Communication Skills">Communication Skills</option>
                        <option value="Corporate Etiquette">Corporate Etiquette</option>
                        <option value="Fresher Career Guide">Fresher Career Guide</option>
                        <option value="Skill Development">Skill Development</option>
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-bold">Author Name</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.author}
                        onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-bold">Tags (Comma-separated)</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.tags}
                        onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                        placeholder="e.g. Sales, Interview, Resume"
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-bold">Estimated Read Time</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.readTime}
                        onChange={(e) => setFormData({ ...formData, readTime: e.target.value })}
                        placeholder="e.g. 5 min read"
                      />
                    </div>
                    <div className="col-12">
                      <label className="form-label small fw-bold">Article Content & Insights</label>
                      <textarea
                        rows="5"
                        required
                        className="form-control"
                        value={formData.content}
                        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                        placeholder="Write article content, tips, and step-by-step guidance..."
                      ></textarea>
                    </div>
                  </div>
                </div>
                <div className="modal-footer border-top">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" disabled={submitting} className="btn btn-primary">
                    {submitting ? "Publishing..." : editingBlog ? "Save Changes" : "Publish Article"}
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