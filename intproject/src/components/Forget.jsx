import { useState } from "react";
import { FaLock } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import { Link } from "react-router-dom";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Password reset request:");
    console.log("Email:", email);
    console.log("New Password:", password);
  };

  return (
    <div
      className="h-screen w-full flex justify-center items-center relative"
      style={{
        background: `linear-gradient(135deg, #6B21A8 0%, #3B82F6 50%, #FBBF24 100%)`,
      }}
    >
      <Link
        to="/Login"
        className="fixed top-4 left-4 text-gray-800 hover:text-gray-900 transition-colors z-50 bg-white rounded-full p-1 shadow-md"
        title="Close"
      >
        <IoMdClose size={28} />
      </Link>

      <div className="p-6 bg-white rounded-lg shadow-md w-80 md:max-w-lg relative">
        <FaLock className="text-4xl mb-4 mx-auto " />

        <h2 className="text-3xl font-bold mb-2 text-center">
          Forgot Password?
        </h2>
        <p className="text-center -mt-1 text-sm md:text-lg mb-4">
          You can reset your password here:
        </p>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Enter your email"
            className="p-2 border rounded w-full mb-3"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Enter new password"
            className="p-2 border rounded w-full mb-4"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            className="bg-blue-600 text-white px-4 py-2 rounded w-full"
            type="submit"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}

export default ForgotPassword;
