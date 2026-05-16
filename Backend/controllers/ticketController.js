import Ticket from "../models/Ticket.js";

import {
    classifyTicket,
    generatePriority,
    generateDraftResponse,
} from "../services/aiService.js";

// Author creates a ticket
export const createTicket = async (req, res) => {
    try {
        const { book, subject, description } = req.body;

        // Input validation
        if (!subject || !subject.trim()) {
            return res.status(400).json({
                success: false,
                message: "Subject is required",
            });
        }

        if (!description || !description.trim()) {
            return res.status(400).json({
                success: false,
                message: "Description is required",
            });
        }

        // AI classification — run in parallel for speed
        let category, priority, aiDraft;

        try {
            [category, priority] = await Promise.all([
                classifyTicket(description),
                generatePriority(description),
            ]);

            // Generate draft with category context for better response
            aiDraft = await generateDraftResponse(description, category);
        } catch (aiError) {
            // Graceful degradation — ticket still gets created
            console.log("AI processing failed, using defaults:", aiError.message);
            category = "General Inquiry";
            priority = "Medium";
            aiDraft = "Thank you for reaching out to BookLeaf Publishing. Our support team will review your query and respond shortly.";
        }

        const ticket = await Ticket.create({
            author: req.user.id,
            book: book || null,
            subject: subject.trim(),
            description: description.trim(),
            category,
            priority,
            aiDraft,
        });

        // Notify admins via socket
        const io = req.app.get("io");
        io.emit("newTicket", {
            message: "New support ticket received",
            ticket,
        });

        res.status(201).json({
            success: true,
            ticket,
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Ticket creation failed. Please try again.",
        });
    }
};

// Author views own tickets
export const getMyTickets = async (req, res) => {
    try {
        const tickets = await Ticket.find({
            author: req.user.id,
        })
            .populate("book", "title isbn")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            tickets,
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch tickets",
        });
    }
};

// Admin views all tickets with filters
export const getAllTickets = async (req, res) => {
    try {
        const { category, priority, status, sort } = req.query;

        let filter = {};

        if (category) filter.category = category;
        if (priority) filter.priority = priority;
        if (status) filter.status = status;

        // Sort: oldest first for urgency, or by priority
        let sortOption = { createdAt: -1 };
        if (sort === "oldest") sortOption = { createdAt: 1 };
        if (sort === "priority") {
            sortOption = { priority: 1, createdAt: 1 };
        }

        const tickets = await Ticket.find(filter)
            .populate("author", "name email")
            .populate("book", "title isbn")
            .populate("assignedTo", "name email")
            .sort(sortOption);

        res.status(200).json({
            success: true,
            count: tickets.length,
            tickets,
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch tickets",
        });
    }
};

// Get single ticket by ID
export const getTicketById = async (req, res) => {
    try {
        const ticket = await Ticket.findById(req.params.id)
            .populate("author", "name email")
            .populate("book", "title isbn")
            .populate("assignedTo", "name email");

        if (!ticket) {
            return res.status(404).json({
                success: false,
                message: "Ticket not found",
            });
        }

        // If author, only allow own tickets
        if (req.user.role === "AUTHOR" && ticket.author._id.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: "Not authorized to view this ticket",
            });
        }

        res.status(200).json({
            success: true,
            ticket,
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch ticket",
        });
    }
};

// Admin responds to ticket
export const respondTicket = async (req, res) => {
    try {
        const { adminResponse, status, internalNotes, category, priority } = req.body;

        const ticket = await Ticket.findById(req.params.id);

        if (!ticket) {
            return res.status(404).json({
                success: false,
                message: "Ticket not found",
            });
        }

        // Update fields if provided
        if (adminResponse) ticket.adminResponse = adminResponse;
        if (status) ticket.status = status;
        if (internalNotes !== undefined) ticket.internalNotes = internalNotes;
        if (category) ticket.category = category;
        if (priority) ticket.priority = priority;

        await ticket.save();

        // Real-time notification to author
        const io = req.app.get("io");
        io.to(ticket.author.toString()).emit("ticketUpdated", {
            message: "Your ticket has been updated",
            ticket,
        });

        res.status(200).json({
            success: true,
            ticket,
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Failed to update ticket",
        });
    }
};

// Admin assigns ticket to self
export const assignTicket = async (req, res) => {
    try {
        const ticket = await Ticket.findById(req.params.id);

        if (!ticket) {
            return res.status(404).json({
                success: false,
                message: "Ticket not found",
            });
        }

        ticket.assignedTo = req.user.id;

        if (ticket.status === "Open") {
            ticket.status = "In Progress";
        }

        await ticket.save();

        res.status(200).json({
            success: true,
            message: "Ticket assigned to you",
            ticket,
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Failed to assign ticket",
        });
    }
};

// Dashboard stats for admin
export const getTicketStats = async (req, res) => {
    try {
        const [total, open, inProgress, resolved, closed, critical, high] = await Promise.all([
            Ticket.countDocuments(),
            Ticket.countDocuments({ status: "Open" }),
            Ticket.countDocuments({ status: "In Progress" }),
            Ticket.countDocuments({ status: "Resolved" }),
            Ticket.countDocuments({ status: "Closed" }),
            Ticket.countDocuments({ priority: "Critical" }),
            Ticket.countDocuments({ priority: "High" }),
        ]);

        res.status(200).json({
            success: true,
            stats: {
                total,
                open,
                inProgress,
                resolved,
                closed,
                critical,
                high,
            },
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch stats",
        });
    }
};