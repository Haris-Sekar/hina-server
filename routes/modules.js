import express from "express";
import authenticateUser from "../middleware/auth.js";
import {
    getAllModules,
    updateModule,
    getMouldeCount
} from "../controllers/modules.js";

const router = express.Router();

router.get("/", authenticateUser, getAllModules);
router.patch("/update/:id", authenticateUser, updateModule);
router.get("/count", authenticateUser, getMouldeCount);

export default router;