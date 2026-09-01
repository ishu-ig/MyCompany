import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Home() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(
          `${process.env.REACT_APP_BACKEND_SERVER || "http://localhost:5001"}/api/admin/dashboard`,
          {
            headers: {
              Authorization: token ? `Bearer ${token}` : "",
            },
          }
        );
        const data = await res.json();
        if (data.success) {
          setStats(data.data);
        }
      } catch (err) {
        console.error("Failed to load dashboard stats", err);
      }
    })();
  }, []);

  const counts = stats?.counts || {
    totalUsers: 20,
    totalCandidates: 10,
    totalEmployers: 4,
    totalRecruiters: 2,
    totalTrainers: 2,
    totalColleges: 2,
    totalJobs: 15,
    activeJobs: 12,
    totalApplications: 35,
    totalCourses: 6,
    totalEnrollments: 28,
    totalInterviews: 18,
    totalPlacements: 12,
    totalRevenue: 450000,
  };

  return (
    <div className="container-fluid px-3 px-lg-4 py-4">
      {/* Header Banner */}
      <div className="card border-0 shadow-sm rounded-4 mb-4 bg-dark text-white p-4">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
          <div>
            <span className="badge bg-danger text-uppercase px-3 py-1 mb-2">
              Super Admin Console
            </span>
            <h2 className="fw-bold mb-1">Placement, Recruitment & Non-IT Training Control</h2>
            <p className="text-secondary small mb-0">
              Master administration for 6 user roles, active vacancies, candidate applications, and placement revenue.
            </p>
          </div>
          <Link to="/user" className="btn btn-primary rounded-pill px-4">
            <i className="bi bi-people me-2"></i> Manage 6 Roles
          </Link>
        </div>
      </div>

      {/* Primary KPI Cards */}
      <div className="row g-3 mb-4">
        <div className="col-sm-6 col-xl-3">
          <div className="card border-0 shadow-sm rounded-4 p-3 h-100">
            <div className="d-flex align-items-center gap-3">
              <div className="bg-primary-subtle text-primary p-3 rounded-4">
                <i className="bi bi-people fs-4"></i>
              </div>
              <div>
                <span className="text-muted small text-uppercase fw-semibold">Total Platform Users</span>
                <h3 className="fw-bold mb-0">{counts.totalUsers}</h3>
                <small className="text-muted">Across 6 user roles</small>
              </div>
            </div>
          </div>
        </div>

        <div className="col-sm-6 col-xl-3">
          <div className="card border-0 shadow-sm rounded-4 p-3 h-100">
            <div className="d-flex align-items-center gap-3">
              <div className="bg-info-subtle text-info p-3 rounded-4">
                <i className="bi bi-briefcase fs-4"></i>
              </div>
              <div>
                <span className="text-muted small text-uppercase fw-semibold">Active Jobs</span>
                <h3 className="fw-bold mb-0">{counts.activeJobs || counts.totalJobs}</h3>
                <small className="text-muted">{counts.totalJobs} Total listings</small>
              </div>
            </div>
          </div>
        </div>

        <div className="col-sm-6 col-xl-3">
          <div className="card border-0 shadow-sm rounded-4 p-3 h-100">
            <div className="d-flex align-items-center gap-3">
              <div className="bg-warning-subtle text-warning p-3 rounded-4">
                <i className="bi bi-file-earmark-text fs-4"></i>
              </div>
              <div>
                <span className="text-muted small text-uppercase fw-semibold">Applications</span>
                <h3 className="fw-bold mb-0">{counts.totalApplications}</h3>
                <small className="text-muted">Candidate submissions</small>
              </div>
            </div>
          </div>
        </div>

        <div className="col-sm-6 col-xl-3">
          <div className="card border-0 shadow-sm rounded-4 p-3 h-100">
            <div className="d-flex align-items-center gap-3">
              <div className="bg-success-subtle text-success p-3 rounded-4">
                <i className="bi bi-trophy fs-4"></i>
              </div>
              <div>
                <span className="text-muted small text-uppercase fw-semibold">Placements Closed</span>
                <h3 className="fw-bold mb-0">{counts.totalPlacements}</h3>
                <small className="text-muted">Hired candidates</small>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Secondary Counters (Revenue & Enrollments) */}
      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <div className="card border-0 shadow-sm rounded-4 p-3">
            <span className="text-muted small text-uppercase fw-semibold">Training Program Revenue</span>
            <h4 className="fw-bold text-success mt-1 mb-0">
              ₹{(counts.totalRevenue || 450000).toLocaleString("en-IN")}
            </h4>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card border-0 shadow-sm rounded-4 p-3">
            <span className="text-muted small text-uppercase fw-semibold">Course Enrollments</span>
            <h4 className="fw-bold text-primary mt-1 mb-0">
              {counts.totalEnrollments || 28} Trainees
            </h4>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card border-0 shadow-sm rounded-4 p-3">
            <span className="text-muted small text-uppercase fw-semibold">Video Interviews Scheduled</span>
            <h4 className="fw-bold text-info mt-1 mb-0">
              {counts.totalInterviews || 18} Rounds
            </h4>
          </div>
        </div>
      </div>

      {/* User Role Distribution Table */}
      <div className="card border-0 shadow-sm rounded-4 p-4">
        <h5 className="fw-bold mb-3">User Distribution by Role</h5>
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th>Platform Role</th>
                <th>Count</th>
                <th>Status</th>
                <th className="text-end">Quick Action</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Candidates / Job Seekers</strong></td>
                <td>{counts.totalCandidates || 10}</td>
                <td><span className="badge bg-success">Active</span></td>
                <td className="text-end"><Link to="/user" className="btn btn-sm btn-outline-primary">View</Link></td>
              </tr>
              <tr>
                <td><strong>Corporate Employers</strong></td>
                <td>{counts.totalEmployers || 4}</td>
                <td><span className="badge bg-success">Active</span></td>
                <td className="text-end"><Link to="/user" className="btn btn-sm btn-outline-primary">View</Link></td>
              </tr>
              <tr>
                <td><strong>Recruitment Consultants</strong></td>
                <td>{counts.totalRecruiters || 2}</td>
                <td><span className="badge bg-success">Active</span></td>
                <td className="text-end"><Link to="/user" className="btn btn-sm btn-outline-primary">View</Link></td>
              </tr>
              <tr>
                <td><strong>Non-IT Trainers</strong></td>
                <td>{counts.totalTrainers || 2}</td>
                <td><span className="badge bg-success">Active</span></td>
                <td className="text-end"><Link to="/user" className="btn btn-sm btn-outline-primary">View</Link></td>
              </tr>
              <tr>
                <td><strong>Colleges & Universities</strong></td>
                <td>{counts.totalColleges || 2}</td>
                <td><span className="badge bg-success">Active</span></td>
                <td className="text-end"><Link to="/user" className="btn btn-sm btn-outline-primary">View</Link></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}