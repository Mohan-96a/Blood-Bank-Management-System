import React from "react";
import { BiDonateBlood, BiUserCircle, BiMenu, BiHomeAlt, BiLineChart } from "react-icons/bi";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const Header = ({ toggleSidebar }) => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const location = useLocation();
  
  // logout handler
  const handleLogout = () => {
    localStorage.clear();
    toast.success("Logout Successful");
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg">
      <div className="container-fluid">
        <button 
          className="btn btn-link sidebar-toggle me-3 d-lg-none" 
          onClick={toggleSidebar}
        >
          <BiMenu size={24} color="white" />
        </button>
        
        <Link to="/" className="navbar-brand">
          <BiDonateBlood size={28} className="me-2 text-light" /> 
          <span>Blood Bank</span>
        </Link>
        
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-center">
            {/* Welcome Message */}
            <li className="nav-item me-3">
              <div className="d-flex align-items-center">
                <BiUserCircle size={24} className="me-1" />
                <span className="d-none d-md-inline">
                  Welcome{" "}
                  {user?.name || user?.hospitalName || user?.organisationName}
                </span>
                <span className="badge bg-light text-primary ms-2 rounded-pill">
                  {user?.role}
                </span>
              </div>
            </li>
            
            {/* Navigation Links */}
            {location.pathname === "/" ||
             location.pathname === "/donar" ||
             location.pathname === "/hospital" ? (
              <li className="nav-item mx-3">
                <Link to="/analytics" className="nav-link d-flex align-items-center">
                  <BiLineChart size={20} className="me-1" />
                  <span>Analytics</span>
                </Link>
              </li>
            ) : (
              <li className="nav-item mx-3">
                <Link to="/" className="nav-link d-flex align-items-center">
                  <BiHomeAlt size={20} className="me-1" />
                  <span>Home</span>
                </Link>
              </li>
            )}
            
            {/* Logout Button */}
            <li className="nav-item ms-3">
              <button className="btn btn-light" onClick={handleLogout}>
                Logout
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Header;
