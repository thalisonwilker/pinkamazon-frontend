"use client"

import { useEffect, useState } from "react"
import {
  Save,
  Image as ImageIcon,
  Code,
  CreditCard,
  Truck,
  ChevronDown,
  Monitor,
  Tablet,
  Smartphone,
  KeyRound,
  MapPin,
  Loader2,
  Webhook,
  Copy,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Eye,
  EyeOff,
  Trash2,
  Plus,
  Activity,
} from "lucide-react"



import { useToast } from "@/hooks/use-toast"
import {
  DEFAULT_ADMIN_SETTINGS,
  getAdminSettings,
  updateBannerAndHomePageSettings,
  updateMarketingScriptsSettings,
  updatePaymentsSettings,
  updateShippingSettings,
  resolveBannerAsset,
  type AdminSettings,
  listStripeWebhooks,
  createStripeWebhook,
  testStripeWebhook,
  deleteStripeWebhook,
  type StripeWebhook,
} from "@/lib/admin-settings"

import { apiFetch, API_BASE_URL } from "@/lib/api"


const bannerTypes = [
  {
    key: "desktop",
    title: "Banner Desktop",
    icon: Monitor,
    recommendedSize: "1920 x 820 px",
    helper: "Ideal para notebooks e monitores widescreen.",
  },
  {
    key: "tablet",
    title: "Banner Tablet",
    icon: Tablet,
    recommendedSize: "1200 x 1400 px",
    helper: "Versao intermediaria para iPads e tablets Android.",
  },
  {
    key: "mobile",
    title: "Banner Mobile",
    icon: Smartphone,
    recommendedSize: "1080 x 1440 px",
    helper: "Formato vertical com foco em leitura rapida no celular.",
  },
] as const

export default function SettingsAdminPage() {
  const { toast } = useToast()
  const [openSections, setOpenSections] = useState({
    banners: false,
    marketing: false,
    payment: false,
    shipping: false,
  })
  const [settings, setSettings] = useState<AdminSettings>(DEFAULT_ADMIN_SETTINGS)
  const [saved, setSaved] = useState(false)
  const [fetchingCep, setFetchingCep] = useState(false)
  const [isLoadingSettings, setIsLoadingSettings] = useState(true)
  const [isSavingSettings, setIsSavingSettings] = useState(false)
  const [testFromCep, setTestFromCep] = useState("")
  const [testToCep, setTestToCep] = useState("")
  const [isTestingShipping, setIsTestingShipping] = useState(false)
  const [isTestingWebhook, setIsTestingWebhook] = useState(false)
  const [showWebhookSecret, setShowWebhookSecret] = useState(false)
  const [isValidatingWebhook, setIsValidatingWebhook] = useState(false)
  const [webhookStatus, setWebhookStatus] = useState<"idle" | "success" | "error">("idle")
  const [webhooks, setWebhooks] = useState<StripeWebhook[]>([])
  const [newWebhookUrl, setNewWebhookUrl] = useState("")
  const [isCreatingWebhook, setIsCreatingWebhook] = useState(false)

  const isStripeKeyValid = !settings.stripe_secret_key || settings.stripe_secret_key.startsWith("sk_")

  useEffect(() => {
    let isMounted = true

    const loadSettings = async () => {
      try {
        const [settingsData, webhooksData] = await Promise.all([
          getAdminSettings(),
          listStripeWebhooks()
        ])
        
        if (!isMounted) return
        
        setSettings(settingsData)
        setWebhooks(webhooksData)

      } catch (error) {
        if (!isMounted) {
          return
        }
        toast({
          title: "Erro ao carregar configurações",
          description: error instanceof Error ? error.message : "Não foi possível buscar as configurações.",
          variant: "destructive",
        })
      } finally {
        if (isMounted) {
          setIsLoadingSettings(false)
        }
      }
    }

    void loadSettings()

    return () => {
      isMounted = false
    }
  }, [toast])


  const lookupCep = async (cep: string) => {
    const clean = cep.replace(/\D/g, "")
    if (clean.length !== 8) return
    setFetchingCep(true)
    try {
      const res = await fetch(`https://viacep.com.br/ws/${clean}/json/`)
      const data = await res.json()
      if (!data.erro) {
        setSettings(prev => ({
          ...prev,
          origin_street: data.logradouro || prev.origin_street,
          origin_neighborhood: data.bairro || prev.origin_neighborhood,
          origin_city: data.localidade || prev.origin_city,
          origin_state: data.uf || prev.origin_state,
        }))
      }
    } catch {}
    setFetchingCep(false)
  }

  const handleSaveBanners = async (e?: React.FormEvent) => {
    e?.preventDefault()
    setIsSavingSettings(true)
    try {
      const updated = await updateBannerAndHomePageSettings({ banners: settings.banners })
      setSettings(updated)
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
      toast({
        title: "Banners salvos",
        description: "As configurações de banners e página inicial foram persistidas.",
      })
    } catch (error) {
      toast({
        title: "Erro ao salvar banners",
        description: error instanceof Error ? error.message : "Não foi possível salvar os banners.",
        variant: "destructive",
      })
    } finally {
      setIsSavingSettings(false)
    }
  }

  const handleSaveMarketing = async (e?: React.FormEvent) => {
    e?.preventDefault()
    setIsSavingSettings(true)
    try {
      const {
        facebook_pixel,
        google_analytics,
        google_tag_manager,
        tiktok_pixel,
        active_campaign_key,
        custom_head_script,
        custom_body_script,
      } = settings
      const updated = await updateMarketingScriptsSettings({
        facebook_pixel,
        google_analytics,
        google_tag_manager,
        tiktok_pixel,
        active_campaign_key,
        custom_head_script,
        custom_body_script,
      })
      setSettings(updated)
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
      toast({
        title: "Marketing salvo",
        description: "As configurações de marketing e scripts foram persistidas.",
      })
    } catch (error) {
      toast({
        title: "Erro ao salvar marketing",
        description: error instanceof Error ? error.message : "Não foi possível salvar o marketing.",
        variant: "destructive",
      })
    } finally {
      setIsSavingSettings(false)
    }
  }

  const handleSavePayments = async (e?: React.FormEvent) => {
    e?.preventDefault()
    setIsSavingSettings(true)
    try {
      const {
        stripe_public_key,
        stripe_secret_key,
        stripe_webhook_secret,
        stripe_enable_cards,
        stripe_enable_pix,
      } = settings
      const updated = await updatePaymentsSettings({
        stripe_public_key,
        stripe_secret_key,
        stripe_webhook_secret,
        stripe_enable_cards,
        stripe_enable_pix,
      })
      setSettings(updated)
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
      toast({
        title: "Pagamentos salvos",
        description: "As configurações de pagamento foram persistidas.",
      })
    } catch (error) {
      toast({
        title: "Erro ao salvar pagamentos",
        description: error instanceof Error ? error.message : "Não foi possível salvar os pagamentos.",
        variant: "destructive",
      })
    } finally {
      setIsSavingSettings(false)
    }
  }

  const handleSaveShipping = async (e?: React.FormEvent) => {
    e?.preventDefault()
    setIsSavingSettings(true)
    try {
      const {
        melhor_envio_api_key,
        melhor_envio_webhook_url,
        origin_street,
        origin_number,
        origin_complement,
        origin_neighborhood,
        origin_city,
        origin_state,
        origin_zip_code,
      } = settings
      const updated = await updateShippingSettings({
        melhor_envio_api_key,
        melhor_envio_webhook_url,
        origin_street,
        origin_number,
        origin_complement,
        origin_neighborhood,
        origin_city,
        origin_state,
        origin_zip_code,
      })
      setSettings(updated)
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
      toast({
        title: "Frete salvo",
        description: "As configurações de envio foram persistidas.",
      })
    } catch (error) {
      toast({
        title: "Erro ao salvar frete",
        description: error instanceof Error ? error.message : "Não foi possível salvar o frete.",
        variant: "destructive",
      })
    } finally {
      setIsSavingSettings(false)
    }
  }

  const handleTestShipping = async () => {
    if (!settings.melhor_envio_api_key || !testFromCep || !testToCep) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha a chave API e os dois CEPs para testar.",
        variant: "destructive"
      })
      return
    }

    setIsTestingShipping(true)
    try {
      const axios = (await import("axios")).default
      const response = await axios.post(
        "https://melhorenvio.com.br/api/v2/me/shipment/calculate",
        {
          from: { postal_code: testFromCep.replace("-", "") },
          to: { postal_code: testToCep.replace("-", "") },
          products: [
            {
              id: "test",
              width: 11,
              height: 11,
              length: 16,
              weight: 0.3,
              insurance_value: 50,
              quantity: 1
            }
          ]
        },
        {
          headers: {
            "Accept": "application/json",
            "Authorization": `Bearer ${settings.melhor_envio_api_key}`,
            "Content-Type": "application/json",
          }
        }
      )

      if (response.status === 200) {
        toast({
          title: "API Funcionando!",
          description: `Conexão estabelecida com sucesso via Axios. Encontradas ${response.data.length} opções de frete.`,
        })
      }
    } catch (error: any) {
      console.error("Shipping test error (Axios):", error)
      toast({
        title: "Erro na API",
        description: error.response?.data?.message || "Erro na chave API ou restrição de CORS no navegador.",
        variant: "destructive"
      })
    } finally {
      setIsTestingShipping(false)
    }
  }

  const handleTestWebhook = async () => {
    setIsTestingWebhook(true)
    try {
      const response = await apiFetch<any>("/api/v1/settings/admin/payments/test-stripe-api-key/", {
        method: "POST",
        requiresAuth: true,
        body: { stripe_secret_key: settings.stripe_secret_key }
      })

      const { status, message } = response
      const apiMsg = status === "success" ? `✅ ${message}` : `❌ ${message}`


      toast({
        title: "Resultado do Teste",
        description: apiMsg,
      })
    } catch (error: any) {
      toast({
        title: "Erro na validação",
        description: error.message || "Falha ao validar a chave Stripe.",
        variant: "destructive"
      })
    } finally {
      setIsTestingWebhook(false)
    }
  }

  const handleValidateWebhook = async () => {
    setIsValidatingWebhook(true)
    setWebhookStatus("idle")
    try {
      const response = await apiFetch<any>("/api/v1/settings/admin/payments/validate-webhook-secret/", {
        method: "POST",
        requiresAuth: true,
        body: { stripe_webhook_secret: settings.stripe_webhook_secret }
      })

      if (response.status === "success") {
        setWebhookStatus("success")
        toast({
          title: "Webhook validado",
          description: "O signing secret está correto e o endpoint respondeu adequadamente.",
        })
      } else {
        setWebhookStatus("error")
        toast({
          title: "Erro na validação",
          description: response.message || "Não foi possível validar o webhook.",
          variant: "destructive"
        })
      }
    } catch (error: any) {
      setWebhookStatus("error")
      toast({
        title: "Erro na validação",
        description: error.message || "Falha ao comunicar com o servidor.",
        variant: "destructive"
      })
    } finally {
      setIsValidatingWebhook(false)
    }
  }

  const copyWebhookUrl = () => {
    const url = `${API_BASE_URL}/api/v1/payments/stripe/`
    navigator.clipboard.writeText(url)
    toast({
      title: "URL Copiada",
      description: "A URL do webhook foi copiada para a área de transferência.",
    })
  }

  const handleSaveWebhook = async () => {
    if (!newWebhookUrl) return
    setIsCreatingWebhook(true)
    try {
      const webhook = await createStripeWebhook(newWebhookUrl)
      setWebhooks([...webhooks, webhook])
      setNewWebhookUrl("")
      toast({
        title: "Webhook criado",
        description: "A URL do webhook foi registrada no Stripe com sucesso.",
      })
    } catch (error: any) {
      toast({
        title: "Erro ao criar webhook",
        description: error.message || "Não foi possível registrar a URL no Stripe.",
        variant: "destructive"
      })
    } finally {
      setIsCreatingWebhook(false)
    }
  }

  const handleTestWebhookEndpoint = async (webhook: StripeWebhook) => {
    try {
      const result = await testStripeWebhook(webhook.id)
      const updatedWebhooks = webhooks.map(w => 
        w.id === webhook.id ? { ...w, last_test_result: result } : w
      )
      setWebhooks(updatedWebhooks)
      
      toast({
        title: "Resultado do Teste",
        description: result.status === "success" ? `✅ ${result.message}` : `❌ ${result.message}`,
      })
    } catch (error: any) {
      toast({
        title: "Erro no teste",
        description: error.message || "Falha ao enviar evento de teste.",
        variant: "destructive"
      })
    }
  }

  const handleDeleteWebhook = async (id: string) => {
    if (!confirm("Tem certeza que deseja remover este webhook do Stripe?")) return
    try {
      await deleteStripeWebhook(id)
      setWebhooks(webhooks.filter(w => w.id !== id))
      toast({
        title: "Webhook removido",
        description: "O endpoint foi excluído do Stripe.",
      })
    } catch (error: any) {
      toast({
        title: "Erro ao remover",
        description: error.message || "Não foi possível remover o webhook.",
        variant: "destructive"
      })
    }
  }




  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  const addressFieldClassName = `w-full rounded-lg border border-border bg-background py-2 px-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary ${fetchingCep ? "cursor-wait animate-pulse opacity-70" : ""}`

  const renderSaveButtonContent = () => {
    if (isSavingSettings) {
      return <><Loader2 className="h-4 w-4 animate-spin" /> Salvando...</>
    }

    if (saved) {
      return "Configurações Salvas!"
    }

    return <><Save className="h-4 w-4" /> Salvar Configurações</>
  }

  if (isLoadingSettings) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4 sm:gap-6 lg:gap-8 w-full">
      {/* Banner Settings */}
      <section className="rounded-xl border border-border bg-card shadow-sm">
        <button
          type="button"
          onClick={() => toggleSection("banners")}
          className="flex w-full items-center justify-between gap-3 bg-secondary/30 px-6 py-4 text-left"
        >
          <div className="flex items-center gap-3">
            <ImageIcon className="h-5 w-5 text-primary" />
            <h2 className="font-bold text-foreground">Banners da Home Page</h2>
          </div>
          <ChevronDown className={`h-5 w-5 text-muted-foreground transition-transform ${openSections.banners ? "rotate-180" : ""}`} />
        </button>
        {openSections.banners && (
        <div className="border-t border-border p-6">
          <div className="grid gap-6">
            {bannerTypes.map((banner) => {
              const bannerSettings = settings.banners[banner.key]
              const Icon = banner.icon

              return (
                <div key={banner.key} className="rounded-xl border border-border bg-background/50 p-5">
                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div className="flex items-start gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-foreground">{banner.title}</h3>
                        <p className="mt-1 text-xs text-muted-foreground">Dimensao recomendada: {banner.recommendedSize}</p>
                        <p className="text-xs text-muted-foreground">{banner.helper}</p>
                      </div>
                    </div>

                    <label className="flex items-center gap-3 rounded-full border border-border px-4 py-2 text-xs font-semibold text-foreground">
                      <input
                        type="checkbox"
                        checked={bannerSettings.enabled}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            banners: {
                              ...settings.banners,
                              [banner.key]: {
                                ...bannerSettings,
                                enabled: e.target.checked,
                              },
                            },
                          })
                        }
                        className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                      />
                      Exibir neste dispositivo
                    </label>
                  </div>

                  <div className="mt-5 grid gap-4 md:grid-cols-[1.2fr_0.8fr]">
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-semibold text-foreground">Arquivo do banner</label>
                      <div className="group relative flex h-32 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-lg border-2 border-dashed border-border bg-secondary/50 transition-colors hover:bg-secondary">
                        {bannerSettings.file_name ? (
                          <>
                            <img 
                              src={resolveBannerAsset(bannerSettings.file_name, "/images/placeholder-banner.jpg")} 
                              alt="Preview" 
                              className="h-full w-full object-cover opacity-50 transition-opacity group-hover:opacity-30" 
                            />
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                              <ImageIcon className="mb-1 h-6 w-6 text-foreground" />
                              <span className="text-[10px] font-bold text-foreground">Trocar imagem</span>
                            </div>
                          </>
                        ) : (
                          <>
                            <ImageIcon className="mb-2 h-8 w-8 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">Clique para fazer upload</span>
                            <span className="mt-1 text-[11px] text-muted-foreground">PNG, JPG ou WebP</span>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col gap-4">
                      <div>
                        <label className="mb-2 block text-sm font-semibold text-foreground">Nome do arquivo</label>
                        <input
                          type="text"
                          value={bannerSettings.file_name}
                          onChange={(e) =>
                            setSettings({
                              ...settings,
                              banners: {
                                ...settings.banners,
                                [banner.key]: {
                                  ...bannerSettings,
                                  file_name: e.target.value,
                                },
                              },
                            })
                          }
                          placeholder="Ex: hero-home-desktop.webp"
                          className="w-full rounded-lg border border-border bg-background py-2 px-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                      </div>
                      <div>
                        <label className="mb-2 block text-sm font-semibold text-foreground">Texto alternativo</label>
                        <input
                          type="text"
                          value={bannerSettings.alt}
                          onChange={(e) =>
                            setSettings({
                              ...settings,
                              banners: {
                                ...settings.banners,
                                [banner.key]: {
                                  ...bannerSettings,
                                  alt: e.target.value,
                                },
                              },
                            })
                          }
                          placeholder="Descricao da imagem para acessibilidade"
                          className="w-full rounded-lg border border-border bg-background py-2 px-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
          
          <div className="mt-6 flex justify-end">
            <button
              type="button"
              onClick={() => handleSaveBanners()}
              disabled={isSavingSettings}
              className="flex items-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-sm font-bold text-primary-foreground shadow-md transition-transform hover:scale-105 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {renderSaveButtonContent()}
            </button>
          </div>
        </div>
        )}
      </section>

      {/* Marketing & Scripts Settings */}
      <section className="rounded-xl border border-border bg-card shadow-sm">
        <button
          type="button"
          onClick={() => toggleSection("marketing")}
          className="flex w-full items-center justify-between gap-3 bg-secondary/30 px-6 py-4 text-left"
        >
          <div className="flex items-center gap-3">
            <Code className="h-5 w-5 text-primary" />
            <h2 className="font-bold text-foreground">Marketing & Scripts</h2>
          </div>
          <ChevronDown className={`h-5 w-5 text-muted-foreground transition-transform ${openSections.marketing ? "rotate-180" : ""}`} />
        </button>
        {openSections.marketing && (
        <form onSubmit={handleSaveMarketing} className="border-t border-border p-6 flex flex-col gap-5">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-semibold text-foreground">Facebook Pixel ID</label>
              <input 
                type="text" 
                value={settings.facebook_pixel}
                onChange={e => setSettings({...settings, facebook_pixel: e.target.value})}
                placeholder="Ex: 123456789012345"
                className="w-full rounded-lg border border-border bg-background py-2 px-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-foreground">Google Analytics (Measurement ID)</label>
              <input 
                type="text" 
                value={settings.google_analytics}
                onChange={e => setSettings({...settings, google_analytics: e.target.value})}
                placeholder="Ex: G-XXXXXXXXXX"
                className="w-full rounded-lg border border-border bg-background py-2 px-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-foreground">Google Tag Manager (GTM)</label>
              <input 
                type="text" 
                value={settings.google_tag_manager}
                onChange={e => setSettings({...settings, google_tag_manager: e.target.value})}
                placeholder="Ex: GTM-XXXXXXX"
                className="w-full rounded-lg border border-border bg-background py-2 px-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-foreground">TikTok Pixel ID</label>
              <input 
                type="text" 
                value={settings.tiktok_pixel}
                onChange={e => setSettings({...settings, tiktok_pixel: e.target.value})}
                placeholder="Ex: CQXXXX..."
                className="w-full rounded-lg border border-border bg-background py-2 px-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-semibold text-foreground">ActiveCampaign API Key</label>
              <input 
                type="password" 
                value={settings.active_campaign_key}
                onChange={e => setSettings({...settings, active_campaign_key: e.target.value})}
                placeholder="Chave secreta"
                className="w-full rounded-lg border border-border bg-background py-2 px-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-semibold text-foreground">Script customizado no head</label>
              <textarea
                rows={4}
                value={settings.custom_head_script}
                onChange={e => setSettings({...settings, custom_head_script: e.target.value})}
                placeholder="Cole aqui scripts de monitoramento, tags ou validacoes que devem carregar no head"
                className="w-full rounded-lg border border-border bg-background py-2 px-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-semibold text-foreground">Script customizado antes do fechamento do body</label>
              <textarea
                rows={4}
                value={settings.custom_body_script}
                onChange={e => setSettings({...settings, custom_body_script: e.target.value})}
                placeholder="Cole aqui pixels, snippets de conversao ou codigos de terceiros"
                className="w-full rounded-lg border border-border bg-background py-2 px-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          <div className="rounded-lg border border-dashed border-border bg-background/70 p-4 text-xs text-muted-foreground">
            Use esta area para IDs rapidos como Google Analytics, Facebook Pixel e TikTok Pixel, e tambem para scripts personalizados quando precisar de snippets completos.
          </div>


          <div className="mt-4 flex justify-end">
            <button
              type="submit"
              disabled={isSavingSettings}
              className="flex items-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-sm font-bold text-primary-foreground shadow-md transition-transform hover:scale-105 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {renderSaveButtonContent()}
            </button>
          </div>
        </form>
        )}
      </section>

      <section className="rounded-xl border border-border bg-card shadow-sm">
        <button
          type="button"
          onClick={() => toggleSection("payment")}
          className="flex w-full items-center justify-between gap-3 bg-secondary/30 px-6 py-4 text-left"
        >
          <div className="flex items-center gap-3">
            <CreditCard className="h-5 w-5 text-primary" />
            <h2 className="font-bold text-foreground">Pagamento</h2>
          </div>
          <ChevronDown className={`h-5 w-5 text-muted-foreground transition-transform ${openSections.payment ? "rotate-180" : ""}`} />
        </button>
        {openSections.payment && (
        <form onSubmit={handleSavePayments} className="border-t border-border p-6 flex flex-col gap-5">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-semibold text-foreground">Stripe API Key</label>
              <input
                value={settings.stripe_secret_key}
                onChange={e => setSettings({...settings, stripe_secret_key: e.target.value})}
                placeholder="sk_test_..."
                className={`w-full rounded-lg border bg-background py-2 px-3 text-sm focus:outline-none focus:ring-1 ${
                  isStripeKeyValid 
                    ? "border-border focus:border-primary focus:ring-primary" 
                    : "border-destructive text-destructive focus:border-destructive focus:ring-destructive"
                }`}
              />
              {!isStripeKeyValid && (
                <p className="mt-1.5 text-[11px] font-medium text-destructive">
                  Você inseriu uma chave inválida. Para esta configuração, use a chave secreta (sk_...).
                </p>
              )}

            </div>
          </div>

          <div className="flex gap-4">
            <button
              type="button"
              onClick={handleTestWebhook}
              disabled={isTestingWebhook || isSavingSettings}
              className="flex items-center gap-2 rounded-lg border border-primary bg-primary/5 px-4 py-2 text-xs font-bold text-primary transition-colors hover:bg-primary/10 disabled:opacity-50"
            >
              {isTestingWebhook ? (
                <><Loader2 className="h-3 w-3 animate-spin" /> Testando...</>
              ) : (
                "Testar Conexão Stripe"
              )}
            </button>
          </div>

          {/* Subseção de Webhooks */}
          <div className="mt-8 border-t border-border pt-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Webhook className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-bold text-foreground">Webhooks</h3>
              </div>
            </div>

            <div className="flex flex-col gap-6">
              {/* Adicionar novo Webhook */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-foreground">Novo URL do Webhook</label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={newWebhookUrl}
                    onChange={e => setNewWebhookUrl(e.target.value)}
                    placeholder="https://seu-dominio.com/api/v1/payments/stripe/"
                    className="flex-1 rounded-lg border border-border bg-background py-2 px-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                  <button
                    type="button"
                    onClick={handleSaveWebhook}
                    disabled={isCreatingWebhook || !newWebhookUrl}
                    className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-bold text-primary-foreground shadow-sm transition-transform hover:scale-105 disabled:opacity-50"
                  >
                    {isCreatingWebhook ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                    Salvar URL
                  </button>
                </div>
              </div>

              {/* Listagem de Webhooks */}
              <div className="flex flex-col gap-4">
                <h4 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Webhooks Configurados</h4>
                
                {webhooks.length === 0 ? (
                  <div className="rounded-lg border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
                    Nenhum webhook configurado no Stripe.
                  </div>
                ) : (
                  <div className="grid gap-3">
                    {webhooks.map((webhook) => (
                      <div key={webhook.id} className="group flex flex-col gap-3 rounded-xl border border-border bg-background/50 p-4 transition-colors hover:bg-background">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex flex-col gap-1 overflow-hidden">
                            <span className="text-xs font-bold text-muted-foreground truncate">{webhook.id}</span>
                            <span className="text-sm font-medium text-foreground truncate">{webhook.url}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            {webhook.last_test_result?.status === "success" ? (
                              <CheckCircle2 className="h-5 w-5 text-green-500" />
                            ) : webhook.last_test_result?.status === "error" ? (
                              <XCircle className="h-5 w-5 text-destructive" />
                            ) : (
                              <AlertCircle className="h-5 w-5 text-amber-500" />
                            )}
                            <button
                              type="button"
                              onClick={() => handleDeleteWebhook(webhook.id)}
                              className="p-2 text-muted-foreground hover:text-destructive transition-colors"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <div className="relative flex-1">
                             <input
                                type="password"
                                readOnly
                                value={webhook.secret || "••••••••••••••••"}
                                className="w-full rounded-lg border border-border bg-secondary/20 py-1.5 px-3 text-[11px] font-mono outline-none"
                             />
                          </div>
                          <button
                            type="button"
                            onClick={() => handleTestWebhookEndpoint(webhook)}
                            className="rounded-lg border border-primary bg-primary/5 px-3 py-1.5 text-[10px] font-bold text-primary transition-colors hover:bg-primary/10"
                          >
                            Validar URL
                          </button>
                        </div>
                        
                        {webhook.last_test_result && (
                          <p className={`text-[10px] font-medium ${webhook.last_test_result.status === "success" ? "text-green-600" : "text-destructive"}`}>
                            {webhook.last_test_result.message}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="mt-4 flex justify-end">
            <button
              type="submit"
              disabled={isSavingSettings}
              className="flex items-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-sm font-bold text-primary-foreground shadow-md transition-transform hover:scale-105 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {renderSaveButtonContent()}
            </button>
          </div>
        </form>
        )}
      </section>

      <section className="rounded-xl border border-border bg-card shadow-sm">
        <button
          type="button"
          onClick={() => toggleSection("shipping")}
          className="flex w-full items-center justify-between gap-3 bg-secondary/30 px-6 py-4 text-left"
        >
          <div className="flex items-center gap-3">
            <Truck className="h-5 w-5 text-primary" />
            <h2 className="font-bold text-foreground">Frete</h2>
          </div>
          <ChevronDown className={`h-5 w-5 text-muted-foreground transition-transform ${openSections.shipping ? "rotate-180" : ""}`} />
        </button>
        {openSections.shipping && (
        <form onSubmit={handleSaveShipping} className="border-t border-border p-6 flex flex-col gap-5">
          <div className="grid grid-cols-1 gap-5">
            <div>
              <label className="mb-2 block text-sm font-semibold text-foreground">API Key Melhor Envio</label>
              <div className="relative">
                <KeyRound className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="password"
                  value={settings.melhor_envio_api_key}
                  onChange={e => setSettings({...settings, melhor_envio_api_key: e.target.value})}
                  placeholder="Token de acesso do Melhor Envio"
                  className="w-full rounded-lg border border-border bg-background py-2 pl-10 pr-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold text-foreground">CEP de Origem (Teste)</label>
                <input
                  type="text"
                  value={testFromCep}
                  onChange={e => setTestFromCep(e.target.value)}
                  placeholder="00000-000"
                  maxLength={9}
                  className="w-full rounded-lg border border-border bg-background py-2 px-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-foreground">CEP de Destino (Teste)</label>
                <input
                  type="text"
                  value={testToCep}
                  onChange={e => setTestToCep(e.target.value)}
                  placeholder="00000-000"
                  maxLength={9}
                  className="w-full rounded-lg border border-border bg-background py-2 px-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>
            <div>
              <button
                type="button"
                onClick={handleTestShipping}
                disabled={isTestingShipping}
                className="flex w-full items-center justify-center gap-2 rounded-lg border border-primary bg-primary/5 py-2.5 text-sm font-bold text-primary transition-colors hover:bg-primary/10 disabled:opacity-50"
              >
                {isTestingShipping ? (
                  <><Loader2 className="h-4 w-4 animate-spin" /> Testando conexão...</>
                ) : (
                  <>Testar API Melhor Envio</>
                )}
              </button>
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-foreground">Webhook de frete</label>
              <input
                type="url"
                value={settings.melhor_envio_webhook_url}
                onChange={e => setSettings({...settings, melhor_envio_webhook_url: e.target.value})}
                placeholder="https://.../shipping/melhor-envio/webhook"
                className="w-full rounded-lg border border-border bg-background py-2 px-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          <div className="rounded-xl border border-border bg-background/50 p-5">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-bold text-foreground">Endereço de origem</h3>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-semibold text-foreground">Rua</label>
                <input
                  type="text"
                  value={settings.origin_street}
                  onChange={e => setSettings({...settings, origin_street: e.target.value})}
                  placeholder="Ex: Rua das Flores"
                  disabled={fetchingCep}
                  className={addressFieldClassName}
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-foreground">Número</label>
                <input
                  type="text"
                  value={settings.origin_number}
                  onChange={e => setSettings({...settings, origin_number: e.target.value})}
                  placeholder="123"
                  className="w-full rounded-lg border border-border bg-background py-2 px-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-foreground">Complemento</label>
                <input
                  type="text"
                  value={settings.origin_complement}
                  onChange={e => setSettings({...settings, origin_complement: e.target.value})}
                  placeholder="Sala 2, Bloco A"
                  className="w-full rounded-lg border border-border bg-background py-2 px-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-foreground">
                  Bairro {fetchingCep ? "(carregando...)" : ""}
                </label>
                <input
                  type="text"
                  value={settings.origin_neighborhood}
                  onChange={e => setSettings({...settings, origin_neighborhood: e.target.value})}
                  placeholder="Centro"
                  disabled={fetchingCep}
                  className={addressFieldClassName}
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-foreground">
                  Cidade {fetchingCep ? "(carregando...)" : ""}
                </label>
                <input
                  type="text"
                  value={settings.origin_city}
                  onChange={e => setSettings({...settings, origin_city: e.target.value})}
                  placeholder="São Paulo"
                  disabled={fetchingCep}
                  className={addressFieldClassName}
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-foreground">
                  Estado {fetchingCep ? "(carregando...)" : ""}
                </label>
                <select
                  value={settings.origin_state}
                  onChange={e => setSettings({...settings, origin_state: e.target.value})}
                  disabled={fetchingCep}
                  className={addressFieldClassName}
                >
                  <option value="">Selecione</option>
                  <option value="AC">AC</option>
                  <option value="AL">AL</option>
                  <option value="AP">AP</option>
                  <option value="AM">AM</option>
                  <option value="BA">BA</option>
                  <option value="CE">CE</option>
                  <option value="DF">DF</option>
                  <option value="ES">ES</option>
                  <option value="GO">GO</option>
                  <option value="MA">MA</option>
                  <option value="MT">MT</option>
                  <option value="MS">MS</option>
                  <option value="MG">MG</option>
                  <option value="PA">PA</option>
                  <option value="PB">PB</option>
                  <option value="PR">PR</option>
                  <option value="PE">PE</option>
                  <option value="PI">PI</option>
                  <option value="RJ">RJ</option>
                  <option value="RN">RN</option>
                  <option value="RS">RS</option>
                  <option value="RO">RO</option>
                  <option value="RR">RR</option>
                  <option value="SC">SC</option>
                  <option value="SP">SP</option>
                  <option value="SE">SE</option>
                  <option value="TO">TO</option>
                </select>
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-foreground">CEP</label>
                <div className="relative">
                  <input
                    type="text"
                    value={settings.origin_zip_code}
                    onChange={e => setSettings({...settings, origin_zip_code: e.target.value})}
                    onBlur={e => lookupCep(e.target.value)}
                    placeholder="00000-000"
                    maxLength={9}
                    className={`w-full rounded-lg border border-border bg-background py-2 px-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary ${fetchingCep ? "cursor-wait pr-10" : ""}`}
                  />
                  {fetchingCep && <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-muted-foreground" />}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 flex justify-end">
            <button
              type="submit"
              disabled={isSavingSettings}
              className="flex items-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-sm font-bold text-primary-foreground shadow-md transition-transform hover:scale-105 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {renderSaveButtonContent()}
            </button>
          </div>
        </form>
        )}
      </section>
    </div>
  )
}
