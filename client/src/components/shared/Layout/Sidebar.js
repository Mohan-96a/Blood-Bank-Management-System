/**
 * Sidebar Component
 * 
 * This component renders a collapsible sidebar navigation menu
 * that dynamically displays different options based on user role.
 */
import React from "react";
import { useLocation, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import "../../../styles/Layout.css";
import { 
  FaHome,
  FaHandHoldingMedical,
  FaBuilding, 
  FaHospital,
  FaUserPlus,
  FaList,
  FaUsers,
  FaClipboard
} from "react-icons/fa";

/**
 * Sidebar component with dynamic menu items based on user role
 * @param {boolean} collapsed - Controls whether sidebar is collapsed or expanded
 */
const Sidebar = ({ collapsed }) => {
  const { user } = useSelector((state) => state.auth);
  const location = useLocation();

  const menuItems = [];

  if (user?.role === "organisation") {
    menuItems.push(
      { 
        name: "Inventory",
        path: "/", 
        icon: <FaHome size={20} /> 
      },
      { 
        name: "Donor",
        path: "/donor", 
        icon: <FaHandHoldingMedical size={20} /> 
      },
      { 
        name: "Hospital",
        path: "/hospital", 
        icon: <FaHospital size={20} /> 
      }
    );
  }

  if (user?.role === "admin") {
    menuItems.push(
      { 
        name: "Donor List",
        path: "/donor-list", 
        icon: <FaUserPlus size={20} />
      },
      { 
        name: "Hospital List",
        path: "/hospital-list", 
        icon: <FaList size={20} /> 
      },
      { 
        name: "Organisation List",
        path: "/org-list", 
        icon: <FaUsers size={20} /> 
      }
    );
  }

  if (user?.role === "donor" || user?.role === "hospital") {
    menuItems.push({
      name: "Organisation",
      path: "/organisation",
      icon: <FaBuilding size={20} />
    });
  }

  if (user?.role === "hospital") {
    menuItems.push({
      name: "Consumer",
      path: "/consumer",
      icon: <FaClipboard size={20} />
    });
  }

  if (user?.role === "donor") {
    menuItems.push({
      name: "Donation",
      path: "/donation",
      icon: <FaHandHoldingMedical size={20} />
    });
  }

  return (
    <div className={`sidebar-wrapper ${collapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <h4 className={collapsed ? 'd-none' : ''}>Dashboard</h4>
      </div>
      
      <div className="sidebar-menu">
        {menuItems.map((menu, index) => {
          const isActive = location.pathname === menu.path;
          return (
            <Link 
              to={menu.path} 
              className={`menu-item ${isActive ? 'active' : ''}`} 
              key={index}
            >
              <div className="menu-icon">{menu.icon}</div>
              <span className={`menu-text ${collapsed ? 'd-none' : ''}`}>
                {menu.name}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default Sidebar;
