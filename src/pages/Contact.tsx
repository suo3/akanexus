import { Mail, MapPin, Clock, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";

const Contact = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast({
      title: "Message sent!",
      description: "We'll get back to you as soon as possible.",
    });
    
    setIsSubmitting(false);
    (e.target as HTMLFormElement).reset();
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Contact Us"
        description="Get in touch with Akanexus for custom frontend development, component requests, or partnership inquiries. We'd love to hear from you."
        keywords="contact Akanexus, frontend development inquiry, custom development, get in touch"
      />
      <Navbar />
      
      <main className="pt-24 pb-16">
        <section className="relative py-16 overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-3xl" />
          </div>

          <div className="container relative z-10 px-6">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6">
                Get in <span className="text-gradient">Touch</span>
              </h1>
              <p className="text-lg text-muted-foreground">
                Have a question or want to work together? We'd love to hear from you. Fill out the form below and we'll get back to you as soon as possible.
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
              {/* Contact Form */}
              <div className="glass rounded-2xl p-8">
                <h2 className="text-xl font-semibold mb-6">Send us a message</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium mb-2">
                        Name
                      </label>
                      <Input
                        id="name"
                        name="name"
                        placeholder="Your name"
                        required
                        maxLength={100}
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium mb-2">
                        Email
                      </label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="you@example.com"
                        required
                        maxLength={255}
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium mb-2">
                      Subject
                    </label>
                    <Input
                      id="subject"
                      name="subject"
                      placeholder="What's this about?"
                      required
                      maxLength={200}
                    />
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium mb-2">
                      Message
                    </label>
                    <Textarea
                      id="message"
                      name="message"
                      placeholder="Tell us more about your project..."
                      rows={5}
                      required
                      maxLength={2000}
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? (
                      "Sending..."
                    ) : (
                      <>
                        Send Message
                        <Send className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </Button>
                </form>
              </div>

              {/* Contact Info */}
              <div className="space-y-6">
                <div className="glass rounded-xl p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <Mail className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Email Us</h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        For general inquiries and support
                      </p>
                      <a href="mailto:hello@akanexus.com" className="text-primary hover:underline">
                        hello@akanexus.com
                      </a>
                    </div>
                  </div>
                </div>

                <div className="glass rounded-xl p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <MapPin className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Location</h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        Our headquarters
                      </p>
                      <p className="text-muted-foreground text-sm">
                        Remote-first company<br />
                        Serving clients worldwide
                      </p>
                    </div>
                  </div>
                </div>

                <div className="glass rounded-xl p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <Clock className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Response Time</h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        We typically respond within
                      </p>
                      <p className="text-primary font-medium">24-48 hours</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Contact;
