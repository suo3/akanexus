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
import { Heart, Coffee, ShieldCheck, Loader2, Terminal } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface SupportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  toolName?: string;
}

const donationTiers = [
  { amount: 5, label: 'COFFEE', icon: Coffee, description: 'Utility Fluid' },
  { amount: 15, label: 'SUPPORT', icon: Heart, description: 'Core Resource' },
  { amount: 50, label: 'CHAMPION', icon: ShieldCheck, description: 'System Override' },
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
        toast.success('Redirecting to secure gateway...', {
          description: 'Access terminal 042 for completion.'
        });
        onOpenChange(false);
      }
    } catch (error) {
      console.error('Error processing donation:', error);
      toast.error('Sync failed', {
        description: 'Connection refused by remote host.'
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
      <DialogContent className="sm:max-w-md bg-background border border-border p-0 overflow-hidden rounded-none">
        <div className="bg-muted px-6 py-2 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Terminal className="w-3 h-3 text-primary" />
            <span className="mono-label text-[10px] opacity-60">sys.admin/contribution/v1.0</span>
          </div>
        </div>

        <div className="p-6">
          <DialogHeader className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 border border-primary flex items-center justify-center bg-primary/5">
                <Heart className="w-6 h-6 text-primary" />
              </div>
              <div>
                <DialogTitle className="text-2xl font-bold tracking-tighter uppercase mb-0.5">
                  Secure Support
                </DialogTitle>
                <DialogDescription className="mono-label text-[10px] text-muted-foreground uppercase tracking-widest">
                  // Target: {toolName}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-8">
            {/* Donation Tiers */}
            <div className="grid grid-cols-3 gap-2">
              {donationTiers.map((tier) => (
                <button
                  key={tier.amount}
                  onClick={() => {
                    setSelectedAmount(tier.amount);
                    setCustomAmount('');
                  }}
                  className={`p-4 border transition-all text-left relative group ${selectedAmount === tier.amount && !customAmount
                      ? 'border-primary bg-primary/5'
                      : 'border-border bg-muted/30 hover:border-primary/50'
                    }`}
                >
                  {selectedAmount === tier.amount && !customAmount && (
                    <div className="absolute top-0 right-0 w-2 h-2 bg-primary" />
                  )}
                  <tier.icon size={16} className={`${selectedAmount === tier.amount && !customAmount ? 'text-primary' : 'text-muted-foreground'} mb-4`} />
                  <span className="font-mono text-lg font-bold block leading-none mb-1">
                    ${tier.amount}
                  </span>
                  <p className="mono-label text-[8px] opacity-60 uppercase">{tier.label}</p>
                </button>
              ))}
            </div>

            {/* Custom Amount */}
            <div className="space-y-2">
              <label className="mono-label text-[10px] text-muted-foreground uppercase tracking-widest pl-1">
                [ Manual Override ]
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-mono text-muted-foreground">$</span>
                <Input
                  type="number"
                  min="1"
                  placeholder="0.00"
                  value={customAmount}
                  onChange={(e) => {
                    setCustomAmount(e.target.value);
                  }}
                  className="pl-8 bg-muted border-border font-mono rounded-none focus-visible:ring-1 focus-visible:ring-primary"
                />
              </div>
            </div>

            {/* Action Button */}
            <div className="pt-2">
              <Button
                onClick={handleDonate}
                className={`w-full gap-3 py-6 font-bold uppercase tracking-widest rounded-none border ${displayAmount > 0
                    ? 'bg-foreground text-background hover:bg-foreground/90'
                    : 'bg-muted text-muted-foreground cursor-not-allowed'
                  }`}
                disabled={isLoading || displayAmount <= 0}
              >
                {isLoading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    [ INITIALIZING... ]
                  </>
                ) : (
                  <>
                    <Heart size={18} />
                    Execute Contribution (${displayAmount})
                  </>
                )}
              </Button>
            </div>

            <div className="pt-2 border-t border-dashed border-border">
              <p className="mono-label text-[8px] text-center text-muted-foreground uppercase leading-relaxed">
                Thank you for enabling independent tool development. <br /> All fragments go towards system maintenance.
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SupportDialog;
