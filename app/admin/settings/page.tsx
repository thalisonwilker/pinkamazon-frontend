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
} from "lucide-react"

import { useToast } from "@/hooks/use-toast"
import {
  DEFAULT_ADMIN_SETTINGS,
  getAdminSettings,
  updateAdminSettings,
  resolveBannerAsset,
  type AdminSettings,
} from "@/lib/admin-settings"

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

  useEffect(() => {
    let isMounted = true

    const loadSettings = async () => {
      try {
        const data = await getAdminSettings()
        if (!isMounted) {
          return
        }
        setSettings(data)
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
          originStreet: data.logradouro || prev.originStreet,
          originNeighborhood: data.bairro || prev.originNeighborhood,
          originCity: data.localidade || prev.originCity,
          originState: data.uf || prev.originState,
        }))
      }
    } catch {}
    setFetchingCep(false)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSavingSettings(true)

    try {
      const updatedSettings = await updateAdminSettings(settings)
      setSettings(updatedSettings)
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
      toast({
        title: "Configurações salvas",
        description: "As alterações de /admin/settings foram persistidas.",
      })
    } catch (error) {
      toast({
        title: "Erro ao salvar configurações",
        description: error instanceof Error ? error.message : "Não foi possível salvar as configurações.",
        variant: "destructive",
      })
    } finally {
      setIsSavingSettings(false)
    }
  }

  const handleTestShipping = async () => {
    if (!settings.melhorEnvioApiKey || !testFromCep || !testToCep) {
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
            "Authorization": `Bearer ${settings.melhorEnvioApiKey}`,
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
                        {bannerSettings.fileName ? (
                          <>
                            <img 
                              src={resolveBannerAsset(bannerSettings.fileName, "/images/placeholder-banner.jpg")} 
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
                          value={bannerSettings.fileName}
                          onChange={(e) =>
                            setSettings({
                              ...settings,
                              banners: {
                                ...settings.banners,
                                [banner.key]: {
                                  ...bannerSettings,
                                  fileName: e.target.value,
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
        <form onSubmit={handleSave} className="border-t border-border p-6 flex flex-col gap-5">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-semibold text-foreground">Facebook Pixel ID</label>
              <input 
                type="text" 
                value={settings.facebookPixel}
                onChange={e => setSettings({...settings, facebookPixel: e.target.value})}
                placeholder="Ex: 123456789012345"
                className="w-full rounded-lg border border-border bg-background py-2 px-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-foreground">Google Analytics (Measurement ID)</label>
              <input 
                type="text" 
                value={settings.googleAnalytics}
                onChange={e => setSettings({...settings, googleAnalytics: e.target.value})}
                placeholder="Ex: G-XXXXXXXXXX"
                className="w-full rounded-lg border border-border bg-background py-2 px-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-foreground">Google Tag Manager (GTM)</label>
              <input 
                type="text" 
                value={settings.googleTagManager}
                onChange={e => setSettings({...settings, googleTagManager: e.target.value})}
                placeholder="Ex: GTM-XXXXXXX"
                className="w-full rounded-lg border border-border bg-background py-2 px-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-foreground">TikTok Pixel ID</label>
              <input 
                type="text" 
                value={settings.tiktokPixel}
                onChange={e => setSettings({...settings, tiktokPixel: e.target.value})}
                placeholder="Ex: CQXXXX..."
                className="w-full rounded-lg border border-border bg-background py-2 px-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-semibold text-foreground">ActiveCampaign API Key</label>
              <input 
                type="password" 
                value={settings.activeCampaignKey}
                onChange={e => setSettings({...settings, activeCampaignKey: e.target.value})}
                placeholder="Chave secreta"
                className="w-full rounded-lg border border-border bg-background py-2 px-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-semibold text-foreground">Script customizado no head</label>
              <textarea
                rows={4}
                value={settings.customHeadScript}
                onChange={e => setSettings({...settings, customHeadScript: e.target.value})}
                placeholder="Cole aqui scripts de monitoramento, tags ou validacoes que devem carregar no head"
                className="w-full rounded-lg border border-border bg-background py-2 px-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-semibold text-foreground">Script customizado antes do fechamento do body</label>
              <textarea
                rows={4}
                value={settings.customBodyScript}
                onChange={e => setSettings({...settings, customBodyScript: e.target.value})}
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
        <form onSubmit={handleSave} className="border-t border-border p-6 flex flex-col gap-5">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-semibold text-foreground">Stripe Publishable Key</label>
              <input
                type="text"
                value={settings.stripePublicKey}
                onChange={e => setSettings({...settings, stripePublicKey: e.target.value})}
                placeholder="pk_test_..."
                className="w-full rounded-lg border border-border bg-background py-2 px-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-foreground">Stripe Secret Key</label>
              <input
                type="password"
                value={settings.stripeSecretKey}
                onChange={e => setSettings({...settings, stripeSecretKey: e.target.value})}
                placeholder="sk_test_..."
                className="w-full rounded-lg border border-border bg-background py-2 px-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-semibold text-foreground">Webhook Secret</label>
              <input
                type="password"
                value={settings.stripeWebhookSecret}
                onChange={e => setSettings({...settings, stripeWebhookSecret: e.target.value})}
                placeholder="whsec_..."
                className="w-full rounded-lg border border-border bg-background py-2 px-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
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
        <form onSubmit={handleSave} className="border-t border-border p-6 flex flex-col gap-5">
          <div className="grid grid-cols-1 gap-5">
            <div>
              <label className="mb-2 block text-sm font-semibold text-foreground">API Key Melhor Envio</label>
              <div className="relative">
                <KeyRound className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="password"
                  value={settings.melhorEnvioApiKey}
                  onChange={e => setSettings({...settings, melhorEnvioApiKey: e.target.value})}
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
                value={settings.melhorEnvioWebhookUrl}
                onChange={e => setSettings({...settings, melhorEnvioWebhookUrl: e.target.value})}
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
                  value={settings.originStreet}
                  onChange={e => setSettings({...settings, originStreet: e.target.value})}
                  placeholder="Ex: Rua das Flores"
                  disabled={fetchingCep}
                  className={addressFieldClassName}
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-foreground">Número</label>
                <input
                  type="text"
                  value={settings.originNumber}
                  onChange={e => setSettings({...settings, originNumber: e.target.value})}
                  placeholder="123"
                  className="w-full rounded-lg border border-border bg-background py-2 px-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-foreground">Complemento</label>
                <input
                  type="text"
                  value={settings.originComplement}
                  onChange={e => setSettings({...settings, originComplement: e.target.value})}
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
                  value={settings.originNeighborhood}
                  onChange={e => setSettings({...settings, originNeighborhood: e.target.value})}
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
                  value={settings.originCity}
                  onChange={e => setSettings({...settings, originCity: e.target.value})}
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
                  value={settings.originState}
                  onChange={e => setSettings({...settings, originState: e.target.value})}
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
                    value={settings.originZipCode}
                    onChange={e => setSettings({...settings, originZipCode: e.target.value})}
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
