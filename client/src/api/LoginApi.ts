import API_Login from "../lib/AxiosLogin";

export interface AdminLoginCredentials {
    Email: string;
    Password: string;
}

export interface AdminLoginResponse {
    message: string;
    adminId: string;
    userId: string;
    token: string;
    adminName: string;
}

export async function loginAdmin(credentials: AdminLoginCredentials): Promise<AdminLoginResponse> {
    const response = await API_Login.post<AdminLoginResponse>("/admin-login", credentials);
    return response.data;
}
