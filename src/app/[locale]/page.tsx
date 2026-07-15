import HeroSection from '@/components/sections/HeroSection';
import AboutSection from '@/components/sections/AboutSection';
import ServicesSection from '@/components/sections/ServicesSection';
import ProductsSection from '@/components/sections/ProductsSection';
import ContactSection from '@/components/sections/ContactSection';

export default function Home() {
  return (
    <main className="bg-warm-bg">
      <HeroSection />
      <AboutSection />
      <ServicesSection />
      <ProductsSection />
      <ContactSection />
    </main>
  );
}