import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Navigation } from '@/components/ui-custom/Navigation';
import { Footer } from '@/components/ui-custom/Footer';
import { Hero } from '@/components/ui-custom/Hero';
import { ResearchPortal } from '@/sections/ResearchPortal';
import { ProductCatalog } from '@/sections/ProductCatalog';
import { WellnessApp } from '@/sections/WellnessApp';
import { AdminDashboard } from '@/pages/AdminDashboard';
import { Cart } from '@/pages/Cart';
import { Login } from '@/pages/Login';
import { DistributorApply } from '@/pages/DistributorApply';
import { AffiliateApply } from '@/pages/AffiliateApply';
import { useAuthStore, useProductStore } from '@/store';

// Home Page - Revolutionary Nano Silver Store
function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Hero />
      
      {/* Scientific Excellence Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 mb-6">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-sm font-medium text-primary">Premium Wellness Products</span>
            </div>
            <h2 className="font-orbitron text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-cyan-400 to-accent">
                SIVERS Technology
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Our proprietary nano silver formulation is manufactured in a GMP-certified Canadian facility. 
              Each batch is third-party tested for purity, concentration, and particle size consistency.
            </p>
          </div>

          {/* Particle Size Visualization */}
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
            <div className="relative">
              <div className="aspect-square rounded-2xl bg-gradient-to-br from-primary/20 via-accent/20 to-primary/20 flex items-center justify-center relative overflow-hidden group">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,255,255,0.1)_0%,transparent_50%)]" />
                
                {/* Animated Particles */}
                <div className="relative w-64 h-64">
                  {[...Array(20)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute w-2 h-2 rounded-full bg-primary/60 animate-float"
                      style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                        animationDelay: `${Math.random() * 3}s`,
                        animationDuration: `${3 + Math.random() * 2}s`,
                      }}
                    />
                  ))}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <p className="font-orbitron text-6xl font-bold text-primary">10-20</p>
                      <p className="text-2xl text-accent font-orbitron">nanometers</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              <h3 className="font-orbitron text-2xl font-semibold">Why Particle Size Matters</h3>
              <div className="space-y-4">
                {[
                  { title: 'Optimal Bioavailability', desc: '3-5nm particles maximize surface area for enhanced effectiveness' },
                  { title: 'Stable Suspension', desc: 'Our proprietary process prevents agglomeration and settling' },
                  { title: '99.99% Pure Silver', desc: 'Pharmaceutical-grade silver in purified water, nothing else' },
                  { title: 'Third-Party Verified', desc: 'Every batch tested by independent laboratories' },
                ].map((item, i) => (
                  <div key={i} className="flex gap-4 p-4 rounded-xl bg-muted/50 border border-border/50">
                    <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-primary font-orbitron font-bold">{i + 1}</span>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">{item.title}</h4>
                      <p className="text-sm text-muted-foreground">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-orbitron text-3xl sm:text-4xl font-bold mb-4">
              Research-Grade <span className="text-primary">Products</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Canadian-made nano silver solutions for research and laboratory applications
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: '10ppm Solution', price: '$49.99', desc: '500ml - Research Grade', icon: '💧' },
              { name: '20ppm Solution', price: '$79.99', desc: '500ml - Enhanced Potency', icon: '⚗️' },
              { name: 'Topical Gel', price: '$34.99', desc: '100ml - External Use', icon: '🧴' },
              { name: 'Nasal Spray', price: '$29.99', desc: '30ml - Fine Mist', icon: '💨' },
            ].map((product, i) => (
              <a
                key={i}
                href="/products"
                className="group holographic-card p-6 rounded-xl hover:scale-[1.02] transition-all duration-300"
              >
                <div className="text-4xl mb-4">{product.icon}</div>
                <h3 className="font-orbitron text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                  {product.name}
                </h3>
                <p className="text-sm text-muted-foreground mb-3">{product.desc}</p>
                <p className="text-xl font-bold text-primary">{product.price}</p>
              </a>
            ))}
          </div>

          <div className="text-center mt-10">
            <a
              href="/products"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl btn-holographic font-semibold"
            >
              View All Products
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </div>
        </div>
      </section>

      {/* Research Hub Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/30 mb-6">
                <svg className="w-4 h-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span className="text-sm font-medium text-accent">PubMed Research Database</span>
              </div>
              <h2 className="font-orbitron text-3xl sm:text-4xl font-bold mb-6">
                Explore the <span className="text-accent">Science</span>
              </h2>
              <p className="text-muted-foreground mb-8 leading-relaxed">
                Access peer-reviewed research on silver nanoparticles from PubMed. 
                Our database includes studies on viral, bacterial, parasitic, and fungal pathogens. 
                Search by disease, pathogen, or health condition.
              </p>
              
              <div className="grid grid-cols-2 gap-4 mb-8">
                {[
                  { label: 'Viral', count: 'COVID-19, HIV, Ebola, Influenza' },
                  { label: 'Bacterial', count: 'MRSA, E. coli, Pseudomonas' },
                  { label: 'Parasitic', count: 'Malaria, Giardia, Toxoplasma' },
                  { label: 'Fungal', count: 'Candida, Aspergillus' },
                ].map((item, i) => (
                  <div key={i} className="p-4 rounded-lg bg-muted/50 border border-border/50">
                    <p className="text-sm font-medium text-primary mb-1">{item.label}</p>
                    <p className="text-xs text-muted-foreground">{item.count}</p>
                  </div>
                ))}
              </div>

              <a
                href="/research"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-accent/10 border border-accent/30 text-accent hover:bg-accent/20 transition-colors font-semibold"
              >
                Search Research Database
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </a>
            </div>

            <div className="relative">
              <div className="aspect-video rounded-2xl bg-gradient-to-br from-accent/20 to-primary/20 p-8 flex flex-col justify-center">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-background/80">
                    <div className="w-3 h-3 rounded-full bg-green-400" />
                    <span className="text-sm font-mono">SARS-CoV-2 inhibition study</span>
                    <span className="ml-auto text-xs text-muted-foreground">2024</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-background/80">
                    <div className="w-3 h-3 rounded-full bg-green-400" />
                    <span className="text-sm font-mono">MRSA antimicrobial activity</span>
                    <span className="ml-auto text-xs text-muted-foreground">2023</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-background/80">
                    <div className="w-3 h-3 rounded-full bg-green-400" />
                    <span className="text-sm font-mono">Wound healing mechanisms</span>
                    <span className="ml-auto text-xs text-muted-foreground">2023</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-background/80">
                    <div className="w-3 h-3 rounded-full bg-green-400" />
                    <span className="text-sm font-mono">Biofilm disruption study</span>
                    <span className="ml-auto text-xs text-muted-foreground">2024</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Certifications & Trust */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-orbitron text-3xl font-bold mb-4">Trusted Quality Standards</h2>
            <p className="text-muted-foreground">Manufactured under strict regulatory compliance</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { icon: '🏭', label: 'GMP Certified', desc: 'Good Manufacturing Practice' },
              { icon: '🔬', label: 'Lab Tested', desc: 'Third-Party Verified' },
              { icon: '📋', label: 'ISO 9001', desc: 'Quality Management' },
              { icon: '🇨🇦', label: 'Made in Canada', desc: 'Canadian Facility' },
            ].map((cert, i) => (
              <div key={i} className="text-center">
                <div className="text-5xl mb-4">{cert.icon}</div>
                <h4 className="font-orbitron font-semibold mb-1">{cert.label}</h4>
                <p className="text-sm text-muted-foreground">{cert.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partner Programs */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-orbitron text-3xl font-bold mb-4">Partner With Us</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Join our network of distributors and affiliates across Canada and beyond
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <a
              href="/distributor/apply"
              className="group holographic-card p-8 rounded-xl hover:scale-[1.02] transition-all"
            >
              <div className="w-16 h-16 rounded-xl bg-primary/20 flex items-center justify-center mb-6 group-hover:bg-primary/30 transition-colors">
                <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="font-orbitron text-xl font-semibold mb-3">Become a Distributor</h3>
              <p className="text-muted-foreground mb-6">
                Bulk pricing, exclusive territory rights, marketing materials, and distributor forum access. 
                Perfect for retailers, clinics, and wellness centers.
              </p>
              <span className="inline-flex items-center text-primary font-semibold">
                Apply Now
                <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </span>
            </a>

            <a
              href="/affiliate/apply"
              className="group holographic-card p-8 rounded-xl hover:scale-[1.02] transition-all"
            >
              <div className="w-16 h-16 rounded-xl bg-accent/20 flex items-center justify-center mb-6 group-hover:bg-accent/30 transition-colors">
                <svg className="w-8 h-8 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <h3 className="font-orbitron text-xl font-semibold mb-3">Become an Affiliate</h3>
              <p className="text-muted-foreground mb-6">
                Earn commissions by referring customers. Get your unique referral link, 
                track clicks and conversions, and receive payouts via PayPal or crypto.
              </p>
              <span className="inline-flex items-center text-accent font-semibold">
                Apply Now
                <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

// Research Page
function ResearchPage() {
  return (
    <div className="min-h-screen bg-background pt-20">
      <ResearchPortal />
    </div>
  );
}

// Products Page
function ProductsPage() {
  return (
    <div className="min-h-screen bg-background pt-20">
      <ProductCatalog />
    </div>
  );
}

// Wellness Page
function WellnessPage() {
  return (
    <div className="min-h-screen bg-background pt-20">
      <WellnessApp />
    </div>
  );
}

// About Page
function AboutPage() {
  return (
    <div className="min-h-screen bg-background pt-24 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="font-orbitron text-4xl font-bold text-center mb-8">
          About <span className="text-primary">Us</span>
        </h1>
        
        <div className="space-y-8">
          <section className="holographic-card p-8 rounded-xl">
            <h2 className="font-orbitron text-2xl font-semibold mb-4">Our Mission</h2>
            <p className="text-muted-foreground leading-relaxed">
              Canada Nano Silver is committed to providing premium wellness products featuring 
              ultra-small silver nanoparticles. We combine cutting-edge science with natural wellness 
              principles to support your health journey with quality you can trust.
            </p>
          </section>

          <section className="holographic-card p-8 rounded-xl">
            <h2 className="font-orbitron text-2xl font-semibold mb-4">Quality Assurance</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              All our products are manufactured in Canada under strict Good Manufacturing Practice (GMP) 
              standards. We employ third-party testing to verify the purity, concentration, and particle 
              size of every batch we produce.
            </p>
            <ul className="grid sm:grid-cols-2 gap-4">
              {[
                'GMP Certified Facility',
                'Third-Party Laboratory Tested',
                'ISO 9001 Compliant',
                'Health Canada Registered',
                '99.99% Pure Silver',
                '3-5nm Particle Size',
              ].map((item) => (
                <li key={item} className="flex items-center gap-2 text-muted-foreground">
                  <svg className="w-5 h-5 text-primary flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <section className="holographic-card p-8 rounded-xl">
            <h2 className="font-orbitron text-2xl font-semibold mb-4">Research Commitment</h2>
            <p className="text-muted-foreground leading-relaxed">
              Our research portal provides direct access to peer-reviewed scientific literature from PubMed, 
              allowing researchers, healthcare professionals, and curious individuals to explore the growing 
              body of knowledge surrounding silver nanoparticles. We do not make medical claims; instead, 
              we present the scientific evidence as published in reputable journals.
            </p>
          </section>

          <section className="holographic-card p-8 rounded-xl">
            <h2 className="font-orbitron text-2xl font-semibold mb-4">Contact Information</h2>
            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium mb-2">Email</h3>
                <a href="mailto:info@canadananosilver.com" className="text-primary hover:underline">
                  info@canadananosilver.com
                </a>
              </div>
              <div>
                <h3 className="font-medium mb-2">Phone</h3>
                <a href="tel:+18006267455" className="text-primary hover:underline">
                  1-800-NANO-SILVER
                </a>
              </div>
              <div>
                <h3 className="font-medium mb-2">Location</h3>
                <p className="text-muted-foreground">Canada</p>
              </div>
              <div>
                <h3 className="font-medium mb-2">Business Hours</h3>
                <p className="text-muted-foreground">Mon-Fri: 9AM - 5PM EST</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

// Protected Route Component
function ProtectedRoute({ children, requireAdmin = false }: { children: React.ReactNode; requireAdmin?: boolean }) {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requireAdmin && user?.role !== 'admin' && user?.role !== 'superadmin') {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

function App() {
  const { fetchProducts } = useProductStore();

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return (
    <Router>
      <div className="min-h-screen bg-background">
        <Routes>
          {/* Routes without navigation */}
          <Route path="/login" element={<Login />} />
          <Route path="/distributor/apply" element={<DistributorApply />} />
          <Route path="/affiliate/apply" element={<AffiliateApply />} />
          
          {/* Routes with navigation and footer */}
          <Route
            path="/*"
            element={
              <>
                <Navigation />
                <main>
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/research" element={<ResearchPage />} />
                    <Route path="/products" element={<ProductsPage />} />
                    <Route path="/wellness" element={<WellnessPage />} />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route
                      path="/admin"
                      element={
                        <ProtectedRoute requireAdmin>
                          <AdminDashboard />
                        </ProtectedRoute>
                      }
                    />
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </main>
                <Footer />
              </>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
