import { useState } from "react";
import { FaLock } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import { Link } from "react-router-dom";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:3000/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage(data.message);
        alert("Password reset successful. You can now login with new password.");
      } else {
        setMessage(data.error);
        alert(data.error);
      }
    } catch (error) {
      console.error("Error resetting password:", error);
      alert("Something went wrong. Please try again later.");
    }
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

      <div className="p-6 bg-white/33 rounded-lg shadow-md w-80 md:max-w-lg relative">
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

        {message && (
          <p className="mt-4 text-center text-sm text-green-600">{message}</p>
        )}
      </div>
    </div>
  );
}

export default ForgotPassword;
