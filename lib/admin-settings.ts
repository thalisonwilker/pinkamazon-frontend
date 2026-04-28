import { apiFetch, API_BASE_URL } from "@/lib/api"

export type BannerKey = "desktop" | "tablet" | "mobile"

export type BannerSetting = {
  enabled: boolean
  file_name: string
  alt: string
  link?: string
}

export type AdminSettings = {
  banners: Record<BannerKey, BannerSetting>
  facebook_pixel: string
  google_analytics: string
  google_tag_manager: string
  tiktok_pixel: string
  active_campaign_key: string
  custom_head_script: string
  custom_body_script: string
  stripe_public_key: string
  stripe_secret_key: string
  stripe_webhook_secret: string
  stripe_webhook_last_event_at: string | null
  stripe_webhook_last_event_type: string
  stripe_webhook_last_error: string
  stripe_enable_cards: boolean
  stripe_enable_pix: boolean

  melhor_envio_api_key: string
  melhor_envio_webhook_url: string
  origin_street: string
  origin_number: string
  origin_complement: string
  origin_neighborhood: string
  origin_city: string
  origin_state: string
  origin_zip_code: string
}

export type PublicSettings = Pick<
  AdminSettings,
  | "banners"
  | "facebook_pixel"
  | "google_analytics"
  | "google_tag_manager"
  | "tiktok_pixel"
  | "custom_head_script"
  | "custom_body_script"
  | "stripe_public_key"
  | "stripe_enable_cards"
  | "stripe_enable_pix"
>

export const DEFAULT_ADMIN_SETTINGS: AdminSettings = {
  banners: {
    desktop: { enabled: true, file_name: "", alt: "" },
    tablet: { enabled: true, file_name: "", alt: "" },
    mobile: { enabled: true, file_name: "", alt: "" },
  },
  facebook_pixel: "",
  google_analytics: "",
  google_tag_manager: "",
  tiktok_pixel: "",
  active_campaign_key: "",
  custom_head_script: "",
  custom_body_script: "",
  stripe_public_key: "",
  stripe_secret_key: "",
  stripe_webhook_secret: "",
  stripe_webhook_last_event_at: null,
  stripe_webhook_last_event_type: "",
  stripe_webhook_last_error: "",
  stripe_enable_cards: true,
  stripe_enable_pix: false,

  melhor_envio_api_key: "",
  melhor_envio_webhook_url: "https://pinkamazon.com/api/v1/shipping/melhor-envio/webhook",
  origin_street: "",
  origin_number: "",
  origin_complement: "",
  origin_neighborhood: "",
  origin_city: "",
  origin_state: "",
  origin_zip_code: "",
}

export const DEFAULT_PUBLIC_SETTINGS: PublicSettings = {
  banners: DEFAULT_ADMIN_SETTINGS.banners,
  facebook_pixel: DEFAULT_ADMIN_SETTINGS.facebook_pixel,
  google_analytics: DEFAULT_ADMIN_SETTINGS.google_analytics,
  google_tag_manager: DEFAULT_ADMIN_SETTINGS.google_tag_manager,
  tiktok_pixel: DEFAULT_ADMIN_SETTINGS.tiktok_pixel,
  custom_head_script: DEFAULT_ADMIN_SETTINGS.custom_head_script,
  custom_body_script: DEFAULT_ADMIN_SETTINGS.custom_body_script,
  stripe_public_key: DEFAULT_ADMIN_SETTINGS.stripe_public_key,
  stripe_enable_cards: DEFAULT_ADMIN_SETTINGS.stripe_enable_cards,
  stripe_enable_pix: DEFAULT_ADMIN_SETTINGS.stripe_enable_pix,
}

function normalizeBannerSetting(input: Partial<BannerSetting> | undefined, fallback: BannerSetting): BannerSetting {
  return {
    enabled: input?.enabled ?? fallback.enabled,
    file_name: input?.file_name ?? (input as any)?.fileName ?? fallback.file_name,
    alt: input?.alt ?? fallback.alt,
    link: input?.link ?? fallback.link,
  }
}

export function normalizeAdminSettings(input?: Partial<AdminSettings> | null): AdminSettings {
  return {
    ...DEFAULT_ADMIN_SETTINGS,
    ...input,
    banners: {
      desktop: normalizeBannerSetting(input?.banners?.desktop, DEFAULT_ADMIN_SETTINGS.banners.desktop),
      tablet: normalizeBannerSetting(input?.banners?.tablet, DEFAULT_ADMIN_SETTINGS.banners.tablet),
      mobile: normalizeBannerSetting(input?.banners?.mobile, DEFAULT_ADMIN_SETTINGS.banners.mobile),
    },
  }
}

export function normalizePublicSettings(input?: Partial<PublicSettings> | null): PublicSettings {
  return {
    ...DEFAULT_PUBLIC_SETTINGS,
    ...input,
    banners: {
      desktop: normalizeBannerSetting(input?.banners?.desktop, DEFAULT_PUBLIC_SETTINGS.banners.desktop),
      tablet: normalizeBannerSetting(input?.banners?.tablet, DEFAULT_PUBLIC_SETTINGS.banners.tablet),
      mobile: normalizeBannerSetting(input?.banners?.mobile, DEFAULT_PUBLIC_SETTINGS.banners.mobile),
    },
  }
}

export async function getPublicSettings(): Promise<PublicSettings> {
  const response = await apiFetch<Partial<PublicSettings>>("/api/v1/settings/public/")
  return normalizePublicSettings(response)
}

export function resolveBannerAsset(fileName: string, fallbackSrc: string): string {
  const normalized = fileName.trim()

  if (!normalized) {
    return fallbackSrc
  }

  // Limpa localhost:8000 se presente
  let cleanName = normalized.replace(/^https?:\/\/localhost:8000/i, "")

  if (cleanName.startsWith("http://") || cleanName.startsWith("https://")) {
    return cleanName
  }

  // Se o caminho começa com /media/, anexa a URL base da API
  if (cleanName.startsWith("/media/")) {
    return `${API_BASE_URL}${cleanName}`
  }

  if (cleanName.startsWith("/")) {
    return cleanName
  }

  return `/images/${cleanName}`
}

export async function getAdminSettings(): Promise<AdminSettings> {
  const response = await apiFetch<Partial<AdminSettings>>("/api/v1/settings/admin/", {
    requiresAuth: true,
  })

  return normalizeAdminSettings(response)
}

export async function updateAdminSettings(settings: AdminSettings): Promise<AdminSettings> {
  const response = await apiFetch<Partial<AdminSettings>>("/api/v1/settings/admin/", {
    method: "PUT",
    requiresAuth: true,
    body: settings,
  })

  return normalizeAdminSettings(response)
}

export async function updateBannerAndHomePageSettings(settings: Pick<AdminSettings, "banners">): Promise<AdminSettings> {
  const response = await apiFetch<Partial<AdminSettings>>("/api/v1/settings/admin/banners-and-home-page/", {
    method: "PATCH",
    requiresAuth: true,
    body: settings,
  })
  return normalizeAdminSettings(response)
}

export async function updateMarketingScriptsSettings(settings: Partial<AdminSettings>): Promise<AdminSettings> {
  const response = await apiFetch<Partial<AdminSettings>>("/api/v1/settings/admin/marketing-scripts/", {
    method: "PATCH",
    requiresAuth: true,
    body: settings,
  })
  return normalizeAdminSettings(response)
}

export async function updatePaymentsSettings(settings: Partial<AdminSettings>): Promise<AdminSettings> {
  const response = await apiFetch<Partial<AdminSettings>>("/api/v1/settings/admin/payments/", {
    method: "PATCH",
    requiresAuth: true,
    body: settings,
  })
  return normalizeAdminSettings(response)
}

export async function updateShippingSettings(settings: Partial<AdminSettings>): Promise<AdminSettings> {
  const response = await apiFetch<Partial<AdminSettings>>("/api/v1/settings/admin/shipping/", {
    method: "PATCH",
    requiresAuth: true,
    body: settings,
  })
  return normalizeAdminSettings(response)
}
export type StripeWebhook = {
  id: string
  url: string
  status: string
  enabled_events: string[]
  secret?: string
  last_test_result?: {
    status: string
    message: string
  }
}

export async function listStripeWebhooks(): Promise<StripeWebhook[]> {
  return apiFetch<StripeWebhook[]>("/api/v1/settings/admin/payments/webhooks/", {
    requiresAuth: true,
  })
}

export async function createStripeWebhook(url: string): Promise<StripeWebhook> {
  return apiFetch<StripeWebhook>("/api/v1/settings/admin/payments/webhooks/create/", {
    method: "POST",
    requiresAuth: true,
    body: { url, enabled_events: ["checkout.session.completed", "payment_intent.succeeded", "payment_intent.payment_failed"] },
  })
}

export async function testStripeWebhook(id: string): Promise<{status: string, message: string}> {
  return apiFetch<any>(`/api/v1/settings/admin/payments/webhooks/${id}/test/`, {
    method: "POST",
    requiresAuth: true,
  })
}

export async function deleteStripeWebhook(id: string): Promise<void> {
  await apiFetch<void>(`/api/v1/settings/admin/payments/webhooks/${id}/`, {
    method: "DELETE",
    requiresAuth: true,
  })
}

