// WelcomeDashboard.tsx
import React from "react";
import Posts from "./Posts";

interface User {
  name: string;
  email: string;
  role: string;
}

interface Props {
  user: User;
  onLogout: () => void;
}

const WelcomeDashboard: React.FC<Props> = ({ user, onLogout }) => {
  const isAdmin = user.role === "G7" || user.role === "G8";

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
      </header>

      <main style={{ marginTop: "80px", padding: "20px" }}>
        <p>Email: {user.email}</p>
        <Posts user={user} />
      </main>
    </div>
  );
};

export default WelcomeDashboard;
