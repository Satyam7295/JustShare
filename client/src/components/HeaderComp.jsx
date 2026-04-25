import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";

const Header = ({ sidebarOpen, setSidebarOpen }) => {
  const [sidebarVisible, setSidebarVisible] = useState(false);
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
    <>
      {/* 🌐 MOBILE HEADER */}
      <header className="w-full sm:hidden flex items-center justify-between px-4 py-3 fixed top-0 left-0 z-50 glass-header text-[var(--text-color)] transition-all duration-300">
        <Link to="/" className="flex items-center space-x-2">
          <img src={logo} alt="Logo" className="w-10 h-10" />
          <span className="text-xl font-bold text-gray-900 dark:text-white">JustShare</span>
        </Link>
        <button onClick={() => setSidebarVisible(true)} className="focus:outline-none p-2 rounded-full hover:bg-white/10 transition-colors">
          <svg className="w-7 h-7 text-[var(--text-color)]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </header>

      {/* 📱 MOBILE SIDEBAR OVERLAY */}
      {sidebarVisible && (
        <div className="fixed inset-0 bg-black/80 z-40 sm:hidden transition-opacity" onClick={() => setSidebarVisible(false)}></div>
      )}

      {/* 📱 MOBILE SIDEBAR PANEL (RIGHT SLIDE) */}
      <aside className={`fixed top-0 right-0 w-64 h-full bg-[var(--bg-color)] text-[var(--text-color)] z-50 shadow-2xl border-l border-white/5 transform ${sidebarVisible ? "translate-x-0" : "translate-x-full"} transition-transform duration-300 ease-out sm:hidden`}>
        <div className="flex items-center justify-between px-5 py-5 border-b border-white/10">
          <div className="flex items-center space-x-2">
            <img src={logo} alt="Logo" className="w-8 h-8" />
            <span className="font-bold text-lg text-[var(--primary-text)]">Menu</span>
          </div>
          <button onClick={() => setSidebarVisible(false)} className="text-2xl font-bold text-gray-500 hover:text-[var(--text-color)] transition-colors">&times;</button>
        </div>
        <div className="p-6 flex flex-col gap-6">
          {/* 🌙 Mode Toggle */}
          <div className="flex items-center justify-between bg-white/5 p-3 rounded-xl border border-white/5">
            <span className="font-medium text-sm">Theme</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={mode === "dark"}
                onChange={() => setMode(mode === "light" ? "dark" : "light")}
                className="sr-only peer"
              />
              <div className={`w-11 h-6 rounded-full transition-colors duration-300 ${mode === "dark" ? "bg-[#333333]" : "bg-gray-300"}`}></div>
              <div className={`absolute left-1 top-1 w-4 h-4 rounded-full bg-white transition-transform duration-300 ${mode === "dark" ? "translate-x-5" : ""}`}></div>
            </label>
          </div>

          {/* 🔐 Auth Links */}
          <div className="flex flex-col gap-3 mt-4">
            <Link to="/signup" onClick={() => setSidebarVisible(false)} className="text-sm font-medium px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-center transition-colors">Sign Up</Link>
            <Link to="/login" onClick={() => setSidebarVisible(false)} className="text-sm font-medium px-4 py-3 rounded-xl btn-primary text-center">Log In</Link>
          </div>
        </div>
      </aside>

      {/* 🖥 DESKTOP HEADER */}
      <div className="hidden sm:flex justify-center fixed top-4 left-0 w-full z-50 px-6 transition-all duration-300">
        <header className="w-full max-w-6xl items-center justify-between px-6 py-3 glass-panel flex text-[var(--text-color)]">
          <div className="flex items-center space-x-4">
            <Link to="/" className="flex items-center space-x-3 group">
              <img src={logo} alt="Logo" className="w-10 h-10 transition-transform duration-300" />
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">JustShare</span>
              </div>
            </Link>
          </div>
          <span className="hidden md:block text-sm font-medium text-gray-500 tracking-wide">Share Files Securely & Instantly</span>
          
          <div className="flex items-center space-x-5">
            {/* 🌙 Mode Toggle */}
            <label className="relative inline-flex items-center cursor-pointer group" title="Toggle Theme">
              <input
                type="checkbox"
                checked={mode === "dark"}
                onChange={() => setMode(mode === "light" ? "dark" : "light")}
                className="sr-only peer"
              />
              <div className={`w-12 h-6 rounded-full transition-colors duration-300 shadow-inner ${mode === "dark" ? "bg-[#333333]" : "bg-gray-300"}`}></div>
              <div className={`absolute left-1 top-1 w-4 h-4 rounded-full bg-white transition-all duration-300 shadow-sm group-hover:scale-110 ${mode === "dark" ? "translate-x-6" : ""}`}></div>
            </label>

            <div className="h-6 w-px bg-white/20"></div>

            {/* 🔐 Auth Buttons */}
            <Link to="/signup" className="text-sm font-semibold px-5 py-2.5 rounded-full hover:bg-white/10 transition-colors text-[var(--text-color)]">Sign Up</Link>
            <Link to="/login" className="btn-primary text-sm">Log In</Link>
          </div>
        </header>
      </div>
    </>
  );
};

export default Header;
