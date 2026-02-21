import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Package, Layout, Code, Settings, LogOut, Shield } from 'lucide-react';

const Dashboard = () => {
  const { user, loading, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  const quickActions = [
    { icon: Package, label: 'Design Components', description: 'Create and customize components', href: '/design-system-generator' },
    { icon: Layout, label: 'My Templates', description: 'Access your templates', href: '/templates' },
    { icon: Code, label: 'Browse System', description: 'Explore the design system', href: '/design-system-generator' },
    { icon: Settings, label: 'Settings', description: 'Manage your account', href: '/dashboard' },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <header className="glass border-b border-border">
          <div className="container mx-auto px-6 py-4 flex items-center justify-between">
            <a href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">A</span>
              </div>
              <span className="text-xl font-bold text-foreground">Akanexus</span>
            </a>

            <div className="flex items-center gap-4">
              {isAdmin && (
                <Button
                  variant="ghost"
                  onClick={() => navigate('/admin')}
                  className="gap-2"
                >
                  <Shield size={18} />
                  Admin Panel
                </Button>
              )}
              <Button variant="ghost" onClick={handleSignOut} className="gap-2">
                <LogOut size={18} />
                Sign Out
              </Button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-6 py-12">
          <div className="mb-12 animate-fade-up">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Welcome back{user?.user_metadata?.full_name ? `, ${user.user_metadata.full_name}` : ''}!
            </h1>
            <p className="text-muted-foreground">
              Manage your components, templates, and account settings.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {quickActions.map((action, index) => (
              <a
                key={action.label}
                href={action.href}
                className="glass rounded-xl p-6 hover:border-primary/50 transition-all duration-300 animate-fade-up group"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <action.icon className="text-primary" size={24} />
                </div>
                <h3 className="font-semibold text-foreground mb-1">{action.label}</h3>
                <p className="text-sm text-muted-foreground">{action.description}</p>
              </a>
            ))}
          </div>

          {/* Stats */}
          <div className="glass rounded-xl p-8 animate-fade-up" style={{ animationDelay: '0.4s' }}>
            <h2 className="text-xl font-semibold text-foreground mb-6">Your Stats</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div>
                <div className="text-3xl font-bold text-gradient mb-1">0</div>
                <div className="text-muted-foreground">Components Purchased</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-gradient mb-1">0</div>
                <div className="text-muted-foreground">Templates Purchased</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-gradient mb-1">0</div>
                <div className="text-muted-foreground">Active Projects</div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
