"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PageHeader } from '@/components/premium/PageHeader';
import { PremiumCard } from '@/components/premium/PremiumCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Plus, Search, Filter, Download, 
  LayoutGrid, List as ListIcon, 
  MoreHorizontal, Mail, Phone, MapPin 
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const employees = [
  { id: 1, name: 'Ahmet Yılmaz', department: 'Yazılım', position: 'Senior Dev', salary: '₺25,000', joinDate: '2022-03-15', status: 'active', email: 'ahmet@sirket.com', phone: '+90 555 111 2233' },
  { id: 2, name: 'Ayşe Demir', department: 'İnsan Kaynakları', position: 'Uzman', salary: '₺18,500', joinDate: '2021-08-22', status: 'active', email: 'ayse@sirket.com', phone: '+90 555 222 3344' },
  { id: 3, name: 'Mehmet Kaya', department: 'Muhasebe', position: 'Müdür', salary: '₺22,000', joinDate: '2020-11-30', status: 'active', email: 'mehmet@sirket.com', phone: '+90 555 333 4455' },
  { id: 4, name: 'Fatma Şahin', department: 'Satış', position: 'Temsilci', salary: '₺15,000', joinDate: '2023-01-10', status: 'probation', email: 'fatma@sirket.com', phone: '+90 555 444 5566' },
  { id: 5, name: 'Can Yıldız', department: 'Yazılım', position: 'Junior Dev', salary: '₺14,000', joinDate: '2023-06-05', status: 'active', email: 'can@sirket.com', phone: '+90 555 555 6677' },
  { id: 6, name: 'Zeynep Arslan', department: 'Pazarlama', position: 'Uzman', salary: '₺17,000', joinDate: '2022-09-18', status: 'active', email: 'zeynep@sirket.com', phone: '+90 555 666 7788' },
];

export default function PersonelPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredEmployees = employees.filter(emp => 
    emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    emp.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Personel Yönetimi" 
        description="Toplam 47 personel • 6 aktif departman"
      >
        <Button variant="outline" className="gap-2">
          <Download className="w-4 h-4" />
          Dışa Aktar
        </Button>
        <Button className="gap-2 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 shadow-lg shadow-primary/25">
          <Plus className="w-4 h-4" />
          Yeni Personel
        </Button>
      </PageHeader>

      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-background/50 p-4 rounded-xl border backdrop-blur-sm">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Personel ara..." 
            className="pl-10 bg-background/50 border-primary/20 focus:border-primary" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon">
            <Filter className="w-4 h-4" />
          </Button>
          <div className="h-8 w-px bg-border mx-2" />
          <Button 
            variant={viewMode === 'grid' ? 'default' : 'ghost'} 
            size="icon"
            onClick={() => setViewMode('grid')}
          >
            <LayoutGrid className="w-4 h-4" />
          </Button>
          <Button 
            variant={viewMode === 'list' ? 'default' : 'ghost'} 
            size="icon"
            onClick={() => setViewMode('list')}
          >
            <ListIcon className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {viewMode === 'grid' ? (
          <motion.div 
            key="grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredEmployees.map((emp, index) => (
              <PremiumCard key={emp.id} delay={index * 0.1} className="overflow-visible">
                <div className="flex flex-col items-center text-center p-2">
                  <div className="relative mb-4">
                    <div className="w-24 h-24 rounded-full p-1 bg-gradient-to-br from-primary to-purple-600">
                      <Avatar className="w-full h-full border-4 border-background">
                        <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${emp.name}`} />
                        <AvatarFallback>{emp.name.substring(0, 2)}</AvatarFallback>
                      </Avatar>
                    </div>
                    <Badge 
                      className={`absolute bottom-0 right-0 border-2 border-background ${
                        emp.status === 'active' ? 'bg-green-500' : 'bg-yellow-500'
                      }`}
                    >
                      {emp.status === 'active' ? 'Aktif' : 'Deneme'}
                    </Badge>
                  </div>
                  
                  <h3 className="text-lg font-bold">{emp.name}</h3>
                  <p className="text-sm text-muted-foreground">{emp.position}</p>
                  
                  <div className="mt-4 flex flex-wrap gap-2 justify-center">
                    <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20">
                      {emp.department}
                    </Badge>
                  </div>

                  <div className="w-full mt-6 space-y-2">
                    <div className="flex items-center text-sm text-muted-foreground gap-2">
                      <Mail className="w-4 h-4 text-primary" />
                      {emp.email}
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground gap-2">
                      <Phone className="w-4 h-4 text-primary" />
                      {emp.phone}
                    </div>
                  </div>

                  <div className="flex gap-2 w-full mt-6">
                    <Button variant="outline" className="flex-1 border-primary/20 hover:bg-primary/5 hover:text-primary">
                      Profili Gör
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>İşlemler</DropdownMenuLabel>
                        <DropdownMenuItem>Düzenle</DropdownMenuItem>
                        <DropdownMenuItem>İzin Ekle</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600">Arşivle</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </PremiumCard>
            ))}
          </motion.div>
        ) : (
          <motion.div 
            key="list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            {filteredEmployees.map((emp, index) => (
              <PremiumCard key={emp.id} delay={index * 0.05} className="flex items-center p-0">
                <div className="flex flex-col md:flex-row items-center gap-6 p-4 w-full">
                  <Avatar className="w-12 h-12 border-2 border-primary/20">
                    <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${emp.name}`} />
                    <AvatarFallback>{emp.name.substring(0, 2)}</AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 text-center md:text-left">
                    <h3 className="font-bold">{emp.name}</h3>
                    <p className="text-sm text-muted-foreground">{emp.email}</p>
                  </div>
                  
                  <div className="flex-1 text-center md:text-left">
                    <p className="font-medium">{emp.department}</p>
                    <p className="text-sm text-muted-foreground">{emp.position}</p>
                  </div>

                  <div className="flex-1 text-center">
                    <Badge variant={emp.status === 'active' ? 'default' : 'secondary'} className={emp.status === 'active' ? 'bg-green-500 hover:bg-green-600' : ''}>
                      {emp.status === 'active' ? 'Aktif' : 'Deneme Süresi'}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline">Detay</Button>
                    <Button size="icon" variant="ghost">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </PremiumCard>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
