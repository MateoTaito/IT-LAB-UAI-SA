import User from "../models/User.model";
import Admin from "../models/Admin.model";
import Role from "../models/Role.model";
import UserRole from "../models/UserRole.model";
import Reason from "../models/Reason.model";
import { hashString } from "./hash.util";

export async function seedDefaultAdmin() {
    try {
        // Check if default admin already exists to avoid duplicates
        const existingUser = await User.findOne({
            where: { Email: "admin@lab.control" },
        });

        const existingSuperAdmin = await User.findOne({
            where: { Email: "superAdmin@lab.control" },
        });

        if (existingUser && existingSuperAdmin) {
            console.log("Default admins already exists");
            return;
        }

        if (existingUser && !existingSuperAdmin) {
            const superAdmin = await User.create({
                Rut: "999999999-9",
                Email: "superAdmin@lab.control",
                Name: "Super",
                LastName: "Administrator",
            });

            await Admin.create({
                UserId: superAdmin.Id,
                Password: await hashString("superAdmin123"),
            });

            let adminRole = await Role.findOne({
                where: { Name: "Administrator" },
            });
            if (!adminRole) {
                adminRole = await Role.create({
                    Name: "Administrator",
                    Description: "System administrator with full privileges",
                });
            }

            await UserRole.create({
                UserId: superAdmin.Id,
                RoleId: adminRole.Id,
            });

            return;
        }

        if (!existingUser && existingSuperAdmin) {
            const defaultUser = await User.create({
                Rut: "00000000-0",
                Email: "admin@lab.control",
                Name: "Default",
                LastName: "Administrator",
            });

            await Admin.create({
                UserId: defaultUser.Id,
                Password: await hashString("superAdmin123"),
            });

            let adminRole = await Role.findOne({
                where: { Name: "Administrator" },
            });
            if (!adminRole) {
                adminRole = await Role.create({
                    Name: "Administrator",
                    Description: "System administrator with full privileges",
                });
            }

            await UserRole.create({
                UserId: defaultUser.Id,
                RoleId: adminRole.Id,
            });

            return;
        }

        // Create default user
        const defaultUser = await User.create({
            Rut: "00000000-0",
            Email: "admin@lab.control",
            Name: "Default",
            LastName: "Administrator",
        });

        const superAdmin = await User.create({
            Rut: "999999999-9",
            Email: "superAdmin@lab.control",
            Name: "Super",
            LastName: "Administrator",
        });

        // Create admin with hashed password
        await Admin.create({
            UserId: defaultUser.Id,
            Password: await hashString("admin123"),
        });

        await Admin.create({
            UserId: superAdmin.Id,
            Password: await hashString("superAdmin123"),
        });

        // Create or get admin role
        let adminRole = await Role.findOne({
            where: { Name: "Administrator" },
        });
        if (!adminRole) {
            adminRole = await Role.create({
                Name: "Administrator",
                Description: "System administrator with full privileges",
            });
        }

        // Assign admin role to the default admin user
        await UserRole.create({
            UserId: defaultUser.Id,
            RoleId: adminRole.Id,
        });

        await UserRole.create({
            UserId: superAdmin.Id,
            RoleId: adminRole.Id,
        });

        console.log(
            "Default admin created successfully with Administrator role",
        );
    } catch (error) {
        console.error("Error seeding default admin:", error);
    }
}

export async function seedDefaultReasons() {
    try {
        const defaultReasons = [
            { Name: "Study", Description: "Individual or group study session" },
            {
                Name: "Project Work",
                Description: "Working on academic or research projects",
            },
            { Name: "Tutorial", Description: "Attending or giving tutorials" },
            { Name: "Meeting", Description: "Attending scheduled meetings" },
            { Name: "Research", Description: "Conducting research activities" },
            {
                Name: "Laboratory Work",
                Description: "Using laboratory equipment and facilities",
            },
            { Name: "General", Description: "General purpose visit" },
        ];

        for (const reasonData of defaultReasons) {
            const existingReason = await Reason.findOne({
                where: { Name: reasonData.Name },
            });
            if (!existingReason) {
                await Reason.create(reasonData);
                console.log(`Created default reason: ${reasonData.Name}`);
            }
        }

        console.log("Default reasons seeding completed");
    } catch (error) {
        console.error("Error seeding default reasons:", error);
    }
}
