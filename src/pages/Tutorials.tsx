import { useEffect, useState } from "react";
import { Play, Clock, User, Loader2, ThumbsUp, Flag, Plus, ExternalLink, X } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

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
  url: string | null;
  upvotes: number;
  flags: number;
  category: string;
  submitted_by: string | null;
}

const CATEGORIES = [
  "All",
  "React",
  "JavaScript",
  "TypeScript",
  "Python",
  "Frontend",
  "Backend",
  "DevOps",
  "Mobile",
  "AI/ML",
  "General",
];

const CATEGORY_COLORS: Record<string, string> = {
  React: "bg-cyan-500/10 text-cyan-400 border-cyan-500/30",
  JavaScript: "bg-yellow-500/10 text-yellow-400 border-yellow-500/30",
  TypeScript: "bg-blue-500/10 text-blue-400 border-blue-500/30",
  Python: "bg-green-500/10 text-green-400 border-green-500/30",
  Frontend: "bg-purple-500/10 text-purple-400 border-purple-500/30",
  Backend: "bg-orange-500/10 text-orange-400 border-orange-500/30",
  DevOps: "bg-red-500/10 text-red-400 border-red-500/30",
  Mobile: "bg-pink-500/10 text-pink-400 border-pink-500/30",
  "AI/ML": "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
  General: "bg-muted text-muted-foreground border-border",
};

const getLevelColor = (level: string) => {
  switch (level) {
    case "Beginner":
      return "bg-green-500/10 text-green-500";
    case "Intermediate":
      return "bg-yellow-500/10 text-yellow-500";
    case "Advanced":
      return "bg-red-500/10 text-red-500";
    default:
      return "bg-primary/10 text-primary";
  }
};

const getVoterHash = () => {
  let hash = localStorage.getItem("voter_hash");
  if (!hash) {
    hash = crypto.randomUUID();
    localStorage.setItem("voter_hash", hash);
  }
  return hash;
};

const Tutorials = () => {
  const [tutorials, setTutorials] = useState<Tutorial[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [userVotes, setUserVotes] = useState<Set<string>>(new Set());
  const [userFlags, setUserFlags] = useState<Set<string>>(new Set());
  const [dialogOpen, setDialogOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    url: "",
    description: "",
    category: "General",
    level: "Beginner",
    submitted_by: "",
  });

  useEffect(() => {
    fetchTutorials();
    fetchUserVotes();
  }, []);

  const fetchTutorials = async () => {
    const { data, error } = await (supabase
      .from("tutorials") as any)
      .select("id, title, slug, description, duration, level, author, thumbnail_url, video_url, url, upvotes, flags, category, submitted_by")
      .eq("is_published", true)
      .eq("is_removed", false)
      .order("upvotes", { ascending: false });

    if (!error && data) {
      setTutorials(data);
    }
    setLoading(false);
  };

  const fetchUserVotes = async () => {
    const voterHash = getVoterHash();
    const { data } = await (supabase
      .from("tutorial_votes") as any)
      .select("tutorial_id, vote_type")
      .eq("voter_hash", voterHash);

    if (data) {
      const votes = new Set<string>();
      const flags = new Set<string>();
      data.forEach((v: { tutorial_id: string; vote_type: string }) => {
        if (v.vote_type === "upvote") votes.add(v.tutorial_id);
        if (v.vote_type === "flag") flags.add(v.tutorial_id);
      });
      setUserVotes(votes);
      setUserFlags(flags);
    }
  };

  const handleUpvote = async (tutorialId: string) => {
    if (userVotes.has(tutorialId)) {
      toast.info("You've already upvoted this tutorial");
      return;
    }

    const voterHash = getVoterHash();
    const { error: voteError } = await (supabase
      .from("tutorial_votes") as any)
      .insert({ tutorial_id: tutorialId, voter_hash: voterHash, vote_type: "upvote" });

    if (voteError) {
      if (voteError.code === "23505") {
        toast.info("You've already upvoted this tutorial");
      } else {
        toast.error("Failed to upvote");
      }
      return;
    }

    await (supabase.rpc as any)("increment_tutorial_upvotes", { _tutorial_id: tutorialId });

    setUserVotes((prev) => new Set([...prev, tutorialId]));
    setTutorials((prev) =>
      prev.map((t) => (t.id === tutorialId ? { ...t, upvotes: t.upvotes + 1 } : t))
    );
    toast.success("Upvoted!");
  };

  const handleFlag = async (tutorialId: string) => {
    if (userFlags.has(tutorialId)) {
      toast.info("You've already flagged this tutorial");
      return;
    }

    const voterHash = getVoterHash();
    const { error: voteError } = await (supabase
      .from("tutorial_votes") as any)
      .insert({ tutorial_id: tutorialId, voter_hash: voterHash, vote_type: "flag" });

    if (voteError) {
      if (voteError.code === "23505") {
        toast.info("You've already flagged this tutorial");
      } else {
        toast.error("Failed to flag");
      }
      return;
    }

    await (supabase.rpc as any)("increment_tutorial_flags", { _tutorial_id: tutorialId });

    setUserFlags((prev) => new Set([...prev, tutorialId]));
    toast.success("Flagged for review");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.url.trim()) {
      toast.error("Title and URL are required");
      return;
    }

    setSubmitting(true);
    const slug = formData.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

    const { error } = await (supabase
      .from("tutorials") as any)
      .insert({
        title: formData.title.trim(),
        url: formData.url.trim(),
        video_url: formData.url.trim(),
        description: formData.description.trim() || null,
        category: formData.category,
        level: formData.level,
        submitted_by: formData.submitted_by.trim() || null,
        slug: slug + "-" + Date.now(),
        is_published: true,
      });

    setSubmitting(false);

    if (error) {
      toast.error("Failed to submit tutorial");
      console.error(error);
      return;
    }

    toast.success("Tutorial submitted!");
    setFormData({ title: "", url: "", description: "", category: "General", level: "Beginner", submitted_by: "" });
    setDialogOpen(false);
    fetchTutorials();
  };

  const filteredTutorials =
    selectedCategory === "All"
      ? tutorials
      : tutorials.filter((t) => t.category === selectedCategory);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-16">
        <section className="relative py-16 overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-3xl" />
          </div>

          <div className="container relative z-10 px-6">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6">
                <span className="text-gradient">Community Tutorials</span>
              </h1>
              <p className="text-lg text-muted-foreground mb-8">
                Discover and share tutorials from across the web. Upvote the best content and help others learn.
              </p>

              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="lg" className="gap-2">
                    <Plus className="w-5 h-5" />
                    Share a Tutorial
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Share a Tutorial</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                      placeholder="Tutorial title *"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      required
                    />
                    <Input
                      placeholder="Tutorial URL *"
                      type="url"
                      value={formData.url}
                      onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                      required
                    />
                    <Textarea
                      placeholder="Brief description (optional)"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={3}
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <Select
                        value={formData.category}
                        onValueChange={(v) => setFormData({ ...formData, category: v })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Category" />
                        </SelectTrigger>
                        <SelectContent>
                          {CATEGORIES.filter((c) => c !== "All").map((cat) => (
                            <SelectItem key={cat} value={cat}>
                              {cat}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Select
                        value={formData.level}
                        onValueChange={(v) => setFormData({ ...formData, level: v })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Beginner">Beginner</SelectItem>
                          <SelectItem value="Intermediate">Intermediate</SelectItem>
                          <SelectItem value="Advanced">Advanced</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Input
                      placeholder="Your name (optional)"
                      value={formData.submitted_by}
                      onChange={(e) => setFormData({ ...formData, submitted_by: e.target.value })}
                    />
                    <Button type="submit" className="w-full" disabled={submitting}>
                      {submitting ? <Loader2 className="animate-spin mr-2" /> : null}
                      Submit Tutorial
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            {/* Category Filters */}
            <div className="flex flex-wrap justify-center gap-2 mb-12">
              {CATEGORIES.map((cat) => (
                <Button
                  key={cat}
                  variant={selectedCategory === cat ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(cat)}
                  className="rounded-full"
                >
                  {cat}
                </Button>
              ))}
            </div>

            {/* Tutorials Grid */}
            {loading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="animate-spin text-primary" size={32} />
              </div>
            ) : filteredTutorials.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Play className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No tutorials in this category yet. Be the first to share one!</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                {filteredTutorials.map((tutorial) => (
                  <article
                    key={tutorial.id}
                    className="group glass rounded-xl overflow-hidden hover:border-primary/50 transition-all duration-300"
                  >
                    <a
                      href={tutorial.url || tutorial.video_url || "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block"
                    >
                      <div className="h-40 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center relative overflow-hidden">
                        {tutorial.thumbnail_url ? (
                          <img
                            src={tutorial.thumbnail_url}
                            alt={tutorial.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-2xl font-bold text-primary/30">
                            {tutorial.title.split(" ")[0]}
                          </span>
                        )}
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-background/50">
                          <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center">
                            <ExternalLink className="w-6 h-6 text-primary-foreground" />
                          </div>
                        </div>
                      </div>
                    </a>
                    <div className="p-6">
                      <div className="flex items-center gap-2 mb-3 flex-wrap">
                        <Badge
                          variant="outline"
                          className={CATEGORY_COLORS[tutorial.category] || CATEGORY_COLORS["General"]}
                        >
                          {tutorial.category}
                        </Badge>
                        <span className={`text-xs font-medium px-2 py-1 rounded ${getLevelColor(tutorial.level)}`}>
                          {tutorial.level}
                        </span>
                        {tutorial.duration && (
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {tutorial.duration}
                          </span>
                        )}
                      </div>
                      <h2 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors line-clamp-2">
                        {tutorial.title}
                      </h2>
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                        {tutorial.description}
                      </p>
                      {(tutorial.author || tutorial.submitted_by) && (
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
                          <User className="w-3 h-3" />
                          {tutorial.author || tutorial.submitted_by}
                        </div>
                      )}
                      <div className="flex items-center gap-2 pt-4 border-t border-border">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleUpvote(tutorial.id)}
                          className={`gap-1 ${userVotes.has(tutorial.id) ? "text-primary" : ""}`}
                        >
                          <ThumbsUp className="w-4 h-4" />
                          {tutorial.upvotes}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleFlag(tutorial.id)}
                          className={`gap-1 ${userFlags.has(tutorial.id) ? "text-destructive" : ""}`}
                        >
                          <Flag className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Tutorials;
