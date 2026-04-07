"use client"

import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import { ShoppingBag, User, Menu, X, Search, LogOut, ChevronDown } from "lucide-react"
import { useCart } from "@/lib/cart-context"
import { useAuth } from "@/lib/auth-context"

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const { totalItems } = useCart()
  const { user, logout } = useAuth()

  return (
    <header className="sticky top-0 z-50 bg-[#E91E7B] border-b border-transparent shadow-sm">
      <div className="mx-auto flex max-w-[1400px] items-center justify-between px-4 py-4 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex shrink-0 items-center gap-2">
          <Image src="/images/logo.png" alt="Pink Amazon" width={64} height={64} className="h-14 w-14 object-contain lg:h-16 lg:w-16" />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-6 lg:flex text-[13px] font-bold uppercase tracking-widest text-white">
          <div className="group relative">
            <Link href="/" className="text-[#FFE800] pb-1">
              Inicio
            </Link>
            <span className="absolute -bottom-1 left-0 h-[2px] w-full bg-[#FFE800]"></span>
          </div>
          <span className="text-white/50 font-light">|</span>
          
          <Link href="/#produtos" className="transition-opacity hover:opacity-70">
            Loja
          </Link>
          <span className="text-white/50 font-light">|</span>
          
          <Link href="/#sobre" className="transition-opacity hover:opacity-70">
            Sobre
          </Link>
          <span className="text-white/50 font-light">|</span>
          
          <Link href="/minha-conta" className="transition-opacity hover:opacity-70">
            Minha Conta
          </Link>
          <span className="text-white/50 font-light">|</span>
          
          <Link href="/#contato" className="transition-opacity hover:opacity-70">
            Contato
          </Link>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button className="hidden rounded-full p-2 text-foreground/70 transition-colors hover:bg-secondary hover:text-primary lg:flex" aria-label="Buscar">
            <Search className="h-5 w-5" />
          </button>

          {/* User menu */}
          {user ? (
            <div className="relative hidden lg:block">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 rounded-full px-3 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-80"
                aria-label="Menu do usuário"
              >
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-black/20">
                  <User className="h-4 w-4 text-white" />
                </div>
                <span className="text-sm">{user.first_name || user.email.split("@")[0]}</span>
                <ChevronDown className={`h-4 w-4 transition-transform ${userMenuOpen ? "rotate-180" : ""}`} />
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-52 overflow-hidden rounded-xl border border-border bg-card shadow-xl">
                  <div className="border-b border-border px-4 py-3">
                     <p className="text-sm font-bold text-foreground">
                       {user.first_name} {user.last_name}
                     </p>
                     <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                  <div className="py-1">
                    <Link href="/minha-conta" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2 px-4 py-2.5 text-sm text-foreground transition-colors hover:bg-secondary hover:text-primary">
                      <User className="h-4 w-4" /> Minha conta
                    </Link>
                    <Link href="/minha-conta" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2 px-4 py-2.5 text-sm text-foreground transition-colors hover:bg-secondary hover:text-primary">
                      <ShoppingBag className="h-4 w-4" /> Meus pedidos
                    </Link>
                  </div>
                  <div className="border-t border-border py-1">
                    <button onClick={() => { logout(); setUserMenuOpen(false) }} className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-red-50 hover:text-red-600">
                      <LogOut className="h-4 w-4" /> Sair
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
             <Link
              href="/login"
              className="hidden rounded-lg bg-[#222222] px-7 py-2 text-[13px] font-bold text-white transition-all hover:bg-black lg:flex"
            >
              Entrar
            </Link>
          )}

          <Link href="/checkout" className="relative rounded-full p-2 text-white transition-all hover:opacity-70" aria-label="Carrinho">
            <ShoppingBag className="h-6 w-6" />
            {totalItems > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-[#FFE800] text-[10px] font-bold text-black">
                {totalItems}
              </span>
            )}
          </Link>
          <button
            className="rounded-full p-2 text-white transition-opacity hover:opacity-70 lg:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
          >
            {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`overflow-hidden border-t border-border transition-all duration-300 ease-in-out lg:hidden ${
          menuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <nav className="flex flex-col gap-1 px-4 py-4">
          {[
            { label: "Inicio", href: "/" },
            { label: "Loja", href: "/#produtos" },
            { label: "Sobre", href: "/#sobre" },
            { label: "Contato", href: "/#contato" },
          ].map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="rounded-lg px-4 py-3 text-sm font-medium uppercase tracking-wider text-foreground/80 transition-colors hover:bg-secondary hover:text-primary"
            >
              {link.label}
            </Link>
          ))}
          {user ? (
            <>
              <Link href="/minha-conta" onClick={() => setMenuOpen(false)} className="rounded-lg px-4 py-3 text-sm font-medium uppercase tracking-wider text-foreground/80 transition-colors hover:bg-secondary hover:text-primary">
                Minha Conta
              </Link>
              <button onClick={() => { logout(); setMenuOpen(false) }} className="rounded-lg px-4 py-3 text-left text-sm font-medium uppercase tracking-wider text-red-500 transition-colors hover:bg-red-50">
                Sair
              </button>
            </>
          ) : (
            <Link href="/login" onClick={() => setMenuOpen(false)} className="rounded-lg px-4 py-3 text-sm font-medium uppercase tracking-wider text-foreground/80 transition-colors hover:bg-secondary hover:text-primary">
              Entrar
            </Link>
          )}
        </nav>
      </div>
    </header>
  )
}
