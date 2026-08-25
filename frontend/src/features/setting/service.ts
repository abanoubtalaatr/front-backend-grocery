import { apiClient } from "@/lib/api/httpClient";
import type { Appearance, Language, Notifications } from "./schema";

function unwrapData<T>(payload: unknown): T {
  if (payload == null || typeof payload !== "object") {
    throw new Error("Invalid API response");
  }
  const root = payload as Record<string, unknown>;
  const data = root.data ?? root;
  if (data == null || typeof data !== "object" || Array.isArray(data)) {
    throw new Error("Invalid API response");
  }
  return data as T;
}

export const languageService = {
  getSettings: async (): Promise<Language> => {
    const response = await apiClient.get<unknown>("/api/language");
    return unwrapData<Language>(response.data);
  },
  update: async (data: Language): Promise<Language> => {
    const response = await apiClient.put<unknown>("/api/language", data);
    return unwrapData<Language>(response.data);
  },
};

export const appearanceService = {
  getAppearance: async (): Promise<Appearance> => {
    const response = await apiClient.get<unknown>("/api/appearance");
    return unwrapData<Appearance>(response.data);
  },
  update: async (data: Appearance): Promise<Appearance> => {
    const response = await apiClient.put<unknown>("/api/appearance", data);
    return unwrapData<Appearance>(response.data);
  },
};

export const notificationSettingService = {
  getNotifications: async (): Promise<Notifications> => {
    const response = await apiClient.get<unknown>("/api/notification-preferences");
    return unwrapData<Notifications>(response.data);
  },
  update: async (data: Notifications): Promise<Notifications> => {
    const response = await apiClient.put<unknown>("/api/notification-preferences", data);
    return unwrapData<Notifications>(response.data);
  },
};

export const dataManagementService = {
  downloadSettings: async (): Promise<Blob> => {
    const response = await apiClient.get<Blob>("/api/data-management/download", {
      responseType: "blob",
    });
    return response.data;
  },

  deleteAccount: async (): Promise<void> => {
    await apiClient.delete<unknown>("/api/data-management/delete");
  },
};