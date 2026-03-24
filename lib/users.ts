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
  document?: {
    doc_type: string;
    doc_number: string;
    country: string;
  };
  addresses?: any[];
};

export async function getAllUsers(): Promise<User[]> {
  // Assuming a customer list endpoint exists or using user list
  const res = await apiFetch<User>("/api/users/profile/", { requiresAuth: true })
  return [res] // Quick fallback for now
}

export async function getUserById(id: string): Promise<User> {
  return apiFetch<User>(`/api/users/profile/`, { requiresAuth: true })
}
