import React, { useState } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";

const Layout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  return (
    <div className="layout-container">
      <div className="header">
        <Header toggleSidebar={toggleSidebar} />
      </div>
      <div className="main-content">
        <Sidebar collapsed={collapsed} />
        <div className="content-area">
          <div className="container-fluid py-3">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;
