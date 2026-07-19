const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors({ origin: process.env.FRONTEND_URL || "*" }));
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");
  })
  .catch((err) => {
    console.log("MongoDB Error:", err);
  });

app.get("/", (req, res) => {
  res.send("Backend is running!");
});

const verifyToken = require("./middleware/auth");
const User = require("./models/User");

// Routers
const onboardingRoutes = require("./routes/onboardingRoutes");
app.use("/api/onboarding", onboardingRoutes);

const routineRoutes = require("./routes/routineRoutes");
app.use("/api/routine", routineRoutes);

app.post("/register", async (req, res) => {
  try {
    const { username, email, name, avatar, password } = req.body;

    const existingUser = await User.findOne({ username });

    if (existingUser) {
      return res.json({
        success: false,
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      username,
      email,
      name,
      avatar,
      bio: "Keep pushing, stay consistent!",
      targetGoal: 85,
      password: hashedPassword,
    });

    await user.save();

    res.json({
      success: true,
      message: "Registration successful",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });

    if (!user) {
      return res.json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const validPassword = await bcrypt.compare(password, user.password);

    if (validPassword) {
      const token = jwt.sign(
        {
          userId: user._id,
          username: user.username,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "7d",
        },
      );

      return res.json({
        success: true,
        token,
      });
    }

    res.json({
      success: false,
      message: "Invalid credentials",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

app.get("/profile", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      username: user.username,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      bio: user.bio,
      targetGoal: user.targetGoal,
      academicProfile: user.academicProfile || {},
      onboardingComplete: user.onboardingComplete || false,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

app.post("/profile", verifyToken, async (req, res) => {
  try {
    const { email, avatar, bio, targetGoal, name } = req.body;
    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (email) user.email = email;
    if (avatar) user.avatar = avatar;
    if (bio !== undefined) user.bio = bio;
    if (targetGoal !== undefined) user.targetGoal = targetGoal;
    if (name !== undefined) user.name = name;

    await user.save();

    res.json({
      success: true,
      message: "Profile updated successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

app.listen(5000, () => {
  console.log("Server Running");
});

