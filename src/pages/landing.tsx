import React from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../components/footer";


const Landing: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-container">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>
            Welcome to <span>Shopping List</span>
          </h1>
          <p>
            Organize your shopping lists easily. Create, manage, and share your
            lists in one place — simple, fast, and secure.
          </p>
          <div className="hero-buttons">
            <button
              className="primary-btn"
              onClick={() => navigate("/register")}
            >
              Get Started
            </button>
            <button
              className="secondary-btn"
              onClick={() => navigate("/login")}
            >
              Log In
            </button>
          </div>
        </div>

        <div className="hero-image">
          <img
            src="https://cdn-icons-png.flaticon.com/512/3081/3081559.png"
            alt="Shopping Illustration"
          />
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <h2>Why You’ll Love It</h2>
        <div className="features-grid">
          <div className="feature-card">
            <img
              src="https://cdn-icons-png.flaticon.com/512/992/992700.png"
              alt="Easy Management"
            />
            <h3>Easy Management</h3>
            <p>
              Add, edit, and track all your shopping lists with just a few
              clicks.
            </p>
          </div>

          <div className="feature-card">
            <img
              src="https://cdn-icons-png.flaticon.com/512/3649/3649460.png"
              alt="Cloud Storage"
            />
            <h3>Cloud Storage</h3>
            <p>Your lists are saved securely, accessible anywhere, anytime.</p>
          </div>

          <div className="feature-card">
            <img
              src="https://cdn-icons-png.flaticon.com/512/3039/3039387.png"
              alt="Share Lists"
            />
            <h3>Share Lists</h3>
            <p>
              Share your lists with friends or family easily through one link.
            </p>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="about">
        <h2>About Shopping List</h2>
        <p>
          Shopping List is a simple and modern web app designed to make your
          shopping experience efficient. Whether you're planning groceries or
          organizing product categories, it helps you stay on top of everything.
        </p>
      </section>

      <Footer />

    </div>
  );
};

export default Landing;
