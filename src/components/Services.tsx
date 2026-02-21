import { Layers, Layout, Code2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const services = [
  {
    icon: Layers,
    title: "Component Library",
    description: "Free React components built on shadcn/ui and Tailwind CSS. Production-ready buttons, forms, modals, charts, and more.",
    features: ["100% Free", "React & TypeScript", "shadcn/ui Based", "Lifetime Updates"],
    cta: "Get Free Components",
    link: "/design-system-generator",
    badge: "Free",
  },
  {
    icon: Layout,
    title: "Pre-Built Templates",
    description: "Free complete frontend solutions for e-commerce, portfolios, dashboards, and more. Launch in hours, not weeks.",
    features: ["100% Free", "Full Source Code", "Responsive Design", "SEO Optimized"],
    cta: "Get Free Templates",
    link: "/templates",
    badge: "Free",
  },
  {
    icon: Code2,
    title: "Custom Development",
    description: "Bespoke frontend development services. We build custom web apps, marketing sites, and seamless integrations tailored to your needs.",
    features: ["Dedicated Team", "Agile Process", "Fast Turnaround", "Ongoing Support"],
    cta: "Get a Quote",
    link: "/contact",
    badge: "Paid Service",
  },
];

const Services = () => {
  return (
    <section id="services" className="relative py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-3xl" />
      </div>

      <div className="container relative z-10 px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            Everything you need to{" "}
            <span className="text-gradient">ship faster</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Free components and templates for everyone. Need something custom? Our team is here to help.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <div
              key={index}
              className="group relative p-8 rounded-2xl glass hover:border-primary/50 transition-all duration-500"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Glow Effect */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="relative z-10">
                {/* Icon & Badge */}
                <div className="flex items-start justify-between mb-6">
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <service.icon className="w-7 h-7 text-primary" />
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${service.badge === "Free"
                      ? "bg-primary/10 text-primary"
                      : "bg-accent/10 text-accent-foreground"
                    }`}>
                    {service.badge}
                  </span>
                </div>

                {/* Content */}
                <h3 className="text-xl font-semibold mb-3">{service.title}</h3>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  {service.description}
                </p>

                {/* Features */}
                <ul className="space-y-2 mb-8">
                  {service.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                      {feature}
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <Button variant="ghost" className="group/btn p-0 h-auto text-primary hover:text-primary" asChild>
                  <Link to={service.link}>
                    {service.cta}
                    <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                  </Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
