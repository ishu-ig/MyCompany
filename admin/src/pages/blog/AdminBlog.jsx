import React, { useState, useEffect } from "react";

export default function AdminBlog() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `${process.env.REACT_APP_BACKEND_SERVER || "http://localhost:5001"}/api/blogs`
      );
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
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this career article?")) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${process.env.REACT_APP_BACKEND_SERVER || "http://localhost:5001"}/api/blogs/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        }
      );
      const data = await res.json();
      if (data.success) {
        setBlogs((prev) => prev.filter((b) => b._id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container-fluid px-3 px-lg-4 py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="fw-bold mb-1">Career Resources & Articles</h3>
          <p className="text-muted small mb-0">Publish interview preparation tips and salary guides.</p>
        </div>
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
                    </td>
                    <td><span className="badge bg-secondary">{b.category}</span></td>
                    <td>{b.author || "Editorial"}</td>
                    <td>{new Date(b.publishedAt || b.createdAt).toLocaleDateString()}</td>
                    <td className="text-end">
                      <button
                        onClick={() => handleDelete(b._id)}
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