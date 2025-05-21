import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaFacebookF, FaGoogle, FaGithub } from 'react-icons/fa';
import axios from 'axios';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/signin', { email, password });
      localStorage.setItem('token', res.data.token);
      navigate('/dashboard');
    } catch (error: any) {
      if (error.response?.status === 404) {
        navigate(error.response.data.redirect);
      } else {
        alert('Login failed');
      }
    }
  };

  return (
    <div className="w-screen min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-300 via-purple-400 to-purple-500">
      <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-sm">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Login</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div className="relative">
            <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-600" />
            <input
              type="email"
              placeholder="Username or Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
          </div>

          {/* Password */}
          <div className="relative">
            <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-600" />
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter your Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full pl-10 pr-10 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
            <div
              className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-600"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </div>
          </div>

          {/* Remember & Forgot */}
          {/* <div className="flex items-center justify-between text-sm text-gray-600">
            <label className="flex items-center gap-1">
              <input type="checkbox" className="accent-purple-500" /> Remember me
            </label>
            <a href="#" className="text-blue-600 hover:underline">
              Forgot password?
            </a>
          </div> */}

          {/* Login button */}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-md transition"
          >
            Login
          </button>
        </form>

        {/* Register */}
        <p className="text-sm text-center mt-4 text-gray-600">
          Don't have an account?{' '}
          <Link to="/register" className="text-blue-600 hover:underline">
            Sign up
          </Link>
        </p>

        {/* Divider */}
        <div className="flex items-center my-4">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="mx-2 text-sm text-gray-500">or connect with</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>

        {/* Social Icons */}
        <div className="flex justify-center space-x-4">
          <a href="http://localhost:5000/auth/google" className="p-2 rounded-full bg-gray-100 hover:bg-red-500 hover:text-white">
            <FaGoogle />
          </a>
          <a
            href="http://localhost:5000/auth/github"
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-800 hover:text-white"
          >
            <FaGithub />
          </a>

        </div>
      </div>
    </div>
  );
};

export default Login;
