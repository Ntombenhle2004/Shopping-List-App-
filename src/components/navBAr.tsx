
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../Reduxhooks";
import { logout } from "../features/loginSlice";

const Navbar: React.FC = () => {
  const isAuthenticated = useAppSelector(
    (state) => state.login.isAuthenticated
  );
  const dispatch = useAppDispatch();
  const location = useLocation();

  const handleLogout = () => {
    dispatch(logout());
  };

  // Hide links if on login or register page
  const hideLinks =
    location.pathname === "/login" || location.pathname === "/register";

  return (
    <nav className="navbar">
      <h2>Shopping List</h2>

      {!hideLinks && (
        <>
          <Link to="/home">Home</Link>
          {isAuthenticated && <Link to="/profile">Profile</Link>}
          {isAuthenticated ? (
            <button onClick={handleLogout} className="btn-logout">
              Logout
            </button>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          )}
        </>
      )}
    </nav>
  );
};

export default Navbar;
