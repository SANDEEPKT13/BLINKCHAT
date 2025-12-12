import { Router } from "express";
import {login, logout , signup } from "../controller/auth.controller.js";
const router = Router();


router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);   // 3 apis);


export default router;
