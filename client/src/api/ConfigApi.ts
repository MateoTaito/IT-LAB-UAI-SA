import API_Config from "../lib/AxiosConfig";

export interface InstanceConfigDTO {
    inicialHour: string;
    finalHour: string;
    maxCapacity: number;
    lastUpdated: string;
    updatedBy: string;
}

export const getActualConfig = async (): Promise<InstanceConfigDTO[]> => {
    try {
        const response = await API_Config.get("/get-config");
        return response.data.data;
    } catch (error) {
        console.error("Error fetching config:", error);
        throw error;
    }
};

export const updateConfig = async (
    updatedData: InstanceConfigDTO,
): Promise<InstanceConfigDTO[]> => {
    try {
        const response = await API_Config.put("/update-config", updatedData);
        return response.data.data;
    } catch (error) {
        console.error("Error updating config:", error);
        throw error;
    }
};
