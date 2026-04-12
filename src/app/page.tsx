import Navbar from '@/components/homepage/navbar'
import HeroSection from '@/components/homepage/hero-section'
import GlassShowcase from '@/components/homepage/glass-showcase'
import FeaturesSection from '@/components/homepage/features-section'
import WorkflowSection from '@/components/homepage/workflow-section'
import AISection from '@/components/homepage/ai-section'
import CTASection from '@/components/homepage/cta-section'
import Footer from '@/components/homepage/footer'

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white overflow-x-hidden">
      <Navbar />
      <HeroSection />
      <GlassShowcase />
      <FeaturesSection />
      <WorkflowSection />
      <AISection />
      <CTASection />
      <Footer />
    </div>
  )
}
