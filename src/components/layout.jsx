import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { logout } from "../services/authService";
import { useAuth } from "../context/AuthProvider.jsx";

export default function Layout() {
  const navigate = useNavigate();
  const { isAdmin, isPatient, isReceptionist, isDoctor, user } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="app-container">
      <style>{`
        /* Sidebar and Layout Structure */
        .app-container {
          display: flex;
          height: 100vh;
          width: 100vw;
          overflow: hidden;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }

        /* Sidebar Styling */
        .sidebar {
          width: 250px;
          background-color: #ffffff;
          border-right: 1px solid #e0e0e0;
          display: flex;
          flex-direction: column;
        }

        .sidebar-header {
          padding: 24px;
          font-weight: bold;
          font-size: 1.2rem;
          color: #333;
          border-bottom: 1px solid #f5f5f5;
        }

        .sidebar-nav {
          flex: 1;
          padding-top: 10px;
        }

        .sidebar-nav ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .nav-link {
          display: flex;
          align-items: center;
          padding: 12px 24px;
          text-decoration: none;
          color: #555;
          font-size: 0.95rem;
          transition: 0.2s;
        }

        .nav-link:hover {
          background-color: #f8f9fa;
          color: #000;
        }

        .nav-link.active {
          background-color: #f0f4ff;
          color: #007bff;
          border-right: 4px solid #007bff;
          font-weight: 600;
        }

        .nav-icon {
          margin-right: 12px;
          font-size: 1.1rem;
        }

        /* Main Content Container */
        .main-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          background-color: #ffffff;
        }

        /* Topbar/Header */
        .topbar {
          height: 60px;
          border-bottom: 1px solid #e0e0e0;
          display: flex;
          align-items: center;
          padding: 0 30px;
          color: #666;
          background: #fff;
        }

        /* Content Area */
        .page-body {
          flex: 1;
          padding: 40px;
          overflow-y: auto;
        }

        /* Logout Button */
        .logout-wrapper {
          padding: 20px;
          border-top: 1px solid #f5f5f5;
        }

        .btn-logout {
          width: 100%;
          text-align: left;
          background: none;
          border: none;
          padding: 10px 4px;
          color: #dc3545;
          cursor: pointer;
          font-size: 0.95rem;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .btn-logout:hover {
          opacity: 0.7;
        }

        footer {
          padding: 15px 30px;
          border-top: 1px solid #f5f5f5;
          font-size: 0.8rem;
          color: #999;
        }
      `}</style>

      {/* LEFT SIDEBAR */}
      <aside className="sidebar">
        <div className="sidebar-header">Clinic</div>

        <nav className="sidebar-nav">
          <ul>
            <li>
              <NavLink to="/" end className="nav-link">
                <span className="nav-icon">⊞</span> Dashboard
              </NavLink>
            </li>

            {isAdmin && (
              <li>
                <NavLink to="/clinic" className="nav-link">
                  <span className="nav-icon">⚙</span> Clinic
                </NavLink>
              </li>
            )}

            {(isDoctor || isPatient) && (
              <>
                <li>
                  <NavLink to="/reports" className="nav-link">
                    <span className="nav-icon"></span> Reports
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/prescriptions" className="nav-link">
                    <span className="nav-icon"></span> Prescriptions
                  </NavLink>
                </li>
                {isDoctor && (
                  <li>
                    <NavLink to="/doctor" className="nav-link">
                      <span className="nav-icon"></span> Queue
                    </NavLink>
                  </li>
                )}
              </>
            )}

            {isReceptionist && (
              <li>
                <NavLink to="/queue" className="nav-link">
                  <span className="nav-icon">📋</span> Queue
                </NavLink>
              </li>
            )}

            {isPatient && (
              <li>
                <NavLink to="/appointments" className="nav-link">
                  <span className="nav-icon"></span> Appointments
                </NavLink>
              </li>
            )}
          </ul>
        </nav>

        <div className="logout-wrapper">
          <button onClick={handleLogout} className="btn-logout">
            <span style={{ fontSize: '1.2rem' }}>↪</span> Logout
          </button>
        </div>
      </aside>

      {/* RIGHT CONTENT AREA */}
      <div className="main-content">
        <header className="topbar">
          {/* Fills the empty brackets from your screenshot */}
          ({user?.name || "Guest"} - {user?.roleName || "User"})
        </header>

        <main className="page-body">
          <Outlet />
        </main>

        <footer>
          <p>© {new Date().getFullYear()} My Website</p>
        </footer>
      </div>
    </div>
  );
}