"use client"

import { ClientLayout } from "@/components/client-layout"
import { HeroBanner } from "@/components/home/hero-banner"
import { PromoBanner } from "@/components/home/promo-banner"
import { LifestyleSlider } from "@/components/home/lifestyle-slider"
import { CategoriesSection } from "@/components/home/categories-section"
import { ProductsSection } from "@/components/home/products-section"
import { AboutSection } from "@/components/home/about-section"

export default function HomePage() {
  return (
    <ClientLayout>
      <PromoBanner />
      <HeroBanner />
      <LifestyleSlider />
      <ProductsSection />
      {/* <CategoriesSection /> - Ocultado temporariamente a pedido do cliente */}
      <AboutSection />
    </ClientLayout>
  )
}
