import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";

import User from "./models/User.js";
import Book from "./models/Book.js";
import Ticket from "./models/Ticket.js";
import fs from "fs";

const data = JSON.parse(
    fs.readFileSync("./data/bookleafData.json", "utf-8")
);

dotenv.config();

mongoose.connect(process.env.MONGO_URI)
    .then(async () => {

        console.log("MongoDB Connected");

        // Remove old data
        await User.deleteMany();
        await Book.deleteMany();
        await Ticket.deleteMany();

        console.log("Old Data Removed");

        // Create admin user
        const adminPassword = await bcrypt.hash("admin123", 10);
        const admin = await User.create({
            name: "BookLeaf Admin",
            email: "admin@bookleaf.com",
            password: adminPassword,
            role: "ADMIN",
        });
        // agar aur admin chaiye toh yaha add k denge 

        console.log("Admin created → admin@bookleaf.com / admin123");

        // Loop authors and seed data
        for (const authorData of data.authors) {

            const hashedPassword = await bcrypt.hash("123456", 10);

            const user = await User.create({
                name: authorData.name,
                email: authorData.email,
                password: hashedPassword,
                role: "AUTHOR",
            });

            for (const book of authorData.books) {

                await Book.create({
                    ...book,
                    author: user._id,
                });

            }

            console.log(`Seeded author: ${authorData.name} → ${authorData.email} / 123456`);
        }

        console.log("\n✅ Seed Complete!");
        console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
        console.log("Admin Login:  admin@bookleaf.com / admin123");
        console.log("Author Login: priya.sharma@email.com / 123456");
        console.log("(All authors use password: 123456)");
        console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

        process.exit();

    })
    .catch((err) => {
        console.log(err);
    });