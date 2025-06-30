import API_Users from "../lib/AxiosUsers";
import axios from "axios"; // Importar axios para el endpoint externo

export interface User {
    Id: number | string;
    Rut: string;
    Email: string;
    Name: string;
    LastName: string;
    Status: string;
    createdAt?: string;
    updatedAt?: string;
    Roles?: string[];
    Careers?: string[];
}

/**
 * Create a new user
 * 
 * @param userData Object containing user details
 * @returns The created user
 */
export async function createUser(userData: { Rut: string; Email: string; Name: string; Lastname: string }): Promise<User> {
    try {
        // Crear usuario en la API principal
        const response = await API_Users.post('/create-user', userData);
        const createdUser = response.data;

        // Hacer request al endpoint del lector de huellas
        try {
            const fingerprint_name = userData.Name + "_" + userData.Lastname;
            await axios.post('http://localhost:5000/api/enrollment/user', {
                // Adapta los datos según lo que espere la API del lector de huellas
                username: fingerprint_name,
                password: "password",
                finger: "right-index-finger", // Aquí deberías enviar los datos de la huella digital
                label: "Primary finger"
                // Agrega cualquier otro campo que necesite el lector de huellas
            });z
            console.log("User successfully enrolled in fingerprint system");
        } catch (fingerprintError) {
            console.warn("Failed to enroll user in fingerprint system:", fingerprintError);
            // Opcional: podrías decidir si fallar completamente o solo logear el warning
        }

        return createdUser;
    } catch (error) {
        console.error("Failed to create user:", error);
        throw error;
    }
}

/**
 * Get a list of all users
 * 
 * @returns Array of users with their roles
 */
export async function listUsers(): Promise<User[]> {
    try {
        const response = await API_Users.get('/list-users');
        return response.data;
    } catch (error) {
        console.error("Failed to fetch users:", error);
        throw error;
    }
}

/**
 * Delete a user by email
 * 
 * @param email Email of the user to delete
 * @returns Success message
 */
export async function deleteUser(email: string): Promise<{ message: string }> {
    try {
        const response = await API_Users.delete('/delete-user', {
            data: { Email: email }
        });
        return response.data;
    } catch (error) {
        console.error("Failed to delete user:", error);
        throw error;
    }
}

/**
 * Assign a role to a user
 * 
 * @param email User's email
 * @param role Role to assign
 * @returns Success message
 */
export async function assignRoleToUser(email: string, role: string): Promise<{ message: string }> {
    try {
        const response = await API_Users.post('/assign-role', {
            Email: email,
            Role: role
        });
        return response.data;
    } catch (error) {
        console.error("Failed to assign role to user:", error);
        throw error;
    }
}

/**
 * Get users by role
 * 
 * @param role Role to filter users by
 * @returns Array of users with the specified role
 */
export async function getUsersByRole(role: string): Promise<User[]> {
    try {
        const response = await API_Users.post('/get-users-by-role', {
            Role: role
        });
        return response.data;
    } catch (error) {
        console.error("Failed to fetch users by role:", error);
        throw error;
    }
}

/**
 * Remove a role from a user
 * 
 * @param email User's email
 * @param role Role to remove
 * @returns Success message
 */
export async function deleteUserRole(email: string, role: string): Promise<{ message: string }> {
    try {
        const response = await API_Users.delete('/delete-user-role', {
            data: {
                Email: email,
                Role: role
            }
        });
        return response.data;
    } catch (error) {
        console.error("Failed to remove role from user:", error);
        throw error;
    }
}

/**
 * Get user information by ID
 * 
 * @param userId ID of the user to fetch
 * @returns User information including roles and careers
 */
export async function getAdminInfo(userId: string): Promise<User> {
    try {
        const response = await API_Users.get(`/${userId}`);
        return response.data;
    } catch (error) {
        console.error("Failed to fetch admin information:", error);
        throw error;
    }
}

/**
 * Update user status
 * 
 * @param email User's email
 * @param status New status ('active' or 'inactive')
 * @returns Success message and updated status
 */
export async function updateUserStatus(email: string, status: 'active' | 'inactive'): Promise<{ message: string; status: string }> {
    try {
        const response = await API_Users.put('/update-status', {
            Email: email,
            Status: status
        });
        return response.data;
    } catch (error) {
        console.error("Failed to update user status:", error);
        throw error;
    }
}

/**
 * Assign a career to a user
 * 
 * @param email User's email
 * @param career Career to assign
 * @returns Success message
 */
export async function assignCareerToUser(email: string, career: string): Promise<{ message: string }> {
    try {
        const response = await API_Users.post('/assign-career', {
            Email: email,
            Career: career
        });
        return response.data;
    } catch (error) {
        console.error("Failed to assign career to user:", error);
        throw error;
    }
}

/**
 * Get users by career
 * 
 * @param career Career to filter users by
 * @returns Array of users with the specified career
 */
export async function getUsersByCareer(career: string): Promise<User[]> {
    try {
        const response = await API_Users.post('/get-users-by-career', {
            Career: career
        });
        return response.data;
    } catch (error) {
        console.error("Failed to fetch users by career:", error);
        throw error;
    }
}

/**
 * Remove a career from a user
 * 
 * @param email User's email
 * @param career Career to remove
 * @returns Success message
 */
export async function deleteUserCareer(email: string, career: string): Promise<{ message: string }> {
    try {
        const response = await API_Users.delete('/delete-user-career', {
            data: {
                Email: email,
                Career: career
            }
        });
        return response.data;
    } catch (error) {
        console.error("Failed to remove career from user:", error);
        throw error;
    }
}
