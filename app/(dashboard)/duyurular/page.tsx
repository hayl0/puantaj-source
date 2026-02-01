import { PageHeader } from '@/components/premium/PageHeader';
import { PremiumCard } from '@/components/premium/PremiumCard';
import { Megaphone, Bell } from 'lucide-react';

export default function DuyurularPage() {
  const announcements = [
    { title: 'Sistem Bakımı', date: 'Bugün, 14:00', content: 'Bu gece 02:00 - 04:00 arasında planlı bakım çalışması yapılacaktır.', important: true },
    { title: 'Yeni Özellik: Mobil Uygulama', date: 'Dün', content: 'Puantaj Pro mobil uygulaması artık App Store ve Play Store\'da!', important: false },
    { title: 'Maaş Ödemeleri', date: '30 Oca', content: 'Ocak ayı maaş ödemeleri hesaplara yatırılmıştır.', important: false },
  ];

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Duyurular" 
        description="Şirket içi önemli duyurular ve haberler."
      />
      
      <div className="space-y-4">
        {announcements.map((announcement, i) => (
          <PremiumCard key={i} className={announcement.important ? "border-primary/50 bg-primary/5" : ""}>
            <div className="flex items-start gap-4">
              <div className={`p-3 rounded-xl ${announcement.important ? 'bg-primary/20 text-primary' : 'bg-secondary text-muted-foreground'}`}>
                {announcement.important ? <Megaphone className="w-6 h-6" /> : <Bell className="w-6 h-6" />}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-bold text-lg">{announcement.title}</h3>
                  <span className="text-xs text-muted-foreground">{announcement.date}</span>
                </div>
                <p className="text-muted-foreground">{announcement.content}</p>
              </div>
            </div>
          </PremiumCard>
        ))}
      </div>
    </div>
  );
}
