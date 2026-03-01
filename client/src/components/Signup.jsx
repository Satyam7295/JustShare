import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { registerUser } from '../redux/slice/auth/authThunk';

const Signup = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const [formData,setFormData]=useState({
    email:'',
    fullname:'',
    password:'',
  })

  const handleChange=(e)=>{
   setFormData({
    ...formData,
    [e.target.name]:e.target.value,
   })
  }

  const handleSubmit=async (e)=>{
    e.preventDefault();
    
    if(!formData.email || !formData.fullname || !formData.password){
      toast.error('Please fill all the fields');
      return;
    }

    try {
      const result = await dispatch(registerUser(formData));
      if (result.error) {
        console.log(result);
        toast.error(result.payload);
      } else {
        toast.success('Registration successful');
        navigate('/login');
      }
    } catch (error) {
      toast.error('Error During Registration');
      console.log(error);     
    }
  }
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex justify-center">
      <div className="m-0 sm:m-12 bg-gray-800 shadow sm:rounded-lg flex justify-center flex-1">
        <div className="lg:w-1/2 xl:w-5/12 p-6 sm:p-12">
          <div>
            {/* <img
              src="https://storage.googleapis.com/devitary-image-host.appspot.com/15846435184459982716-LogoMakr_7POjrN.png"
              className="w-32 mx-auto"
              alt="Logo"
            /> */}
          </div>
          <div className="mt-12 flex flex-col items-center">
            <h1 className="text-2xl xl:text-3xl font-extrabold text-white">
              Sign up for justshare
            </h1>
            <div className="w-full flex-1 mt-8">
              <div className="mx-auto max-w-xs">
                <input
                  className="w-full px-8 py-4 rounded-lg font-medium bg-gray-700 border border-gray-600 placeholder-gray-400 text-white text-sm focus:outline-none focus:border-gray-500 focus:bg-gray-600"
                  type="name"
                  name="fullname"
                  onChange={handleChange}
                  value={formData.fullname}
                  placeholder="Full Name"
                />
                <input
                  className="w-full px-8 py-4 rounded-lg font-medium bg-gray-700 border border-gray-600 placeholder-gray-400 text-white text-sm focus:outline-none focus:border-gray-500 focus:bg-gray-600 mt-5"
                  type="email"
                  name="email"
                  onChange={handleChange}
                  value={formData.email}
                  placeholder="Email"
                />
                <input
                  className="w-full px-8 py-4 rounded-lg font-medium bg-gray-700 border border-gray-600 placeholder-gray-400 text-white text-sm focus:outline-none focus:border-gray-500 focus:bg-gray-600 mt-5"
                  type="password"
                  name="password"
                  onChange={handleChange}
                  value={formData.password}
                  placeholder="Password"
                />
                <button
                  className="mt-5 tracking-wide font-semibold bg-indigo-500 text-gray-100 w-full py-4 rounded-lg hover:bg-indigo-700 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none"
                  onClick={handleSubmit}
                  disabled={loading}
                >
                  <svg
                    className="w-6 h-6 -ml-2"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    viewBox="0 0 24 24"
                  >
                    <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                    <circle cx="8.5" cy="7" r="4" />
                    <path d="M20 8v6M23 11h-6" />
                  </svg>
                  <span className="ml-3">{loading ? "Signing Up..." : "Sign Up"}</span>
                </button>
                <p className="mt-6 text-xs text-gray-300 text-center">
                  Already have an account?{' '}
                  <a
                    href="/login"
                    className="border-b border-gray-500 border-dotted text-primary hover:text-primary font-semibold"
                  >
                    Login
                  </a>
                 
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side Image Section */}
        <div className="flex-1 bg-indigo-100 text-center hidden lg:flex">
          <div
            className="m-12 xl:m-16 w-full bg-contain bg-center bg-no-repeat"
            style={{
              backgroundImage:
                "url('https://storage.googleapis.com/devitary-image-host.appspot.com/15848031292911696601-undraw_designer_life_w96d.svg')",
            }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
