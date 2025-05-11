import { useEffect, useState } from "react";
import axios from "axios";
import WelcomeDashboard from "./WelcomeDashboard";

type User = {
  name: string;
  email: string;
  role: string;
};

const Dashboard = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchProtectedData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Token not found");
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

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  if (!user) return <p>Loading...</p>;

  return <WelcomeDashboard user={user} onLogout={handleLogout} />;
};

export default Dashboard;
