// lib/payments.ts
import { apiFetch } from "./api";

export interface CheckoutSessionResponse {
  checkoutUrl: string;
}

/**
 * Creates a Stripe checkout session for a given order.
 * @param orderId - The ID of the order to create a session for.
 * @param token - The user's JWT for authorization.
 * @returns The URL for the Stripe checkout page.
 */
export const createCheckoutSession = async (
  orderId: string,
  token: string
): Promise<CheckoutSessionResponse> => {
  try {
    const response = await apiFetch<CheckoutSessionResponse>(
      "/api/v1/payments/create-checkout-session/",
      {
        method: "POST",
        body: { order_id: orderId },
        headers: {
          Authorization: `Bearer ${token}`,
        },
        requiresAuth: false, // Manual auth header
      }
    );
    return response;
  } catch (error) {
    console.error("Failed to create checkout session:", error);
    // Handle error appropriately in the UI
    throw error;
  }
};
