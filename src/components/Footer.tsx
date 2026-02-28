import { Github, Twitter, Linkedin } from "lucide-react";
import { Link } from "react-router-dom";

const footerLinks = {
  Product: [
    { label: "Components", href: "/design-system-generator" },
    { label: "Support Us", href: "/pricing" },
  ],
  Company: [
    { label: "About", href: "/about" },
    { label: "Blog", href: "/blog" },
    { label: "Contact", href: "/contact" },
  ],
  Resources: [
    { label: "Documentation", href: "/documentation" },
    { label: "Tutorials", href: "/tutorials" },
  ],
  Legal: [
    { label: "Privacy", href: "/privacy" },
    { label: "Terms", href: "/terms" },
  ],
};

const Footer = () => {
  return (
    <footer className="relative border-t border-border">
      <div className="container px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8">
          {/* Brand */}
          <div className="col-span-2">
            <a href="/" className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 border border-foreground flex items-center justify-center bg-foreground">
                <span className="text-background font-bold text-lg mono-label">A</span>
              </div>
              <span className="text-xl font-bold tracking-tighter uppercase">Akanexus</span>
            </a>
            <p className="text-muted-foreground text-sm mb-6 max-w-xs">
              Free industrial-grade tools for modern creators. Build faster with our open-access component library and development utilities.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="mono-label mb-6 text-xs text-muted-foreground">{category}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    {link.href.startsWith("/") ? (
                      <Link
                        to={link.href}
                        className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                      >
                        {link.label}
                      </Link>
                    ) : (
                      <a
                        href={link.href}
                        className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                      >
                        {link.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="mt-16 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground mono-label">
            © 2024 Akanexus. Precision tools for creators.
          </p>
          <p className="text-sm text-muted-foreground">
            Crafted with precision for developers worldwide.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
