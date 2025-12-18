import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell
} from 'recharts';
import { Users, Package, Layout, Download, TrendingUp, Calendar } from 'lucide-react';

interface Stats {
  totalUsers: number;
  totalComponents: number;
  totalTemplates: number;
  totalDownloads: number;
  publishedComponents: number;
  publishedTemplates: number;
}

const COLORS = ['hsl(var(--primary))', 'hsl(var(--secondary))', 'hsl(142 76% 36%)', 'hsl(38 92% 50%)'];

export const AnalyticsDashboard = () => {
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    totalComponents: 0,
    totalTemplates: 0,
    totalDownloads: 0,
    publishedComponents: 0,
    publishedTemplates: 0,
  });
  const [userGrowthData, setUserGrowthData] = useState<any[]>([]);
  const [componentsByCategory, setComponentsByCategory] = useState<any[]>([]);
  const [templatesByCategory, setTemplatesByCategory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    setLoading(true);

    // Fetch user count
    const { count: userCount } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true });

    // Fetch components
    const { data: components } = await (supabase
      .from('marketplace_components') as any)
      .select('*');

    // Fetch templates
    const { data: templates } = await (supabase
      .from('marketplace_templates') as any)
      .select('*');

    // Fetch user registration data for growth chart
    const { data: users } = await supabase
      .from('profiles')
      .select('created_at')
      .order('created_at', { ascending: true });

    // Calculate stats
    const totalDownloads = (components?.reduce((sum: number, c: any) => sum + (c.downloads || 0), 0) || 0) +
                          (templates?.reduce((sum: number, t: any) => sum + (t.downloads || 0), 0) || 0);

    setStats({
      totalUsers: userCount || 0,
      totalComponents: components?.length || 0,
      totalTemplates: templates?.length || 0,
      totalDownloads,
      publishedComponents: components?.filter((c: any) => c.is_published).length || 0,
      publishedTemplates: templates?.filter((t: any) => t.is_published).length || 0,
    });

    // Process user growth data (group by month)
    if (users && users.length > 0) {
      const monthlyData: { [key: string]: number } = {};
      users.forEach((user: { created_at: string }) => {
        const date = new Date(user.created_at);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        monthlyData[monthKey] = (monthlyData[monthKey] || 0) + 1;
      });

      // Get last 6 months
      const months = [];
      for (let i = 5; i >= 0; i--) {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        const monthName = date.toLocaleDateString('en-US', { month: 'short' });
        months.push({
          month: monthName,
          users: monthlyData[monthKey] || 0,
        });
      }
      setUserGrowthData(months);
    } else {
      // Generate empty data for last 6 months
      const months = [];
      for (let i = 5; i >= 0; i--) {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        months.push({
          month: date.toLocaleDateString('en-US', { month: 'short' }),
          users: 0,
        });
      }
      setUserGrowthData(months);
    }

    // Process components by category
    if (components && components.length > 0) {
      const categoryCount: { [key: string]: number } = {};
      components.forEach((c: any) => {
        categoryCount[c.category] = (categoryCount[c.category] || 0) + 1;
      });
      setComponentsByCategory(
        Object.entries(categoryCount).map(([name, value]) => ({ name, value }))
      );
    }

    // Process templates by category
    if (templates && templates.length > 0) {
      const categoryCount: { [key: string]: number } = {};
      templates.forEach((t: any) => {
        categoryCount[t.category] = (categoryCount[t.category] || 0) + 1;
      });
      setTemplatesByCategory(
        Object.entries(categoryCount).map(([name, value]) => ({ name, value }))
      );
    }

    setLoading(false);
  };

  const StatCard = ({ title, value, icon: Icon, subtitle }: { 
    title: string; 
    value: number; 
    icon: any;
    subtitle?: string;
  }) => (
    <Card className="glass border-border">
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-3xl font-bold text-foreground mt-1">{value}</p>
            {subtitle && (
              <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
            )}
          </div>
          <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center">
            <Icon size={24} className="text-primary" />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="animate-fade-up">
        <h1 className="text-2xl font-bold text-foreground mb-8">Analytics</h1>
        <div className="flex items-center justify-center py-12">
          <div className="animate-pulse text-muted-foreground">Loading analytics...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-up">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground mb-1">Analytics</h1>
        <p className="text-muted-foreground">Overview of your marketplace performance</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard 
          title="Total Users" 
          value={stats.totalUsers} 
          icon={Users} 
        />
        <StatCard 
          title="Components" 
          value={stats.totalComponents} 
          icon={Package}
          subtitle={`${stats.publishedComponents} published`}
        />
        <StatCard 
          title="Templates" 
          value={stats.totalTemplates} 
          icon={Layout}
          subtitle={`${stats.publishedTemplates} published`}
        />
        <StatCard 
          title="Total Downloads" 
          value={stats.totalDownloads} 
          icon={Download} 
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Growth Chart */}
        <Card className="glass border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <TrendingUp size={20} className="text-primary" />
              User Growth
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={userGrowthData}>
                  <defs>
                    <linearGradient id="userGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="month" 
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                  />
                  <YAxis 
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    allowDecimals={false}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                      color: 'hsl(var(--foreground))'
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="users" 
                    stroke="hsl(var(--primary))" 
                    fill="url(#userGradient)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Downloads Overview */}
        <Card className="glass border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <Calendar size={20} className="text-primary" />
              Content Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart 
                  data={[
                    { name: 'Components', total: stats.totalComponents, published: stats.publishedComponents },
                    { name: 'Templates', total: stats.totalTemplates, published: stats.publishedTemplates },
                  ]}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="name" 
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                  />
                  <YAxis 
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    allowDecimals={false}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                      color: 'hsl(var(--foreground))'
                    }}
                  />
                  <Bar dataKey="total" name="Total" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="published" name="Published" fill="hsl(142 76% 36%)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Components by Category */}
        {componentsByCategory.length > 0 && (
          <Card className="glass border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <Package size={20} className="text-primary" />
                Components by Category
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={componentsByCategory}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={2}
                      dataKey="value"
                      label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                      labelLine={false}
                    >
                      {componentsByCategory.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                        color: 'hsl(var(--foreground))'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Templates by Category */}
        {templatesByCategory.length > 0 && (
          <Card className="glass border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <Layout size={20} className="text-primary" />
                Templates by Category
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={templatesByCategory}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={2}
                      dataKey="value"
                      label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                      labelLine={false}
                    >
                      {templatesByCategory.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                        color: 'hsl(var(--foreground))'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
