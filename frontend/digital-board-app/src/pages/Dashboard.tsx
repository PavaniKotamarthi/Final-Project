import { useEffect, useState } from "react";
import axios from "axios";

// Define User type
interface User {
  name: string;
  email: string;
  role: string;
}

const Dashboard = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchProtectedData = async () => {
      alert('entered dashboard');
      const token = localStorage.getItem("token");
      if (!token){
        alert('token not found')
        return;
      } 

      try {
        const res = await axios.get<User>("http://localhost:5000/api/auth/protected", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);
      } catch {
        alert("Access denied");
      }
    };

    fetchProtectedData();
  }, []);

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
        }}>
        {user ? (
          <h3>Welcome {user.name} | Role: {user.role}</h3>
        ) : (
          <h3>Loading user info...</h3>
        )}
      </header>
      <main>
        <h2>Dashboard</h2>
        {user ? (
          <p>Email: {user.email}</p>
        ) : (
          <p>Loading content...</p>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
