
import React, { useMemo, useState } from 'react';
import { School, Area, SchoolType } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import { AREAS, CHECKLIST_LABELS } from '../constants';
import { Filter, Search, Download, Printer, TrendingUp, Building2, Users, CheckCircle2 } from 'lucide-react';

interface SuperAdminDashboardProps {
  schools: School[];
  onEdit: (id: string) => void;
  onPrint: (id: string) => void;
}

const SuperAdminDashboard: React.FC<SuperAdminDashboardProps> = ({ schools, onEdit, onPrint }) => {
  const [areaFilter, setAreaFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredSchools = useMemo(() => {
    return schools.filter(s => {
      const matchArea = areaFilter === 'all' || s.areaId === areaFilter;
      const matchType = typeFilter === 'all' || s.type === typeFilter;
      const matchSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchArea && matchType && matchSearch;
    });
  }, [schools, areaFilter, typeFilter, searchQuery]);

  // Statistics
  const stats = useMemo(() => {
    const total = schools.length;
    const avg = Math.round(schools.reduce((acc, s) => acc + s.completionPercentage, 0) / total);
    const completed = schools.filter(s => s.completionPercentage === 100).length;
    
    // Group by area for chart
    const areaStats = AREAS.map(a => {
      const areaSchools = schools.filter(s => s.areaId === a.id);
      const completion = areaSchools.length > 0 
        ? Math.round(areaSchools.reduce((acc, s) => acc + s.completionPercentage, 0) / areaSchools.length)
        : 0;
      return { name: a.name, percentage: completion };
    });

    // Group by type
    const types: SchoolType[] = ['صناعي', 'فندقي', 'تجاري', 'زراعي'];
    const typeStats = types.map(t => {
      const typeSchools = schools.filter(s => s.type === t);
      const completion = typeSchools.length > 0
        ? Math.round(typeSchools.reduce((acc, s) => acc + s.completionPercentage, 0) / typeSchools.length)
        : 0;
      return { name: t, percentage: completion };
    });

    return { total, avg, completed, areaStats, typeStats };
  }, [schools]);

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#6366f1', '#06b6d4'];

  return (
    <div className="space-y-8">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center space-x-4 space-x-reverse">
          <div className="bg-blue-100 p-3 rounded-xl text-blue-600"><Building2 size={24}/></div>
          <div>
            <p className="text-gray-500 text-xs">إجمالي المدارس</p>
            <p className="text-2xl font-bold">{stats.total}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center space-x-4 space-x-reverse">
          <div className="bg-green-100 p-3 rounded-xl text-green-600"><TrendingUp size={24}/></div>
          <div>
            <p className="text-gray-500 text-xs">نسبة الإنجاز العام</p>
            <p className="text-2xl font-bold">{stats.avg}%</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center space-x-4 space-x-reverse">
          <div className="bg-purple-100 p-3 rounded-xl text-purple-600"><CheckCircle2 size={24}/></div>
          <div>
            <p className="text-gray-500 text-xs">مدارس مكتملة</p>
            <p className="text-2xl font-bold">{stats.completed}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center space-x-4 space-x-reverse">
          <div className="bg-orange-100 p-3 rounded-xl text-orange-600"><Users size={24}/></div>
          <div>
            <p className="text-gray-500 text-xs">عدد المسؤولين</p>
            <p className="text-2xl font-bold">{AREAS.length}</p>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold mb-6">نسبة الإنجاز حسب الإدارة</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.areaStats} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                <XAxis type="number" domain={[0, 100]} hide />
                <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="percentage" radius={[0, 4, 4, 0]}>
                  {stats.areaStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold mb-6">نسبة الإنجاز حسب التخصص</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.typeStats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Bar dataKey="percentage" radius={[4, 4, 0, 0]}>
                   {stats.typeStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index + 2 % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Filters and List */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100 space-y-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <h3 className="font-bold text-lg">قائمة جميع المدارس (37)</h3>
            <div className="flex flex-wrap gap-2">
              <select 
                className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm"
                value={areaFilter}
                onChange={e => setAreaFilter(e.target.value)}
              >
                <option value="all">كل الإدارات</option>
                {AREAS.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
              </select>
              <select 
                className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm"
                value={typeFilter}
                onChange={e => setTypeFilter(e.target.value)}
              >
                <option value="all">كل التخصصات</option>
                <option value="صناعي">صناعي</option>
                <option value="تجاري">تجاري</option>
                <option value="زراعي">زراعي</option>
                <option value="فندقي">فندقي</option>
              </select>
              <div className="relative">
                <Search size={16} className="absolute left-3 top-2.5 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="بحث عن مدرسة..." 
                  className="bg-gray-50 border border-gray-200 rounded-lg pr-10 pl-3 py-2 text-sm"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse">
            <thead className="bg-gray-50 text-gray-500 text-xs">
              <tr>
                <th className="p-4 border-b">اسم المدرسة</th>
                <th className="p-4 border-b">الإدارة</th>
                <th className="p-4 border-b">التخصص</th>
                <th className="p-4 border-b">نسبة الإنجاز</th>
                <th className="p-4 border-b">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredSchools.map(school => (
                <tr key={school.id} className="hover:bg-blue-50 transition-colors">
                  <td className="p-4 font-bold text-sm">{school.name}</td>
                  <td className="p-4 text-sm">{AREAS.find(a => a.id === school.areaId)?.name}</td>
                  <td className="p-4 text-xs font-semibold">{school.type}</td>
                  <td className="p-4">
                    <div className="flex items-center">
                      <span className="ml-3 font-semibold text-xs">{school.completionPercentage}%</span>
                      <div className="flex-1 max-w-[80px] bg-gray-100 h-1.5 rounded-full overflow-hidden">
                        <div className={`h-full ${school.completionPercentage === 100 ? 'bg-green-500' : 'bg-blue-500'}`} style={{ width: `${school.completionPercentage}%` }}></div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex space-x-1 space-x-reverse">
                      <button 
                         onClick={() => onEdit(school.id)}
                         className="p-1.5 text-blue-600 hover:bg-blue-100 rounded-md transition-colors"
                      >
                        <Download size={16} />
                      </button>
                      <button 
                         onClick={() => onPrint(school.id)}
                         className="p-1.5 text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
                      >
                        <Printer size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
