import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Building2, 
  Mail, 
  Phone, 
  MapPin, 
  User, 
  Briefcase,
  Send,
  CheckCircle,
  ArrowLeft,
  Store,
  Globe,
  DollarSign
} from 'lucide-react';
import { useDistributorStore } from '@/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

export function DistributorApply() {
  const navigate = useNavigate();
  const { submitApplication } = useDistributorStore();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    businessName: '',
    contactName: '',
    email: '',
    phone: '',
    street: '',
    city: '',
    province: '',
    postalCode: '',
    country: 'Canada',
    territory: '',
    businessType: 'retail' as const,
    yearsInBusiness: '',
    currentBrands: '',
    whyInterested: '',
    estimatedMonthlyVolume: '',
    hasStorefront: false,
    hasOnlinePresence: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    await new Promise(resolve => setTimeout(resolve, 1500));

    submitApplication({
      businessName: formData.businessName,
      contactName: formData.contactName,
      email: formData.email,
      phone: formData.phone,
      address: {
        street: formData.street,
        city: formData.city,
        province: formData.province,
        postalCode: formData.postalCode,
        country: formData.country,
      },
      territory: formData.territory,
      province: formData.province,
      city: formData.city,
      businessType: formData.businessType,
      yearsInBusiness: parseInt(formData.yearsInBusiness) || 0,
      currentBrands: formData.currentBrands,
      whyInterested: formData.whyInterested,
      estimatedMonthlyVolume: formData.estimatedMonthlyVolume,
      hasStorefront: formData.hasStorefront,
      hasOnlinePresence: formData.hasOnlinePresence,
    });

    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center py-12 px-4">
        <div className="fixed inset-0 grid-bg opacity-30 pointer-events-none" />
        
        <Card className="holographic-card max-w-2xl w-full relative z-10">
          <CardContent className="py-12 px-8 text-center">
            <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-400" />
            </div>
            <h2 className="font-orbitron text-2xl font-bold mb-4">Application Submitted!</h2>
            <p className="text-muted-foreground mb-6">
              Thank you for your interest in becoming a SilverSol™ distributor. 
              Our team will review your application and contact you within 2-3 business days.
            </p>
            
            {/* Distributor Welcome Message */}
            <div className="bg-primary/10 border border-primary/30 rounded-xl p-6 mb-6 text-left">
              <h3 className="font-orbitron font-semibold text-lg mb-3 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-primary" />
                Welcome to the SilverSol™ Distributor Network!
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                You now have access to wholesale pricing, distributor tools, product education, 
                and a powerful AI assistant to help you generate business materials. You can 
                request product guides, sales scripts, brochures, and marketing content anytime. 
                We're here to support your growth.
              </p>
            </div>
            
            <Button onClick={() => navigate('/')} className="btn-holographic">
              Return to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="fixed inset-0 grid-bg opacity-30 pointer-events-none" />
      
      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header */}
        <div className="mb-8">
          <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 mb-4">
              <Building2 className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">Distributor Program</span>
            </div>
            <h1 className="font-orbitron text-3xl sm:text-4xl font-bold mb-4">
              Become a <span className="text-primary">SilverSol™</span> Distributor
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Join our network of authorized distributors and offer your customers 
              the highest quality nano silver products available.
            </p>
          </div>
        </div>

        {/* Benefits */}
        <div className="grid sm:grid-cols-3 gap-4 mb-8">
          {[
            { icon: DollarSign, title: 'Bulk Pricing', desc: 'Wholesale rates on all products' },
            { icon: Store, title: 'Territory Rights', desc: 'Exclusive distribution zones' },
            { icon: Globe, title: 'Marketing Support', desc: 'Materials and training provided' },
          ].map((benefit, i) => (
            <div key={i} className="p-4 rounded-xl bg-muted/50 border border-border/50 text-center">
              <benefit.icon className="w-8 h-8 text-primary mx-auto mb-3" />
              <h3 className="font-semibold mb-1">{benefit.title}</h3>
              <p className="text-sm text-muted-foreground">{benefit.desc}</p>
            </div>
          ))}
        </div>

        {/* Application Form */}
        <Card className="holographic-card">
          <CardHeader>
            <CardTitle className="font-orbitron">Distributor Application</CardTitle>
            <CardDescription>
              Please fill out all required fields. We'll review your application and respond within 2-3 business days.
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Business Information */}
              <div className="space-y-4">
                <h3 className="font-orbitron text-lg font-semibold flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-primary" />
                  Business Information
                </h3>
                
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Business Name *</label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        required
                        value={formData.businessName}
                        onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                        className="pl-10 input-holographic"
                        placeholder="Your business name"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block">Contact Name *</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        required
                        value={formData.contactName}
                        onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                        className="pl-10 input-holographic"
                        placeholder="Full name"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Email *</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        required
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="pl-10 input-holographic"
                        placeholder="business@example.com"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block">Phone *</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        required
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="pl-10 input-holographic"
                        placeholder="+1 (555) 000-0000"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Address */}
              <div className="space-y-4">
                <h3 className="font-orbitron text-lg font-semibold flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-primary" />
                  Business Address
                </h3>
                
                <div>
                  <label className="text-sm font-medium mb-2 block">Street Address *</label>
                  <Input
                    required
                    value={formData.street}
                    onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                    className="input-holographic"
                    placeholder="123 Business St"
                  />
                </div>

                <div className="grid sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">City *</label>
                    <Input
                      required
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="input-holographic"
                      placeholder="City"
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block">Province *</label>
                    <Input
                      required
                      value={formData.province}
                      onChange={(e) => setFormData({ ...formData, province: e.target.value })}
                      className="input-holographic"
                      placeholder="Province"
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block">Postal Code *</label>
                    <Input
                      required
                      value={formData.postalCode}
                      onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                      className="input-holographic"
                      placeholder="A1A 1A1"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Territory of Interest *</label>
                  <Input
                    required
                    value={formData.territory}
                    onChange={(e) => setFormData({ ...formData, territory: e.target.value })}
                    className="input-holographic"
                    placeholder="e.g., Greater Toronto Area, Vancouver Island"
                  />
                </div>
              </div>

              {/* Business Details */}
              <div className="space-y-4">
                <h3 className="font-orbitron text-lg font-semibold flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-primary" />
                  Business Details
                </h3>
                
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Business Type *</label>
                    <select
                      required
                      value={formData.businessType}
                      onChange={(e) => setFormData({ ...formData, businessType: e.target.value as any })}
                      className="w-full h-10 px-3 rounded-md border border-input bg-background input-holographic"
                    >
                      <option value="retail">Retail Store</option>
                      <option value="wholesale">Wholesale/Distribution</option>
                      <option value="online">Online/E-commerce</option>
                      <option value="clinic">Health Clinic/Practice</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block">Years in Business *</label>
                    <Input
                      required
                      type="number"
                      min="0"
                      value={formData.yearsInBusiness}
                      onChange={(e) => setFormData({ ...formData, yearsInBusiness: e.target.value })}
                      className="input-holographic"
                      placeholder="e.g., 5"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Current Brands/Product Lines</label>
                  <Textarea
                    value={formData.currentBrands}
                    onChange={(e) => setFormData({ ...formData, currentBrands: e.target.value })}
                    className="input-holographic"
                    placeholder="List any health/wellness brands you currently distribute or sell"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Why are you interested in SilverSol™? *</label>
                  <Textarea
                    required
                    value={formData.whyInterested}
                    onChange={(e) => setFormData({ ...formData, whyInterested: e.target.value })}
                    className="input-holographic"
                    placeholder="Tell us about your interest in nano silver products and how they fit your business..."
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Estimated Monthly Volume *</label>
                  <Input
                    required
                    value={formData.estimatedMonthlyVolume}
                    onChange={(e) => setFormData({ ...formData, estimatedMonthlyVolume: e.target.value })}
                    className="input-holographic"
                    placeholder="e.g., 50-100 units"
                  />
                </div>

                <div className="flex gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.hasStorefront}
                      onChange={(e) => setFormData({ ...formData, hasStorefront: e.target.checked })}
                      className="rounded border-border"
                    />
                    <span className="text-sm">Physical Storefront</span>
                  </label>
                  
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.hasOnlinePresence}
                      onChange={(e) => setFormData({ ...formData, hasOnlinePresence: e.target.checked })}
                      className="rounded border-border"
                    />
                    <span className="text-sm">Online Presence</span>
                  </label>
                </div>
              </div>

              <Alert className="bg-amber-950/30 border-amber-500/30">
                <AlertDescription className="text-amber-200/90 text-sm">
                  By submitting this application, you agree that all information provided is accurate 
                  and you authorize SilverSol™ to verify your business credentials. Approved distributors 
                  will receive access to our wholesale portal, marketing materials, and distributor forum.
                </AlertDescription>
              </Alert>

              <Button
                type="submit"
                className="w-full btn-holographic"
                size="lg"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5 mr-2" />
                    Submit Application
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
