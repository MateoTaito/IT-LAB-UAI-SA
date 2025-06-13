import API_Users from "../lib/AxiosUsers";

export interface User {
    Id: string;
    Name: string;
    LastName: string;
    Email: string;
    Role?: string;
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
