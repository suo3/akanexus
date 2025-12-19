import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
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
import { Plus, Pencil, Trash2, Loader2, Play, Clock, User } from 'lucide-react';
import { toast } from 'sonner';

interface Tutorial {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  duration: string | null;
  level: string;
  author: string | null;
  thumbnail_url: string | null;
  video_url: string | null;
  content: string | null;
  order_index: number;
  is_published: boolean;
}

export const TutorialManager = () => {
  const [tutorials, setTutorials] = useState<Tutorial[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTutorial, setEditingTutorial] = useState<Tutorial | null>(null);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    duration: '',
    level: 'Beginner',
    author: '',
    thumbnail_url: '',
    video_url: '',
    content: '',
    order_index: 0,
    is_published: false,
  });

  useEffect(() => {
    fetchTutorials();
  }, []);

  const fetchTutorials = async () => {
    setLoading(true);
    const { data, error } = await (supabase
      .from('tutorials') as any)
      .select('*')
      .order('order_index', { ascending: true });

    if (error) {
      toast.error('Failed to fetch tutorials');
    } else {
      setTutorials(data || []);
    }
    setLoading(false);
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleTitleChange = (title: string) => {
    setFormData(prev => ({
      ...prev,
      title,
      slug: editingTutorial ? prev.slug : generateSlug(title),
    }));
  };

  const openCreateDialog = () => {
    setEditingTutorial(null);
    setFormData({
      title: '',
      slug: '',
      description: '',
      duration: '',
      level: 'Beginner',
      author: '',
      thumbnail_url: '',
      video_url: '',
      content: '',
      order_index: tutorials.length,
      is_published: false,
    });
    setDialogOpen(true);
  };

  const openEditDialog = (tutorial: Tutorial) => {
    setEditingTutorial(tutorial);
    setFormData({
      title: tutorial.title,
      slug: tutorial.slug,
      description: tutorial.description || '',
      duration: tutorial.duration || '',
      level: tutorial.level,
      author: tutorial.author || '',
      thumbnail_url: tutorial.thumbnail_url || '',
      video_url: tutorial.video_url || '',
      content: tutorial.content || '',
      order_index: tutorial.order_index,
      is_published: tutorial.is_published,
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!formData.title || !formData.slug) {
      toast.error('Title and slug are required');
      return;
    }

    setSaving(true);

    if (editingTutorial) {
      const { error } = await (supabase
        .from('tutorials') as any)
        .update(formData)
        .eq('id', editingTutorial.id);

      if (error) {
        toast.error('Failed to update tutorial');
      } else {
        toast.success('Tutorial updated');
        setDialogOpen(false);
        fetchTutorials();
      }
    } else {
      const { error } = await (supabase
        .from('tutorials') as any)
        .insert(formData);

      if (error) {
        toast.error('Failed to create tutorial');
      } else {
        toast.success('Tutorial created');
        setDialogOpen(false);
        fetchTutorials();
      }
    }

    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    const { error } = await (supabase
      .from('tutorials') as any)
      .delete()
      .eq('id', id);

    if (error) {
      toast.error('Failed to delete tutorial');
    } else {
      toast.success('Tutorial deleted');
      fetchTutorials();
    }
  };

  const togglePublished = async (tutorial: Tutorial) => {
    const { error } = await (supabase
      .from('tutorials') as any)
      .update({ is_published: !tutorial.is_published })
      .eq('id', tutorial.id);

    if (error) {
      toast.error('Failed to update tutorial');
    } else {
      fetchTutorials();
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Beginner':
        return 'bg-green-500/10 text-green-500 border-green-500/30';
      case 'Intermediate':
        return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/30';
      case 'Advanced':
        return 'bg-red-500/10 text-red-500 border-red-500/30';
      default:
        return 'bg-primary/10 text-primary border-primary/30';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="animate-spin text-primary" size={32} />
      </div>
    );
  }

  return (
    <div className="animate-fade-up">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground mb-1">Tutorial Management</h1>
          <p className="text-muted-foreground">Create and manage video tutorials</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreateDialog}>
              <Plus size={18} className="mr-2" />
              Add Tutorial
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingTutorial ? 'Edit Tutorial' : 'Create Tutorial'}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder="Tutorial title"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="slug">Slug</Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                    placeholder="tutorial-slug"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Brief description of the tutorial"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="duration">Duration</Label>
                  <Input
                    id="duration"
                    value={formData.duration}
                    onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                    placeholder="e.g., 45 min"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="level">Level</Label>
                  <Select
                    value={formData.level}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, level: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Beginner">Beginner</SelectItem>
                      <SelectItem value="Intermediate">Intermediate</SelectItem>
                      <SelectItem value="Advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="author">Author</Label>
                  <Input
                    id="author"
                    value={formData.author}
                    onChange={(e) => setFormData(prev => ({ ...prev, author: e.target.value }))}
                    placeholder="Author name"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="video_url">Video URL</Label>
                  <Input
                    id="video_url"
                    value={formData.video_url}
                    onChange={(e) => setFormData(prev => ({ ...prev, video_url: e.target.value }))}
                    placeholder="https://..."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="thumbnail_url">Thumbnail URL</Label>
                  <Input
                    id="thumbnail_url"
                    value={formData.thumbnail_url}
                    onChange={(e) => setFormData(prev => ({ ...prev, thumbnail_url: e.target.value }))}
                    placeholder="https://..."
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Content (optional)</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="Additional tutorial content or notes"
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="order_index">Order Index</Label>
                  <Input
                    id="order_index"
                    type="number"
                    value={formData.order_index}
                    onChange={(e) => setFormData(prev => ({ ...prev, order_index: parseInt(e.target.value) || 0 }))}
                  />
                </div>
                <div className="flex items-center justify-between pt-6">
                  <Label htmlFor="is_published">Published</Label>
                  <Switch
                    id="is_published"
                    checked={formData.is_published}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_published: checked }))}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSave} disabled={saving}>
                  {saving && <Loader2 size={16} className="mr-2 animate-spin" />}
                  {editingTutorial ? 'Update' : 'Create'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tutorials.map((tutorial) => (
          <div
            key={tutorial.id}
            className="glass rounded-xl overflow-hidden"
          >
            <div className="h-32 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center relative">
              {tutorial.thumbnail_url ? (
                <img
                  src={tutorial.thumbnail_url}
                  alt={tutorial.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <Play className="w-10 h-10 text-primary/50" />
              )}
            </div>
            <div className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Badge className={getLevelColor(tutorial.level)}>
                  {tutorial.level}
                </Badge>
                {tutorial.duration && (
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {tutorial.duration}
                  </span>
                )}
                <Badge variant={tutorial.is_published ? 'default' : 'secondary'} className="ml-auto">
                  {tutorial.is_published ? 'Published' : 'Draft'}
                </Badge>
              </div>
              <h3 className="font-semibold mb-1 line-clamp-1">{tutorial.title}</h3>
              <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                {tutorial.description}
              </p>
              {tutorial.author && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground mb-3">
                  <User className="w-3 h-3" />
                  {tutorial.author}
                </div>
              )}
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openEditDialog(tutorial)}
                >
                  <Pencil size={14} className="mr-1" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => togglePublished(tutorial)}
                >
                  {tutorial.is_published ? 'Unpublish' : 'Publish'}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-destructive hover:text-destructive ml-auto"
                  onClick={() => handleDelete(tutorial.id)}
                >
                  <Trash2 size={14} />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {tutorials.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <Play className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>No tutorials yet. Create your first tutorial!</p>
        </div>
      )}
    </div>
  );
};
