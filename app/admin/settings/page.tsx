"use client"

import { useState } from "react"
import { Save, Image as ImageIcon, Code } from "lucide-react"

export default function SettingsAdminPage() {
  const [settings, setSettings] = useState({
    facebookPixel: "",
    googleAnalytics: "",
    googleTagManager: "",
    tiktokPixel: "",
    activeCampaignKey: ""
  })
  const [saved, setSaved] = useState(false)

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="flex flex-col gap-8 max-w-4xl">
      {/* Banner Settings */}
      <section className="rounded-xl border border-border bg-card shadow-sm">
        <div className="flex items-center gap-3 border-b border-border bg-secondary/30 px-6 py-4">
          <ImageIcon className="h-5 w-5 text-primary" />
          <h2 className="font-bold text-foreground">Banners da Home Page</h2>
        </div>
        <div className="p-6">
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-foreground">Banner Principal (Desktop)</label>
              <div className="flex h-32 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-secondary/50 transition-colors hover:bg-secondary">
                <ImageIcon className="h-8 w-8 text-muted-foreground mb-2" />
                <span className="text-xs text-muted-foreground">Clique para fazer upload (1920x1080)</span>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-foreground">Banner Principal (Mobile)</label>
              <div className="flex h-32 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-secondary/50 transition-colors hover:bg-secondary">
                <ImageIcon className="h-8 w-8 text-muted-foreground mb-2" />
                <span className="text-xs text-muted-foreground">Clique para fazer upload (1080x1920)</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Marketing & Scripts Settings */}
      <section className="rounded-xl border border-border bg-card shadow-sm">
        <div className="flex items-center gap-3 border-b border-border bg-secondary/30 px-6 py-4">
          <Code className="h-5 w-5 text-primary" />
          <h2 className="font-bold text-foreground">Marketing & Scripts</h2>
        </div>
        <form onSubmit={handleSave} className="p-6 flex flex-col gap-5">
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
          </div>

          <div className="mt-4 flex justify-end">
            <button
              type="submit"
              className="flex items-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-sm font-bold text-primary-foreground shadow-md transition-transform hover:scale-105"
            >
              {saved ? "Configurações Salvas!" : <><Save className="h-4 w-4" /> Salvar Configurações</>}
            </button>
          </div>
        </form>
      </section>
    </div>
  )
}
