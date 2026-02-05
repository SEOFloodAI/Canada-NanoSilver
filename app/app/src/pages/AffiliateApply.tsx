import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Users, 
  Mail, 
  Globe, 
  Instagram, 
  Youtube, 
  Twitter,
  Send,
  CheckCircle,
  ArrowLeft,
  DollarSign,
  TrendingUp,
  Link as LinkIcon,
  Hash
} from 'lucide-react';
import { useAffiliateStore } from '@/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

export function AffiliateApply() {
  const navigate = useNavigate();
  const { submitApplication } = useAffiliateStore();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    website: '',
    instagram: '',
    youtube: '',
    twitter: '',
    otherPlatform: '',
    howDidYouHear: '',
    whyInterested: '',
    promotionMethods: [] as string[],
    audienceDescription: '',
  });

  const promotionOptions = [
    'Social Media Posts',
    'Blog/Content Marketing',
    'Email Marketing',
    'YouTube Videos',
    'Podcast',
    'Paid Advertising',
    'Influencer Marketing',
    'Other',
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    await new Promise(resolve => setTimeout(resolve, 1500));

    const socialMedia = [];
    if (formData.instagram) socialMedia.push({ platform: 'instagram' as const, url: formData.instagram, followers: 0 });
    if (formData.youtube) socialMedia.push({ platform: 'youtube' as const, url: formData.youtube, followers: 0 });
    if (formData.twitter) socialMedia.push({ platform: 'twitter' as const, url: formData.twitter, followers: 0 });
    if (formData.otherPlatform) socialMedia.push({ platform: 'other' as const, url: formData.otherPlatform, followers: 0 });

    submitApplication({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      website: formData.website,
      socialMedia,
      howDidYouHear: formData.howDidYouHear,
      whyInterested: formData.whyInterested,
      promotionMethods: formData.promotionMethods,
      audienceDescription: formData.audienceDescription,
    });

    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  const togglePromotionMethod = (method: string) => {
    setFormData(prev => ({
      ...prev,
      promotionMethods: prev.promotionMethods.includes(method)
        ? prev.promotionMethods.filter(m => m !== method)
        : [...prev.promotionMethods, method]
    }));
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
              Thank you for your interest in our affiliate program! 
              We'll review your application and send you your referral link within 1-2 business days.
            </p>
            
            {/* Affiliate Welcome Message */}
            <div className="bg-accent/10 border border-accent/30 rounded-xl p-6 mb-6 text-left">
              <h3 className="font-orbitron font-semibold text-lg mb-3 flex items-center gap-2">
                <Users className="w-5 h-5 text-accent" />
                Welcome to the SilverSol™ Affiliate Program!
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                You now have access to marketing materials, promotional assistance, and a dedicated 
                AI assistant that can help you create content, social media posts, and email campaigns. 
                Your goal is to share the benefits of SilverSol™ with your audience in an ethical, 
                compliant way. Let us know if you need help getting started!
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
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/30 mb-4">
              <Users className="w-4 h-4 text-accent" />
              <span className="text-sm font-medium text-accent">Affiliate Program</span>
            </div>
            <h1 className="font-orbitron text-3xl sm:text-4xl font-bold mb-4">
              Become a <span className="text-accent">SilverSol™</span> Affiliate
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Earn commissions by sharing SilverSol™ products with your audience. 
              Get your unique referral link and start earning today.
            </p>
          </div>
        </div>

        {/* Commission Structure */}
        <div className="grid sm:grid-cols-3 gap-4 mb-8">
          {[
            { icon: DollarSign, title: '15% Commission', desc: 'On every sale' },
            { icon: TrendingUp, title: '30-Day Cookie', desc: 'Extended tracking' },
            { icon: LinkIcon, title: 'Unique Link', desc: 'Personal referral URL' },
          ].map((benefit, i) => (
            <div key={i} className="p-4 rounded-xl bg-muted/50 border border-border/50 text-center">
              <benefit.icon className="w-8 h-8 text-accent mx-auto mb-3" />
              <h3 className="font-semibold mb-1">{benefit.title}</h3>
              <p className="text-sm text-muted-foreground">{benefit.desc}</p>
            </div>
          ))}
        </div>

        {/* How It Works */}
        <div className="grid sm:grid-cols-4 gap-4 mb-8">
          {[
            { step: '1', title: 'Apply', desc: 'Fill out the form' },
            { step: '2', title: 'Get Approved', desc: 'We review your app' },
            { step: '3', title: 'Share', desc: 'Post your link' },
            { step: '4', title: 'Earn', desc: 'Get paid monthly' },
          ].map((item, i) => (
            <div key={i} className="relative text-center">
              <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-3">
                <span className="font-orbitron font-bold text-accent">{item.step}</span>
              </div>
              <h4 className="font-semibold mb-1">{item.title}</h4>
              <p className="text-xs text-muted-foreground">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Application Form */}
        <Card className="holographic-card">
          <CardHeader>
            <CardTitle className="font-orbitron">Affiliate Application</CardTitle>
            <CardDescription>
              Tell us about yourself and your audience. We'll review and get back to you quickly.
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="font-orbitron text-lg font-semibold flex items-center gap-2">
                  <Users className="w-5 h-5 text-accent" />
                  Personal Information
                </h3>
                
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Full Name *</label>
                    <Input
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="input-holographic"
                      placeholder="Your full name"
                    />
                  </div>
                  
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
                        placeholder="you@example.com"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Phone (optional)</label>
                  <Input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="input-holographic"
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
              </div>

              {/* Online Presence */}
              <div className="space-y-4">
                <h3 className="font-orbitron text-lg font-semibold flex items-center gap-2">
                  <Globe className="w-5 h-5 text-accent" />
                  Online Presence
                </h3>
                
                <div>
                  <label className="text-sm font-medium mb-2 block">Website/Blog</label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      value={formData.website}
                      onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                      className="pl-10 input-holographic"
                      placeholder="https://yourwebsite.com"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Instagram</label>
                    <div className="relative">
                      <Instagram className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        value={formData.instagram}
                        onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                        className="pl-10 input-holographic"
                        placeholder="@username or profile URL"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block">YouTube</label>
                    <div className="relative">
                      <Youtube className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        value={formData.youtube}
                        onChange={(e) => setFormData({ ...formData, youtube: e.target.value })}
                        className="pl-10 input-holographic"
                        placeholder="Channel URL"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Twitter/X</label>
                    <div className="relative">
                      <Twitter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        value={formData.twitter}
                        onChange={(e) => setFormData({ ...formData, twitter: e.target.value })}
                        className="pl-10 input-holographic"
                        placeholder="@username or profile URL"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block">Other Platform</label>
                    <div className="relative">
                      <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        value={formData.otherPlatform}
                        onChange={(e) => setFormData({ ...formData, otherPlatform: e.target.value })}
                        className="pl-10 input-holographic"
                        placeholder="TikTok, Pinterest, etc."
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Promotion Details */}
              <div className="space-y-4">
                <h3 className="font-orbitron text-lg font-semibold flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-accent" />
                  Promotion Details
                </h3>
                
                <div>
                  <label className="text-sm font-medium mb-2 block">How did you hear about us?</label>
                  <Input
                    value={formData.howDidYouHear}
                    onChange={(e) => setFormData({ ...formData, howDidYouHear: e.target.value })}
                    className="input-holographic"
                    placeholder="e.g., Google search, friend referral, social media"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Why do you want to promote SilverSol™? *</label>
                  <Textarea
                    required
                    value={formData.whyInterested}
                    onChange={(e) => setFormData({ ...formData, whyInterested: e.target.value })}
                    className="input-holographic"
                    placeholder="Tell us why you're interested in promoting our nano silver products..."
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-3 block">How do you plan to promote? *</label>
                  <div className="flex flex-wrap gap-2">
                    {promotionOptions.map((method) => (
                      <button
                        key={method}
                        type="button"
                        onClick={() => togglePromotionMethod(method)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          formData.promotionMethods.includes(method)
                            ? 'bg-accent text-accent-foreground'
                            : 'bg-muted text-muted-foreground hover:bg-muted/80'
                        }`}
                      >
                        {method}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Describe Your Audience *</label>
                  <Textarea
                    required
                    value={formData.audienceDescription}
                    onChange={(e) => setFormData({ ...formData, audienceDescription: e.target.value })}
                    className="input-holographic"
                    placeholder="Tell us about your audience demographics, interests, and size..."
                  />
                </div>
              </div>

              <Alert className="bg-accent/10 border-accent/30">
                <AlertDescription className="text-accent-foreground/80 text-sm">
                  <strong>Commission Structure:</strong> Earn 15% on every sale generated through your 
                  unique referral link. Payments are made monthly via PayPal or cryptocurrency. 
                  Minimum payout threshold is $50.
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
