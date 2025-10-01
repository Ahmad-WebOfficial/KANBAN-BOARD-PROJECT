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

app.use(express.json());
app.use(cors());
connectToMongoDB();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: "Too many login attempts. Try again after 15 minutes." },
  keyGenerator: (req) => req.body.email || req.ip,
});

const signupLimiter = rateLimit({
  windowMs: 30 * 60 * 1000,
  max: 4,
  message: { error: "Too many signup attempts. Try again after 30 minutes." },
  keyGenerator: (req) => req.body.email || req.ip,
});

const forgetLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  message: {
    error: "Too many forgot password attempts. Try again after 1 hour.",
  },
  keyGenerator: (req) => req.body.email || req.ip,
});

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.status(401).json({ error: "Unauthorized" });

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ error: "Forbidden" });

    req.user = decoded;
    next();
  });
};

// SIGNUP
app.post("/signup", signupLimiter, async (req, res) => {
  const { name, email, address, password } = req.body;

  if (!email || !password || !name) {
    return res
      .status(400)
      .json({ error: "Name, email and password are required" });
  }

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

    res.status(201).json({
      message: "Signup successful",
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

// LOGIN
app.post("/login", loginLimiter, async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  try {
    const user = await Person.findOne({ email });
    if (!user)
      return res.status(401).json({ error: "Invalid Email or Password" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ error: "Invalid Email or Password" });

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "2d" });

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

//FORGET
app.post("/forgot-password", forgetLimiter, async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ error: "Email and new password are required" });
  }

  try {
    const user = await Person.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: "Password updated successfully." });
  } catch (error) {
    console.error("Forgot Password Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/tasks", authenticateToken, async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.user.id });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

app.post("/tasks", authenticateToken, async (req, res) => {
  const { name, status } = req.body;
  if (!name) return res.status(400).json({ error: "Task name is required" });

  try {
    const newTask = new Task({
      name,
      status: status || "todo",
      userId: req.user.id,
    });
    await newTask.save();
    res.status(201).json(newTask);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

app.delete("/tasks/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  try {
    const task = await Task.findById(id);
    if (!task) return res.status(404).json({ error: "Task not found" });

    if (task.userId.toString() !== req.user.id)
      return res.status(403).json({ error: "Forbidden" });

    await Task.findByIdAndDelete(id);
    res.json({ message: "Task deleted" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

app.put("/tasks/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!["todo", "inprogress", "done"].includes(status)) {
    return res.status(400).json({ error: "Invalid status value" });
  }

  try {
    const task = await Task.findById(id);
    if (!task) return res.status(404).json({ error: "Task not found" });

    if (task.userId.toString() !== req.user.id)
      return res.status(403).json({ error: "Forbidden" });

    task.status = status;
    await task.save();

    res.json(task);
  } catch (err) {
    console.error("Update Task Error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
