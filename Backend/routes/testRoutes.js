import express from "express";

import {
    protect,
    adminOnly,
} from "../middleware/authMiddleware.js";

const router = express.Router();


// AUTHOR OR ADMIN
router.get("/profile", protect, (req, res) => {

    res.json({
        message: "Protected route working",
        user: req.user,
    });

});



// ADMIN ONLY
router.get(
    "/admin",
    protect,
    adminOnly,
    (req, res) => {

        res.json({
            message: "Welcome Admin",
        });

    }
);

export default router;