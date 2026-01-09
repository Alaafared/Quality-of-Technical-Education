
import React from 'react';
import { User } from '../types';
import { Bell, Search, User as UserIcon } from 'lucide-react';

interface HeaderProps {
  user: User;
}

const Header: React.FC<HeaderProps> = ({ user }) => {
  return (
    <header className="bg-white border-b border-gray-200 h-20 px-4 md:px-8 flex items-center justify-between sticky top-0 z-10">
      <div className="flex items-center">
        <h2 className="text-xl font-bold text-gray-800 hidden md:block">
          {user.role === 'superadmin' ? 'لوحة التحكم العامة' : 'متابعة المدارس الفنية'}
        </h2>
      </div>

      <div className="flex items-center space-x-4 space-x-reverse">
        <div className="hidden lg:flex items-center bg-gray-100 px-3 py-2 rounded-lg border border-transparent focus-within:border-blue-500 transition-all">
          <Search size={18} className="text-gray-400" />
          <input 
            type="text" 
            placeholder="بحث..." 
            className="bg-transparent border-none outline-none mr-2 text-sm w-48"
          />
        </div>

        <div className="flex items-center border-r border-gray-200 pr-4 mr-4">
          <div className="text-left ml-3 hidden sm:block">
            <p className="text-sm font-bold text-gray-700 leading-none mb-1">{user.name}</p>
            <p className="text-xs text-gray-500 capitalize">{user.role === 'superadmin' ? 'مدير النظام' : 'مسؤول منطقة'}</p>
          </div>
          <div className="bg-white-600 w-10 h-10 rounded-2xl flex items-center justify-center mx-auto mb-6 text-white shadow-xl">
            <img 
                src="logo.jpg" // ضع مسار الصورة هنا (مثلاً في مجلد public)
                alt="Logo" 
                className="w-full h-full object-contain"
              />            </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
