/**
 * Landing Page Component
 * 
 * This is the public landing page that users see when they first visit the website.
 * It provides information about the blood bank system and navigation to login/register.
 */

import React from "react";
import { Link, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const LandingPage = () => {
  const { user } = useSelector((state) => state.auth);

  // If user is already authenticated, redirect to dashboard
  if (user) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <div className="min-vh-100 d-flex flex-column">
      {/* Navigation Header */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-danger">
        <div className="container">
          <Link className="navbar-brand fw-bold" to="/">
            <i className="fas fa-heartbeat me-2"></i>
            Blood Bank Management System
          </Link>
          <div className="navbar-nav ms-auto">
            <Link className="nav-link" to="/login">
              <i className="fas fa-sign-in-alt me-1"></i>
              Login
            </Link>
            <Link className="nav-link" to="/register">
              <i className="fas fa-user-plus me-1"></i>
              Register
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="flex-grow-1 d-flex align-items-center">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <h1 className="display-4 fw-bold text-danger mb-4">
                Save Lives Through Blood Donation
              </h1>
              <p className="lead mb-4">
                Our Blood Bank Management System connects donors, hospitals, and organizations 
                to ensure timely access to blood supplies when they're needed most.
              </p>
              <div className="d-flex gap-3">
                <Link to="/register" className="btn btn-danger btn-lg">
                  <i className="fas fa-user-plus me-2"></i>
                  Get Started
                </Link>
                <Link to="/login" className="btn btn-outline-danger btn-lg">
                  <i className="fas fa-sign-in-alt me-2"></i>
                  Sign In
                </Link>
              </div>
            </div>
            <div className="col-lg-6 text-center">
              <img 
                src="/assets/images/login_image.png" 
                alt="Blood Donation" 
                className="img-fluid rounded shadow"
                style={{ maxHeight: '400px' }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-light py-5">
        <div className="container">
          <h2 className="text-center mb-5">Why Choose Our System?</h2>
          <div className="row g-4">
            <div className="col-md-4">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body text-center">
                  <i className="fas fa-hospital fa-3x text-danger mb-3"></i>
                  <h5 className="card-title">Hospital Management</h5>
                  <p className="card-text">
                    Hospitals can efficiently manage blood inventory and track usage patterns.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body text-center">
                  <i className="fas fa-users fa-3x text-danger mb-3"></i>
                  <h5 className="card-title">Donor Management</h5>
                  <p className="card-text">
                    Easy donor registration and tracking of donation history and eligibility.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body text-center">
                  <i className="fas fa-chart-line fa-3x text-danger mb-3"></i>
                  <h5 className="card-title">Analytics & Reports</h5>
                  <p className="card-text">
                    Comprehensive analytics and reporting for better decision making.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-dark text-light py-4">
        <div className="container text-center">
          <p className="mb-0">
            © 2024 Blood Bank Management System. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage; 