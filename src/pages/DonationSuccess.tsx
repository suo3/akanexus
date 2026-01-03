import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle, Download, ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const DonationSuccess = () => {
  const [searchParams] = useSearchParams();
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  
  const itemName = searchParams.get('item') || 'your item';
  const itemType = searchParams.get('type') || 'component';
  const itemId = searchParams.get('id') || '';

  // Auto-download on mount if we have the item details
  useEffect(() => {
    const pendingDownload = sessionStorage.getItem('pendingDownload');
    if (pendingDownload) {
      const { itemId: storedId, itemType: storedType } = JSON.parse(pendingDownload);
      if (storedId) {
        handleDownload(storedId, storedType);
        sessionStorage.removeItem('pendingDownload');
      }
    } else if (itemId) {
      handleDownload(itemId, itemType);
    }
  }, []);

  const handleDownload = async (id: string, type: string) => {
    if (!id) {
      toast.error('Download information missing');
      return;
    }

    setIsDownloading(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-download', {
        body: { itemId: id, itemType: type }
      });

      if (error) throw error;

      if (data?.zipData && data?.fileName) {
        // Convert base64 to blob and download
        const byteCharacters = atob(data.zipData);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: 'application/zip' });
        
        // Create download link
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = data.fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        setDownloaded(true);
        toast.success('Download started!', {
          description: 'Check your downloads folder.'
        });
      }
    } catch (error) {
      console.error('Error downloading:', error);
      toast.error('Failed to download', {
        description: 'Please try again.'
      });
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-32 pb-20 px-6">
        <div className="max-w-lg mx-auto text-center">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-primary" />
          </div>
          
          <h1 className="text-3xl font-bold text-foreground mb-4">
            Thank You for Your Donation!
          </h1>
          
          <p className="text-muted-foreground mb-8">
            Your generous support helps us continue creating free resources for the community. 
            {downloaded 
              ? ` Your download for ${itemName} has started.`
              : ` Your download for ${itemName} is ready.`
            }
          </p>

          <div className="space-y-4">
            <Button 
              variant="hero" 
              size="lg" 
              className="w-full gap-2"
              onClick={() => handleDownload(itemId, itemType)}
              disabled={isDownloading}
            >
              {isDownloading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Preparing Download...
                </>
              ) : downloaded ? (
                <>
                  <Download size={18} />
                  Download Again
                </>
              ) : (
                <>
                  <Download size={18} />
                  Download {itemName}
                </>
              )}
            </Button>
            
            <Button variant="outline" size="lg" asChild className="w-full gap-2">
              <Link to={itemType === 'component' ? '/gallery' : '/templates'}>
                <ArrowLeft size={18} />
                Back to {itemType === 'component' ? 'Gallery' : 'Templates'}
              </Link>
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default DonationSuccess;
