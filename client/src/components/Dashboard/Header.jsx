import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import logo from "../../assets/logo.png";

const Header = ({ sidebarOpen, setSidebarOpen }) => {
  const { user } = useSelector((state) => state.auth);
  const [mode, setModeState] = useState("light");

  useEffect(() => {
    const savedMode = localStorage.getItem("mode") || "light";
    setModeState(savedMode);
    document.body.setAttribute("data-mode", savedMode);
  }, []);

  const setMode = (newMode) => {
    document.body.setAttribute("data-mode", newMode);
    localStorage.setItem("mode", newMode);
    setModeState(newMode);
  };

  return (
    <header className="w-full flex items-center justify-between px-4 py-5 border-b shadow-sm fixed top-0 left-0 z-50 bg-[var(--bg-color)] text-[var(--text-color)]">
      {/* Hamburger for Mobile */}
      <button
        className="focus:outline-none md:hidden"
        onClick={() => setSidebarOpen(!sidebarOpen)}
        aria-label="Toggle sidebar"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {sidebarOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {/* Branding */}
      <div className="hidden sm:flex flex-col text-center">
        <Link to="/" className="flex items-center space-x-2">
          <img src={logo} alt="Logo" className="w-10 h-10" />
          <span className="text-3xl font-bold text-[var(--primary-text)]">JustShare</span>
        </Link>
        <span className="text-base text-[var(--secondary-text)]">Share Files Without Logging Into WhatsApp</span>
      </div>

      {/* Theme and User */}
      <div className="flex items-center space-x-4">
        {/* Dark/Light Toggle */}
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={mode === "dark"}
            onChange={() => setMode(mode === "light" ? "dark" : "light")}
            className="sr-only peer"
          />
          <div className={`w-11 h-6 bg-gray-300 peer-checked:bg-[var(--primary-text)] rounded-full relative transition`}>
            <div
              className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                mode === "dark" ? "translate-x-5" : ""
              }`}
            ></div>
          </div>
        </label>

        {/* User Info */}
        <div className="flex items-center space-x-2 cursor-pointer" tabIndex={0} role="button">
          <div className="w-9 h-9 rounded-full bg-[var(--primary-text)] flex items-center justify-center text-white font-bold">
            {user?.fullname?.charAt(0).toUpperCase() || "U"}
          </div>
          <div className="hidden md:block">
            <h3 className="text-sm font-medium">{user?.fullname || "User"}</h3>
            <p className="text-xs text-gray-300">{user?.email || "user@example.com"}</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
