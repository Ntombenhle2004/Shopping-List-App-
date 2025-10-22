import React, { useState, useEffect } from "react";
import Navbar from "../components/navBAr";
import Input from "../components/Input";
import Button from "../components/Button";
import { useAppDispatch, useAppSelector } from "../../Reduxhooks";
import { updateProfile } from "../features/profileSlice";
import { updateUser } from "../features/loginSlice";
import { api } from "../api/api";
import * as bcrypt from "bcryptjs";
import Footer from "../components/footer";

const Profile: React.FC = () => {
  const dispatch = useAppDispatch();
  const profile = useAppSelector((state) => state.login.user);
  const [form, setForm] = useState({
    name: "",
    surname: "",
    email: "",
    cell: "",
    currentPassword: "",
    newPassword: "",
  });
  const [message, setMessage] = useState("");
  const [showEdit, setShowEdit] = useState(false);

  useEffect(() => {
    if (profile)
      setForm({
        name: profile.name,
        surname: profile.surname,
        email: profile.email,
        cell: profile.cell,
        currentPassword: "",
        newPassword: "",
      });
  }, [profile]);

  // Auto-clear feedback messages after 3 seconds
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;

    // Check if any field has changed
    const hasChanges =
      form.name !== profile.name ||
      form.surname !== profile.surname ||
      form.email !== profile.email ||
      form.cell !== profile.cell ||
      form.newPassword;

    if (!hasChanges) {
      setMessage("No changes detected. Update fields before saving.");
      return;
    }

    // If changing password, require current password
    if (form.newPassword) {
      if (!form.currentPassword) {
        setMessage("Enter your current password to set a new password.");
        return;
      }

      const isMatch = bcrypt.compareSync(
        form.currentPassword,
        profile.password
      );
      if (!isMatch) {
        setMessage("Current password is incorrect.");
        return;
      }

      if (form.currentPassword === form.newPassword) {
        setMessage("New password cannot be the same as the current password.");
        return;
      }
    }

    try {
      // Prepare updated data
      const updateData: any = {
        id: profile.id,
        name: form.name,
        surname: form.surname,
        email: form.email,
        cell: form.cell,
        password: profile.password, // Keep old password unless changed
      };

      if (form.newPassword) {
        updateData.password = bcrypt.hashSync(form.newPassword, 10);
      }

      // Update in DB
      await api.put(`/users/${profile.id}`, updateData);

      // Update Redux state
      dispatch(updateProfile(updateData));
      dispatch(updateUser(updateData));

      setMessage("Profile updated successfully!");
      setForm({ ...form, currentPassword: "", newPassword: "" });
      setShowEdit(false);
    } catch {
      setMessage("Failed to update profile. Check server connection.");
    }
  };

  return (
    <>
      <Navbar />
      <div className="section">
        <div className="profile-container">
          <h2>Profile</h2>
          {message && <p className="message">{message}</p>}

          {/* View Mode */}
          {!showEdit && profile && (
            <div className="profile-view">
              <p>
                <strong>Name:</strong> {profile.name}
              </p>
              <p>
                <strong>Surname:</strong> {profile.surname}
              </p>
              <p>
                <strong>Email:</strong> {profile.email}
              </p>
              <p>
                <strong>Cell:</strong> {profile.cell}
              </p>
              <Button onClick={() => setShowEdit(true)}>Edit Profile</Button>
            </div>
          )}

          {/* Edit Mode */}
          {showEdit && (
            <form className="profile-form" onSubmit={handleSubmit}>
              <Input
                name="name"
                placeholder="Name"
                value={form.name}
                onChange={handleChange}
              />
              <Input
                name="surname"
                placeholder="Surname"
                value={form.surname}
                onChange={handleChange}
              />
              <Input
                name="email"
                placeholder="Email"
                type="email"
                value={form.email}
                onChange={handleChange}
              />
              <Input
                name="cell"
                placeholder="Cell"
                value={form.cell}
                onChange={handleChange}
              />
              <Input
                name="currentPassword"
                type="password"
                placeholder="Current Password (required for new password)"
                value={form.currentPassword}
                onChange={handleChange}
              />
              <Input
                name="newPassword"
                type="password"
                placeholder="New Password"
                value={form.newPassword}
                onChange={handleChange}
              />
              <div className="form-buttons">
                <Button type="submit">Save Changes</Button>
                <Button type="button" onClick={() => setShowEdit(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Profile;
