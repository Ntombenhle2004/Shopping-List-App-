import React from "react";
import { Link } from "react-router-dom";


const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <p>© {new Date().getFullYear()} shoppingList. All rights reserved.</p>
      <nav>
        <div className="footer-link">
          <Link to="/privacy">Privacy & Security</Link>
        </div>
      </nav>
    </footer>
  );
};

export default Footer;
