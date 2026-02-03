"use client";

import { useState, useEffect } from 'react';
import { PageHeader } from '@/components/premium/PageHeader';
import { PremiumCard } from '@/components/premium/PremiumCard';
import { Megaphone, Bell, Plus, Loader2, Trash2 } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';

export default function DuyurularPage() {
  const { data: session } = useSession();
  const userRole = (session?.user as any)?.role;
  const isAdmin = userRole === 'admin';

  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    important: false
  });

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/announcements');
      if (res.ok) {
        const data = await res.json();
        setAnnouncements(data);
      }
    } catch (error) {
      console.error('Failed to fetch announcements:', error);
      toast.error('Duyurular yüklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session) {
      fetchAnnouncements();
    }
  }, [session]);

  const handleSubmit = async () => {
    if (!formData.title || !formData.content) {
      toast.error('Lütfen başlık ve içerik giriniz');
      return;
    }

    try {
      const res = await fetch('/api/announcements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        toast.success('Duyuru başarıyla oluşturuldu');
        setIsDialogOpen(false);
        setFormData({ title: '', content: '', important: false });
        fetchAnnouncements();
      } else {
        toast.error('Duyuru oluşturulurken hata oluştu');
      }
    } catch (error) {
      console.error('Create announcement error:', error);
      toast.error('Bir hata oluştu');
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Duyurular" 
        description="Şirket içi önemli duyurular ve haberler."
      >
        {isAdmin && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2 bg-gradient-to-r from-blue-600 to-indigo-600">
                <Plus className="w-4 h-4" />
                Duyuru Ekle
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Yeni Duyuru Oluştur</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Başlık</Label>
                  <Input 
                    placeholder="Duyuru başlığı..." 
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>İçerik</Label>
                  <Textarea 
                    placeholder="Duyuru detayları..." 
                    rows={4}
                    value={formData.content}
                    onChange={(e) => setFormData({...formData, content: e.target.value})}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="important" 
                    checked={formData.important}
                    onCheckedChange={(checked) => setFormData({...formData, important: checked})}
                  />
                  <Label htmlFor="important">Önemli Duyuru</Label>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>İptal</Button>
                <Button onClick={handleSubmit}>Paylaş</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </PageHeader>
      
      {loading ? (
        <div className="flex justify-center py-10">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      ) : announcements.length === 0 ? (
        <div className="text-center py-10 text-muted-foreground">
          <Bell className="w-12 h-12 mx-auto mb-4 opacity-20" />
          <p>Henüz yayınlanmış bir duyuru yok.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {announcements.map((announcement) => (
            <PremiumCard key={announcement.id} className={announcement.important ? "border-primary/50 bg-primary/5" : ""}>
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-xl ${announcement.important ? 'bg-primary/20 text-primary' : 'bg-secondary text-muted-foreground'}`}>
                  {announcement.important ? <Megaphone className="w-6 h-6" /> : <Bell className="w-6 h-6" />}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-bold text-lg">{announcement.title}</h3>
                    <div className="flex flex-col items-end">
                       <span className="text-xs text-muted-foreground">
                        {format(new Date(announcement.date), 'd MMMM yyyy, HH:mm', { locale: tr })}
                       </span>
                       {announcement.user && (
                         <span className="text-[10px] text-muted-foreground/70">
                           {announcement.user.name}
                         </span>
                       )}
                    </div>
                  </div>
                  <p className="text-muted-foreground whitespace-pre-wrap">{announcement.content}</p>
                </div>
              </div>
            </PremiumCard>
          ))}
        </div>
      )}
    </div>
  );
}
