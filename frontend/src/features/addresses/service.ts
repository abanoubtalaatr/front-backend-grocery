import { apiClient } from "@/lib/api/httpClient";
import type { AxiosError } from "axios";
import type { CreateAddressValues } from "./schema";
import type { Address, ApiErrorShape } from "./types";

function pickArray(value: unknown): Address[] | null {
  if (Array.isArray(value)) return value as Address[];
  if (value && typeof value === "object") {
    const obj = value as Record<string, unknown>;
    const candidates = [obj.data, obj.addresses, obj.items, obj.results];
    const firstArray = candidates.find(Array.isArray);
    if (Array.isArray(firstArray)) return firstArray as Address[];
  }
  return null;
}

export function normalizeAddresses(payload: unknown): Address[] {
  const direct = pickArray(payload);
  if (direct) return direct;

  if (payload && typeof payload === "object") {
    const nested = pickArray((payload as Record<string, unknown>).data);
    if (nested) return nested;
  }

  return [];
}

export function extractApiErrorMessage(err: unknown): string {
  const axiosErr = err as AxiosError<unknown>;
  const data = axiosErr.response?.data as ApiErrorShape | undefined;

  const validationMessage = data?.errors
    ? Object.values(data.errors).flat().filter(Boolean).join("\n")
    : undefined;

  return (
    validationMessage ??
    data?.message ??
    data?.error ??
    axiosErr.message ??
    "Something went wrong"
  );
}

export const addressService = {
  getAll: async (): Promise<Address[]> => {
    const response = await apiClient.get("/api/addresses");
    return normalizeAddresses(response.data);
  },

  create: async (values: CreateAddressValues): Promise<Address> => {
    const response = await apiClient.post("/api/addresses", values);
    return response.data;
  },

  update: async (id: string | number, values: CreateAddressValues): Promise<Address> => {
    const response = await apiClient.put(`/api/addresses/${id}`, values);
    return response.data;
  },

  delete: async (id: string | number): Promise<void> => {
    await apiClient.delete(`/api/addresses/${id}`);
  },
};
