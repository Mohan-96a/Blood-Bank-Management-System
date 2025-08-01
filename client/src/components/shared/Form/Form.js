import React, { useState, useEffect } from "react";
import InputType from "./InputType";
import { Link } from "react-router-dom";
import { handleLogin, handleRegister } from "../../../services/authService";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { checkServerConnection } from "../../../utils/serverCheck";

const Form = ({ formType, formTitle, submitBtn }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("donar");
  const [name, setName] = useState("");
  const [organisationName, setOrganisationName] = useState("");
  const [hospitalName, setHospitalName] = useState("");
  const [website, setWebsite] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [serverStatus, setServerStatus] = useState("checking");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Check server connection when the component mounts
  useEffect(() => {
    const checkServer = async () => {
      setServerStatus("checking");
      const isConnected = await checkServerConnection();
      setServerStatus(isConnected ? "connected" : "error");
    };
    checkServer();
  }, []);

  const handleCheckServer = async () => {
    setServerStatus("checking");
    const isConnected = await checkServerConnection();
    setServerStatus(isConnected ? "connected" : "error");
    
    if (isConnected) {
      toast.success("Server connection restored");
    } else {
              toast.error("Cannot connect to server. Please check your internet connection or try refreshing the page.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check server connection before submitting
    if (serverStatus !== "connected") {
      const isConnected = await checkServerConnection();
      setServerStatus(isConnected ? "connected" : "error");
      
      if (!isConnected) {
        toast.error("Cannot connect to server. Please check your internet connection or try refreshing the page.");
        return;
      }
    }
    
    // Basic validation
    if (formType === "register") {
      // Check role-specific required fields
      if (role === "donar" && !name) {
        toast.error("Name is required for donors");
        return;
      }
      
      if (role === "admin" && !name) {
        toast.error("Name is required for admin");
        return;
      }
      
      if (role === "hospital" && !hospitalName) {
        toast.error("Hospital name is required");
        return;
      }
      
      if (role === "organisation" && !organisationName) {
        toast.error("Organisation name is required");
        return;
      }
      
      // Check common required fields
      if (!address) {
        toast.error("Address is required");
        return;
      }
      
      if (!phone) {
        toast.error("Phone number is required");
        return;
      }
    }
    
    try {
      setLoading(true);
      // Handle login
      if (formType === "login") {
        const response = await handleLogin({ email, password, role }, dispatch);
        if (response && response.success) {
          toast.success(response.message);
          navigate("/");
        }
      }
      // Handle register
      else if (formType === "register") {
        const response = await handleRegister({
          email,
          password,
          role,
          name,
          organisationName,
          hospitalName,
          website,
          address,
          phone,
        });
        if (response && response.success) {
          toast.success(response.message);
          navigate("/login");
        }
      }
    } catch (error) {
      console.log(error);
      // Error handling is now in the API interceptor
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Server Status Indicator */}
      {serverStatus === "checking" && (
        <div className="alert alert-info">
          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
          Checking server connectivity...
        </div>
      )}
      
      {serverStatus === "error" && (
        <div className="alert alert-danger">
          <strong>Server Connection Error</strong>
          <p>Cannot connect to the server. Please check your internet connection or try refreshing the page.</p>
          <button 
            className="btn btn-sm btn-outline-danger" 
            onClick={handleCheckServer}
          >
            Retry Connection
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <h1 className="text-center">{formTitle}</h1>
        <hr />

        {/* Role Selection Radio Buttons */}
        <div className="d-flex mb-3">
          <div className="form-check ms-2">
            <input
              type="radio"
              className="form-check-input"
              name="role"
              id="donarRadio"
              value="donar"
              onChange={(e) => setRole(e.target.value)}
              checked={role === "donar"}
            />
            <label htmlFor="donarRadio" className="form-check-label">
              Donor
            </label>
          </div>
          <div className="form-check ms-2">
            <input
              type="radio"
              className="form-check-input"
              name="role"
              id="adminRadio"
              value="admin"
              onChange={(e) => setRole(e.target.value)}
              checked={role === "admin"}
            />
            <label htmlFor="adminRadio" className="form-check-label">
              Admin
            </label>
          </div>
          <div className="form-check ms-2">
            <input
              type="radio"
              className="form-check-input"
              name="role"
              id="hospitalRadio"
              value="hospital"
              onChange={(e) => setRole(e.target.value)}
              checked={role === "hospital"}
            />
            <label htmlFor="hospitalRadio" className="form-check-label">
              Hospital
            </label>
          </div>
          <div className="form-check ms-2">
            <input
              type="radio"
              className="form-check-input"
              name="role"
              id="organisationRadio"
              value="organisation"
              onChange={(e) => setRole(e.target.value)}
              checked={role === "organisation"}
            />
            <label htmlFor="organisationRadio" className="form-check-label">
              Organisation
            </label>
          </div>
        </div>

        {/* Form Fields Based on Form Type */}
        {formType === "login" ? (
          // Login Form Fields
          <>
            <InputType
              labelText={"Email"}
              labelFor={"email"}
              inputType={"email"}
              name={"email"}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required={true}
            />
            <InputType
              labelText={"Password"}
              labelFor={"password"}
              inputType={"password"}
              name={"password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required={true}
            />
          </>
        ) : (
          // Register Form Fields 
          <>
            {/* Donor Registration Fields */}
            {(role === "donar" || role === "admin") && (
              <InputType
                labelText={"Name"}
                labelFor={"name"}
                inputType={"text"}
                name={"name"}
                value={name}
                onChange={(e) => setName(e.target.value)}
                required={true}
              />
            )}
            {/* Hospital Registration Fields */}
            {role === "hospital" && (
              <InputType
                labelText={"Hospital Name"}
                labelFor={"hospitalName"}
                inputType={"text"}
                name={"hospitalName"}
                value={hospitalName}
                onChange={(e) => setHospitalName(e.target.value)}
                required={true}
              />
            )}
            {/* Organisation Registration Fields */}
            {role === "organisation" && (
              <InputType
                labelText={"Organisation Name"}
                labelFor={"organisationName"}
                inputType={"text"}
                name={"organisationName"}
                value={organisationName}
                onChange={(e) => setOrganisationName(e.target.value)}
                required={true}
              />
            )}
            {/* Common Fields for All Registration Types */}
            <InputType
              labelText={"Email"}
              labelFor={"email"}
              inputType={"email"}
              name={"email"}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required={true}
            />
            <InputType
              labelText={"Password"}
              labelFor={"password"}
              inputType={"password"}
              name={"password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required={true}
            />
            {/* Website field - only for Hospital and Organisation */}
            {(role === "hospital" || role === "organisation") && (
              <InputType
                labelText={"Website"}
                labelFor={"website"}
                inputType={"text"}
                name={"website"}
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                required={true}
              />
            )}
            {/* Address and Phone fields - required for ALL roles */}
            <InputType
              labelText={"Address"}
              labelFor={"address"}
              inputType={"text"}
              name={"address"}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required={true}
            />
            <InputType
              labelText={"Phone"}
              labelFor={"phone"}
              inputType={"text"}
              name={"phone"}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required={true}
            />
          </>
        )}

        {/* Submit Button */}
        <div className="d-flex flex-row justify-content-between">
          {formType === "login" ? (
            <p>
              Not registered yet? Register
              <Link to="/register"> Here!</Link>
            </p>
          ) : (
            <p>
              Already have an account? Login
              <Link to="/login"> Here!</Link>
            </p>
          )}
          
          <button 
            className="btn btn-primary" 
            type="submit"
            disabled={loading || serverStatus === "checking" || serverStatus === "error"}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Loading...
              </>
            ) : (
              submitBtn
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Form;
