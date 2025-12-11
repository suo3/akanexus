import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Heart, Sparkles, Coffee, Rocket } from 'lucide-react';

const tiers = [
  {
    name: 'Coffee',
    icon: Coffee,
    suggested: '$5',
    description: 'Buy us a coffee to show your appreciation',
  },
  {
    name: 'Supporter',
    icon: Heart,
    suggested: '$15',
    description: 'Help us keep building and maintaining components',
    popular: true,
  },
  {
    name: 'Champion',
    icon: Rocket,
    suggested: '$50+',
    description: 'Become a champion and get a shoutout on our site',
  },
];

const Pricing = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-6">
          {/* Header */}
          <div className="text-center mb-16 animate-fade-up">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Sparkles size={16} />
              100% Free & Open
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Pay What You <span className="text-gradient">Want</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              All components and templates are completely free. If you find them useful, consider supporting our work with a donation.
            </p>
          </div>

          {/* Donation Tiers */}
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto mb-16">
            {tiers.map((tier, index) => (
              <div
                key={tier.name}
                className={`relative glass rounded-2xl p-8 text-center animate-fade-up ${
                  tier.popular ? 'border-primary ring-2 ring-primary/20' : ''
                }`}
                style={{ animationDelay: `${0.1 + index * 0.1}s` }}
              >
                {tier.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <div className="flex items-center gap-1 bg-primary text-primary-foreground px-4 py-1.5 rounded-full text-sm font-medium">
                      <Heart size={14} />
                      Most Chosen
                    </div>
                  </div>
                )}

                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <tier.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">{tier.name}</h3>
                <div className="text-3xl font-bold text-foreground mb-2">{tier.suggested}</div>
                <p className="text-muted-foreground text-sm mb-6">{tier.description}</p>
                <Button variant={tier.popular ? 'hero' : 'glass'} className="w-full">
                  Donate {tier.suggested}
                </Button>
              </div>
            ))}
          </div>

          {/* Custom Amount */}
          <div className="glass rounded-2xl p-8 max-w-2xl mx-auto text-center animate-fade-up" style={{ animationDelay: '0.4s' }}>
            <h3 className="text-xl font-bold text-foreground mb-2">Custom Amount</h3>
            <p className="text-muted-foreground mb-6">
              Want to donate a different amount? Every contribution helps us continue building free resources for the community.
            </p>
            <Button variant="outline" className="px-8">
              Choose Your Amount
            </Button>
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
                <div key={item} className="glass rounded-xl p-4">
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
