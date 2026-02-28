import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Heart, Sparkles, Coffee, Rocket, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const tiers = [
  {
    name: 'Coffee',
    icon: Coffee,
    amount: 5,
    description: 'Buy us a coffee to show your appreciation',
  },
  {
    name: 'Supporter',
    icon: Heart,
    amount: 15,
    description: 'Help us keep building and maintaining components',
    popular: true,
  },
  {
    name: 'Champion',
    icon: Rocket,
    amount: 50,
    description: 'Become a champion and get a shoutout on our site',
  },
];

const Pricing = () => {
  const [loadingTier, setLoadingTier] = useState<string | null>(null);
  const [customAmount, setCustomAmount] = useState('');
  const [loadingCustom, setLoadingCustom] = useState(false);

  const handleDonation = async (amount: number, tierName: string) => {
    if (amount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    setLoadingTier(tierName);

    try {
      const { data, error } = await supabase.functions.invoke('create-donation', {
        body: {
          amount,
          itemName: `${tierName} Donation`,
          itemId: tierName.toLowerCase(),
          itemType: 'donation',
        },
      });

      if (error) throw error;

      if (data?.url) {
        window.open(data.url, '_blank');
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (error) {
      console.error('Donation error:', error);
      toast.error('Failed to start checkout. Please try again.');
    } finally {
      setLoadingTier(null);
    }
  };

  const handleCustomDonation = async () => {
    const amount = parseFloat(customAmount);
    if (isNaN(amount) || amount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    setLoadingCustom(true);

    try {
      const { data, error } = await supabase.functions.invoke('create-donation', {
        body: {
          amount,
          itemName: 'Custom Donation',
          itemId: 'custom',
          itemType: 'donation',
        },
      });

      if (error) throw error;

      if (data?.url) {
        window.open(data.url, '_blank');
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (error) {
      console.error('Donation error:', error);
      toast.error('Failed to start checkout. Please try again.');
    } finally {
      setLoadingCustom(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-6">
          <SEO
            title="Support Our Mission"
            description="All Akanexus tools are 100% free. Support us through donations to help keep the platform running."
          />
          {/* Header */}
          <div className="text-center mb-16 animate-fade-up">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 text-sm font-medium mb-6">
              <Sparkles size={16} />
              100% Free & Community Supported
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Support Our <span className="text-gradient">Mission</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Akanexus tools and templates are completely free for everyone. Your voluntary donations are what keep this platform alive and allow us to continue building for the community.
            </p>
          </div>

          {/* Donation Tiers */}
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto mb-16">
            {tiers.map((tier, index) => (
              <div
                key={tier.name}
                className={`relative glass p-8 text-center animate-fade-up ${tier.popular ? 'border-primary ring-2 ring-primary/20' : ''
                  }`}
                style={{ animationDelay: `${0.1 + index * 0.1}s` }}
              >
                {tier.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <div className="flex items-center gap-1 bg-primary text-primary-foreground px-4 py-1.5 text-sm font-medium">
                      <Heart size={14} />
                      Most Chosen
                    </div>
                  </div>
                )}

                <div className="w-16 h-16 bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <tier.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">{tier.name}</h3>
                <div className="text-3xl font-bold text-foreground mb-2">${tier.amount}</div>
                <p className="text-muted-foreground text-sm mb-6">{tier.description}</p>
                <Button
                  variant={tier.popular ? 'hero' : 'glass'}
                  className="w-full"
                  onClick={() => handleDonation(tier.amount, tier.name)}
                  disabled={loadingTier === tier.name}
                >
                  {loadingTier === tier.name ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    `Donate $${tier.amount}`
                  )}
                </Button>
              </div>
            ))}
          </div>

          {/* Custom Amount */}
          <div className="glass p-8 max-w-2xl mx-auto text-center animate-fade-up" style={{ animationDelay: '0.4s' }}>
            <h3 className="text-xl font-bold text-foreground mb-2">Custom Amount</h3>
            <p className="text-muted-foreground mb-6">
              Want to donate a different amount? Every contribution helps us continue building free resources for the community.
            </p>
            <div className="flex gap-3 max-w-sm mx-auto">
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                <Input
                  type="number"
                  min="1"
                  step="1"
                  placeholder="Enter amount"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  className="pl-7"
                />
              </div>
              <Button
                variant="outline"
                onClick={handleCustomDonation}
                disabled={loadingCustom || !customAmount}
              >
                {loadingCustom ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  'Donate'
                )}
              </Button>
            </div>
          </div>

          {/* What You Get */}
          <div className="mt-20 text-center animate-fade-up" style={{ animationDelay: '0.5s' }}>
            <h2 className="text-2xl font-bold text-foreground mb-8">What's Included — For Free</h2>
            <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              {[
                'All components',
                'All templates',
                'Full source code',
                'Commercial license',
                'Lifetime updates',
                'Community support',
                'Documentation',
                'Code examples',
              ].map((item) => (
                <div key={item} className="glass p-4">
                  <span className="text-foreground font-medium">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Footer note */}
          <div className="mt-16 text-center animate-fade-up" style={{ animationDelay: '0.6s' }}>
            <p className="text-muted-foreground">
              Your support helps us maintain and improve these resources.{' '}
              <span className="text-primary">Thank you for being part of our community!</span>
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Pricing;
