import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema(
    {
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        book: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Book",
            default: null,
        },

        subject: {
            type: String,
            required: true,
            trim: true,
        },

        description: {
            type: String,
            required: true,
        },

        category: {
            type: String,
            enum: [
                "Royalty & Payments",
                "ISBN & Metadata Issues",
                "Printing & Quality",
                "Distribution & Availability",
                "Book Status & Production Updates",
                "General Inquiry",
            ],
            default: "General Inquiry",
        },

        priority: {
            type: String,
            enum: ["Critical", "High", "Medium", "Low"],
            default: "Medium",
        },

        status: {
            type: String,
            enum: ["Open", "In Progress", "Resolved", "Closed"],
            default: "Open",
        },

        aiDraft: {
            type: String,
        },

        adminResponse: {
            type: String,
        },

        internalNotes: {
            type: String,
        },

        assignedTo: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
    },
    {
        timestamps: true,
    }
);

const Ticket = mongoose.model("Ticket", ticketSchema);

export default Ticket;