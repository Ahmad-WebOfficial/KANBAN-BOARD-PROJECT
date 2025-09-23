import React, { useState } from "react";
import { Link } from "react-router-dom";
import img3 from "../images/img6.jpg";
import { IoMdClose } from "react-icons/io";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [nameError, setNameError] = useState("");
  const [addressError, setAddressError] = useState("");

  const [loading, setLoading] = useState(false);

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
      setPasswordError("Password must be between 4 to 8 characters");
      error = true;
    } else {
      setPasswordError("");
    }

    if (!name) {
      setNameError("Name is required");
      error = true;
    } else if (name.length < 3 || name.length > 22) {
      setNameError("Name must be between 3 to 22 characters");
      error = true;
    } else if (!/^[A-Za-z]+( [A-Za-z]+)*$/.test(name)) {
      setNameError("Name can only contain letters and spaces.");
      error = true;
    } else {
      setNameError("");
    }

    if (!address) {
      setAddressError("Address is required");
      error = true;
    } else {
      setAddressError("");
    }

    if (error) return;

    setLoading(true);

    try {
      const startTime = Date.now();

      const response = await fetch("http://localhost:3000/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, address }),
      });

      const data = await response.json();

      const elapsed = Date.now() - startTime;
      const delay = 3000;
      if (elapsed < delay) {
        await new Promise((resolve) => setTimeout(resolve, delay - elapsed));
      }

      if (response.ok) {
        localStorage.setItem("token", data.token);
        alert("✅ Signup successful!");
        setName("");
        setEmail("");
        setPassword("");
        setAddress("");
      } else {
        alert("❌ Error: " + (data.error || "Something went wrong"));
      }
    } catch (err) {
      alert("❌ Network error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      className="min-h-screen flex p-12 md:p-3 items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: `url(${img3})` }}
    >
      <Link
        to="/"
        className="absolute top-3 left-3 text-gray-800 hover:text-gray-900 transition-colors"
        title="Close"
      >
        <IoMdClose size={28} />
      </Link>
      <form
        onSubmit={handleSubmit}
        className="bg-white/60 flex flex-col gap-1 p-6 rounded-lg max-w-md w-95"
      >
        <h1 className="font-bold text-2xl md:text-3xl md:mb-7 text-center mb-5">
          Sign Up
        </h1>

        <input
          className="w-full p-2 border mb-4 rounded"
          type="text"
          value={name}
          placeholder="Name"
          onChange={(e) => setName(e.target.value)}
          disabled={loading}
        />
        <p className="text-red-600 text-sm mb-2 -mt-4">{nameError}</p>

        <input
          className="w-full p-2 border mb-4 rounded"
          type="email"
          value={email}
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
        />
        <p className="text-red-600 text-sm mb-2 -mt-4">{emailError}</p>

        <input
          className="w-full p-2 border mb-4 rounded"
          type="text"
          value={address}
          placeholder="Address"
          onChange={(e) => setAddress(e.target.value)}
          disabled={loading}
        />
        <p className="text-red-600 text-sm mb-2 -mt-4">{addressError}</p>

        <input
          className="w-full p-2 border mb-4 rounded"
          type="password"
          value={password}
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
          disabled={loading}
        />
        <p className="text-red-600 text-sm mb-2 -mt-4">{passwordError}</p>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Signing up..." : "Sign Up"}
        </button>

        <p className="text-center mt-4 text-1rem flex justify-center items-center gap-2">
          <span>Already have an account?</span>
          <Link to="/login">
            <button
              type="button"
              className="text-blue-600 -ml-2 hover:text-blue-800"
              disabled={loading}
            >
              Login
            </button>
          </Link>
        </p>
      </form>
    </section>
  );
};

export default SignUp;
