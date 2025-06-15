import express from "express";
import {
  isSellerAuth,
  sellerLogin,
  sellerLogout,
} from "../controllers/sellerController.js";
import authSeller from "../middlewares/aurhSeller.js";

const sellerRoute = express.Router();

sellerRoute.post("/login", sellerLogin);
sellerRoute.get("/is-auth", authSeller, isSellerAuth);
sellerRoute.get("/logout", authSeller, sellerLogout);

export default sellerRoute;
