import User from "../models/User.model";
import Admin from "../models/Admin.model";
import { hashString } from "./hash.util";

export async function seedDefaultAdmin() {
    try {
        // Check if default admin already exists to avoid duplicates
        const existingUser = await User.findOne({ where: { Email: "admin@lab.control" } });
        if (existingUser) {
            console.log("Default admin already exists");
            return;
        }

        // Create default user
        const defaultUser = await User.create({
            Rut: "00000000-0",
            Email: "admin@lab.control",
            Name: "Default",
            LastName: "Administrator"
        });

        // Create admin with hashed password
        await Admin.create({
            UserId: defaultUser.Id,
            Password: await hashString("admin123")
        });

        console.log("Default admin created successfully");
    } catch (error) {
        console.error("Error seeding default admin:", error);
    }
}
