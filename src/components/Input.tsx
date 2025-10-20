// import React from "react";

// interface InputProps {
//   type?: string;
//   placeholder?: string;
//   value?: string;
//   onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
//   name?: string;
// }

// const Input: React.FC<InputProps> = ({
//   type = "text",
//   placeholder,
//   value,
//   onChange,
//   name,
// }) => {
//   return (
//     <input
//       type={type}
//       placeholder={placeholder}
//       value={value}
//       onChange={onChange}
//       name={name}
//       className="input"
//     />
//   );
// };

// export default Input;


import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input: React.FC<InputProps> = ({ type = "text", ...props }) => {
  return (
    <input
      type={type}
      {...props}
      className={`input ${props.className || ""}`} // ✅ keep your styling + allow extra classes
    />
  );
};

export default Input;
