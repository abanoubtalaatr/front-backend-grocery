import type { SmartListValues } from "./schema";
import type { ProductOption, SmartList } from "./types";
import { apiClient } from "@/lib/api/httpClient";

function extractArray(payload: unknown): unknown[] {
  if (Array.isArray(payload)) return payload;
  if (!payload || typeof payload !== "object") return [];
  const o = payload as Record<string, unknown>;
  const keys = [
    "data",
    "products",
    "items",
    "results",
    "meals",
    "smart_lists",
    "smartLists",
  ] as const;
  for (const key of keys) {
    const v = o[key];
    if (Array.isArray(v)) return v;
    if (v && typeof v === "object" && "data" in (v as object)) {
      const inner = (v as { data?: unknown }).data;
      if (Array.isArray(inner)) return inner;
    }
  }
  return [];
}

function mapProductRow(row: unknown): ProductOption {
  if (!row || typeof row !== "object") {
    return { id: "", name: "" };
  }
  const r = row as Record<string, unknown>;
  return {
    id: String(r.id ?? r._id ?? ""),
    name: String(r.name ?? r.title ?? r.label ?? "Unnamed"),
  };
}

/** API may return a bare array or `{ data: [...] }` (and similar). */
export function normalizeProducts(payload: unknown): ProductOption[] {
  return extractArray(payload)
    .map(mapProductRow)
    .filter((p) => p.id !== "");
}

function mapSmartListRow(row: unknown): SmartList {
  if (!row || typeof row !== "object") {
    return {
      id: "",
      name: "",
      updatedAt: new Date().toISOString(),
      image_url: undefined,
      items: [],
    };
  }
  const r = row as Record<string, unknown>;
  const rawItems = r.items ?? r.meals;
  const imageUrl =
    typeof r.image_url === "string" && r.image_url.length > 0
      ? r.image_url
      : typeof r.imageUrl === "string" && r.imageUrl.length > 0
        ? r.imageUrl
        : undefined;

  const items = Array.isArray(rawItems)
    ? rawItems
        .map((it) => {
          if (!it || typeof it !== "object") return null;
          const i = it as Record<string, unknown>;
          return {
            id: String(i.id ?? i._id ?? ""),
            name: String(i.name ?? i.title ?? ""),
            quantity: Number(i.quantity ?? 0),
            price: Number(i.price ?? 0),
          };
        })
        .filter((x): x is NonNullable<typeof x> => x !== null && x.id !== "")
    : [];

  return {
    id: String(r.id ?? r._id ?? ""),
    name: String(r.name ?? r.title ?? ""),
    updatedAt: (r.updated_at ?? r.updatedAt ?? new Date()) as
      | string
      | number
      | Date,
    image_url: imageUrl,
    items,
  };
}

/** API may return a bare array or wrapped `{ data: [...] }` / `{ smart_lists: [...] }`. */
export function normalizeSmartLists(payload: unknown): SmartList[] {
  return extractArray(payload)
    .map(mapSmartListRow)
    .filter((s) => s.id !== "");
}

export const smartListService = {
  getSmartLists: async (): Promise<SmartList[]> => {
    const response = await apiClient.get("/api/smart-lists");
    return normalizeSmartLists(response.data);
  },

  create: async (data: SmartListValues): Promise<SmartList> => {
    // JSON cannot carry File/Blob — `JSON.stringify(file)` becomes `{}`.
    // Laravel-style multipart: name, image file, items[] ids.
    const formData = new FormData();
    formData.append("name", data.name);
    if (data.image instanceof File) {
      formData.append("image", data.image);
    }
    for (const itemId of data.items) {
      formData.append("items[]", itemId);
    }
    const response = await apiClient.post("/api/smart-lists", formData);
    return response.data;
  },
  /**
   * Laravel + PHP: multipart bodies on real `PUT` often do not populate `Request` input.
   * Use `POST` with `_method=PUT` (method spoofing) so `name` / `items[]` / `image` are parsed.
   */
  update: async (listId: string, data: SmartListValues): Promise<SmartList> => {
    const formData = new FormData();
    formData.append("_method", "PUT");
    formData.append("name", data.name);
    if (data.image instanceof File) {
      formData.append("image", data.image);
    }
    for (const itemId of data.items) {
      formData.append("items[]", itemId);
    }
    const response = await apiClient.post(`/api/smart-lists/${listId}`, formData);
    return response.data;
  },

  getAllProducts: async (): Promise<ProductOption[]> => {
    const response = await apiClient.get("/api/meals");
    return normalizeProducts(response.data);
  },

  delete: async (listId: string): Promise<void> => {
    const response = await apiClient.delete(`/api/smart-lists/${listId}`);
    if (response.status !== 200) {
      throw new Error("Failed to delete smart list");
    }
    return response.data;
  },
};
