/**
 * Login Page Component
 * 
 * This component renders the user login page with a form for authentication.
 * It displays a banner image alongside the login form and handles loading states.
 */

import React from "react";
import Form from "../../components/shared/Form/Form";     // Reusable form component
import { useSelector } from "react-redux";                // Redux state access hook
import Spinner from "./../../components/shared/Spinner";  // Loading indicator component

/**
 * Login Component
 * 
 * Renders the login page with a form and banner image.
 * Uses Redux to manage authentication state and loading states.
 * 
 * @returns {JSX.Element} Login page component
 */
const Login = () => {
  // Extract authentication state from Redux store
  const { loading, error } = useSelector((state) => state.auth);
  
  return (
    <>
      {/* Display error alerts if authentication fails */}
      {error && <span>{alert(error)}</span>}
      
      {/* Show spinner during loading or the login form when ready */}
      {loading ? (
        <Spinner />
      ) : (
        <div className="row g-0">
          {/* Left section - Banner image */}
          <div className="col-md-8 form-banner">
            <img src="/assets/images/login_image.png" alt="loginImage" style={{width: '100%', height: '100%', objectFit: 'cover'}} />
          </div>
          
          {/* Right section - Login form */}
          <div className="col-md-4 form-container">
            <Form
              formTitle={"Login Page"}
              submitBtn={"Login"}
              formType={"login"}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default Login;
