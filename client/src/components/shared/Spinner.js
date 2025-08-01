/**
 * Loading Spinner Component
 * 
 * A reusable loading indicator component used throughout the application
 * to show when data is being fetched or operations are in progress.
 * The styling for this component is defined in index.css.
 */

import React from "react";

/**
 * Spinner Component
 * 
 * Renders a centered loading animation with CSS-based styling.
 * Used during API calls, page transitions, and other asynchronous operations.
 * 
 * @returns {JSX.Element} Loading spinner animation
 */
const Spinner = () => {
  return (
    <div className="loader-container">
      <div className="loader"></div>
    </div>
  );
};

export default Spinner;
