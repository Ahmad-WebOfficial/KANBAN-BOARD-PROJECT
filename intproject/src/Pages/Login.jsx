


import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { IoMdClose } from "react-icons/io";
import img3 from '../images/img5.jpg';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const login = localStorage.getItem("login");
    if (login) {
      navigate("/dashboard");
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    let error = false;

    if (!email) {
      setEmailError("Email is required");
      error = true;
    } else {
      setEmailError("");
    }

    if (!password) {
      setPasswordError("Password is required.");
      error = true;
    } else if (password.length < 4 || password.length > 8) {
      setPasswordError("Password must be between 4 to 8 characters.");
      error = true;
    } else {
      setPasswordError("");
    }

    if (error) return;

    try {
      const response = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: JSON.stringify({ email, password })
      });

      const contentType = response.headers.get("content-type");

      if (!response.ok) {
        const text = await response.text();
        console.error("Server error:", text);
        alert("❌ Login failed: " + text);
        return;
      }

      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text();
        console.error("Expected JSON but got:", text);
        alert("❌ Invalid response from server.");
        return;
      }

      const data = await response.json();

      localStorage.setItem("login", "true");
      localStorage.setItem("token", data.token);

      navigate("/dashboard", { replace: true });

    } catch (err) {
      alert("❌ Network error: " + err.message);
      console.error("Fetch error:", err);
    }
  };

  return (
    <section
      className="min-h-screen flex p-12 md:p-3 items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: `url(${img3})` }}
    >
      <Link
        to="/"
        className="absolute top-3 left-3 text-gray-700 hover:text-gray-700 transition-colors"
        title="Close"
      >
        <IoMdClose size={28} />
      </Link>

      <form
        onSubmit={handleSubmit}
        className="relative bg-white/60 flex flex-col gap-1 p-6 rounded-lg max-w-md w-95"
      >
        <h1 className="font-bold text-2xl md:text-3xl md:mb-7 text-center mb-5">
          Login
        </h1>

        <input
          className="w-full p-2 border mb-4 rounded"
          type="email"
          value={email}
          placeholder="Email Address"
          onChange={(e) => setEmail(e.target.value)}
        />
        <p className="text-red-600 text-sm mb-2 -mt-4">{emailError}</p>

        <input
          className="w-full p-2 border mb-4 rounded"
          type="password"
          value={password}
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <p className="text-red-600 text-sm -mt-4 mb-2">{passwordError}</p>

        <Link
          to="/forgot-password"
          className="text-sm text-blue-600 text-end cursor-pointer mb-3 -mt-1 hover:underline"
        >
          Forgot Password?
        </Link>

        <button
          type="submit"
          className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700"
        >
          Login
        </button>
      </form>
    </section>
  );
};

export default Login;
