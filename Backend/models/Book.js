import mongoose from "mongoose";

const bookSchema = new mongoose.Schema(
    {
        title: {
            type: String,
        },

        isbn: {
            type: String,
        },

        genre: {
            type: String,
        },

        publication_date: {
            type: String,
        },

        status: {
            type: String,
        },

        mrp: {
            type: Number,
        },

        author_royalty_per_copy: {
            type: Number,
        },

        total_copies_sold: {
            type: Number,
        },

        total_royalty_earned: {
            type: Number,
        },

        royalty_paid: {
            type: Number,
        },

        royalty_pending: {
            type: Number,
        },

        last_royalty_payout_date: {
            type: String,
        },

        print_partner: {
            type: String,
        },

        available_on: [String],

        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
    },
    {
        timestamps: true,
    }
);

const Book = mongoose.model("Book", bookSchema);

export default Book;