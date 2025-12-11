import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Check, Sparkles } from 'lucide-react';

const plans = [
  {
    name: 'Starter',
    description: 'Perfect for individual developers',
    price: '$0',
    period: '/forever',
    features: [
      '5 free components',
      'Basic documentation',
      'Community support',
      'Personal use only',
    ],
    cta: 'Get Started',
    variant: 'glass' as const,
    popular: false,
  },
  {
    name: 'Pro',
    description: 'For professional developers',
    price: '$49',
    period: '/month',
    features: [
      'Unlimited components',
      'All templates included',
      'Priority support',
      'Commercial license',
      'Source code access',
      'Early access to new releases',
    ],
    cta: 'Start Pro Trial',
    variant: 'hero' as const,
    popular: true,
  },
  {
    name: 'Enterprise',
    description: 'For teams and organizations',
    price: '$199',
    period: '/month',
    features: [
      'Everything in Pro',
      'Custom component requests',
      'Dedicated support',
      'Team collaboration',
      'Private Slack channel',
      'Custom integrations',
      'SLA guarantee',
    ],
    cta: 'Contact Sales',
    variant: 'glass' as const,
    popular: false,
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
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Simple, Transparent <span className="text-gradient">Pricing</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Choose the plan that fits your needs. All plans include access to our core component library.
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan, index) => (
              <div
                key={plan.name}
                className={`relative glass rounded-2xl p-8 animate-fade-up ${
                  plan.popular ? 'border-primary ring-2 ring-primary/20' : ''
                }`}
                style={{ animationDelay: `${0.1 + index * 0.1}s` }}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <div className="flex items-center gap-1 bg-primary text-primary-foreground px-4 py-1.5 rounded-full text-sm font-medium">
                      <Sparkles size={14} />
                      Most Popular
                    </div>
                  </div>
                )}

                <div className="text-center mb-8">
                  <h3 className="text-xl font-bold text-foreground mb-2">{plan.name}</h3>
                  <p className="text-muted-foreground text-sm mb-6">{plan.description}</p>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                    <span className="text-muted-foreground">{plan.period}</span>
                  </div>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                        <Check size={12} className="text-primary" />
                      </div>
                      <span className="text-foreground text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button variant={plan.variant} className="w-full">
                  {plan.cta}
                </Button>
              </div>
            ))}
          </div>

          {/* FAQ or Additional Info */}
          <div className="mt-20 text-center animate-fade-up" style={{ animationDelay: '0.4s' }}>
            <p className="text-muted-foreground">
              All plans include a 30-day money-back guarantee. No questions asked.
            </p>
            <p className="text-muted-foreground mt-2">
              Need a custom plan?{' '}
              <a href="/contact" className="text-primary hover:underline">
                Contact us
              </a>
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Pricing;
