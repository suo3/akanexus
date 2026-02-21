import React, { useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import {
  LayoutTemplate,
  Lock,
  LayoutDashboard,
  CreditCard,
  Copy,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';

const PATTERNS = [
  // Authentication Patterns
  {
    id: 'auth-login',
    category: 'Authentication',
    title: 'Login Form',
    description: 'Standard email/password login with "remember me" and social options.',
    files: ['Login.tsx'],
    preview: (
      <div className="max-w-sm w-full mx-auto p-6 rounded-xl border bg-card shadow-sm">
        <div className="space-y-4">
          <div className="space-y-2 text-center">
            <h1 className="text-2xl font-bold">Welcome back</h1>
            <p className="text-sm text-muted-foreground">Enter your email to sign in to your account</p>
          </div>
          <div className="space-y-2">
            <div className="h-8 rounded-md bg-muted animate-pulse" />
            <div className="h-8 rounded-md bg-muted animate-pulse" />
            <div className="h-8 rounded-md bg-primary/20 animate-pulse w-full" />
          </div>
        </div>
      </div>
    ),
    code: `import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function LoginForm() {
  return (
    <div className="space-y-4 max-w-sm mx-auto">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-bold">Welcome back</h1>
        <p className="text-muted-foreground">Enter your email to sign in</p>
      </div>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="m@example.com" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" required />
        </div>
        <Button className="w-full">Sign in</Button>
      </div>
    </div>
  );
}`
  },
  {
    id: 'auth-signup',
    category: 'Authentication',
    title: 'Sign Up Form',
    description: 'Multi-field registration form with validation and terms acceptance.',
    files: ['SignUp.tsx'],
    preview: (
      <div className="max-w-sm w-full mx-auto p-6 rounded-xl border bg-card shadow-sm">
        <div className="space-y-3">
          <div className="text-center">
            <h1 className="text-xl font-bold">Create Account</h1>
          </div>
          <div className="space-y-2">
            <div className="h-7 rounded-md bg-muted animate-pulse" />
            <div className="h-7 rounded-md bg-muted animate-pulse" />
            <div className="h-7 rounded-md bg-muted animate-pulse" />
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded border bg-muted" />
              <div className="h-3 flex-1 rounded bg-muted/50" />
            </div>
            <div className="h-8 rounded-md bg-primary/20 animate-pulse w-full" />
          </div>
        </div>
      </div>
    ),
    code: `import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

export function SignUpForm() {
  return (
    <div className="space-y-4 max-w-sm mx-auto">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-bold">Create Account</h1>
        <p className="text-muted-foreground">Sign up to get started</p>
      </div>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <Input id="name" placeholder="John Doe" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="m@example.com" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" required />
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox id="terms" />
          <label htmlFor="terms" className="text-sm">
            I agree to the terms and conditions
          </label>
        </div>
        <Button className="w-full">Create Account</Button>
      </div>
    </div>
  );
}`
  },

  // Layout Patterns
  {
    id: 'dashboard-shell',
    category: 'Layouts',
    title: 'Dashboard Shell',
    description: 'Responsive sidebar layout with top navigation and main content area.',
    files: ['DashboardLayout.tsx', 'Sidebar.tsx'],
    preview: (
      <div className="h-48 w-full rounded-xl border bg-background flex overflow-hidden">
        <div className="w-16 bg-muted border-r hidden sm:flex flex-col items-center py-4 gap-2">
          <div className="w-8 h-8 rounded-full bg-primary/20" />
          <div className="w-8 h-8 rounded-md bg-card border" />
          <div className="w-8 h-8 rounded-md bg-card border" />
        </div>
        <div className="flex-1 flex flex-col">
          <div className="h-12 border-b bg-card flex items-center px-4 justify-between">
            <div className="w-24 h-4 bg-muted rounded" />
            <div className="w-8 h-8 rounded-full bg-muted" />
          </div>
          <div className="flex-1 p-4 bg-muted/10">
            <div className="grid grid-cols-2 gap-4">
              <div className="h-24 rounded-lg border bg-card" />
              <div className="h-24 rounded-lg border bg-card" />
            </div>
          </div>
        </div>
      </div>
    ),
    code: `export function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen w-full">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-6 overflow-auto bg-muted/10">
          {children}
        </main>
      </div>
    </div>
  );
}

function Sidebar() {
  return (
    <aside className="w-64 border-r bg-card hidden md:flex flex-col">
      <div className="p-6 border-b">
        <h2 className="text-lg font-bold">Dashboard</h2>
      </div>
      <nav className="flex-1 p-4">
        {/* Navigation items */}
      </nav>
    </aside>
  );
}`
  },
  {
    id: 'split-layout',
    category: 'Layouts',
    title: 'Split Screen Layout',
    description: 'Two-column layout perfect for settings or detail views.',
    files: ['SplitLayout.tsx'],
    preview: (
      <div className="h-48 w-full rounded-xl border bg-background flex overflow-hidden">
        <div className="w-1/3 bg-muted border-r p-4 space-y-2">
          <div className="h-4 bg-card rounded w-3/4" />
          <div className="h-4 bg-card rounded w-1/2" />
          <div className="h-4 bg-card rounded w-2/3" />
        </div>
        <div className="flex-1 p-4 space-y-3">
          <div className="h-6 bg-muted rounded w-1/3" />
          <div className="space-y-2">
            <div className="h-4 bg-muted rounded" />
            <div className="h-4 bg-muted rounded w-5/6" />
          </div>
        </div>
      </div>
    ),
    code: `export function SplitLayout({ sidebar, children }: { 
  sidebar: React.ReactNode; 
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen w-full">
      <aside className="w-80 border-r bg-muted/30 overflow-auto">
        {sidebar}
      </aside>
      <main className="flex-1 overflow-auto p-8">
        {children}
      </main>
    </div>
  );
}`
  },

  // Form Patterns
  {
    id: 'contact-form',
    category: 'Forms',
    title: 'Contact Form',
    description: 'Multi-field contact form with textarea and submit button.',
    files: ['ContactForm.tsx'],
    preview: (
      <div className="max-w-md w-full mx-auto p-6 rounded-xl border bg-card">
        <div className="space-y-3">
          <div className="h-5 bg-muted rounded w-1/3" />
          <div className="space-y-2">
            <div className="h-8 rounded-md bg-muted" />
            <div className="h-8 rounded-md bg-muted" />
            <div className="h-20 rounded-md bg-muted" />
            <div className="h-9 rounded-md bg-primary/20 w-full" />
          </div>
        </div>
      </div>
    ),
    code: `import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function ContactForm() {
  return (
    <form className="space-y-4 max-w-md mx-auto">
      <h2 className="text-2xl font-bold">Get in Touch</h2>
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input id="name" placeholder="Your name" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" placeholder="you@example.com" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="message">Message</Label>
        <Textarea id="message" placeholder="Your message..." rows={4} required />
      </div>
      <Button type="submit" className="w-full">Send Message</Button>
    </form>
  );
}`
  },
  {
    id: 'search-filter',
    category: 'Forms',
    title: 'Search with Filters',
    description: 'Search bar with dropdown filters and advanced options.',
    files: ['SearchFilter.tsx'],
    preview: (
      <div className="w-full p-4 rounded-xl border bg-card">
        <div className="flex gap-2">
          <div className="flex-1 h-9 rounded-md bg-muted flex items-center px-3">
            <div className="w-4 h-4 rounded-full bg-muted-foreground/20" />
          </div>
          <div className="w-32 h-9 rounded-md bg-muted" />
          <div className="w-20 h-9 rounded-md bg-primary/20" />
        </div>
      </div>
    ),
    code: `import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";

export function SearchFilter() {
  return (
    <div className="flex gap-2 w-full max-w-2xl">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input placeholder="Search..." className="pl-9" />
      </div>
      <Select defaultValue="all">
        <SelectTrigger className="w-32">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All</SelectItem>
          <SelectItem value="active">Active</SelectItem>
          <SelectItem value="archived">Archived</SelectItem>
        </SelectContent>
      </Select>
      <Button>Filter</Button>
    </div>
  );
}`
  },

  // Data Display Patterns
  {
    id: 'stats-cards',
    category: 'Data Display',
    title: 'Stats Dashboard',
    description: 'Grid of metric cards with icons and trend indicators.',
    files: ['StatsCards.tsx'],
    preview: (
      <div className="grid grid-cols-2 gap-3 w-full p-2">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="p-3 rounded-lg border bg-card">
            <div className="flex items-center justify-between mb-2">
              <div className="w-8 h-8 rounded-md bg-primary/10" />
              <div className="text-[10px] text-green-500">↑ 12%</div>
            </div>
            <div className="h-3 bg-muted rounded w-2/3 mb-1" />
            <div className="h-5 bg-muted rounded w-1/2" />
          </div>
        ))}
      </div>
    ),
    code: `import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Users, DollarSign, Activity } from "lucide-react";

export function StatsCards() {
  const stats = [
    { title: "Total Users", value: "2,543", change: "+12%", icon: Users },
    { title: "Revenue", value: "$45,231", change: "+8%", icon: DollarSign },
    { title: "Active Now", value: "573", change: "+23%", icon: Activity },
    { title: "Growth", value: "12.5%", change: "+4%", icon: TrendingUp },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-green-500">{stat.change} from last month</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}`
  },
  {
    id: 'data-table',
    category: 'Data Display',
    title: 'Data Table',
    description: 'Sortable table with actions and pagination.',
    files: ['DataTable.tsx'],
    preview: (
      <div className="w-full rounded-lg border bg-card overflow-hidden">
        <div className="border-b bg-muted/30 p-2 flex gap-2">
          <div className="h-3 bg-muted rounded w-1/4" />
          <div className="h-3 bg-muted rounded w-1/4" />
          <div className="h-3 bg-muted rounded w-1/4" />
        </div>
        {[1, 2, 3].map(i => (
          <div key={i} className="border-b p-2 flex gap-2 items-center">
            <div className="h-2 bg-muted rounded flex-1" />
            <div className="h-2 bg-muted rounded flex-1" />
            <div className="h-2 bg-muted rounded flex-1" />
          </div>
        ))}
      </div>
    ),
    code: `import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";

export function DataTable() {
  const data = [
    { id: 1, name: "John Doe", email: "john@example.com", role: "Admin" },
    { id: 2, name: "Jane Smith", email: "jane@example.com", role: "User" },
  ];

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row) => (
            <TableRow key={row.id}>
              <TableCell className="font-medium">{row.name}</TableCell>
              <TableCell>{row.email}</TableCell>
              <TableCell>{row.role}</TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="sm">Edit</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}`
  },

  // Navigation Patterns
  {
    id: 'breadcrumbs',
    category: 'Navigation',
    title: 'Breadcrumbs',
    description: 'Hierarchical navigation breadcrumb trail.',
    files: ['Breadcrumbs.tsx'],
    preview: (
      <div className="flex items-center gap-2 p-3">
        <div className="h-3 w-12 bg-muted rounded" />
        <div className="text-muted-foreground">/</div>
        <div className="h-3 w-16 bg-muted rounded" />
        <div className="text-muted-foreground">/</div>
        <div className="h-3 w-14 bg-primary/30 rounded" />
      </div>
    ),
    code: `import { ChevronRight } from "lucide-react";
import Link from "next/link";

export function Breadcrumbs({ items }: { items: { label: string; href: string }[] }) {
  return (
    <nav className="flex items-center space-x-2 text-sm">
      {items.map((item, index) => (
        <div key={item.href} className="flex items-center">
          {index > 0 && <ChevronRight className="w-4 h-4 mx-2 text-muted-foreground" />}
          <Link 
            href={item.href}
            className={index === items.length - 1 
              ? "font-medium text-foreground" 
              : "text-muted-foreground hover:text-foreground"
            }
          >
            {item.label}
          </Link>
        </div>
      ))}
    </nav>
  );
}`
  },
  {
    id: 'pagination',
    category: 'Navigation',
    title: 'Pagination',
    description: 'Page navigation with previous/next and page numbers.',
    files: ['Pagination.tsx'],
    preview: (
      <div className="flex items-center justify-center gap-1 p-3">
        <div className="w-8 h-8 rounded-md border bg-card" />
        <div className="w-8 h-8 rounded-md border bg-primary/20" />
        <div className="w-8 h-8 rounded-md border bg-card" />
        <div className="w-8 h-8 rounded-md border bg-card" />
        <div className="px-2 text-muted-foreground">...</div>
        <div className="w-8 h-8 rounded-md border bg-card" />
      </div>
    ),
    code: `import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function Pagination({ currentPage, totalPages }: { currentPage: number; totalPages: number }) {
  return (
    <div className="flex items-center justify-center gap-1">
      <Button variant="outline" size="icon" disabled={currentPage === 1}>
        <ChevronLeft className="w-4 h-4" />
      </Button>
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <Button
          key={page}
          variant={page === currentPage ? "default" : "outline"}
          size="icon"
        >
          {page}
        </Button>
      ))}
      <Button variant="outline" size="icon" disabled={currentPage === totalPages}>
        <ChevronRight className="w-4 h-4" />
      </Button>
    </div>
  );
}`
  },

  // Feedback Patterns
  {
    id: 'alert-banner',
    category: 'Feedback',
    title: 'Alert Banners',
    description: 'Informational, warning, error, and success alerts.',
    files: ['AlertBanner.tsx'],
    preview: (
      <div className="space-y-2 w-full p-2">
        <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-blue-500" />
          <div className="h-2 bg-blue-500/30 rounded flex-1" />
        </div>
        <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-green-500" />
          <div className="h-2 bg-green-500/30 rounded flex-1" />
        </div>
      </div>
    ),
    code: `import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info, CheckCircle2, AlertTriangle, XCircle } from "lucide-react";

export function AlertBanner({ type, title, message }: { 
  type: "info" | "success" | "warning" | "error";
  title: string;
  message: string;
}) {
  const icons = {
    info: Info,
    success: CheckCircle2,
    warning: AlertTriangle,
    error: XCircle,
  };
  
  const Icon = icons[type];

  return (
    <Alert variant={type === "error" ? "destructive" : "default"}>
      <Icon className="h-4 w-4" />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
}`
  },
  {
    id: 'empty-state',
    category: 'Feedback',
    title: 'Empty State',
    description: 'Placeholder for empty data with call-to-action.',
    files: ['EmptyState.tsx'],
    preview: (
      <div className="flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-full bg-muted mb-3 flex items-center justify-center">
          <div className="w-8 h-8 rounded-full bg-muted-foreground/20" />
        </div>
        <div className="h-4 bg-muted rounded w-32 mb-2" />
        <div className="h-3 bg-muted/50 rounded w-48 mb-4" />
        <div className="h-8 bg-primary/20 rounded w-24" />
      </div>
    ),
    code: `import { Button } from "@/components/ui/button";
import { FileX } from "lucide-react";

export function EmptyState({ 
  icon: Icon = FileX,
  title,
  description,
  action
}: {
  icon?: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  action?: { label: string; onClick: () => void };
}) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center">
      <div className="w-16 h-16 rounded-full bg-muted mb-4 flex items-center justify-center">
        <Icon className="w-8 h-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground mb-6 max-w-sm">{description}</p>
      {action && (
        <Button onClick={action.onClick}>{action.label}</Button>
      )}
    </div>
  );
}`
  },

  // Marketing Patterns
  {
    id: 'pricing-table',
    category: 'Marketing',
    title: 'Pricing Cards',
    description: 'Three-column pricing table with highlighted preferred option.',
    files: ['Pricing.tsx'],
    preview: (
      <div className="flex gap-2 items-end justify-center h-full pt-4">
        <div className="w-1/4 h-24 rounded-t-lg border border-b-0 bg-card transform translate-y-2 opacity-50" />
        <div className="w-1/3 h-32 rounded-t-lg border border-b-0 bg-card ring-2 ring-primary z-10 shadow-lg relative">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-primary text-[8px] text-primary-foreground rounded-full">POPULAR</div>
        </div>
        <div className="w-1/4 h-24 rounded-t-lg border border-b-0 bg-card transform translate-y-2 opacity-50" />
      </div>
    ),
    code: `import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";

export function Pricing() {
  const plans = [
    { name: "Starter", price: "$9", features: ["10 Projects", "5GB Storage", "Email Support"] },
    { name: "Pro", price: "$29", features: ["Unlimited Projects", "50GB Storage", "Priority Support", "Advanced Analytics"], popular: true },
    { name: "Enterprise", price: "$99", features: ["Unlimited Everything", "Dedicated Support", "Custom Integrations"] },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {plans.map((plan) => (
        <Card key={plan.name} className={plan.popular ? "border-primary shadow-lg" : ""}>
          {plan.popular && (
            <div className="bg-primary text-primary-foreground text-xs font-bold text-center py-1">
              MOST POPULAR
            </div>
          )}
          <CardHeader>
            <CardTitle>{plan.name}</CardTitle>
            <CardDescription>
              <span className="text-3xl font-bold text-foreground">{plan.price}</span>/month
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-500" />
                  <span className="text-sm">{feature}</span>
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter>
            <Button className="w-full" variant={plan.popular ? "default" : "outline"}>
              Get Started
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}`
  },
  {
    id: 'feature-grid',
    category: 'Marketing',
    title: 'Feature Grid',
    description: 'Grid showcasing product features with icons.',
    files: ['FeatureGrid.tsx'],
    preview: (
      <div className="grid grid-cols-2 gap-3 p-2">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="p-3 rounded-lg border bg-card">
            <div className="w-8 h-8 rounded-lg bg-primary/10 mb-2" />
            <div className="h-3 bg-muted rounded w-3/4 mb-1" />
            <div className="h-2 bg-muted/50 rounded w-full" />
          </div>
        ))}
      </div>
    ),
    code: `import { Zap, Shield, Sparkles, Rocket } from "lucide-react";

export function FeatureGrid() {
  const features = [
    { icon: Zap, title: "Lightning Fast", description: "Optimized for speed and performance" },
    { icon: Shield, title: "Secure", description: "Enterprise-grade security built-in" },
    { icon: Sparkles, title: "Beautiful", description: "Stunning UI that users love" },
    { icon: Rocket, title: "Scalable", description: "Grows with your business" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {features.map((feature) => (
        <div key={feature.title} className="p-6 rounded-lg border bg-card">
          <feature.icon className="w-10 h-10 text-primary mb-4" />
          <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
          <p className="text-sm text-muted-foreground">{feature.description}</p>
        </div>
      ))}
    </div>
  );
}`
  },

  // E-commerce Patterns
  {
    id: 'product-card',
    category: 'E-commerce',
    title: 'Product Card',
    description: 'Product display with image, price, and add to cart.',
    files: ['ProductCard.tsx'],
    preview: (
      <div className="max-w-xs rounded-lg border bg-card overflow-hidden">
        <div className="aspect-square bg-muted" />
        <div className="p-4 space-y-2">
          <div className="h-4 bg-muted rounded w-3/4" />
          <div className="h-3 bg-muted/50 rounded w-1/2" />
          <div className="flex items-center justify-between pt-2">
            <div className="h-5 bg-muted rounded w-16" />
            <div className="h-8 bg-primary/20 rounded w-20" />
          </div>
        </div>
      </div>
    ),
    code: `import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { ShoppingCart } from "lucide-react";

export function ProductCard({ product }: { 
  product: { name: string; price: number; image: string; description: string }
}) {
  return (
    <Card className="overflow-hidden">
      <div className="aspect-square overflow-hidden">
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-full object-cover hover:scale-105 transition-transform"
        />
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg mb-1">{product.name}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex items-center justify-between">
        <span className="text-2xl font-bold">\${product.price}</span>
        <Button size="sm">
          <ShoppingCart className="w-4 h-4 mr-2" />
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
}`
  },
];

export default function PatternLibrary() {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [previewPattern, setPreviewPattern] = useState<typeof PATTERNS[0] | null>(null);

  const categories = ['All', ...Array.from(new Set(PATTERNS.map(p => p.category)))];

  const filteredPatterns = PATTERNS.filter(p => {
    const matchesCategory = activeCategory === 'All' || p.category === activeCategory;
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleCopy = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handlePreview = (pattern: typeof PATTERNS[0]) => {
    setPreviewPattern(pattern);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="border-b px-8 py-6 bg-card/30">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-500">
            <LayoutTemplate className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-3xl font-black tracking-tight">Pattern Library</h1>
            <p className="text-sm text-muted-foreground">Pre-built composite UI patterns to accelerate development</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Filter Bar */}
        <div className="px-8 py-4 border-b bg-card/10 flex flex-wrap items-center gap-4">
          <div className="flex gap-2">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${activeCategory === cat
                  ? 'bg-primary text-primary-foreground shadow-md'
                  : 'bg-background hover:bg-muted text-muted-foreground'
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex-1 max-w-sm ml-auto relative">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
            <input
              type="text"
              placeholder="Search patterns..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>
        </div>

        <ScrollArea className="flex-1 p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {filteredPatterns.map(pattern => (
              <div key={pattern.id} className="group rounded-2xl border bg-card overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col">
                {/* Preview */}
                <div className="h-48 bg-muted/20 border-b flex items-center justify-center p-6 relative overflow-hidden group/preview">
                  <div className="absolute inset-0 bg-grid-slate-200/50 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] pointer-events-none" />
                  <div className="relative w-full h-full flex items-center justify-center pointer-events-none">
                    {pattern.preview}
                  </div>
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/preview:opacity-100 transition-all duration-200 flex items-center justify-center gap-3 backdrop-blur-sm z-10">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => handleCopy(pattern.code, pattern.id)}
                      className="shadow-lg"
                    >
                      {copiedId === pattern.id ? <CheckCircle2 className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                      {copiedId === pattern.id ? 'Copied!' : 'Copy Code'}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="bg-white/10 text-white hover:bg-white/20 border-white/30 shadow-lg backdrop-blur-sm"
                      onClick={() => handlePreview(pattern)}
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Preview
                    </Button>
                  </div>
                </div>

                {/* Info */}
                <div className="p-5 flex-1 flex flex-col">
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="outline" className="text-xs font-normal text-muted-foreground">
                      {pattern.category}
                    </Badge>
                    <span className="text-[10px] text-muted-foreground font-mono">
                      {pattern.files.length} file{pattern.files.length > 1 ? 's' : ''}
                    </span>
                  </div>
                  <h3 className="font-bold text-lg mb-1">{pattern.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-4 flex-1">
                    {pattern.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Preview Modal */}
      <Dialog open={!!previewPattern} onOpenChange={(open) => !open && setPreviewPattern(null)}>
        <DialogContent className="max-w-5xl h-[90vh] flex flex-col p-0">
          <DialogHeader className="px-6 pt-6 pb-4 border-b">
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle className="text-2xl font-bold">{previewPattern?.title}</DialogTitle>
                <DialogDescription className="mt-1">
                  {previewPattern?.description}
                </DialogDescription>
              </div>
              <Badge variant="outline">{previewPattern?.category}</Badge>
            </div>
          </DialogHeader>

          <Tabs defaultValue="preview" className="flex-1 flex flex-col overflow-hidden">
            <TabsList className="mx-6 mt-4 w-fit">
              <TabsTrigger value="preview">Preview</TabsTrigger>
              <TabsTrigger value="code">Code</TabsTrigger>
            </TabsList>

            <TabsContent value="preview" className="flex-1 overflow-auto m-0 p-6">
              <div className="w-full h-full flex items-center justify-center bg-muted/20 rounded-lg border p-12">
                <div className="w-full max-w-3xl">
                  {previewPattern?.preview}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="code" className="flex-1 overflow-auto m-0 p-6">
              <div className="relative">
                <Button
                  size="sm"
                  variant="outline"
                  className="absolute top-2 right-2 z-10"
                  onClick={() => previewPattern && handleCopy(previewPattern.code, previewPattern.id)}
                >
                  {copiedId === previewPattern?.id ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 mr-2" />
                      Copy Code
                    </>
                  )}
                </Button>
                <pre className="bg-muted/50 rounded-lg p-6 overflow-auto text-sm">
                  <code>{previewPattern?.code}</code>
                </pre>
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </div>
  );
}
