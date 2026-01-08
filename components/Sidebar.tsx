
import React from 'react';
import { User } from '../types';
import { LayoutDashboard, FileText, LogOut, ChevronLeft, Menu } from 'lucide-react';

interface SidebarProps {
  user: User;
  currentView: string;
  setView: (view: any) => void;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ user, currentView, setView, onLogout }) => {
  const [isOpen, setIsOpen] = React.useState(true);

  return (
    <aside className={`${isOpen ? 'w-64' : 'w-20'} bg-white border-l border-gray-200 transition-all duration-300 flex flex-col hidden md:flex sticky top-0 h-screen`}>
      <div className="p-6 flex items-center justify-between">
        {isOpen && <h1 className="font-bold text-xl text-blue-800">جودة الإسماعيلية</h1>}
        <button onClick={() => setIsOpen(!isOpen)} className="p-2 hover:bg-gray-100 rounded-lg">
          <Menu size={20} className="text-gray-500" />
        </button>
      </div>

      <nav className="flex-1 px-4 space-y-2 mt-4">
        <button 
          onClick={() => setView('dashboard')}
          className={`w-full flex items-center p-3 rounded-xl transition-colors ${currentView === 'dashboard' ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50'}`}
        >
          <LayoutDashboard size={22} />
          {isOpen && <span className="mr-3 font-medium">لوحة التحكم</span>}
        </button>
      </nav>

      <div className="p-4 border-t border-gray-100">
        <button 
          onClick={onLogout}
          className="w-full flex items-center p-3 rounded-xl text-red-500 hover:bg-red-50 transition-colors"
        >
          <LogOut size={22} />
          {isOpen && <span className="mr-3 font-medium">خروج</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
