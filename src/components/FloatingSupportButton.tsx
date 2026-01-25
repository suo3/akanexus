import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, X, Sparkles } from 'lucide-react';
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
        initial={{ opacity: 0, scale: 0.5, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ delay: 2, duration: 0.5, type: 'spring' }}
      >
        <AnimatePresence mode="wait">
          {isExpanded ? (
            <motion.div
              key="expanded"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="relative"
            >
              {/* Glow effect */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-pink-500 via-primary to-purple-500 blur-lg opacity-60 animate-pulse" />
              
              {/* Main button container */}
              <div className="relative flex items-center gap-2 bg-gradient-to-r from-pink-500 via-primary to-purple-600 rounded-full shadow-2xl overflow-hidden">
                {/* Shimmer effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
                
                {/* Close button */}
                <button
                  onClick={() => setIsExpanded(false)}
                  className="p-2 pl-3 hover:bg-white/10 transition-colors"
                  aria-label="Minimize"
                >
                  <X className="h-4 w-4 text-white/70" />
                </button>
                
                {/* Main action */}
                <button
                  onClick={() => setShowDialog(true)}
                  className="flex items-center gap-2 pr-5 py-3 font-semibold text-white"
                >
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 1 }}
                  >
                    <Heart className="h-5 w-5 fill-white" />
                  </motion.div>
                  <span>Support Us</span>
                  <Sparkles className="h-4 w-4 text-yellow-300" />
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.button
              key="collapsed"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={() => setShowDialog(true)}
              onMouseEnter={() => setIsExpanded(true)}
              className="relative group"
            >
              {/* Glow effect */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 blur-md opacity-50 group-hover:opacity-80 transition-opacity" />
              
              {/* Button */}
              <div className="relative w-14 h-14 rounded-full bg-gradient-to-r from-pink-500 via-primary to-purple-600 flex items-center justify-center shadow-xl">
                <motion.div
                  animate={{ scale: [1, 1.15, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 0.5 }}
                >
                  <Heart className="h-6 w-6 text-white fill-white" />
                </motion.div>
              </div>
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
