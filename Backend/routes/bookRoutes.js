import express from "express";

import Book from "../models/Book.js";

import {
    protect,
    adminOnly,
} from "../middleware/authMiddleware.js";

const router = express.Router();



// AUTHOR → ADD NEW BOOK
router.post(
    "/",
    protect,
    async (req, res) => {
        try {
            const { title, genre, isbn } = req.body;
            
            if (!title) {
                return res.status(400).json({ message: "Book title is required" });
            }

            const book = await Book.create({
                title,
                genre: genre || "Uncategorized",
                isbn: isbn || "Pending Assignment",
                status: "In Production - Manuscript Review",
                author: req.user._id,
                total_copies_sold: 0,
                total_royalty_earned: 0,
                royalty_paid: 0,
                royalty_pending: 0,
            });

            res.status(201).json(book);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
);

// AUTHOR → ONLY OWN BOOKS
router.get(
    "/my-books",
    protect,
    async (req, res) => {

        try {

            const books = await Book.find({
                author: req.user._id,
            });

            res.json(books);

        } catch (error) {

            res.status(500).json({
                message: error.message,
            });

        }

    }
);




// ADMIN → ALL BOOKS
router.get(
    "/all-books",
    protect,
    adminOnly,
    async (req, res) => {

        try {

            const books = await Book.find()
                .populate("author", "name email");

            res.json(books);

        } catch (error) {

            res.status(500).json({
                message: error.message,
            });

        }

    }
);

export default router;