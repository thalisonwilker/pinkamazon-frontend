"use client"

import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, Mail, Lock, ArrowRight } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { useToast } from "@/hooks/use-toast"

export default function LoginPage() {

  const router = useRouter()
  const { login } = useAuth()
  const { toast } = useToast()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})

  const getInputErrorClass = (id: string) => {
    const hasError = touched[id] && fieldErrors[id]
    const val = id === 'email' ? email : password
    const isValid = touched[id] && !fieldErrors[id] && val
    
    if (hasError) return "border-red-500 focus:border-red-500 focus:ring-red-500/10 animate-shake"
    if (isValid) return "border-green-500/50 focus:border-green-500 focus:ring-green-500/10"
    return "border-border focus:border-primary focus:ring-primary/10"
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    const result = await login(email, password)
    
    if (result.success && result.user) {
      if (result.user.is_staff) {
        router.push("/admin")
      } else {
        router.push("/minha-conta")
      }
    } else {
      const errorObj = result.error
      
      if (errorObj && typeof errorObj === 'object') {
        const errorList = Array.isArray(errorObj.data) 
          ? errorObj.data 
          : (errorObj.data && Array.isArray(errorObj.data.errors) ? errorObj.data.errors : null);

        if (errorList) {
          const newFieldErrors: Record<string, string> = {}
          const newTouched: Record<string, boolean> = {}

          errorList.forEach((errItem: any) => {
            if (errItem.field && errItem.message) {
              let fieldId = errItem.field.toLowerCase()
              if (fieldId === 'username') fieldId = 'email'
              newFieldErrors[fieldId] = errItem.message
              newTouched[fieldId] = true
            }
          })
          setFieldErrors(newFieldErrors)
          setTouched(newTouched)
        } else if (errorObj.data && typeof errorObj.data === 'object') {
          const newFieldErrors: Record<string, string> = {}
          const newTouched: Record<string, boolean> = {}
          
          Object.entries(errorObj.data).forEach(([field, messages]) => {
            let msg = ""
            if (Array.isArray(messages) && messages.length > 0) msg = messages[0]
            else if (typeof messages === 'string') msg = messages
            
            if (msg && typeof msg === 'string') {
              let fieldId = field.toLowerCase()
              if (fieldId === 'username') fieldId = 'email'
              newFieldErrors[fieldId] = msg
              newTouched[fieldId] = true
            }
          })
          setFieldErrors(newFieldErrors)
          setTouched(newTouched)
        }
      }

      const message = (errorObj && typeof errorObj === 'object' ? errorObj.message : errorObj) || "Erro ao entrar. Verifique suas credenciais."
      
      toast({
        variant: "destructive",
        title: "Erro no login",
        description: message,
      })
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen">
      {/* Left side - Login form */}
      <div className="flex w-full flex-col justify-center px-6 py-12 lg:w-1/2 lg:px-20">
        <div className="mx-auto w-full max-w-md">
          {/* Logo */}
          <Link href="/" className="mb-8 inline-block">
            <div className="relative h-16 w-40">
              <Image src="/images/logo.png" alt="Pink Amazon" fill className="object-contain" priority />
            </div>
          </Link>

          {/* Title */}
          <div className="mb-8">
            <h1 className="font-serif text-3xl font-bold text-foreground md:text-4xl">Bem-vinda de volta</h1>
            <p className="mt-2 text-sm text-muted-foreground">Entre com sua conta para continuar comprando</p>
          </div>


          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-semibold text-foreground">E-mail</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onBlur={() => setTouched(prev => ({ ...prev, email: true }))}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    if (fieldErrors.email) setFieldErrors(prev => ({ ...prev, email: "" }))
                  }}
                  placeholder="seu@email.com"
                  required
                  className={`w-full rounded-lg border bg-background py-3 pl-12 pr-4 text-sm text-foreground placeholder:text-muted-foreground transition-all focus:outline-none focus:ring-2 ${getInputErrorClass('email')}`}
                />
              </div>
              <p className={`mt-1 text-[10px] font-semibold uppercase tracking-wider ${touched.email && fieldErrors.email ? "text-red-500" : "text-muted-foreground"}`}>
                {fieldErrors.email || "Seu e-mail de acesso"}
              </p>
            </div>

            <div>
              <label htmlFor="password" className="mb-2 block text-sm font-semibold text-foreground">Senha</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onBlur={() => setTouched(prev => ({ ...prev, password: true }))}
                  onChange={(e) => {
                    setPassword(e.target.value)
                    if (fieldErrors.password) setFieldErrors(prev => ({ ...prev, password: "" }))
                  }}
                  placeholder="••••••••"
                  required
                  className={`w-full rounded-lg border bg-background py-3 pl-12 pr-12 text-sm text-foreground placeholder:text-muted-foreground transition-all focus:outline-none focus:ring-2 ${getInputErrorClass('password')}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                  aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              <p className={`mt-1 text-[10px] font-semibold uppercase tracking-wider ${touched.password && fieldErrors.password ? "text-red-500" : "text-muted-foreground"}`}>
                {fieldErrors.password || "Mínimo de 8 caracteres"}
              </p>
            </div>

            <div className="flex items-center justify-end">
              <Link href="#" className="text-sm font-semibold text-primary transition-colors hover:text-primary/80">
                Esqueceu a senha?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="group mt-2 flex items-center justify-center gap-2 rounded-full bg-primary py-3.5 text-sm font-bold uppercase tracking-wider text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] hover:shadow-xl hover:shadow-primary/30 disabled:opacity-70"
            >
              {loading ? "Entrando..." : "Entrar"}
              {!loading && <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />}
            </button>
          </form>

          <div className="my-8 flex items-center gap-4">
            <div className="h-px flex-1 bg-border" />
            <span className="text-xs text-muted-foreground">OU</span>
            <div className="h-px flex-1 bg-border" />
          </div>

          {/* <div className="flex flex-col gap-3">
            <button type="button" className="flex items-center justify-center gap-3 rounded-lg border-2 border-border bg-background py-3 text-sm font-semibold text-foreground transition-all hover:border-muted-foreground/30 hover:bg-secondary">
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Continuar com Google
            </button>
            <button type="button" className="flex items-center justify-center gap-3 rounded-lg border-2 border-border bg-background py-3 text-sm font-semibold text-foreground transition-all hover:border-muted-foreground/30 hover:bg-secondary">
              <svg className="h-5 w-5" fill="#1877F2" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              Continuar com Facebook
            </button>
          </div> */}

          <p className="mt-8 text-center text-sm text-muted-foreground">
            Não tem uma conta?{" "}
            <Link href="/cadastro" className="font-semibold text-primary transition-colors hover:text-primary/80">
              Criar conta
            </Link>
          </p>
        </div>
      </div>

      {/* Right side - Brand */}
      <div className="relative hidden lg:block lg:w-1/2">
        <div className="absolute inset-0 bg-primary">
          <div className="flex h-full flex-col items-center justify-center p-12 text-center">
            <div className="relative mb-8 h-32 w-64">
              <Image src="/images/logo.png" alt="Pink Amazon Logo" fill className="object-contain brightness-0 invert" />
            </div>
            <h2 className="mb-4 font-serif text-4xl font-bold text-white">Wild, Bold & Proud</h2>
            <p className="max-w-md text-lg leading-relaxed text-white/90">
              Sandálias criadas no coração da Amazônia com alma brasileira e atitude internacional.
            </p>
            <div className="mt-12 grid grid-cols-3 gap-8">
              {["Qualidade", "Conforto", "Estilo"].map((label, i) => (
                <div key={i} className="flex flex-col items-center gap-2">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/20">
                    <span className="text-2xl font-bold text-white">{i + 1}</span>
                  </div>
                  <p className="text-xs font-semibold text-white">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


