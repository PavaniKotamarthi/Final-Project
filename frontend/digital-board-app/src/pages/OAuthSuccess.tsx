import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const OAuthSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');

    if (token) {
      localStorage.setItem('token', token);
      navigate('/dashboard');
    } else {
      navigate('/');
    }
  }, [location, navigate]);

  return <div className="text-center mt-10 text-lg">Logging in via Google...</div>;
};

export default OAuthSuccess;
