/**
 * Fix Sidebar Component
 * 
 * This script restores the original Sidebar.js file with BiHospital icon
 */
const fs = require('fs');
const path = require('path');

const sidebarPath = path.join(__dirname, 'client', 'src', 'components', 'shared', 'Layout', 'Sidebar.js');

const originalSidebarContent = `/**
 * Sidebar Component
 * 
 * This component renders a collapsible sidebar navigation menu
 * that dynamically displays different options based on user role.
 */
import React from "react";
// Commented out unused import
// import { userMenu } from "./Menus/userMenu";

// Router imports for navigation and location tracking
import { useLocation, Link } from "react-router-dom";
// Redux import to access global state
import { useSelector } from "react-redux";
// Import CSS styles for the sidebar
import "../../../styles/Layout.css";
// Import icon components from react-icons
import { 
  BiHomeAlt,       // Home icon
  BiDonateBlood,   // Blood donation icon
  BiBuilding,      // Building/organization icon
  BiHospital,      // Hospital icon
  BiUserPlus,      // User/donor icon
  BiListUl,        // List icon
  BiGroup,         // Group/team icon
  BiNotepad        // Note/consumer icon
} from "react-icons/bi";

/**
 * Sidebar component with dynamic menu items based on user role
 * @param {boolean} collapsed - Controls whether sidebar is collapsed or expanded
 */
const Sidebar = ({ collapsed }) => {
  // Extract user data from Redux auth state
  const { user } = useSelector((state) => state.auth);
  // Get current location to determine active menu item
  const location = useLocation();

  // Array to hold menu items specific to the user's role
  const menuItems = [];

  // For organization users: show inventory, donor and hospital management
  if (user?.role === "organisation") {
    menuItems.push(
      { 
        name: "Inventory",     // Dashboard/home view
        path: "/", 
        icon: <BiHomeAlt size={20} /> 
      },
      { 
        name: "Donar",         // Donor management
        path: "/donar", 
        icon: <BiDonateBlood size={20} /> 
      },
      { 
        name: "Hospital",      // Hospital management
        path: "/hospital", 
        icon: <BiHospital size={20} /> 
      }
    );
  }

  // For admin users: show lists of donors, hospitals and organizations
  if (user?.role === "admin") {
    menuItems.push(
      { 
        name: "Donar List",    // View and manage donors
        path: "/donar-list", 
        icon: <BiUserPlus size={20} />
      },
      { 
        name: "Hospital List", // View and manage hospitals
        path: "/hospital-list", 
        icon: <BiListUl size={20} /> 
      },
      { 
        name: "Organisation List", // View and manage organizations
        path: "/org-list", 
        icon: <BiGroup size={20} /> 
      }
    );
  }

  // Common menu item for both donors and hospitals: access to organizations
  if (user?.role === "donar" || user?.role === "hospital") {
    menuItems.push({
      name: "Organisation",    // View available organizations
      path: "/organisation",
      icon: <BiBuilding size={20} />
    });
  }

  // Hospital-specific menu item to manage blood consumption
  if (user?.role === "hospital") {
    menuItems.push({
      name: "Consumer",        // Record blood usage
      path: "/consumer",
      icon: <BiNotepad size={20} />
    });
  }

  // Donor-specific menu item to manage blood donations
  if (user?.role === "donar") {
    menuItems.push({
      name: "Donation",        // Record blood donations
      path: "/donation",
      icon: <BiDonateBlood size={20} />
    });
  }

  return (
    // Main sidebar container with conditional class for collapsed state
    <div className={\`sidebar-wrapper \${collapsed ? 'collapsed' : ''}\`}>
      {/* Header section with dashboard title */}
      <div className="sidebar-header">
        {/* Title disappears when sidebar is collapsed */}
        <h4 className={collapsed ? 'd-none' : ''}>Dashboard</h4>
      </div>
      
      {/* Menu items section */}
      <div className="sidebar-menu">
        {/* Dynamically generate menu items based on user role */}
        {menuItems.map((menu, index) => {
          // Determine if this menu item is for the current page
          const isActive = location.pathname === menu.path;
          return (
            // Navigation link with active state highlighting
            <Link 
              to={menu.path} 
              className={\`menu-item \${isActive ? 'active' : ''}\`} 
              key={index}
            >
              {/* Icon section - always visible */}
              <div className="menu-icon">{menu.icon}</div>
              
              {/* Text section - hidden when sidebar is collapsed */}
              <span className={\`menu-text \${collapsed ? 'd-none' : ''}\`}>
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
`;

try {
  fs.writeFileSync(sidebarPath, originalSidebarContent);
  console.log(`Successfully reverted Sidebar.js to original version with BiHospital icon.`);
} catch (error) {
  console.error(`Error reverting Sidebar.js: ${error.message}`);
} 