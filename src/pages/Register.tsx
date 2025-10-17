// import React, { useState, useEffect } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { useAppDispatch, useAppSelector } from "../../Reduxhooks";
// import { registerUser, clearMessage } from "../features/registerSlice";
// import Input from "../components/Input";
// import Button from "../components/Button";
// import Navbar from "../components/navBAr";

// const Register: React.FC = () => {
//   const dispatch = useAppDispatch();
//   const navigate = useNavigate();
//   const { loading, error, success } = useAppSelector((state) => state.register);

//   const [form, setForm] = useState({
//     name: "",
//     surname: "",
//     email: "",
//     password: "",
//     cell: "",
//   });

// useEffect(() => {
//   dispatch(clearMessage());
// }, [dispatch]);


//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     // Basic validation
//     if (
//       !form.name ||
//       !form.surname ||
//       !form.email ||
//       !form.password ||
//       !form.cell
//     ) {
//       alert("Please fill in all fields.");
//       return;
//     }

//     const res = await dispatch(registerUser(form));
//     if (res.meta.requestStatus === "fulfilled") {
//       navigate("/login");
//     }
//   };

//   return (
//     <>
//       <Navbar />
//       <div className="form-container">
//         <h2>Register</h2>
//         {error && <p className="error">{error}</p>}
//         {success && <p className="success">{success}</p>}
//         <form onSubmit={handleSubmit}>
//           <Input
//             name="name"
//             placeholder="Name"
//             value={form.name}
//             onChange={handleChange}
//           />
//           <Input
//             name="surname"
//             placeholder="Surname"
//             value={form.surname}
//             onChange={handleChange}
//           />
//           <Input
//             name="email"
//             placeholder="Email"
//             value={form.email}
//             onChange={handleChange}
//           />
//           <Input
//             name="password"
//             type="password"
//             placeholder="Password"
//             value={form.password}
//             onChange={handleChange}
//           />
//           <Input
//             name="cell"
//             placeholder="Cell"
//             value={form.cell}
//             onChange={handleChange}
//           />
//           <Button type="submit">
//             {loading ? "Registering..." : "Register"}
//           </Button>
//           <p>Already have an account? <Link to="/login">Login</Link></p>
//         </form>
//       </div>
//     </>
//   );
// };

// export default Register;


import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../Reduxhooks";
import { registerUser, clearMessage } from "../features/registerSlice";
import Input from "../components/Input";
import Button from "../components/Button";
import Navbar from "../components/navBAr";

const Register: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, error, success } = useAppSelector((state) => state.register);
  const [validationError, setValidationError] = useState("");

  const [form, setForm] = useState({
    name: "",
    surname: "",
    email: "",
    password: "",
    cell: "",
  });

  useEffect(() => {
    dispatch(clearMessage());
  }, [dispatch]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setValidationError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (
      !form.name ||
      !form.surname ||
      !form.email ||
      !form.password ||
      !form.cell
    ) {
      setValidationError("Please fill in all fields.");
      return;
    }

    const res = await dispatch(registerUser(form));
    if (res.meta.requestStatus === "fulfilled") {
      setTimeout(() => navigate("/login"), 1500);
    }
  };

  return (
    <>
      <Navbar />
      <div className="form-container">
        <h2>Register</h2>
        {validationError && <p className="error">{validationError}</p>}
        {error && <p className="error">{error}</p>}
        {success && <p className="success">{success}</p>}
        <form onSubmit={handleSubmit}>
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
            value={form.email}
            onChange={handleChange}
          />
          <Input
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
          />
          <Input
            name="cell"
            placeholder="Phone Number"
            value={form.cell}
            onChange={handleChange}
          />
          <Button type="submit">
            {loading ? "Registering..." : "Register"}
          </Button>
          <p>
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </form>
      </div>
    </>
  );
};

export default Register;