import React from "react";
import Footer from "../components/footer";
import Navbar from "../components/navBAr";


const PrivacySecurity: React.FC = () => {
  return (
    <div>
      <Navbar />
      <div className="privacy-container">
        <h2>Privacy & Security</h2>
        <p className="intro">
          We are committed to protecting your personal information and ensuring
          your privacy in compliance with relevant data protection laws and
          regulations.
        </p>

        <section className="privacy-section">
          <h3>🔒 Data Protection</h3>
          <p>
            All personal data you provide (such as name, email, and contact
            details) is securely stored and never shared with unauthorized third
            parties. We apply industry-standard encryption to safeguard
            sensitive information.
          </p>
        </section>

        <section className="privacy-section">
          <h3>📑 Compliance</h3>
          <p>
            Our system complies with data protection regulations, including{" "}
            <strong>POPIA (Protection of Personal Information Act)</strong> in
            South Africa and <strong>GDPR</strong> for international users. This
            ensures lawful collection, processing, and usage of your
            information.
          </p>
        </section>

        <section className="privacy-section">
          <h3>👤 User Control</h3>
          <p>
            You have the right to access, update, or delete your personal data
            at any time. Profile management options allow you to review your
            information and update details as needed.
          </p>
        </section>

        <section className="privacy-section">
          <h3>⚠️ Security Measures</h3>
          <p>
            We implement security best practices such as authentication,
            role-based access control, and regular monitoring to protect your
            account against unauthorized access.
          </p>
        </section>

        <section className="privacy-section">
          <h3>📧 Contact Us</h3>
          <p>
            If you have any concerns or requests about your data, you may
            contact us at{" "}
            <a href="mailto:support@example.com">
              ngcobontombenhle434@gmail.com
            </a>
            .
          </p>
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default PrivacySecurity;
