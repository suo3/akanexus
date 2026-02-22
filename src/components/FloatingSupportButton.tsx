import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, X, Terminal } from 'lucide-react';
import SupportDialog from './SupportDialog';

const FloatingSupportButton = () => {
  const [showDialog, setShowDialog] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  const [isDismissed, setIsDismissed] = useState(false);

  if (isDismissed) return null;

  return (
    <>
      {/* Floating Button */}
      <motion.div
        className="fixed bottom-6 right-6 z-50"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 2, duration: 0.5 }}
      >
        <AnimatePresence mode="wait">
          {isExpanded ? (
            <motion.div
              key="expanded"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative flex items-center bg-background border border-border overflow-hidden animate-glow-ring"
            >
              {/* Status indicator line */}
              <div className="absolute top-0 left-0 bottom-0 w-1 bg-primary" />

              {/* Close button */}
              <button
                onClick={() => setIsExpanded(false)}
                className="p-3 hover:bg-muted transition-colors border-r border-border"
                aria-label="Minimize"
              >
                <X className="h-4 w-4 text-muted-foreground" />
              </button>

              {/* Main action */}
              <button
                onClick={() => setShowDialog(true)}
                className="flex flex-col items-start gap-0.5 px-4 py-2 hover:bg-muted transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Heart className="h-3 w-3 text-primary" />
                  <span className="mono-label text-[10px] text-primary">System.Support</span>
                </div>
                <div className="flex items-center gap-2 font-bold text-foreground">
                  <span className="uppercase tracking-tighter">Support Us</span>
                  <Terminal className="h-3 w-3 text-muted-foreground" />
                </div>
              </button>

              {/* Version/ID Tag */}
              <div className="px-3 py-1 bg-muted border-l border-border h-full flex items-center">
                <span className="mono-label text-[8px] opacity-40">SR-71</span>
              </div>
            </motion.div>
          ) : (
            <motion.button
              key="collapsed"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              onClick={() => setShowDialog(true)}
              onMouseEnter={() => setIsExpanded(true)}
              className="relative group border border-border bg-background p-4 hover:border-primary transition-all overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-0.5 bg-primary/20 group-hover:bg-primary transition-colors" />
              <Heart className="h-5 w-5 text-primary" />
            </motion.button>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Support Dialog */}
      <SupportDialog
        open={showDialog}
        onOpenChange={setShowDialog}
        toolName="Akanexus"
      />
    </>
  );
};

export default FloatingSupportButton;
