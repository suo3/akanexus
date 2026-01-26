import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { Trash2, Flag, Eye, ExternalLink } from "lucide-react";

interface Tutorial {
  id: string;
  title: string;
  url: string | null;
  video_url: string | null;
  description: string | null;
  category: string;
  level: string;
  upvotes: number;
  flags: number;
  is_flagged: boolean;
  is_removed: boolean;
  submitted_by: string | null;
  created_at: string;
}

const CommunityTutorialManager = () => {
  const [tutorials, setTutorials] = useState<Tutorial[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "flagged">("all");

  useEffect(() => {
    fetchTutorials();
  }, []);

  const fetchTutorials = async () => {
    setLoading(true);
    const { data, error } = await (supabase
      .from("tutorials") as any)
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Failed to load tutorials");
      console.error(error);
    } else {
      setTutorials(data || []);
    }
    setLoading(false);
  };

  const handleRemove = async (id: string) => {
    const { error } = await (supabase.from("tutorials") as any)
      .update({ is_removed: true })
      .eq("id", id);

    if (error) {
      toast.error("Failed to remove tutorial");
      console.error(error);
    } else {
      toast.success("Tutorial removed");
      setTutorials((prev) => prev.map((t) => (t.id === id ? { ...t, is_removed: true } : t)));
    }
  };

  const handleRestore = async (id: string) => {
    const { error } = await (supabase.from("tutorials") as any)
      .update({ is_removed: false, is_flagged: false, flags: 0 })
      .eq("id", id);

    if (error) {
      toast.error("Failed to restore tutorial");
      console.error(error);
    } else {
      toast.success("Tutorial restored");
      setTutorials((prev) =>
        prev.map((t) => (t.id === id ? { ...t, is_removed: false, is_flagged: false, flags: 0 } : t))
      );
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Permanently delete this tutorial?")) return;

    const { error } = await (supabase
      .from("tutorials") as any)
      .delete()
      .eq("id", id);

    if (error) {
      toast.error("Failed to delete tutorial");
      console.error(error);
    } else {
      toast.success("Tutorial deleted permanently");
      setTutorials((prev) => prev.filter((t) => t.id !== id));
    }
  };

  const filteredTutorials =
    filter === "flagged"
      ? tutorials.filter((t) => t.is_flagged || t.flags > 0)
      : tutorials;

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
        <h2 className="text-2xl font-bold">Community Tutorials</h2>
        <div className="flex gap-2">
          <Button
            variant={filter === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("all")}
          >
            All ({tutorials.length})
          </Button>
          <Button
            variant={filter === "flagged" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("flagged")}
            className="gap-1"
          >
            <Flag className="w-4 h-4" />
            Flagged ({tutorials.filter((t) => t.is_flagged || t.flags > 0).length})
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-8">Loading...</div>
      ) : filteredTutorials.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">No tutorials found</div>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Level</TableHead>
                <TableHead>Upvotes</TableHead>
                <TableHead>Flags</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTutorials.map((tutorial) => (
                <TableRow key={tutorial.id} className={tutorial.is_removed ? "opacity-50" : ""}>
                  <TableCell>
                    <div className="max-w-xs">
                      <a
                        href={tutorial.url || tutorial.video_url || "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium hover:text-primary flex items-center gap-1"
                      >
                        {tutorial.title}
                        <ExternalLink className="w-3 h-3" />
                      </a>
                      {tutorial.submitted_by && (
                        <span className="text-xs text-muted-foreground">
                          by {tutorial.submitted_by}
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{tutorial.category}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{tutorial.level}</Badge>
                  </TableCell>
                  <TableCell>{tutorial.upvotes}</TableCell>
                  <TableCell>
                    <span className={tutorial.flags > 0 ? "text-destructive font-medium" : ""}>
                      {tutorial.flags}
                    </span>
                  </TableCell>
                  <TableCell>
                    {tutorial.is_removed ? (
                      <Badge variant="destructive">Removed</Badge>
                    ) : tutorial.is_flagged ? (
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
                    {formatDate(tutorial.created_at)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      {tutorial.is_removed ? (
                        <>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRestore(tutorial.id)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(tutorial.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </>
                      ) : (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemove(tutorial.id)}
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

export default CommunityTutorialManager;
