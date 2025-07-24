import API_Users from "../lib/AxiosUsers";
import API_Fingerprint from "../lib/AxiosFingerprint";

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
 * Expected response from fingerprint enrollment API
 */
export interface FingerprintEnrollmentResponse {
    success: boolean;
    message: string;
    enrollmentId?: string;
    templateData?: string;
}

/**
 * Expected response from fingerprint deletion API
 */
export interface FingerprintDeletionResponse {
    success: boolean;
    message: string;
}

/**
 * User creation progress states
 */
export enum UserCreationState {
    IDLE = 'idle',
    CREATING_USER = 'creating_user',
    WAITING_FINGERPRINT = 'waiting_fingerprint',
    ENROLLING_FINGERPRINT = 'enrolling_fingerprint',
    SUCCESS = 'success',
    ERROR = 'error'
}

/**
 * Create a new user with fingerprint enrollment
 * 
 * @param userData Object containing user details
 * @param onStateChange Callback to track creation progress
 * @returns The created user
 */
export async function createUser(
    userData: { Rut: string; Email: string; Name: string; Lastname: string },
    onStateChange?: (state: UserCreationState, message?: string) => void
): Promise<User> {
    try {
        // Step 1: Create user in database
        onStateChange?.(UserCreationState.CREATING_USER, "Creating user account...");
        const response = await API_Users.post('/create-user', userData);
        const createdUser = response.data;

        // Step 2: Wait for external fingerprint verification
        onStateChange?.(UserCreationState.WAITING_FINGERPRINT, "Please provide fingerprint for enrollment...");
        
        // Step 3: Enroll fingerprint
        onStateChange?.(UserCreationState.ENROLLING_FINGERPRINT, "Enrolling fingerprint...");
        const fingerprint_response = await API_Fingerprint.post('/enrollment/user', {
            username: createdUser.Email,
            password: "password",
            finger: "right-index-finger",
            label: "Primary finger"
        });

        // Step 4: Success
        onStateChange?.(UserCreationState.SUCCESS, "User created and fingerprint enrolled successfully!");
        return createdUser;
    } catch (error) {
        onStateChange?.(UserCreationState.ERROR, "Failed to create user or enroll fingerprint");
        console.error("Failed to create user:", error);
        throw error;
    }
}

export async function createUserTest(
    userData: { Rut: string; Email: string; Name: string; Lastname: string },
    onStateChange?: (state: UserCreationState, message?: string) => void
): Promise<User> {
    try {
        // Step 1: Create user in database
        onStateChange?.(UserCreationState.CREATING_USER, "Creating user account...");
        const response = await API_Users.post('/create-user', userData);
        const createdUser = response.data;

        onStateChange?.(UserCreationState.SUCCESS, "User created!");
        return createdUser;
    } catch (error) {
        onStateChange?.(UserCreationState.ERROR, "Failed to create user");
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
        // First delete the user from the database
        const response = await API_Users.delete('/delete-user', {
            data: { Email: email }
        });
        
        // Try to delete the fingerprint data, but don't fail if it doesn't work
        try {
            await API_Fingerprint.delete(`/users/${email}`, {
                data: {
                    username: email,
                }
            });
        } catch (fingerprintError) {
            // Log the error but continue since the user was deleted successfully
            console.warn("Failed to delete fingerprint data, but user was deleted:", fingerprintError);
        }
        
        return response.data;
    } catch (error) {
        console.error("Failed to delete user:", error);
        throw error;
    }
}

export async function deleteUserTest(email: string): Promise<{ message: string }> {
    try {
        // First delete the user from the database
        const response = await API_Users.delete('/delete-user', {
            data: { Email: email }
        });
        // No fingerprint deletion in test mode, just return success
        
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
