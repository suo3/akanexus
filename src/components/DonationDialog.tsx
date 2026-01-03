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
import { Heart, Download, Coffee, Trophy, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface DonationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  itemName: string;
  itemType: 'component' | 'template';
}

const donationTiers = [
  { amount: 0, label: 'Free', icon: Download, description: 'Download for free' },
  { amount: 5, label: 'Coffee', icon: Coffee, description: 'Buy us a coffee' },
  { amount: 15, label: 'Supporter', icon: Heart, description: 'Show your support' },
  { amount: 50, label: 'Champion', icon: Trophy, description: 'Champion supporter' },
];

const DonationDialog = ({ open, onOpenChange, itemName, itemType }: DonationDialogProps) => {
  const [selectedAmount, setSelectedAmount] = useState<number>(0);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const handleDownload = async () => {
    const finalAmount = customAmount ? parseFloat(customAmount) : selectedAmount;
    
    if (finalAmount > 0) {
      // Redirect to Stripe Checkout
      setIsLoading(true);
      try {
        const { data, error } = await supabase.functions.invoke('create-donation', {
          body: { amount: finalAmount, itemName, itemType }
        });

        if (error) throw error;

        if (data?.url) {
          window.open(data.url, '_blank');
          toast.success('Redirecting to checkout...', {
            description: 'Complete your donation in the new tab.'
          });
        }
      } catch (error) {
        console.error('Error creating donation:', error);
        toast.error('Failed to process donation', {
          description: 'Please try again later.'
        });
      } finally {
        setIsLoading(false);
      }
    } else {
      toast.success(`Downloading ${itemName}`, {
        description: 'Thank you for using our components!'
      });
    }
    
    onOpenChange(false);
    
    // Reset state
    setSelectedAmount(0);
    setCustomAmount('');
  };

  const displayAmount = customAmount ? parseFloat(customAmount) || 0 : selectedAmount;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-background border-border">
        <DialogHeader>
          <DialogTitle className="text-xl text-foreground">
            Download {itemName}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            This {itemType} is completely free. If you'd like to support our work, 
            consider leaving a donation.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Donation Tiers */}
          <div className="grid grid-cols-2 gap-3">
            {donationTiers.map((tier) => (
              <button
                key={tier.amount}
                onClick={() => {
                  setSelectedAmount(tier.amount);
                  setCustomAmount('');
                }}
                className={`p-4 rounded-xl border transition-all text-left ${
                  selectedAmount === tier.amount && !customAmount
                    ? 'border-primary bg-primary/10'
                    : 'border-border bg-secondary/50 hover:border-primary/50'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <tier.icon size={16} className="text-primary" />
                  <span className="font-semibold text-foreground">
                    {tier.amount === 0 ? 'Free' : `$${tier.amount}`}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">{tier.description}</p>
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
                min="0"
                placeholder="Enter amount"
                value={customAmount}
                onChange={(e) => {
                  setCustomAmount(e.target.value);
                  setSelectedAmount(0);
                }}
                className="pl-8 bg-secondary border-border"
              />
            </div>
          </div>

          {/* Action Button */}
          <Button 
            onClick={handleDownload} 
            className="w-full gap-2"
            variant="hero"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Processing...
              </>
            ) : displayAmount > 0 ? (
              <>
                <Heart size={18} />
                Donate ${displayAmount} & Download
              </>
            ) : (
              <>
                <Download size={18} />
                Download Free
              </>
            )}
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            Your support helps us create more free resources for the community.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DonationDialog;
