import express from "express";
import authenticateUser from "../middleware/auth.js";
import { validate } from "../validators/joiValidator.js";
import {
    getAllItems,
    createItem,
    updateItem,
    deleteItem,
    getAllItemGroups,
    createItemGroup,
    updateItemGroup,
    deleteItemGroup,
    getAllSizes,
    createSize,
    updateSize,
    deleteSize,
    getAllRateVersions,
    createRateVersion,
    updateRateVersion,
    deleteRateVersion,
} from "../controllers/item.js";

const router = express.Router();

// Item routes
router.get("/", authenticateUser, getAllItems);
router.post("/create", authenticateUser, validate, createItem);
router.patch("/update/:id", authenticateUser, validate, updateItem);
router.delete("/delete/:id", authenticateUser, deleteItem);

// Item Group routes
router.get("/groups", authenticateUser, getAllItemGroups);
router.post("/groups/create", authenticateUser, validate, createItemGroup);
router.patch("/groups/update/:id", authenticateUser, validate, updateItemGroup);
router.delete("/groups/delete/:id", authenticateUser, deleteItemGroup);

// Size routes
router.get("/sizes", authenticateUser, getAllSizes);
router.post("/sizes/create", authenticateUser, validate, createSize);
router.patch("/sizes/update/:id", authenticateUser, validate, updateSize);
router.delete("/sizes/delete/:id", authenticateUser, deleteSize);

// Rate Version routes
router.get("/rates", authenticateUser, getAllRateVersions);
router.post("/rates/create", authenticateUser, validate, createRateVersion);
router.patch("/rates/update/:id", authenticateUser, validate, updateRateVersion);
router.delete("/rates/delete/:id", authenticateUser, deleteRateVersion);

export default router;