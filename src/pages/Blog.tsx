import { useState, useEffect } from "react";
import { Calendar, User, ArrowUp, Flag, Plus, ExternalLink, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { CATEGORIES, getCategoryColorClasses } from "@/lib/categoryColors";

interface BlogLink {
  id: string;
  title: string;
  url: string;
  description: string | null;
  category: string;
  upvotes: number;
  flags: number;
  submitted_by: string | null;
  created_at: string;
}

// Generate a simple hash for vote tracking
const getVoterHash = () => {
  let hash = localStorage.getItem("voter_hash");
  if (!hash) {
    hash = Math.random().toString(36).substring(2) + Date.now().toString(36);
    localStorage.setItem("voter_hash", hash);
  }
  return hash;
};

const Blog = () => {
  const [blogs, setBlogs] = useState<BlogLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [votedPosts, setVotedPosts] = useState<Set<string>>(new Set());
  const [flaggedPosts, setFlaggedPosts] = useState<Set<string>>(new Set());
  
  // Form state
  const [newTitle, setNewTitle] = useState("");
  const [newUrl, setNewUrl] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newCategory, setNewCategory] = useState("General");
  const [newSubmittedBy, setNewSubmittedBy] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchBlogs();
    loadUserVotes();
  }, []);

  const fetchBlogs = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("blog_links" as any)
      .select("*")
      .order("upvotes", { ascending: false });
    
    if (error) {
      toast.error("Failed to load blog links");
      console.error(error);
    } else {
      setBlogs((data as BlogLink[]) || []);
    }
    setLoading(false);
  };

  const loadUserVotes = async () => {
    const voterHash = getVoterHash();
    const { data } = await supabase
      .from("blog_votes" as any)
      .select("blog_id, vote_type")
      .eq("voter_hash", voterHash);
    
    if (data) {
      const voted = new Set<string>();
      const flagged = new Set<string>();
      (data as any[]).forEach((vote) => {
        if (vote.vote_type === "upvote") voted.add(vote.blog_id);
        if (vote.vote_type === "flag") flagged.add(vote.blog_id);
      });
      setVotedPosts(voted);
      setFlaggedPosts(flagged);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newTitle.trim() || !newUrl.trim()) {
      toast.error("Title and URL are required");
      return;
    }

    // Basic URL validation
    try {
      new URL(newUrl);
    } catch {
      toast.error("Please enter a valid URL");
      return;
    }

    setSubmitting(true);
    
    const { error } = await supabase.from("blog_links" as any).insert({
      title: newTitle.trim(),
      url: newUrl.trim(),
      description: newDescription.trim() || null,
      category: newCategory,
      submitted_by: newSubmittedBy.trim() || null,
    } as any);

    if (error) {
      toast.error("Failed to submit link");
      console.error(error);
    } else {
      toast.success("Link submitted successfully!");
      setNewTitle("");
      setNewUrl("");
      setNewDescription("");
      setNewCategory("General");
      setNewSubmittedBy("");
      setIsDialogOpen(false);
      fetchBlogs();
    }
    setSubmitting(false);
  };

  const handleUpvote = async (blogId: string) => {
    if (votedPosts.has(blogId)) {
      toast.info("You've already upvoted this link");
      return;
    }

    const voterHash = getVoterHash();
    
    // Insert vote record
    const { error: voteError } = await supabase.from("blog_votes" as any).insert({
      blog_id: blogId,
      voter_hash: voterHash,
      vote_type: "upvote",
    } as any);

    if (voteError) {
      if (voteError.code === "23505") {
        toast.info("You've already upvoted this link");
      } else {
        toast.error("Failed to upvote");
      }
      return;
    }

    // Increment upvotes using RPC
    await (supabase.rpc as any)("increment_blog_upvotes", { _blog_id: blogId });
    
    setVotedPosts((prev) => new Set([...prev, blogId]));
    setBlogs((prev) =>
      prev.map((b) => (b.id === blogId ? { ...b, upvotes: b.upvotes + 1 } : b))
    );
    toast.success("Upvoted!");
  };

  const handleFlag = async (blogId: string) => {
    if (flaggedPosts.has(blogId)) {
      toast.info("You've already flagged this link");
      return;
    }

    const voterHash = getVoterHash();
    
    const { error: voteError } = await supabase.from("blog_votes" as any).insert({
      blog_id: blogId,
      voter_hash: voterHash,
      vote_type: "flag",
    } as any);

    if (voteError) {
      if (voteError.code === "23505") {
        toast.info("You've already flagged this link");
      } else {
        toast.error("Failed to flag");
      }
      return;
    }

    await (supabase.rpc as any)("increment_blog_flags", { _blog_id: blogId });
    
    setFlaggedPosts((prev) => new Set([...prev, blogId]));
    toast.success("Flagged for review");
  };

  const filteredBlogs = selectedCategory === "All" 
    ? blogs 
    : blogs.filter((b) => b.category === selectedCategory);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

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
                Community <span className="text-gradient">Links</span>
              </h1>
              <p className="text-lg text-muted-foreground mb-8">
                Share and discover interesting articles, tutorials, and resources. Upvote the best content!
              </p>
              
              {/* Submit Button */}
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="lg" className="gap-2">
                    <Plus className="w-5 h-5" />
                    Share a Link
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Share a Link</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                    <div>
                      <Input
                        placeholder="Title *"
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        maxLength={100}
                        required
                      />
                    </div>
                    <div>
                      <Input
                        placeholder="URL *"
                        type="url"
                        value={newUrl}
                        onChange={(e) => setNewUrl(e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Textarea
                        placeholder="Description (optional)"
                        value={newDescription}
                        onChange={(e) => setNewDescription(e.target.value)}
                        maxLength={300}
                        rows={3}
                      />
                    </div>
                    <div>
                      <Select value={newCategory} onValueChange={setNewCategory}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {CATEGORIES.filter((c) => c !== "All").map((cat) => (
                            <SelectItem key={cat} value={cat}>
                              {cat}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Input
                        placeholder="Your name (optional)"
                        value={newSubmittedBy}
                        onChange={(e) => setNewSubmittedBy(e.target.value)}
                        maxLength={50}
                      />
                    </div>
                    <Button type="submit" className="w-full" disabled={submitting}>
                      {submitting ? "Submitting..." : "Submit Link"}
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              {CATEGORIES.map((cat) => (
                <Button
                  key={cat}
                  variant={selectedCategory === cat ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(cat)}
                  className="gap-1"
                >
                  {cat === "All" && <Filter className="w-3 h-3" />}
                  {cat}
                </Button>
              ))}
            </div>

            {/* Blog Grid */}
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto" />
              </div>
            ) : filteredBlogs.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No links found. Be the first to share!</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                {filteredBlogs.map((post) => (
                  <article
                    key={post.id}
                    className="group glass rounded-xl overflow-hidden hover:border-primary/50 transition-all duration-300"
                  >
                    <div className="p-6">
                      <div className="flex items-center gap-2 mb-3">
                        <Badge 
                          variant="outline" 
                          className={getCategoryColorClasses(post.category)}
                        >
                          {post.category}
                        </Badge>
                      </div>
                      
                      <a 
                        href={post.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="block"
                      >
                        <h2 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors flex items-start gap-2">
                          {post.title}
                          <ExternalLink className="w-4 h-4 flex-shrink-0 mt-1 opacity-50" />
                        </h2>
                      </a>
                      
                      {post.description && (
                        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                          {post.description}
                        </p>
                      )}
                      
                      <div className="flex items-center justify-between pt-4 border-t border-border/50">
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          {post.submitted_by && (
                            <span className="flex items-center gap-1">
                              <User className="w-3 h-3" />
                              {post.submitted_by}
                            </span>
                          )}
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {formatDate(post.created_at)}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleUpvote(post.id)}
                            className={`h-8 px-2 gap-1 ${
                              votedPosts.has(post.id) ? "text-primary" : ""
                            }`}
                          >
                            <ArrowUp className="w-4 h-4" />
                            <span className="text-xs">{post.upvotes}</span>
                          </Button>
                          
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleFlag(post.id)}
                            className={`h-8 px-2 ${
                              flaggedPosts.has(post.id) ? "text-destructive" : "text-muted-foreground"
                            }`}
                          >
                            <Flag className="w-4 h-4" />
                          </Button>
                        </div>
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

export default Blog;
