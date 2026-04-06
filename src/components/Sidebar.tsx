'use client'
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Tag, 
  Package, 
  Users, 
  ShoppingCart, 
  Settings,
  Truck,
  Layers
} from 'lucide-react';

const menuItems = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Categorías', href: '/categorias', icon: Layers },
  { name: 'Marcas', href: '/marcas', icon: Tag },
  { name: 'Productos', href: '/productos', icon: Package },
  { name: 'Proveedores', href: '/proveedores', icon: Truck },
  { name: 'Ventas', href: '/ventas', icon: ShoppingCart },
  { name: 'Clientes', href: '/clientes', icon: Users },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 bg-slate-900 min-h-screen text-slate-300 p-4 flex flex-col fixed left-0 top-0">
      <div className="flex items-center gap-3 px-2 mb-10 mt-4">
        <div className="bg-indigo-600 p-2 rounded-lg">
          <ShoppingCart className="text-white" size={24} />
        </div>
        <span className="text-xl font-bold text-white tracking-tight">MultiPOS</span>
      </div>

      <nav className="flex-1 space-y-1">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                isActive 
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/20' 
                  : 'hover:bg-slate-800 hover:text-white'
              }`}
            >
              <item.icon size={20} className={isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'} />
              <span className="font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto border-t border-slate-800 pt-4 px-2">
        <button className="flex items-center gap-3 px-4 py-3 w-full rounded-xl hover:bg-slate-800 transition-all text-slate-400 hover:text-white">
          <Settings size={20} />
          <span className="font-medium">Configuración</span>
        </button>
      </div>
    </div>
  );
}
