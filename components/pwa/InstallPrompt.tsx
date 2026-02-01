'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  const { toast } = useToast();

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
      setShowPrompt(false);
      toast({
        title: "Uygulama Yükleniyor",
        description: "Puantaj Pro ana ekranınıza ekleniyor.",
      });
    }
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-20 left-4 right-4 z-50 md:hidden">
      <div className="bg-background/95 backdrop-blur-md border border-primary/20 p-4 rounded-xl shadow-2xl flex items-center justify-between gap-4">
        <div className="flex-1">
          <h3 className="font-semibold text-foreground">Uygulamayı Yükle</h3>
          <p className="text-sm text-muted-foreground">Daha hızlı erişim için ana ekrana ekle.</p>
        </div>
        <Button onClick={handleInstall} size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
          <Download className="w-4 h-4 mr-2" />
          Yükle
        </Button>
      </div>
    </div>
  );
}
