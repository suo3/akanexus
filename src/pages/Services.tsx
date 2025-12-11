import { Layers, Layout, Code2, ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const services = [
  {
    icon: Layers,
    title: "Component Library",
    description: "Premium React components built on shadcn/ui and Tailwind CSS. Production-ready buttons, forms, modals, charts, and more.",
    features: ["React & TypeScript", "shadcn/ui Based", "Tailwind CSS", "Lifetime Updates"],
    cta: "Browse Components",
    link: "/gallery",
  },
  {
    icon: Layout,
    title: "Pre-Built Templates",
    description: "Complete frontend solutions for e-commerce, portfolios, dashboards, and more. Launch in hours, not weeks.",
    features: ["Full Source Code", "Responsive Design", "SEO Optimized", "Easy Customization"],
    cta: "View Templates",
    link: "/templates",
  },
  {
    icon: Code2,
    title: "Custom Development",
    description: "Bespoke frontend development services. We build custom web apps, marketing sites, and seamless integrations.",
    features: ["Dedicated Team", "Agile Process", "Fast Turnaround", "Ongoing Support"],
    cta: "Start Project",
    link: "/contact",
  },
];

const Services = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-16">
        {/* Hero Section */}
        <section className="relative py-16 overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-3xl" />
          </div>

          <div className="container relative z-10 px-6">
            <div className="text-center mb-16">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6">
                Our <span className="text-gradient">Services</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                From individual components to complete solutions, we've got you covered at every stage of your project.
              </p>
            </div>

            {/* Services Grid */}
            <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {services.map((service, index) => (
                <div
                  key={index}
                  className="group relative p-8 rounded-2xl glass hover:border-primary/50 transition-all duration-500"
                >
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  <div className="relative z-10">
                    <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                      <service.icon className="w-7 h-7 text-primary" />
                    </div>

                    <h3 className="text-xl font-semibold mb-3">{service.title}</h3>
                    <p className="text-muted-foreground mb-6 leading-relaxed">
                      {service.description}
                    </p>

                    <ul className="space-y-2 mb-8">
                      {service.features.map((feature, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Check className="w-4 h-4 text-primary" />
                          {feature}
                        </li>
                      ))}
                    </ul>

                    <Link to={service.link}>
                      <Button variant="ghost" className="group/btn p-0 h-auto text-primary hover:text-primary">
                        {service.cta}
                        <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Services;
