import API_Users from "../lib/AxiosUsers";
import API_Admins from "../lib/AxiosAdmin";


export interface CreateAdminData {
    Rut: string;
    Email: string;
    Name: string;
    LastName: string;
    Password: string;
}

export interface AdminResponse {
    Id: number;
    User: {
        Id: number;
        Rut: string;
        Email: string;
        Name: string;
        LastName: string;
    };
}

export interface AdminListResponse {
    Id: number;
    UserId: number;
    User: {
        Id: number;
        Rut: string;
        Email: string;
        Name: string;
        LastName: string;
        Status: string;
    };
}

// Create a new administrator
export async function createAdmin(adminData: CreateAdminData): Promise<AdminResponse> {
    try {
        console.log(adminData)
        const response = await API_Admins.post('/create-admin', {
            Email: adminData.Email, 
            Password: adminData.Password
        });
        return response.data.admin;
    } catch (error) {
        console.error("Failed to create admin:", error);
        throw error;
    }
}

// Get all administrators
export async function getAllAdmins(): Promise<AdminListResponse[]> {
    try {
        const response = await API_Admins.get('/get-all-admins');
        return response.data;
    } catch (error) {
        console.error("Failed to fetch admins:", error);
        throw error;
    }
}

// Delete an administrator
export async function deleteAdmin(adminId: number): Promise<void> {
    try {
        console.log(adminId)
        await API_Admins.delete(`/delete-admin/${adminId}`);
    } catch (error) {
        console.error("Failed to delete admin:", error);
        throw error;
    }
}
