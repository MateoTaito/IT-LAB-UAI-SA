let selectedInstanceRoute: string | null = null;

export const updateSelectedInstanceRoute = (route: string | null): void => {
  selectedInstanceRoute = route;
};

export const getSelectedInstanceRoute = (): string | null => {
  return selectedInstanceRoute;
};

export const getApiBaseUrl = (): string => {
  const serverRoute = selectedInstanceRoute?.toString();

  const currentHost = window.location.hostname;
  const baseHost = currentHost.replace(/:\d+$/, "");

  // Si no hay ruta seleccionada, usar una por defecto
  if (!serverRoute) {
    return `http://${baseHost}/sa_api`; // o cualquier ruta por defecto
  }

  return `http://${baseHost}${serverRoute}`;
};

export const getSelectedInstanceApiUrl = (): string => {
  return getApiBaseUrl();
};

export const API_INSTANCE_URL = getApiBaseUrl();

console.log("API Base URL:", API_INSTANCE_URL);
