import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Heart, Coffee, Trophy, Loader2, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface SupportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  toolName?: string;
}

const donationTiers = [
  { amount: 5, label: 'Coffee', icon: Coffee, description: 'Buy us a coffee' },
  { amount: 15, label: 'Supporter', icon: Heart, description: 'Show your support' },
  { amount: 50, label: 'Champion', icon: Trophy, description: 'Champion supporter' },
];

const SupportDialog = ({ open, onOpenChange, toolName = 'this tool' }: SupportDialogProps) => {
  const [selectedAmount, setSelectedAmount] = useState<number>(5);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const handleDonate = async () => {
    const finalAmount = customAmount ? parseFloat(customAmount) : selectedAmount;
    
    if (!finalAmount || finalAmount <= 0) {
      toast.error('Please select or enter an amount');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('create-donation', {
        body: { 
          amount: finalAmount, 
          itemName: toolName,
          itemId: 'mastering-tool',
          itemType: 'tool'
        }
      });

      if (error) throw error;

      if (data?.url) {
        window.open(data.url, '_blank');
        toast.success('Redirecting to checkout...', {
          description: 'Complete your donation in the new tab.'
        });
        onOpenChange(false);
      }
    } catch (error) {
      console.error('Error processing donation:', error);
      toast.error('Failed to process donation', {
        description: 'Please try again later.'
      });
    } finally {
      setIsLoading(false);
      setSelectedAmount(5);
      setCustomAmount('');
    }
  };

  const displayAmount = customAmount ? parseFloat(customAmount) || 0 : selectedAmount;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-background border-border">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary" />
            </div>
            <DialogTitle className="text-xl text-foreground">
              Support {toolName}
            </DialogTitle>
          </div>
          <DialogDescription className="text-muted-foreground">
            This tool is completely free to use. If you find it valuable, 
            consider supporting its development with a donation.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Donation Tiers */}
          <div className="grid grid-cols-3 gap-3">
            {donationTiers.map((tier) => (
              <button
                key={tier.amount}
                onClick={() => {
                  setSelectedAmount(tier.amount);
                  setCustomAmount('');
                }}
                className={`p-4 rounded-xl border transition-all text-center ${
                  selectedAmount === tier.amount && !customAmount
                    ? 'border-primary bg-primary/10'
                    : 'border-border bg-secondary/50 hover:border-primary/50'
                }`}
              >
                <tier.icon size={24} className="text-primary mx-auto mb-2" />
                <span className="font-bold text-foreground block">
                  ${tier.amount}
                </span>
                <p className="text-xs text-muted-foreground mt-1">{tier.label}</p>
              </button>
            ))}
          </div>

          {/* Custom Amount */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Or enter a custom amount
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
              <Input
                type="number"
                min="1"
                placeholder="Enter amount"
                value={customAmount}
                onChange={(e) => {
                  setCustomAmount(e.target.value);
                }}
                className="pl-8 bg-secondary border-border"
              />
            </div>
          </div>

          {/* Action Button */}
          <Button 
            onClick={handleDonate} 
            className="w-full gap-2"
            variant="hero"
            disabled={isLoading || displayAmount <= 0}
          >
            {isLoading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Heart size={18} />
                Donate ${displayAmount}
              </>
            )}
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            Your support helps us keep this tool free and add new features.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SupportDialog;
