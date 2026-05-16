import User from "../models/User.js";

// Get user profile
export const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update user profile
export const updateProfile = async (req, res) => {
    try {
        const { name, phone, bankDetails } = req.body;

        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (name) user.name = name;
        if (phone !== undefined) user.phone = phone;
        
        if (bankDetails) {
            if (bankDetails.accountName !== undefined) user.bankDetails.accountName = bankDetails.accountName;
            if (bankDetails.accountNumber !== undefined) user.bankDetails.accountNumber = bankDetails.accountNumber;
            if (bankDetails.ifscCode !== undefined) user.bankDetails.ifscCode = bankDetails.ifscCode;
            if (bankDetails.bankName !== undefined) user.bankDetails.bankName = bankDetails.bankName;
        }

        await user.save();

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            phone: user.phone,
            bankDetails: user.bankDetails,
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
