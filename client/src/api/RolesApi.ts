import API_Roles from "../lib/AxiosRoles";

// Updated interface to match the API response format
export interface Role {
    Id: string | number;
    Name: string;
    Description: string;
    createdAt?: string;
    updatedAt?: string;
    UserCount?: string | number;
}

/**
 * Fetch all roles from the server
 */
export async function getRoles(): Promise<Role[]> {
    try {
        const response = await API_Roles.get('/list-roles');
        return response.data;
    } catch (error) {
        console.error("Failed to fetch roles:", error);
        throw error;
    }
}

/**
 * Create a new role
 * 
 * @param roleData Object containing Name and Description for the new role
 * @returns The created role with Id, Name, Description, createdAt and updatedAt
 */
export async function createRole(roleData: { Name: string; Description: string }): Promise<Role> {
    try {
        const response = await API_Roles.post('/create-role', roleData);
        return response.data;
    } catch (error) {
        console.error("Failed to create role:", error);
        throw error;
    }
}

/**
 * Update an existing role
 * 
 * @param currentName The current name of the role to update
 * @param updates Object containing optional NewName and Description fields
 * @returns Object with success message and updated role data
 */
export async function updateRole(
    currentName: string,
    updates: { NewName?: string; Description?: string }
): Promise<{ message: string; role: Role }> {
    try {
        const response = await API_Roles.put('/update-role', {
            CurrentName: currentName,
            ...updates
        });
        return response.data;
    } catch (error) {
        console.error("Failed to update role:", error);
        throw error;
    }
}

/**
 * Delete a role
 * 
 * @param roleName Name of the role to delete
 * @returns Message confirming the role was deleted
 */
export async function deleteRole(roleName: string): Promise<{ message: string }> {
    try {
        const response = await API_Roles.delete('/delete-role', {
            data: { Name: roleName }
        });
        return response.data;
    } catch (error) {
        console.error("Failed to delete role:", error);
        throw error;
    }
}

/**
 * Fetch role details by ID
 */
export async function getRoleById(roleId: string | number): Promise<Role> {
    try {
        const response = await API_Roles.get(`/role/${roleId}`);
        return response.data;
    } catch (error) {
        console.error("Failed to fetch role details:", error);
        throw error;
    }
}
