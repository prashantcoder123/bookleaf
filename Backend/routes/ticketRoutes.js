import express from "express";

import {
    createTicket,
    getMyTickets,
    getAllTickets,
    getTicketById,
    respondTicket,
    assignTicket,
    getTicketStats,
    deflectTicket,
} from "../controllers/ticketController.js";

import {
    protect,
    adminOnly,
} from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/deflect", protect, deflectTicket);

// Author routes
router.post("/", protect, createTicket);
router.get("/my", protect, getMyTickets);

// Admin routes
router.get("/stats", protect, adminOnly, getTicketStats);
router.get("/", protect, adminOnly, getAllTickets);
router.get("/:id", protect, getTicketById);
router.put("/:id/respond", protect, adminOnly, respondTicket);
router.put("/:id/assign", protect, adminOnly, assignTicket);

export default router;