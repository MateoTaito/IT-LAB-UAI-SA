import API_Instance from "../lib/AxiosInstance";

export interface Instance {
  Id: number;
  InstanceId: string;
  Name: string;
  Description?: string;
  Route: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateInstanceDTO {
  instanceId: string;
  name: string;
  description?: string;
  Route: string;
}

// Get all instances
export const listInstances = async (): Promise<Instance[]> => {
  try {
    const response = await API_Instance.get("/list-instances");
    return response.data;
  } catch (error) {
    console.error("Error fetching instances:", error);
    throw error;
  }
};

// Get instance by ID
export const getInstanceById = async (id: number): Promise<Instance> => {
  try {
    const response = await API_Instance.get(`/instance/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching instance:", error);
    throw error;
  }
};

// Create new instance
export const createInstance = async (
  instanceData: CreateInstanceDTO,
): Promise<Instance> => {
  try {
    const response = await API_Instance.post(
      "/instance/create-instance",
      instanceData,
    );
    return response.data;
  } catch (error) {
    console.error("Error creating instance:", error);
    throw error;
  }
};

// Update instance
export const updateInstance = async (
  id: number,
  instanceData: Partial<CreateInstanceDTO>,
): Promise<Instance> => {
  try {
    const response = await API_Instance.put(`/instance/${id}`, instanceData);
    return response.data;
  } catch (error) {
    console.error("Error updating instance:", error);
    throw error;
  }
};

export const deleteInstance = async (id: number): Promise<void> => {
  try {
    await API_Instance.delete(`/instance/${id}`);
  } catch (error) {
    console.error("Error deleting instance:", error);
    throw error;
  }
};

export const getInstancesList = async () => {
  return listInstances();
};
