# 🌸 Pink Amazon: Wild, Bold & Proud

[![Next.js](https://img.shields.io/badge/Next.js-15%2B-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue?logo=react)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript)](https://www.typescriptlang.org/)

**Pink Amazon** é uma plataforma de e-commerce de elite focada em *streetwear* de calçados premium, unindo a exuberância da biodiversidade amazônica com a atitude crua da cultura urbana industrial e estética neon.

---

## 🎨 Identidade e Conceito

A marca nasceu da provocação entre o "Selvagem" e o "Urbano". O design utiliza contrastes de alto impacto:
- **Cores**: Black profundo e Neon Pink (#E91E7B).
- **Iconografia**: Animais amazônicos (Araras, Tucanos, Primatas) reinterpretados com acessórios urbanos (fones de ouvido, bonés, óculos).
- **Tipografia**: O drama das fontes serifadas (`Playfair Display`) em equilíbrio com a precisão técnica das sans-serif (`Inter`).

---

## 🛠️ Stack Tecnológica

O projeto utiliza o que há de mais moderno no desenvolvimento web para garantir performance, SEO e escalabilidade:

- **Core**: Next.js 15+ (App Router) & React 19.
- **Styling**: Tailwind CSS 4 (Beta/Canary) com suporte nativo a modern CSS features.
- **Componentes**: Radix UI (Primitivos acessíveis) e Lucide React para ícones.
- **Animações**: Transições nativas do Tailwind 4 e `tw-animate-css` para micro-interações.
- **Data Handling**: TypeScript para segurança de tipos em todo o fluxo de dados.
- **Analytics**: Vercel Analytics integrado.

---

## 🏗️ Estrutura do Projeto

```bash
├── app/                  # Rotas, Layouts e Páginas (Next.js App Router)
│   ├── globals.css       # Estilos globais e Configuração Tailwind 4
│   └── layout.tsx        # Definição de fontes e Meta tags (SEO)
├── components/           # Componentes modulares e reutilizáveis
│   ├── home/             # Componentes específicos da Landing Page
│   └── ui/               # Componentes de base (botões, inputs, etc)
├── lib/                  # Utilitários, hooks, mocks e tipos
│   └── products.ts       # Simulação de banco de dados e tipos de produto
├── public/               # Assets estáticos (Imagens, Vídeos, Vetores)
├── styles/               # Configurações adicionais de estilo
└── GEMINI.md             # Guia de contexto para desenvolvimento assistido por IA
```

---

## 🚀 Como Executar

### Pré-requisitos
- Node.js 18.18+ ou superior.
- npm, pnpm ou yarn.

### Instalação

1. Clone o repositório ou baixe os arquivos.
2. Instale as dependências:
   ```bash
   npm install
   # ou
   pnpm install
   ```

3. Execute o servidor de desenvolvimento frontend:
   ```bash
   npm run dev
   ```
4. Acesse `http://localhost:3000` no seu navegador.

---

## 🧩 Backend Django (opcional)

O projeto também inclui um backend Django + PostgreSQL dentro da pasta `api/` (autenticação JWT, usuários, etc.). Ele roda em `http://localhost:8000`.

### Rodando o backend

```bash
cd api
cp .env.example .env
docker-compose up --build
```

### Conectando o frontend ao backend

O frontend utiliza a variável de ambiente `NEXT_PUBLIC_API_URL` para apontar para o backend (por padrão `http://localhost:8000`).

---

## ✨ Principais Funcionalidades Implementadas

### 1. Hybrid Video Hero Slider
Um slider de alta performance que alterna entre vídeos de campanha em 4K e imagens de lifestyle de alta resolução. Inclui controles estilo *Media Player* discretos e barras de progresso animadas.

### 2. Fluxo de Vitrine Inteligente
Sistema de grid progressivo que exibe os produtos com meta-dados detalhados (preços, categorias, badges de novidade). Utiliza *Hover Effects* sofisticados para revelar detalhes secundários.

### 3. Design System Atômico
Toda a UI é construída sobre variáveis CSS dinâmicas, permitindo a troca rápida de temas (Dark/Light) e garantindo consistência visual em todos os componentes.

### 4. Responsividade Ultra-fluida
Estratégia *Mobile-First* aplicada rigorosamente, convertendo grids complexos em sliders horizontais ou listas compactas para garantir a melhor experiência em dispositivos móveis.

---

## 📏 Guia de Estilo (Resumo)

### Cores (CSS Variables)
- **Primary (Neon)**: `#E91E7B` (Pink)
- **Background**: `#000000` (Main) / `#111111` (Secondary)
- **Foreground**: `#FFFFFF` (Main)

### Tipografia
- **Títulos**: `Playfair Display, serif` (Black 900)
- **Corpo**: `Inter, sans-serif` (Medium 500 / SemiBold 600)

---

## 🛤️ Roadmap Futuro

- [ ] Integração com Gateway de Pagamento (Stripe/Cielo).
- [ ] Carrinho de compras com persistência local.
- [ ] Filtros de categoria avançados com busca em tempo real.
- [ ] Página de visualização de produto 3D (WebGL/Three.js).

---

## 📄 Licença

Este projeto é de uso exclusivo da marca **Pink Amazon**. 

---

*"Created in the Heart of the Amazon, Walked Around the World."*
