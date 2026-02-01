import { PageHeader } from '@/components/premium/PageHeader';
import { PremiumCard } from '@/components/premium/PremiumCard';
import { FileText, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function BelgelerPage() {
  const documents = [
    { name: 'İş Sözleşmesi Şablonu', date: '01.02.2026', type: 'PDF' },
    { name: 'İzin Formu', date: '15.01.2026', type: 'DOCX' },
    { name: 'Personel Yönetmeliği', date: '01.01.2026', type: 'PDF' },
    { name: 'KVKK Aydınlatma Metni', date: '01.01.2026', type: 'PDF' },
  ];

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Belgeler" 
        description="Şirket içi belgeler ve formlar."
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {documents.map((doc, i) => (
          <PremiumCard key={i} className="hover:scale-105 transition-transform">
            <div className="flex flex-col items-center text-center space-y-4 p-4">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                <FileText className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h3 className="font-bold text-foreground">{doc.name}</h3>
                <p className="text-sm text-muted-foreground">{doc.date} • {doc.type}</p>
              </div>
              <Button variant="outline" className="w-full gap-2">
                <Download className="w-4 h-4" />
                İndir
              </Button>
            </div>
          </PremiumCard>
        ))}
      </div>
    </div>
  );
}
