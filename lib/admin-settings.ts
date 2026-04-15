import { apiFetch } from "@/lib/api"

export type BannerKey = "desktop" | "tablet" | "mobile"

export type BannerSetting = {
  enabled: boolean
  fileName: string
  alt: string
}

export type AdminSettings = {
  banners: Record<BannerKey, BannerSetting>
  facebookPixel: string
  googleAnalytics: string
  googleTagManager: string
  tiktokPixel: string
  activeCampaignKey: string
  customHeadScript: string
  customBodyScript: string
  stripePublicKey: string
  stripeSecretKey: string
  stripeWebhookSecret: string
  stripeEnableCards: boolean
  stripeEnablePix: boolean
  melhorEnvioApiKey: string
  melhorEnvioWebhookUrl: string
  originStreet: string
  originNumber: string
  originComplement: string
  originNeighborhood: string
  originCity: string
  originState: string
  originZipCode: string
}

export type PublicSettings = Pick<
  AdminSettings,
  | "banners"
  | "facebookPixel"
  | "googleAnalytics"
  | "googleTagManager"
  | "tiktokPixel"
  | "customHeadScript"
  | "customBodyScript"
  | "stripePublicKey"
  | "stripeEnableCards"
  | "stripeEnablePix"
>

export const DEFAULT_ADMIN_SETTINGS: AdminSettings = {
  banners: {
    desktop: { enabled: true, fileName: "", alt: "" },
    tablet: { enabled: true, fileName: "", alt: "" },
    mobile: { enabled: true, fileName: "", alt: "" },
  },
  facebookPixel: "",
  googleAnalytics: "",
  googleTagManager: "",
  tiktokPixel: "",
  activeCampaignKey: "",
  customHeadScript: "",
  customBodyScript: "",
  stripePublicKey: "",
  stripeSecretKey: "",
  stripeWebhookSecret: "",
  stripeEnableCards: true,
  stripeEnablePix: false,
  melhorEnvioApiKey: "",
  melhorEnvioWebhookUrl: "https://pinkamazon.com/api/v1/shipping/melhor-envio/webhook",
  originStreet: "",
  originNumber: "",
  originComplement: "",
  originNeighborhood: "",
  originCity: "",
  originState: "",
  originZipCode: "",
}

export const DEFAULT_PUBLIC_SETTINGS: PublicSettings = {
  banners: DEFAULT_ADMIN_SETTINGS.banners,
  facebookPixel: DEFAULT_ADMIN_SETTINGS.facebookPixel,
  googleAnalytics: DEFAULT_ADMIN_SETTINGS.googleAnalytics,
  googleTagManager: DEFAULT_ADMIN_SETTINGS.googleTagManager,
  tiktokPixel: DEFAULT_ADMIN_SETTINGS.tiktokPixel,
  customHeadScript: DEFAULT_ADMIN_SETTINGS.customHeadScript,
  customBodyScript: DEFAULT_ADMIN_SETTINGS.customBodyScript,
  stripePublicKey: DEFAULT_ADMIN_SETTINGS.stripePublicKey,
  stripeEnableCards: DEFAULT_ADMIN_SETTINGS.stripeEnableCards,
  stripeEnablePix: DEFAULT_ADMIN_SETTINGS.stripeEnablePix,
}

function normalizeBannerSetting(input: Partial<BannerSetting> | undefined, fallback: BannerSetting): BannerSetting {
  return {
    enabled: input?.enabled ?? fallback.enabled,
    fileName: input?.fileName ?? fallback.fileName,
    alt: input?.alt ?? fallback.alt,
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

  if (normalized.startsWith("http://") || normalized.startsWith("https://") || normalized.startsWith("/")) {
    return normalized
  }

  return `/images/${normalized}`
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