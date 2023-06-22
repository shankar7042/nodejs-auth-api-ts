import express from "express";
import userRoutes from "./user.routes";
import authRoutes from "./auth.routes";

const router = express.Router();

router.get("/test", (_, res) => res.json({ msg: "api working!!" }));

router.use(userRoutes);
router.use(authRoutes);

export default router;
