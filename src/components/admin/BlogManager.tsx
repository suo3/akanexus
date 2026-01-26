import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { Trash2, Flag, Eye, ExternalLink } from "lucide-react";

interface BlogLink {
  id: string;
  title: string;
  url: string;
  description: string | null;
  category: string;
  upvotes: number;
  flags: number;
  is_flagged: boolean;
  is_removed: boolean;
  submitted_by: string | null;
  created_at: string;
}

const BlogManager = () => {
  const [blogs, setBlogs] = useState<BlogLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "flagged">("all");

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    setLoading(true);
    // Admin needs to see all posts including removed ones
    const { data, error } = await supabase
      .from("blog_links" as any)
      .select("*")
      .order("created_at", { ascending: false });
    
    if (error) {
      toast.error("Failed to load blog links");
      console.error(error);
    } else {
      setBlogs((data as BlogLink[]) || []);
    }
    setLoading(false);
  };

  const handleRemove = async (id: string) => {
    const { error } = await (supabase.from("blog_links") as any)
      .update({ is_removed: true })
      .eq("id", id);

    if (error) {
      toast.error("Failed to remove link");
      console.error(error);
    } else {
      toast.success("Link removed");
      setBlogs((prev) => prev.map((b) => (b.id === id ? { ...b, is_removed: true } : b)));
    }
  };

  const handleRestore = async (id: string) => {
    const { error } = await (supabase.from("blog_links") as any)
      .update({ is_removed: false, is_flagged: false, flags: 0 })
      .eq("id", id);

    if (error) {
      toast.error("Failed to restore link");
      console.error(error);
    } else {
      toast.success("Link restored");
      setBlogs((prev) =>
        prev.map((b) => (b.id === id ? { ...b, is_removed: false, is_flagged: false, flags: 0 } : b))
      );
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Permanently delete this link?")) return;
    
    const { error } = await supabase
      .from("blog_links" as any)
      .delete()
      .eq("id", id);

    if (error) {
      toast.error("Failed to delete link");
      console.error(error);
    } else {
      toast.success("Link deleted permanently");
      setBlogs((prev) => prev.filter((b) => b.id !== id));
    }
  };

  const filteredBlogs = filter === "flagged" 
    ? blogs.filter((b) => b.is_flagged || b.flags > 0) 
    : blogs;

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Community Links</h2>
        <div className="flex gap-2">
          <Button
            variant={filter === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("all")}
          >
            All ({blogs.length})
          </Button>
          <Button
            variant={filter === "flagged" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("flagged")}
            className="gap-1"
          >
            <Flag className="w-4 h-4" />
            Flagged ({blogs.filter((b) => b.is_flagged || b.flags > 0).length})
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-8">Loading...</div>
      ) : filteredBlogs.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">No links found</div>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Upvotes</TableHead>
                <TableHead>Flags</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBlogs.map((blog) => (
                <TableRow key={blog.id} className={blog.is_removed ? "opacity-50" : ""}>
                  <TableCell>
                    <div className="max-w-xs">
                      <a
                        href={blog.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium hover:text-primary flex items-center gap-1"
                      >
                        {blog.title}
                        <ExternalLink className="w-3 h-3" />
                      </a>
                      {blog.submitted_by && (
                        <span className="text-xs text-muted-foreground">
                          by {blog.submitted_by}
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{blog.category}</Badge>
                  </TableCell>
                  <TableCell>{blog.upvotes}</TableCell>
                  <TableCell>
                    <span className={blog.flags > 0 ? "text-destructive font-medium" : ""}>
                      {blog.flags}
                    </span>
                  </TableCell>
                  <TableCell>
                    {blog.is_removed ? (
                      <Badge variant="destructive">Removed</Badge>
                    ) : blog.is_flagged ? (
                      <Badge variant="secondary" className="bg-amber-500/20 text-amber-400">
                        Flagged
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="bg-emerald-500/20 text-emerald-400">
                        Active
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {formatDate(blog.created_at)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      {blog.is_removed ? (
                        <>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRestore(blog.id)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(blog.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </>
                      ) : (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemove(blog.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default BlogManager;
