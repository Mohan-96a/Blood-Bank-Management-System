/**
 * Registration Page Component
 * 
 * This component renders the user registration page with a form for creating
 * a new account. It displays a banner image alongside the registration form
 * and handles loading states and error notifications.
 */

import React, { useEffect } from "react";
import Form from "../../components/shared/Form/Form";     // Reusable form component
import { useSelector } from "react-redux";                // Redux state access hook
import Spinner from "../../components/shared/Spinner";    // Loading indicator component

/**
 * Register Component
 * 
 * Renders the registration page with a form and banner image.
 * Uses Redux to manage authentication state and loading states.
 * Includes error handling with alert notifications.
 * 
 * @returns {JSX.Element} Registration page component
 */
const Register = () => {
  // Extract authentication state from Redux store
  const { loading, error } = useSelector((state) => state.auth);

  // Display error alerts when authentication errors occur
  useEffect(() => {
    if (error) {
      alert(error); // Show alert when error occurs
    }
  }, [error]);

  return (
    <>
      {/* Show spinner during loading or the registration form when ready */}
      {loading ? (
        <Spinner />
      ) : (
        <div className="row g-0">
          {/* Left section - Banner image */}
          <div className="col-md-8 form-banner ">
            <img src="/assets/images/register_Image.png" alt="Blood donation" style={{width: '100%', height: '100%', objectFit: 'cover'}} />
          </div>
          
          {/* Right section - Registration form */}
          <div className="col-md-4 form-container">
            <Form
              formTitle={"Register"}
              submitBtn={"Register"}
              formType={"register"}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default Register;
