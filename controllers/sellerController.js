import jwt from "jsonwebtoken";

// Seller Login
// =====================
export const sellerLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (
      password === process.env.SELLER_PASSWORD &&
      email === process.env.SELLER_EMAIL
    ) {
      const token = jwt.sign({ email }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });

      res.cookie("sellerToken", token, {
        httpOnly: true, // Prevent JavaScript to access cookie
        secure: process.env.NODE_ENV === "production", // Use secure cookies in production
        sameSite: process.env.NODE_ENV === "production" ? "none" : "strict", // CSRF PROTECTION
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      return res.json({ success: true, message: "Logged In" });
    } else {
      return res.json({ success: false, message: "Invalid Credentials" });
    }
  } catch (error) {
    res
      .status(400)
      .json({ success: false, message: "error in SellerLogin..." });
  }
};

// Seller isAuth
// =================
export const isSellerAuth = async (req, res) => {
  try {
    return res.json({ success: true });
  } catch (error) {
    console.error("isAuth error:", error);
    res
      .status(500)
      .json({ success: false, message: "Server error in isSellerAuth" });
  }
};

// Seller Logout
// =================

export const sellerLogout = async (req, res) => {
  try {
    res.clearCookie("sellerToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    });
    return res.json({ success: true, message: "Logged Out" });
  } catch (error) {
    res.status(400).json({ success: false, message: "Error in Logout..." });
  }
};
