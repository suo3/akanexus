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
import { Plus, Search, MoreVertical, Eye, EyeOff, Pencil, Trash2, Loader2, Package } from 'lucide-react';

interface MarketplaceComponent {
  id: string;
  name: string;
  description: string | null;
  category: string;
  preview_image_url: string | null;
  code_snippet: string | null;
  price: number;
  is_premium: boolean;
  is_published: boolean;
  downloads: number;
  created_at: string;
}

const CATEGORIES = ['UI', 'Forms', 'Navigation', 'Cards', 'Charts', 'Modals', 'Tables', 'Other'];

export const ComponentManager = () => {
  const [components, setComponents] = useState<MarketplaceComponent[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingComponent, setEditingComponent] = useState<MarketplaceComponent | null>(null);
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'UI',
    preview_image_url: '',
    code_snippet: '',
    price: 0,
    is_premium: false,
    is_published: false,
  });

  useEffect(() => {
    fetchComponents();
  }, []);

  const fetchComponents = async () => {
    setLoading(true);
    const { data, error } = await (supabase
      .from('marketplace_components') as any)
      .select('*')
      .order('created_at', { ascending: false });
    
    if (!error && data) {
      setComponents(data);
    }
    setLoading(false);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      category: 'UI',
      preview_image_url: '',
      code_snippet: '',
      price: 0,
      is_premium: false,
      is_published: false,
    });
    setEditingComponent(null);
  };

  const openEditDialog = (component: MarketplaceComponent) => {
    setEditingComponent(component);
    setFormData({
      name: component.name,
      description: component.description || '',
      category: component.category,
      preview_image_url: component.preview_image_url || '',
      code_snippet: component.code_snippet || '',
      price: component.price,
      is_premium: component.is_premium,
      is_published: component.is_published,
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    if (editingComponent) {
      const { error } = await (supabase
        .from('marketplace_components') as any)
        .update(formData)
        .eq('id', editingComponent.id);
      
      if (error) {
        toast.error('Failed to update component: ' + error.message);
      } else {
        toast.success('Component updated successfully');
        fetchComponents();
        setIsDialogOpen(false);
        resetForm();
      }
    } else {
      const { error } = await (supabase
        .from('marketplace_components') as any)
        .insert([formData]);
      
      if (error) {
        toast.error('Failed to create component: ' + error.message);
      } else {
        toast.success('Component created successfully');
        fetchComponents();
        setIsDialogOpen(false);
        resetForm();
      }
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    const { error } = await (supabase
      .from('marketplace_components') as any)
      .delete()
      .eq('id', id);
    
    if (error) {
      toast.error('Failed to delete component: ' + error.message);
    } else {
      toast.success('Component deleted');
      fetchComponents();
    }
  };

  const togglePublish = async (id: string, currentState: boolean) => {
    const { error } = await (supabase
      .from('marketplace_components') as any)
      .update({ is_published: !currentState })
      .eq('id', id);
    
    if (error) {
      toast.error('Failed to update status');
    } else {
      toast.success(currentState ? 'Component unpublished' : 'Component published');
      fetchComponents();
    }
  };

  const filteredComponents = components.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="animate-fade-up">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground mb-1">Component Management</h1>
          <p className="text-muted-foreground">Manage marketplace components</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            <Input
              placeholder="Search components..."
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
                Add Component
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingComponent ? 'Edit Component' : 'Add New Component'}
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
                  <Label htmlFor="code_snippet">Code Snippet</Label>
                  <Textarea
                    id="code_snippet"
                    value={formData.code_snippet}
                    onChange={(e) => setFormData({ ...formData, code_snippet: e.target.value })}
                    rows={6}
                    className="font-mono text-sm"
                    placeholder="<Button>Click me</Button>"
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
                    {editingComponent ? 'Save Changes' : 'Create Component'}
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
              <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Component</th>
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
                  Loading components...
                </td>
              </tr>
            ) : filteredComponents.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center">
                  <Package className="mx-auto text-muted-foreground mb-4" size={48} />
                  <p className="text-muted-foreground">No components found</p>
                </td>
              </tr>
            ) : (
              filteredComponents.map((component) => (
                <tr key={component.id} className="hover:bg-secondary/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                        <Package size={20} className="text-primary" />
                      </div>
                      <div>
                        <span className="font-medium text-foreground block">{component.name}</span>
                        <span className="text-xs text-muted-foreground line-clamp-1">
                          {component.description || 'No description'}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant="secondary">{component.category}</Badge>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {component.is_published ? (
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
                      {component.is_premium && (
                        <Badge className="bg-amber-500/20 text-amber-500 border-amber-500/30">
                          Premium
                        </Badge>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">
                    {component.price > 0 ? `$${component.price.toFixed(2)}` : 'Free'}
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">{component.downloads}</td>
                  <td className="px-6 py-4 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical size={16} />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => openEditDialog(component)}>
                          <Pencil size={14} className="mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => togglePublish(component.id, component.is_published)}>
                          {component.is_published ? (
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
                          onClick={() => handleDelete(component.id)}
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
