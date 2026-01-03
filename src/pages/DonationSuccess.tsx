import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle, Download, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const DonationSuccess = () => {
  const [searchParams] = useSearchParams();
  const itemName = searchParams.get('item') || 'your item';
  const itemType = searchParams.get('type') || 'component';

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
            Your download for <span className="text-foreground font-medium">{itemName}</span> is ready.
          </p>

          <div className="space-y-4">
            <Button variant="hero" size="lg" className="w-full gap-2">
              <Download size={18} />
              Download {itemName}
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
