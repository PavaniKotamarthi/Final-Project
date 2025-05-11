import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Protected = () => {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      try {
        const res = await axios.get('http://localhost:5000/api/auth/protected', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setMessage(res.data.message);
      } catch {
        setMessage('Access denied. Invalid or expired token.');
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h2>Protected Page</h2>
      <p>{message}</p>
    </div>
  );
};

export default Protected;
