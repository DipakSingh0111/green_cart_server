import jwt from "jsonwebtoken";
import user from "../models/user.js";
import bcrypt from "bcryptjs";

// =====================
// REGISTER USER
// =====================
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validations
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "All Fields Are Required.", successs: false });
    }

    // Check the exitsing User
    const existingUser = await user.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "user already exits" });
    }

    // hashed password
    const hashedPassword = await bcrypt.hash(password, 10);

    const User = await user.create({ name, email, password: hashedPassword });

    // JsonWebToken
    const token = jwt.sign({ id: User._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.cookie("token", token, {
      httpOnly: true, // Prevent JavaScript to access cookie
      secure: process.env.NODE_ENV === "production", // Use secure cookies in production
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict", // CSRF PROTECTION
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      message: "User Register Successfully...",
      token,
      User,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      User: { email: user.email, name: user.name },
      message: "Error in Register Controller...",
    });
  }
};

// =====================
// Login USER
// =====================
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // validation
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Email and password are required!" });
    }

    const User = await user.findOne({ email });

    if (!User) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, User.password);

    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid email or password!" });
    }

    // JsonWebToken
    const token = jwt.sign({ id: User._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.cookie("token", token, {
      httpOnly: true, // Prevent JavaScript to access cookie
      secure: process.env.NODE_ENV === "production", // Use secure cookies in production
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict", // CSRF PROTECTION
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      message: "User Login Successfully...",
      token,
      User,
    });
  } catch (error) {
    return res
      .status(400)
      .json({ success: false, message: "Error in Login Page..." });
  }
};

// =====================
// Check Auth
// =====================

export const isAuth = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res
        .status(400)
        .json({ success: false, message: "User ID not found" });
    }

    const userData = await user.findById(userId).select("-password");

    if (!userData) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    return res.json({ success: true, user: userData });
  } catch (error) {
    console.error("isAuth error:", error);
    res.status(500).json({ success: false, message: "Server error in isAuth" });
  }
};

// =====================
// Logout User
// =====================

export const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    });
    return res.json({ success: true, message: "Logged Out" });
  } catch (error) {
    res.status(400).json({ success: false, message: "Error in Logout..." });
  }
};
