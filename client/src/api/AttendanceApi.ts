import API_Attendance from "../lib/AxiosAttendance";

export interface UserCheckInDTO {
    email: string;
    checkIn: string | Date;
    Reason: string;
}

export interface UserCheckOutDTO {
    email: string;
    checkOut: string | Date;
}

export interface ActiveUser {
    Id: number;
    UserId: number;
    ReasonId: number;
    CheckIn: string;
    CheckOut: string | null;
    Email: string;
    Name: string;
    LastName: string;
    Rut: string;
    Reason: string;
}

export interface TopUser {
    userId: number;
    email: string;
    name: string;
    lastName: string;
    totalTime: number;
    sessionCount: number;
    totalTimeHours: number;
    averageSessionHours: number;
}

export interface LabUtilization {
    utilizationPercentage: number;
    totalUtilizedMinutes: number;
    utilizationHours: number;
    utilizationMinutesRemainder: number;
    maxPossibleMinutes: number;
    currentOccupancy: number;
    maxCapacity: number;
    date: string;
}

export interface DailyUtilization {
    date: string;
    utilizationPercentage: number;
    utilizedMinutes: number;
    activeUsers: number;
}

export interface HourlyUtilization {
    hour: string;
    utilization: number;
    activeUsers: number;
    totalMinutes: number;
}

export interface MonthlyUtilization {
    month: number;
    year: number;
    monthlyUtilizationPercentage: number;
    averageDailyUtilizationPercentage: number;
    totalUtilizedMinutes: number;
    totalUtilizedHours: number;
    totalUtilizedMinutesRemainder: number;
    businessDaysCount: number;
    totalPossibleMinutes: number;
    dailyBreakdown: DailyUtilization[];
    peakDay: DailyUtilization;
    lowDay: DailyUtilization;
}

export const checkInUser = async (data: UserCheckInDTO) => {
    const response = await API_Attendance.post("/check-in-user", data);
    return response.data;
};

export const checkOutUser = async (data: UserCheckOutDTO) => {
    const response = await API_Attendance.post("/check-out-user", data);
    return response.data;
};

export const listActiveUsers = async (): Promise<ActiveUser[]> => {
    const response = await API_Attendance.get("/list-active-users");
    return response.data;
};

export const listInactiveUsers = async () => {
    const response = await API_Attendance.get("/list-inactive-users");
    return response.data;
};

export const listAllUsersAttendance = async () => {
    const response = await API_Attendance.get("/list-all-users");
    return response.data;
};

export const getRecentActivity = async (
    limit: number = 10,
): Promise<ActiveUser[]> => {
    const response = await API_Attendance.get("/list-all-users");
    const allAttendance = response.data;

    // Sort by most recent activity (CheckIn or CheckOut)
    const sorted = allAttendance.sort((a: any, b: any) => {
        const aTime = new Date(a.CheckOut || a.CheckIn).getTime();
        const bTime = new Date(b.CheckOut || b.CheckIn).getTime();
        return bTime - aTime;
    });

    return sorted.slice(0, limit);
};

export const getTopUsers = async (): Promise<TopUser[]> => {
    const response = await API_Attendance.get("/top-users");
    return response.data;
};

export const getLabUtilization = async (
    date?: string,
): Promise<LabUtilization> => {
    const url = date ? `/lab-utilization?date=${date}` : "/lab-utilization";
    const response = await API_Attendance.get(url);
    return response.data;
};

export const getHourlyUtilization = async (
    date?: string,
): Promise<HourlyUtilization[]> => {
    const url = date
        ? `/hourly-utilization?date=${date}`
        : "/hourly-utilization";
    const response = await API_Attendance.get(url);
    return response.data;
};

export const getMonthlyUtilization = async (
    month?: number,
    year?: number,
): Promise<MonthlyUtilization> => {
    let url = "/monthly-utilization";
    const params: string[] = [];
    if (month) params.push(`month=${month}`);
    if (year) params.push(`year=${year}`);
    if (params.length > 0) url += `?${params.join("&")}`;

    const response = await API_Attendance.get(url);
    return response.data;
};

export default API_Attendance;
