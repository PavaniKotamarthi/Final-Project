import React from 'react';
import { Link, useLocation } from 'react-router-dom';

interface User {
  name: string;
  email: string;
  role: string;
}

interface Props {
  user: User;
  onLogout: () => void;
  children?: React.ReactNode;
}

const WelcomeDashboard: React.FC<Props> = ({ user, onLogout, children }) => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  return (
    <div>
      <header
        style={{
          backgroundColor: "#4a90e2",
          color: "white",
          padding: "15px 30px",
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
          zIndex: 1000,
          fontSize: "18px",
          fontWeight: "bold",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <h3>
            Welcome {user.name} | Role: {user.role}
          </h3>
          <div>
            <Link
              to="/dashboard"
              style={{
                marginRight: "20px",
                color: isActive('/dashboard') ? '#ffd700' : '#fff',
                textDecoration: "none",
              }}
            >
              Posts
            </Link>
            <Link
              to="/dashboard/questions"
              style={{
                marginRight: "20px",
                color: isActive('/dashboard/questions') ? '#ffd700' : '#fff',
                textDecoration: "none",
              }}
            >
              Questions
            </Link>
            <button
              onClick={onLogout}
              style={{
                backgroundColor: "#fff",
                color: "#4a90e2",
                border: "none",
                padding: "5px 10px",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main style={{ marginTop: "30px", width: "100vw",padding: "20px" }}>
        {children}
      </main>
    </div>
  );
};

export default WelcomeDashboard;
