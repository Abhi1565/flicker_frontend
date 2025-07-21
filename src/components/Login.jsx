import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from "react-hot-toast"
import api from '../utils/axios';
import { useDispatch, useSelector } from "react-redux";
import { setAuthUser } from '../redux/userSlice';
//import { BASE_URL } from '..';

const Login = () => {
  const [user, setUser] = useState({
    username: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { authUser } = useSelector(store => store.user);

  // Redirect to home if already authenticated
  useEffect(() => {
    if (authUser) {
      navigate("/");
    }
  }, [authUser, navigate]);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    
    if (!user.username || !user.password) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsLoading(true);
    
    try {
      console.log("Attempting login to:", api.defaults.baseURL);
      const res = await api.post('/user/login', user);
      console.log("Login response:", res);
      
      if (res.data) {
        dispatch(setAuthUser(res.data));
        toast.success("Login successful!");
        navigate("/");
      }
    } catch (error) {
      console.error("Login error:", error);
      
      if (error.response) {
        // Server responded with error
        toast.error(error.response.data?.message || "Login failed");
      } else if (error.request) {
        // Network error
        toast.error("Network error. Please check your connection.");
      } else {
        // Other error
        toast.error("Login failed. Please try again.");
      }
    } finally {
      setIsLoading(false);
      setUser({
        username: "",
        password: ""
      });
    }
  }

  return (
    <div className="min-w-96 mx-auto">
      <div className='w-full p-6 rounded-lg shadow-md bg-clip-padding backdrop-filter backdrop-blur-md bg-opacity-10 border border-gray-100'>
        <h1 className='text-3xl font-bold text-center'>Login</h1>
        <form onSubmit={onSubmitHandler} action="">

          <div>
            <label className='label p-2'>
              <span className='text-base label-text'>Username</span>
            </label>
            <input
              value={user.username}
              onChange={(e) => setUser({ ...user, username: e.target.value })}
              className='w-full input input-bordered h-10'
              type="text"
              placeholder='Username'
              disabled={isLoading}
            />
          </div>
          <div>
            <label className='label p-2'>
              <span className='text-base label-text'>Password</span>
            </label>
            <input
              value={user.password}
              onChange={(e) => setUser({ ...user, password: e.target.value })}
              className='w-full input input-bordered h-10'
              type="password"
              placeholder='Password'
              disabled={isLoading}
            />
          </div>
          <p className='text-center my-2'>Don't have an account? <Link to="/register"> signup </Link></p>
          <div>
            <button 
              type="submit" 
              className='btn btn-block btn-sm mt-2 border border-slate-700'
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Login"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Login