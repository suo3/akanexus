import { Button } from "@/components/ui/button";
import { Menu, X, Sun, Moon } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { NavLink } from "@/components/NavLink";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "next-themes";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-md">
      <div className="container mx-auto px-6 py-3">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-8 h-8 border border-foreground flex items-center justify-center bg-foreground">
              <span className="text-background font-bold text-lg mono-label">A</span>
            </div>
            <span className="text-xl font-bold tracking-tighter text-foreground uppercase">Akanexus</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <NavLink
              to="/services"
              className="text-muted-foreground hover:text-foreground transition-colors relative py-1 mono-label"
              activeClassName="text-foreground font-medium after:absolute after:bottom-0 after:left-0 after:right-0 after:h-px after:bg-primary"
            >
              /Services
            </NavLink>
            <NavLink
              to="/design-system-generator"
              className="text-muted-foreground hover:text-foreground transition-colors relative py-1 mono-label"
              activeClassName="text-foreground font-medium after:absolute after:bottom-0 after:left-0 after:right-0 after:h-px after:bg-primary"
            >
              /Components
            </NavLink>
            <NavLink
              to="/products"
              className="text-muted-foreground hover:text-foreground transition-colors relative py-1 mono-label"
              activeClassName="text-foreground font-medium after:absolute after:bottom-0 after:left-0 after:right-0 after:h-px after:bg-primary"
            >
              /Products
            </NavLink>
            <NavLink
              to="/pricing"
              className="text-muted-foreground hover:text-foreground transition-colors relative py-1 mono-label"
              activeClassName="text-foreground font-medium after:absolute after:bottom-0 after:left-0 after:right-0 after:h-px after:bg-primary"
            >
              /Pricing
            </NavLink>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 rounded-none"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              aria-label="Toggle theme"
            >
              <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </Button>
            {user ? (
              <>
                <Button variant="ghost" onClick={() => navigate('/dashboard')}>Dashboard</Button>
                <Button variant="glass" onClick={handleSignOut}>Sign Out</Button>
              </>
            ) : (
              <>
                <Button variant="ghost" onClick={() => navigate('/auth')} className="mono-label">Sign In</Button>
                <Button variant="default" onClick={() => navigate('/products')} className="mono-label">Get Started</Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-foreground"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 flex flex-col gap-4 animate-fade-up">
            <NavLink
              to="/services"
              className="text-muted-foreground hover:text-foreground transition-colors py-2 border-l-2 border-transparent pl-3"
              activeClassName="text-foreground font-medium border-l-primary"
            >
              Services
            </NavLink>
            <NavLink
              to="/design-system-generator"
              className="text-muted-foreground hover:text-foreground transition-colors py-2 border-l-2 border-transparent pl-3"
              activeClassName="text-foreground font-medium border-l-primary"
            >
              Components
            </NavLink>
            <NavLink
              to="/products"
              className="text-muted-foreground hover:text-foreground transition-colors py-2 border-l-2 border-transparent pl-3"
              activeClassName="text-foreground font-medium border-l-primary"
            >
              Products
            </NavLink>
            <NavLink
              to="/pricing"
              className="text-muted-foreground hover:text-foreground transition-colors py-2 border-l border-transparent pl-3 mono-label"
              activeClassName="text-foreground font-medium border-l-primary"
            >
              Pricing
            </NavLink>
            <div className="flex flex-col gap-2 pt-4 border-t border-border">
              <Button
                variant="outline"
                className="w-full gap-2"
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              >
                {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
              </Button>
              {user ? (
                <>
                  <Button variant="ghost" className="w-full" onClick={() => navigate('/dashboard')}>Dashboard</Button>
                  <Button variant="glass" className="w-full" onClick={handleSignOut}>Sign Out</Button>
                </>
              ) : (
                <>
                  <Button variant="ghost" className="w-full" onClick={() => navigate('/auth')}>Sign In</Button>
                  <Button variant="hero" className="w-full" onClick={() => navigate('/products')}>Get Started</Button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
