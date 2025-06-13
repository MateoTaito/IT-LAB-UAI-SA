import API_Users from "../lib/AxiosUsers";

export interface User {
    Id: string;
    Name: string;
    LastName: string;
    Email: string;
    Role?: string;
    Status?: string; // Add Status property (optional in API response)
}

export interface CreateUserDTO {
    Name: string;
    LastName: string;
    Email: string;
    Password?: string;
}

export async function getAdminInfo(userId: string): Promise<User> {
    try {
        const response = await API_Users.get(`/${userId}`);
        return response.data;
    } catch (error) {
        console.error("Failed to fetch admin information:", error);
        throw error;
    }
}

export async function createUser(userData: CreateUserDTO): Promise<User> {
    try {
        const response = await API_Users.post('/create-user', userData);
        return response.data;
    } catch (error) {
        console.error("Failed to create user:", error);
        throw error;
    }
}

export async function listUsers(): Promise<User[]> {
    try {
        const response = await API_Users.get('/list-users');
        return response.data;
    } catch (error) {
        console.error("Failed to fetch users list:", error);
        throw error;
    }
}

export async function deleteUser(email: string): Promise<void> {
    try {
        await API_Users.delete('/delete-user', { data: { Email: email } });
    } catch (error) {
        console.error("Failed to delete user:", error);
        throw error;
    }
}

export async function assignRole(email: string, roleName: string): Promise<void> {
    try {
        await API_Users.post('/assign-role', { Email: email, RoleName: roleName });
    } catch (error) {
        console.error("Failed to assign role to user:", error);
        throw error;
    }
}
