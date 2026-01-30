import { 
  Home, Users, Calendar, Clock, CreditCard, 
  BarChart3, Settings, HelpCircle, LogOut 
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const navItems = [
  { icon: Home, label: 'Dashboard', href: '/dashboard' },
  { icon: Users, label: 'Personel', href: '/personel' },
  { icon: Calendar, label: 'Puantaj', href: '/puantaj' },
  { icon: Clock, label: 'Mesai', href: '/mesai' },
  { icon: CreditCard, label: 'Maaş', href: '/maas' },
  { icon: BarChart3, label: 'Finans', href: '/finans' },
  { icon: BarChart3, label: 'Raporlar', href: '/raporlar' },
  { icon: Settings, label: 'Ayarlar', href: '/ayarlar' },
];

export default function PremiumSidebar() {
  return (
    <aside className="w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col">
      <div className="p-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-xl">P+</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">Puantaj Plus</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">Premium Edition</p>
          </div>
        </div>
      </div>
      
      <nav className="flex-1 px-4 space-y-2">
        {navItems.map((item) => (
          <a
            key={item.label}
            href={item.href}
            className="flex items-center gap-3 px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
          >
            <item.icon className="w-5 h-5" />
            <span className="font-medium">{item.label}</span>
          </a>
        ))}
      </nav>
      
      <div className="p-4 border-t border-gray-200 dark:border-gray-800">
        <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
            <span className="text-white font-bold">A</span>
          </div>
          <div className="flex-1">
            <p className="font-medium text-gray-900 dark:text-white">Admin</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Yönetici</p>
          </div>
          <Button variant="ghost" size="icon">
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </aside>
  );
}
