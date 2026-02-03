"use client";

import { useState, useRef } from 'react';
import { PageHeader } from '@/components/premium/PageHeader';
import { PremiumCard } from '@/components/premium/PremiumCard';
import { FileText, Download, Printer, Eye, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { IzinFormu, IsSozlesmesi, ZimmetTutanagi, KVKKMetni } from './components/DocumentTemplates';

// We might not have react-to-print installed, so I'll implement a simple print handler without it first.
// If the user has it, great, but I should rely on standard window.print with CSS.

export default function BelgelerPage() {
  const [selectedDoc, setSelectedDoc] = useState<any>(null);
  const printRef = useRef<HTMLDivElement>(null);

  const documents = [
    { 
      id: 'sozlesme',
      name: 'İş Sözleşmesi Şablonu', 
      date: '01.02.2026', 
      type: 'PDF', 
      Component: IsSozlesmesi 
    },
    { 
      id: 'izin',
      name: 'İzin Talep Formu', 
      date: '15.01.2026', 
      type: 'PDF', 
      Component: IzinFormu 
    },
    { 
      id: 'zimmet',
      name: 'Zimmet Tutanağı', 
      date: '01.01.2026', 
      type: 'PDF', 
      Component: ZimmetTutanagi 
    },
    { 
      id: 'kvkk',
      name: 'KVKK Aydınlatma Metni', 
      date: '01.01.2026', 
      type: 'PDF', 
      Component: KVKKMetni 
    },
  ];

  const handlePrint = () => {
    if (!printRef.current) return;
    
    const printContent = printRef.current.innerHTML;
    const originalContent = document.body.innerHTML;

    // Create a temporary print window/frame is better, but swapping body content is a quick hack often used.
    // However, it kills React state. 
    // Better approach: Open a new window.
    
    const printWindow = window.open('', '', 'height=600,width=800');
    if (printWindow) {
      printWindow.document.write('<html><head><title>Yazdır</title>');
      // Copy styles
      const styles = document.querySelectorAll('style, link[rel="stylesheet"]');
      styles.forEach(style => {
        printWindow.document.head.appendChild(style.cloneNode(true));
      });
      // Add Tailwind CDN if needed as fallback or ensure styles are loaded. 
      // Since we are in Next.js with Tailwind, copying style tags usually works for extracted CSS.
      // But for development mode, styles might be in JS.
      // A safer bet for this environment is adding a specific print style to the current page 
      // and using window.print() while hiding everything else.
      
      printWindow.document.write('</head><body class="bg-white">');
      printWindow.document.write(printContent);
      printWindow.document.write('</body></html>');
      printWindow.document.close();
      printWindow.focus();
      // Give some time for styles to load
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 500);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Belgeler" 
        description="Şirket içi resmi belgeler, sözleşmeler ve form şablonları."
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {documents.map((doc, i) => (
          <PremiumCard key={i} className="group hover:border-primary/50 transition-all duration-300">
            <div className="flex flex-col items-center text-center space-y-4 p-4">
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-primary/5 to-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-inner">
                <FileText className="w-10 h-10 text-primary" />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors">{doc.name}</h3>
                <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                  <span className="bg-secondary px-2 py-0.5 rounded text-secondary-foreground font-medium">{doc.type}</span>
                  <span>•</span>
                  <span>{doc.date}</span>
                </div>
              </div>
              <div className="w-full pt-2 flex gap-2">
                <Button 
                    variant="outline" 
                    className="flex-1 gap-2 hover:bg-primary hover:text-primary-foreground transition-colors"
                    onClick={() => setSelectedDoc(doc)}
                >
                  <Eye className="w-4 h-4" />
                  Görüntüle
                </Button>
              </div>
            </div>
          </PremiumCard>
        ))}
      </div>

      <Dialog open={!!selectedDoc} onOpenChange={(open) => !open && setSelectedDoc(null)}>
        <DialogContent className="max-w-4xl h-[90vh] flex flex-col p-0 gap-0 bg-gray-50/95 backdrop-blur-xl">
          <DialogHeader className="p-4 border-b bg-white flex flex-row items-center justify-between space-y-0">
            <div className="flex items-center gap-2">
                <DialogTitle>{selectedDoc?.name}</DialogTitle>
                <span className="text-xs px-2 py-1 bg-blue-50 text-blue-700 rounded-full font-medium border border-blue-100">Önizleme Modu</span>
            </div>
            <div className="flex items-center gap-2">
                <Button size="sm" onClick={handlePrint} className="gap-2">
                    <Printer className="w-4 h-4" />
                    Yazdır
                </Button>
                <DialogClose asChild>
                    <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full">
                        <X className="w-4 h-4" />
                    </Button>
                </DialogClose>
            </div>
          </DialogHeader>
          
          <div className="flex-1 overflow-y-auto p-8 bg-gray-100/50">
             {selectedDoc && (
                 <div className="shadow-2xl print-content mx-auto" ref={printRef}>
                    <selectedDoc.Component />
                 </div>
             )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print-content, .print-content * {
            visibility: visible;
          }
          .print-content {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            margin: 0;
            padding: 0;
            box-shadow: none;
          }
        }
      `}</style>
    </div>
  );
}
