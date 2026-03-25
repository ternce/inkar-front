import { Outlet, Link, useLocation } from "react-router";
import { 
  LayoutDashboard, 
  FileText, 
  BarChart3, 
  Users, 
  List, 
  Settings 
} from "lucide-react";
import { Toaster } from "./ui/sonner";

const menuItems = [
  { path: "/", label: "Главная", icon: LayoutDashboard },
  { path: "/price-lists", label: "Прайс-листы", icon: FileText },
  { path: "/competitor-assignment", label: "Назначение ПЛК", icon: Users },
  { path: "/universal-lists", label: "Универсальные списки", icon: List },
  { path: "/pricing-settings", label: "Настройки ЦО", icon: Settings },
];

export function Layout() {
  const location = useLocation();

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-xl text-blue-600">Система ценообразования</h1>
        </div>
        <nav className="flex-1 p-4">
          <ul className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${
                      isActive
                        ? "bg-blue-50 text-blue-600"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">Филиал: Москва</span>
              <span className="text-gray-300">|</span>
              <span className="text-sm text-gray-600">Пользователь: Администратор</span>
            </div>
            <div className="text-sm text-gray-600">
              {new Date().toLocaleDateString('ru-RU', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>

      <Toaster />
    </div>
  );
}
