import { apiFetch } from "./api"

export type User = {
  id: string;
  email: string;
  name: string;
  first_name?: string;
  last_name?: string;
  phone?: string | null;
  birthdate?: string | null;
  is_active: boolean;
  date_joined: string;
  promo_emails: boolean;
  order_updates: boolean;
  wishlist_notifications: boolean;
  document?: string;
  addresses?: any[];
};

export async function getAllUsers(): Promise<User[]> {
  const response = await apiFetch<any>("/api/v1/users/", { requiresAuth: true })
  return response?.data?.results || response?.results || response?.data || response || []
}

export async function getUserById(id: string): Promise<User> {
  const response = await apiFetch<any>("/api/v1/users/me/", { requiresAuth: true })
  return response?.data || response
}
