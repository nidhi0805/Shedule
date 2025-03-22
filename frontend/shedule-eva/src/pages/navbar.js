import { useState } from "react";
import scheduleLogo from "../images/logo_shedule.svg";

export default function Navbar() {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <div>
      <style>
        {`
          .navbar {
            display: flex;
            align-items: center;
            background-color: #D8BFD8; /* Lighter background */
            padding: 5px 5px;
            width: 100%;
            position: fixed;
            top: 0;
            left: 0;
            height: 45px; /* Reduced height */
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
            z-index: 1000;
          }
          body {
            padding-top: 50px; /* Prevents navbar from overlapping content */
          }
          .logo {
            display: flex;
            align-items: center;
          }
          .logo img {
            height: 30px; /* Adjusted logo size */
            width: auto;
          }
          .nav-links {
            display: flex;
            gap: 30px;
            margin-left: 20px; /* Moves Home & Calendar closer to the logo */
          }
          .nav-item {
            text-decoration: none;
            color: black;
            font-weight: bold;
            font-size: 18px; /* Increased font size */
            padding: 5px 10px;
            border-radius: 5px;
            transition: background 0.3s;
          }
          .nav-item:hover {
            background: rgba(0, 0, 0, 0.1);
          }
          .active {
            background: rgba(0, 0, 0, 0.2);
          }
          .user-menu {
            position: absolute;
            right: 20px; /* Keeps user icon inside the screen */
            display: flex;
            align-items: center;
            cursor: pointer;
          }
          .user-icon {
            height: 30px;
            width: 30px;
            border-radius: 50%;
            object-fit: cover;
            margin-left: 10px;
          }
          .dropdown {
            position: absolute;
            top: 40px;
            right: 0;
            background: white;
            color: black;
            border-radius: 5px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            display: ${dropdownOpen ? "block" : "none"};
            min-width: 120px;
          }
          .dropdown-item {
            padding: 8px 15px;
            cursor: pointer;
            white-space: nowrap;
          }
          .dropdown-item:hover {
            background: #eee;
          }
        `}
      </style>

      <nav className="navbar">
        <div className="logo">
          <img src={scheduleLogo} alt="Logo" />
        </div>

        <div className="nav-links">
          <a href="#" className="nav-item active">Home</a>
          <a href="#" className="nav-item">Calendar</a>
        </div>

        <div className="user-menu" onClick={() => setDropdownOpen(!dropdownOpen)}>
          <img src="https://cdn-icons-png.flaticon.com/512/921/921124.png" alt="User" className="user-icon" />
          {dropdownOpen && (
            <div className="dropdown">
              <div className="dropdown-item">Profile</div>
              <div className="dropdown-item">Settings</div>
              <div className="dropdown-item">Logout</div>
            </div>
          )}
        </div>
      </nav>
    </div>
  );
}
