import express from "express";
import cors from "cors";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import rateLimit from "express-rate-limit";

import connectToMongoDB from "./Mongo.js";
import { Person, Task } from "./Person.js";

const app = express();
const PORT = 3000;
const JWT_SECRET = "your_secret_key";
const JWT_REFRESH_SECRET = "your_refresh_secret_key";

app.use(express.json());
app.use(cors());
connectToMongoDB();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { error: "Too many login attempts. Try again after 15 minutes." },
  standardHeaders: true,
  legacyHeaders: false,
});

const signupLimiter = rateLimit({
  windowMs: 30 * 60 * 1000,
  max: 7,
  message: { error: "Too many signup attempts. Try again after 30 minutes." },
  standardHeaders: true,
  legacyHeaders: false,
});
const ForgetLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 4,
  message: { error: "Too many signup attempts. Try again after 1 hour." },
  standardHeaders: true,
  legacyHeaders: false,
});
// SIGNUP page
app.post("/signup", signupLimiter, async (req, res) => {
  const { name, email, address, password } = req.body;

  try {
    const existingUser = await Person.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new Person({
      name,
      email,
      address,
      password: hashedPassword,
    });

    await newUser.save();

    const token = jwt.sign({ id: newUser._id }, JWT_SECRET, {
      expiresIn: "1h",
    });
    const refreshToken = jwt.sign({ id: newUser._id }, JWT_REFRESH_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
    });

    res.status(201).json({
      message: "Signup successful",
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        address: newUser.address,
      },
    });
  } catch (error) {
    console.error("Signup Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// LOGIN page
app.post("/login", loginLimiter, async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await Person.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Invalid Email or Password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid Email or Password" });
    }

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1h" });
    const refreshToken = jwt.sign({ id: user._id }, JWT_REFRESH_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
    });

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        address: user.address,
      },
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Forget Password
app.post("/forgot-password", ForgetLimiter, async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await Person.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: "Password updated successfully." });
  } catch (error) {
    console.error("Forgot Password Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
app.get("/tasks", async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// Add new task
app.post("/tasks", async (req, res) => {
  const { name, status } = req.body;
  if (!name) return res.status(400).json({ error: "Task name is required" });

  try {
    const newTask = new Task({ name, status: status || "todo" });
    await newTask.save();
    res.status(201).json(newTask);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

app.delete("/tasks/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await Task.findByIdAndDelete(id);
    res.json({ message: "Task deleted" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
