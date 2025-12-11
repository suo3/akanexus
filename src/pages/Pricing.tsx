import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Check, Sparkles } from 'lucide-react';

const plans = [
  {
    name: 'Single Component',
    description: 'Pay per component',
    price: '$12',
    period: '/each',
    features: [
      'One component of your choice',
      'Full source code',
      'Lifetime updates',
      'Commercial license',
    ],
    cta: 'Browse Components',
    variant: 'glass' as const,
    popular: false,
  },
  {
    name: 'Template Bundle',
    description: 'Complete project starter',
    price: '$79',
    period: '/template',
    features: [
      'Full template with all pages',
      '20+ integrated components',
      'Responsive & SEO optimized',
      'Commercial license',
      'Free updates for 1 year',
      '48-hour support response',
    ],
    cta: 'View Templates',
    variant: 'hero' as const,
    popular: true,
  },
  {
    name: 'All-Access',
    description: 'Everything, forever',
    price: '$299',
    period: 'one-time',
    features: [
      'All current components',
      'All current templates',
      'All future releases',
      'Commercial license',
      'Priority support',
      'Early access to new releases',
      'Request new components',
    ],
    cta: 'Get All-Access',
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
              Flexible <span className="text-gradient">Pricing</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Buy what you need. Individual components, complete templates, or get everything with All-Access.
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
              All purchases include a 14-day money-back guarantee. No questions asked.
            </p>
            <p className="text-muted-foreground mt-2">
              Need custom development?{' '}
              <a href="/contact" className="text-primary hover:underline">
                Contact us for a quote
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
