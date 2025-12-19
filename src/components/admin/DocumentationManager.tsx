import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
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
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { 
  Plus, Search, Edit2, Trash2, Loader2, Eye, EyeOff,
  Book, Code, Zap, Settings, Palette, Shield, FileText, Lightbulb
} from 'lucide-react';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface DocumentationSection {
  id: string;
  title: string;
  description: string | null;
  icon: string;
  content: string | null;
  order_index: number;
  is_published: boolean | null;
  created_at: string;
  updated_at: string;
}

const iconOptions = [
  { value: 'Book', label: 'Book', icon: Book },
  { value: 'Code', label: 'Code', icon: Code },
  { value: 'Zap', label: 'Zap', icon: Zap },
  { value: 'Settings', label: 'Settings', icon: Settings },
  { value: 'Palette', label: 'Palette', icon: Palette },
  { value: 'Shield', label: 'Shield', icon: Shield },
  { value: 'FileText', label: 'FileText', icon: FileText },
  { value: 'Lightbulb', label: 'Lightbulb', icon: Lightbulb },
];

const getIconComponent = (iconName: string) => {
  const iconOption = iconOptions.find(opt => opt.value === iconName);
  return iconOption?.icon || Book;
};

export const DocumentationManager = () => {
  const [sections, setSections] = useState<DocumentationSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedSection, setSelectedSection] = useState<DocumentationSection | null>(null);
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    icon: 'Book',
    content: '',
    order_index: 0,
    is_published: false,
  });

  useEffect(() => {
    fetchSections();
  }, []);

  const fetchSections = async () => {
    setLoading(true);
    const { data, error } = await (supabase
      .from('documentation_sections') as any)
      .select('*')
      .order('order_index', { ascending: true });
    
    if (error) {
      toast.error('Failed to fetch documentation sections');
    } else {
      setSections(data || []);
    }
    setLoading(false);
  };

  const handleOpenDialog = (section?: DocumentationSection) => {
    if (section) {
      setSelectedSection(section);
      setFormData({
        title: section.title,
        description: section.description || '',
        icon: section.icon,
        content: section.content || '',
        order_index: section.order_index,
        is_published: section.is_published || false,
      });
    } else {
      setSelectedSection(null);
      setFormData({
        title: '',
        description: '',
        icon: 'Book',
        content: '',
        order_index: sections.length,
        is_published: false,
      });
    }
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!formData.title.trim()) {
      toast.error('Title is required');
      return;
    }

    setSaving(true);

    if (selectedSection) {
      const { error } = await (supabase
        .from('documentation_sections') as any)
        .update({
          title: formData.title.trim(),
          description: formData.description.trim() || null,
          icon: formData.icon,
          content: formData.content.trim() || null,
          order_index: formData.order_index,
          is_published: formData.is_published,
        })
        .eq('id', selectedSection.id);

      if (error) {
        toast.error('Failed to update section: ' + error.message);
      } else {
        toast.success('Section updated successfully');
        setDialogOpen(false);
        fetchSections();
      }
    } else {
      const { error } = await (supabase
        .from('documentation_sections') as any)
        .insert({
          title: formData.title.trim(),
          description: formData.description.trim() || null,
          icon: formData.icon,
          content: formData.content.trim() || null,
          order_index: formData.order_index,
          is_published: formData.is_published,
        });

      if (error) {
        toast.error('Failed to create section: ' + error.message);
      } else {
        toast.success('Section created successfully');
        setDialogOpen(false);
        fetchSections();
      }
    }

    setSaving(false);
  };

  const handleDelete = async () => {
    if (!selectedSection) return;

    const { error } = await (supabase
      .from('documentation_sections') as any)
      .delete()
      .eq('id', selectedSection.id);

    if (error) {
      toast.error('Failed to delete section: ' + error.message);
    } else {
      toast.success('Section deleted successfully');
      setDeleteDialogOpen(false);
      setSelectedSection(null);
      fetchSections();
    }
  };

  const handleTogglePublish = async (section: DocumentationSection) => {
    const { error } = await (supabase
      .from('documentation_sections') as any)
      .update({ is_published: !section.is_published })
      .eq('id', section.id);

    if (error) {
      toast.error('Failed to update section');
    } else {
      toast.success(section.is_published ? 'Section unpublished' : 'Section published');
      fetchSections();
    }
  };

  const filteredSections = sections.filter(section =>
    section.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    section.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="animate-fade-up">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground mb-1">Documentation Manager</h1>
          <p className="text-muted-foreground">Create and manage documentation sections</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            <Input
              placeholder="Search sections..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-secondary border-border"
            />
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => handleOpenDialog()}>
                <Plus size={18} className="mr-2" />
                Add Section
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {selectedSection ? 'Edit Section' : 'Create New Section'}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Getting Started"
                    maxLength={100}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="A brief description of this section..."
                    rows={2}
                    maxLength={500}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Icon</Label>
                    <Select
                      value={formData.icon}
                      onValueChange={(value) => setFormData({ ...formData, icon: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {iconOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            <div className="flex items-center gap-2">
                              <option.icon size={16} />
                              {option.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="order">Order Index</Label>
                    <Input
                      id="order"
                      type="number"
                      value={formData.order_index}
                      onChange={(e) => setFormData({ ...formData, order_index: parseInt(e.target.value) || 0 })}
                      min={0}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="content">Content (Markdown supported)</Label>
                  <Textarea
                    id="content"
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    placeholder="# Section Content\n\nWrite your documentation here..."
                    rows={10}
                    className="font-mono text-sm"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    id="published"
                    checked={formData.is_published}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_published: checked })}
                  />
                  <Label htmlFor="published">Publish immediately</Label>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSave} disabled={saving}>
                  {saving ? <Loader2 size={18} className="mr-2 animate-spin" /> : null}
                  {selectedSection ? 'Update' : 'Create'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="glass rounded-xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-secondary/50">
            <tr>
              <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Section</th>
              <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Description</th>
              <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Order</th>
              <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Status</th>
              <th className="text-right px-6 py-4 text-sm font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {loading ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
                  <Loader2 className="animate-spin mx-auto" />
                </td>
              </tr>
            ) : filteredSections.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
                  No documentation sections found
                </td>
              </tr>
            ) : (
              filteredSections.map((section) => {
                const IconComponent = getIconComponent(section.icon);
                return (
                  <tr key={section.id} className="hover:bg-secondary/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                          <IconComponent size={20} className="text-primary" />
                        </div>
                        <span className="font-medium text-foreground">{section.title}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground max-w-xs truncate">
                      {section.description || '—'}
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {section.order_index}
                    </td>
                    <td className="px-6 py-4">
                      {section.is_published ? (
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
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleTogglePublish(section)}
                        >
                          {section.is_published ? <EyeOff size={16} /> : <Eye size={16} />}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleOpenDialog(section)}
                        >
                          <Edit2 size={16} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:text-destructive"
                          onClick={() => {
                            setSelectedSection(section);
                            setDeleteDialogOpen(true);
                          }}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Documentation Section?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete "{selectedSection?.title}". This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
