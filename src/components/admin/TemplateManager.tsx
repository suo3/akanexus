import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Plus, Search, MoreVertical, Eye, EyeOff, Pencil, Trash2, Loader2, Layout, ExternalLink } from 'lucide-react';

interface MarketplaceTemplate {
  id: string;
  name: string;
  description: string | null;
  category: string;
  preview_image_url: string | null;
  demo_url: string | null;
  price: number;
  is_premium: boolean;
  is_published: boolean;
  downloads: number;
  features: string[] | null;
  created_at: string;
}

const CATEGORIES = ['Landing Page', 'Dashboard', 'E-commerce', 'Blog', 'Portfolio', 'SaaS', 'Admin', 'Other'];

export const TemplateManager = () => {
  const [templates, setTemplates] = useState<MarketplaceTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<MarketplaceTemplate | null>(null);
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'Landing Page',
    preview_image_url: '',
    demo_url: '',
    price: 0,
    is_premium: false,
    is_published: false,
    features: '',
  });

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    setLoading(true);
    const { data, error } = await (supabase
      .from('marketplace_templates') as any)
      .select('*')
      .order('created_at', { ascending: false });
    
    if (!error && data) {
      setTemplates(data);
    }
    setLoading(false);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      category: 'Landing Page',
      preview_image_url: '',
      demo_url: '',
      price: 0,
      is_premium: false,
      is_published: false,
      features: '',
    });
    setEditingTemplate(null);
  };

  const openEditDialog = (template: MarketplaceTemplate) => {
    setEditingTemplate(template);
    setFormData({
      name: template.name,
      description: template.description || '',
      category: template.category,
      preview_image_url: template.preview_image_url || '',
      demo_url: template.demo_url || '',
      price: template.price,
      is_premium: template.is_premium,
      is_published: template.is_published,
      features: template.features?.join(', ') || '',
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const dataToSave = {
      ...formData,
      features: formData.features ? formData.features.split(',').map(f => f.trim()).filter(Boolean) : [],
    };

    if (editingTemplate) {
      const { error } = await (supabase
        .from('marketplace_templates') as any)
        .update(dataToSave)
        .eq('id', editingTemplate.id);
      
      if (error) {
        toast.error('Failed to update template: ' + error.message);
      } else {
        toast.success('Template updated successfully');
        fetchTemplates();
        setIsDialogOpen(false);
        resetForm();
      }
    } else {
      const { error } = await (supabase
        .from('marketplace_templates') as any)
        .insert([dataToSave]);
      
      if (error) {
        toast.error('Failed to create template: ' + error.message);
      } else {
        toast.success('Template created successfully');
        fetchTemplates();
        setIsDialogOpen(false);
        resetForm();
      }
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    const { error } = await (supabase
      .from('marketplace_templates') as any)
      .delete()
      .eq('id', id);
    
    if (error) {
      toast.error('Failed to delete template: ' + error.message);
    } else {
      toast.success('Template deleted');
      fetchTemplates();
    }
  };

  const togglePublish = async (id: string, currentState: boolean) => {
    const { error } = await (supabase
      .from('marketplace_templates') as any)
      .update({ is_published: !currentState })
      .eq('id', id);
    
    if (error) {
      toast.error('Failed to update status');
    } else {
      toast.success(currentState ? 'Template unpublished' : 'Template published');
      fetchTemplates();
    }
  };

  const filteredTemplates = templates.filter(t =>
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="animate-fade-up">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground mb-1">Template Management</h1>
          <p className="text-muted-foreground">Manage marketplace templates</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            <Input
              placeholder="Search templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-secondary border-border"
            />
          </div>
          <Dialog open={isDialogOpen} onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button>
                <Plus size={18} className="mr-2" />
                Add Template
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingTemplate ? 'Edit Template' : 'Add New Template'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) => setFormData({ ...formData, category: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {CATEGORIES.map((cat) => (
                          <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="preview_image_url">Preview Image URL</Label>
                    <Input
                      id="preview_image_url"
                      value={formData.preview_image_url}
                      onChange={(e) => setFormData({ ...formData, preview_image_url: e.target.value })}
                      placeholder="https://..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="demo_url">Demo URL</Label>
                    <Input
                      id="demo_url"
                      value={formData.demo_url}
                      onChange={(e) => setFormData({ ...formData, demo_url: e.target.value })}
                      placeholder="https://..."
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="features">Features (comma-separated)</Label>
                  <Input
                    id="features"
                    value={formData.features}
                    onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                    placeholder="Responsive, Dark Mode, SEO Optimized"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price">Price ($)</Label>
                    <Input
                      id="price"
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                    />
                  </div>
                  <div className="flex items-center gap-6 pt-6">
                    <div className="flex items-center gap-2">
                      <Switch
                        id="is_premium"
                        checked={formData.is_premium}
                        onCheckedChange={(checked) => setFormData({ ...formData, is_premium: checked })}
                      />
                      <Label htmlFor="is_premium">Premium</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        id="is_published"
                        checked={formData.is_published}
                        onCheckedChange={(checked) => setFormData({ ...formData, is_published: checked })}
                      />
                      <Label htmlFor="is_published">Published</Label>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end gap-2 pt-4">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={saving}>
                    {saving && <Loader2 size={16} className="mr-2 animate-spin" />}
                    {editingTemplate ? 'Save Changes' : 'Create Template'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="glass rounded-xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-secondary/50">
            <tr>
              <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Template</th>
              <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Category</th>
              <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Status</th>
              <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Price</th>
              <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Downloads</th>
              <th className="text-right px-6 py-4 text-sm font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {loading ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">
                  Loading templates...
                </td>
              </tr>
            ) : filteredTemplates.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center">
                  <Layout className="mx-auto text-muted-foreground mb-4" size={48} />
                  <p className="text-muted-foreground">No templates found</p>
                </td>
              </tr>
            ) : (
              filteredTemplates.map((template) => (
                <tr key={template.id} className="hover:bg-secondary/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                        <Layout size={20} className="text-primary" />
                      </div>
                      <div>
                        <span className="font-medium text-foreground block">{template.name}</span>
                        <span className="text-xs text-muted-foreground line-clamp-1">
                          {template.description || 'No description'}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant="secondary">{template.category}</Badge>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {template.is_published ? (
                        <Badge className="bg-green-500/20 text-green-500 border-green-500/30">
                          <Eye size={12} className="mr-1" />
                          Published
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-muted-foreground">
                          <EyeOff size={12} className="mr-1" />
                          Draft
                        </Badge>
                      )}
                      {template.is_premium && (
                        <Badge className="bg-amber-500/20 text-amber-500 border-amber-500/30">
                          Premium
                        </Badge>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">
                    {template.price > 0 ? `$${template.price.toFixed(2)}` : 'Free'}
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">{template.downloads}</td>
                  <td className="px-6 py-4 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical size={16} />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => openEditDialog(template)}>
                          <Pencil size={14} className="mr-2" />
                          Edit
                        </DropdownMenuItem>
                        {template.demo_url && (
                          <DropdownMenuItem onClick={() => window.open(template.demo_url!, '_blank')}>
                            <ExternalLink size={14} className="mr-2" />
                            View Demo
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem onClick={() => togglePublish(template.id, template.is_published)}>
                          {template.is_published ? (
                            <>
                              <EyeOff size={14} className="mr-2" />
                              Unpublish
                            </>
                          ) : (
                            <>
                              <Eye size={14} className="mr-2" />
                              Publish
                            </>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          onClick={() => handleDelete(template.id)}
                          className="text-destructive focus:text-destructive"
                        >
                          <Trash2 size={14} className="mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
