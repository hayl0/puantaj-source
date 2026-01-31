"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PageHeader } from '@/components/premium/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  Plus, Search, Filter, Download, 
  LayoutGrid, List as ListIcon, 
  MoreHorizontal, Mail, Phone, MapPin, Edit, Trash, CreditCard,
  Calendar as CalendarIcon
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { cn } from "@/lib/utils";

interface Employee {
  id: string;
  name: string;
  email: string | null;
  department: string;
  position: string;
  salary: number;
  paymentType: string;
  hireDate: string;
  status?: string;
}

export default function PersonelPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    department: '',
    position: '',
    salary: '',
    paymentType: 'monthly',
    hireDate: undefined as Date | undefined,
  });

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/employees');
      if (res.ok) {
        const data = await res.json();
        setEmployees(data);
      } else {
        toast({
          variant: "destructive",
          title: "Hata",
          description: "Personel listesi yüklenemedi.",
        });
      }
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      password: '',
      department: '',
      position: '',
      salary: '',
      paymentType: 'monthly',
      hireDate: new Date(),
    });
    setSelectedEmployee(null);
  };

  const handleAddClick = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const handleEditClick = (employee: Employee) => {
    setSelectedEmployee(employee);
    setFormData({
      name: employee.name,
      email: employee.email || '',
      password: '', // Don't show password
      department: employee.department,
      position: employee.position,
      salary: employee.salary.toString(),
      paymentType: employee.paymentType || 'monthly',
      hireDate: employee.hireDate ? new Date(employee.hireDate) : new Date(),
    });
    setIsDialogOpen(true);
  };

  const handleDeleteClick = (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsDeleteDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = '/api/employees';
      const method = selectedEmployee ? 'PUT' : 'POST';
      const body = selectedEmployee 
        ? { ...formData, id: selectedEmployee.id }
        : formData;

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        toast({
          title: "Başarılı",
          description: selectedEmployee ? "Personel güncellendi." : "Personel eklendi.",
        });
        setIsDialogOpen(false);
        fetchEmployees();
      } else {
        const error = await res.json();
        toast({
          variant: "destructive",
          title: "Hata",
          description: error.error || "İşlem başarısız.",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Hata",
        description: "Bir hata oluştu.",
      });
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedEmployee) return;

    try {
      const res = await fetch('/api/employees', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: selectedEmployee.id }),
      });

      if (res.ok) {
        toast({
          title: "Başarılı",
          description: "Personel silindi.",
        });
        setIsDeleteDialogOpen(false);
        fetchEmployees();
      } else {
        toast({
          variant: "destructive",
          title: "Hata",
          description: "Silme işlemi başarısız.",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Hata",
        description: "Bir hata oluştu.",
      });
    }
  };

  const filteredEmployees = employees.filter(emp => 
    emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    emp.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Personel Yönetimi" 
        description={`Toplam ${employees.length} personel`}
      >
        <Button variant="outline" className="gap-2">
          <Download className="w-4 h-4" />
          Dışa Aktar
        </Button>
        <Button 
          className="gap-2 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 shadow-lg shadow-primary/25"
          onClick={handleAddClick}
        >
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

      {loading ? (
        <div className="text-center py-10">Yükleniyor...</div>
      ) : (
        <AnimatePresence mode="wait">
          {viewMode === 'grid' ? (
            <motion.div 
              key="grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredEmployees.map((employee) => (
                <motion.div 
                  key={employee.id}
                  layoutId={employee.id}
                  className="group relative bg-card hover:bg-card/50 border hover:border-primary/50 rounded-2xl p-6 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5"
                >
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEditClick(employee)}>
                          <Edit className="w-4 h-4 mr-2" />
                          Düzenle
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600" onClick={() => handleDeleteClick(employee)}>
                          <Trash className="w-4 h-4 mr-2" />
                          Sil
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <div className="flex flex-col items-center text-center mb-6">
                    <Avatar className="w-20 h-20 mb-4 border-4 border-background shadow-xl">
                      <AvatarFallback className="bg-gradient-to-br from-primary to-purple-600 text-white text-xl">
                        {employee.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <h3 className="font-bold text-lg text-foreground">{employee.name}</h3>
                    <p className="text-sm text-muted-foreground">{employee.position}</p>
                    <Badge variant="secondary" className="mt-2 bg-primary/10 text-primary hover:bg-primary/20">
                      {employee.department}
                    </Badge>
                  </div>

                  <div className="space-y-3 pt-4 border-t border-border/50">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Mail className="w-4 h-4 mr-3 text-primary/70" />
                      {employee.email || '-'}
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <CreditCard className="w-4 h-4 mr-3 text-primary/70" />
                      {employee.salary ? (
                        <span>
                          ₺{employee.salary.toLocaleString()}
                          <span className="text-xs ml-1 opacity-70">
                            {employee.paymentType === 'hourly' ? '/saat' : 
                             employee.paymentType === 'daily' ? '/gün' : 
                             '/ay'}
                          </span>
                        </span>
                      ) : '-'}
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div 
              key="list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="bg-card rounded-xl border overflow-hidden"
            >
              {/* List View Implementation (Simplified) */}
              <div className="p-4 text-center text-muted-foreground">Liste görünümü hazırlanıyor...</div>
            </motion.div>
          )}
        </AnimatePresence>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedEmployee ? 'Personeli Düzenle' : 'Yeni Personel Ekle'}</DialogTitle>
            <DialogDescription>
              Personel bilgilerini aşağıdan yönetebilirsiniz.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Ad Soyad</Label>
              <Input id="name" name="name" value={formData.name} onChange={handleInputChange} required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Şifre {selectedEmployee && '(Değiştirmek için doldurun)'}</Label>
              <Input id="password" name="password" type="password" value={formData.password} onChange={handleInputChange} required={!selectedEmployee} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="department">Departman</Label>
                <Input id="department" name="department" value={formData.department} onChange={handleInputChange} required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="position">Pozisyon</Label>
                <Input id="position" name="position" value={formData.position} onChange={handleInputChange} required />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="paymentType">Ödeme Tipi</Label>
                <Select 
                  value={formData.paymentType} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, paymentType: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seçiniz" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monthly">Aylık Maaş</SelectItem>
                    <SelectItem value="hourly">Saatlik Ücret</SelectItem>
                    <SelectItem value="daily">Günlük Yevmiye</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="hireDate">İşe Başlama Tarihi</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !formData.hireDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.hireDate ? format(formData.hireDate, "d MMMM yyyy", { locale: tr }) : <span>Tarih seçin</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={formData.hireDate}
                      onSelect={(date) => setFormData(prev => ({ ...prev, hireDate: date }))}
                      initialFocus
                      locale={tr}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="salary">
                {formData.paymentType === 'hourly' ? 'Saatlik Ücret (TL)' : 
                 formData.paymentType === 'daily' ? 'Günlük Yevmiye (TL)' : 
                 'Aylık Maaş (TL)'}
              </Label>
              <Input id="salary" name="salary" type="number" value={formData.salary} onChange={handleInputChange} required />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>İptal</Button>
              <Button type="submit">Kaydet</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Personeli Sil</DialogTitle>
            <DialogDescription>
              Bu personeli silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>İptal</Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}>Sil</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
