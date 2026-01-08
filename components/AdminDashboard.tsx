
import React from 'react';
import { School } from '../types';
import { FileEdit, Printer, CheckCircle, XCircle } from 'lucide-react';

interface AdminDashboardProps {
  schools: School[];
  onEdit: (id: string) => void;
  onPrint: (id: string) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ schools, onEdit, onPrint }) => {
  const averageCompletion = Math.round(
    schools.reduce((acc, s) => acc + s.completionPercentage, 0) / (schools.length || 1)
  );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <p className="text-gray-500 text-sm mb-1">إجمالي المدارس</p>
          <p className="text-3xl font-bold text-blue-600">{schools.length}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <p className="text-gray-500 text-sm mb-1">متوسط الإنجاز</p>
          <p className="text-3xl font-bold text-green-600">{averageCompletion}%</p>
          <div className="w-full bg-gray-100 h-2 rounded-full mt-3 overflow-hidden">
             <div className="bg-green-500 h-full transition-all duration-1000" style={{ width: `${averageCompletion}%` }}></div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <p className="text-gray-500 text-sm mb-1">مدارس مكتملة (100%)</p>
          <p className="text-3xl font-bold text-purple-600">{schools.filter(s => s.completionPercentage === 100).length}</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h3 className="font-bold text-lg">قائمة المدارس المكلف بها</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse">
            <thead className="bg-gray-50 text-gray-500 text-sm">
              <tr>
                <th className="p-4 border-b">اسم المدرسة</th>
                <th className="p-4 border-b">التصنيف</th>
                <th className="p-4 border-b">نسبة الإنجاز</th>
                <th className="p-4 border-b">الحالة</th>
                <th className="p-4 border-b">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {schools.map(school => (
                <tr key={school.id} className="hover:bg-blue-50 transition-colors">
                  <td className="p-4 font-bold">{school.name}</td>
                  <td className="p-4"><span className="px-3 py-1 bg-gray-100 rounded-full text-xs">{school.type}</span></td>
                  <td className="p-4">
                    <div className="flex items-center">
                      <span className="ml-3 font-semibold">{school.completionPercentage}%</span>
                      <div className="flex-1 max-w-[100px] bg-gray-100 h-1.5 rounded-full overflow-hidden">
                        <div className={`h-full ${school.completionPercentage === 100 ? 'bg-green-500' : 'bg-blue-500'}`} style={{ width: `${school.completionPercentage}%` }}></div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    {school.completionPercentage === 100 ? (
                      <span className="flex items-center text-green-600 text-xs font-bold">
                        <CheckCircle size={14} className="ml-1" /> مكتمل
                      </span>
                    ) : (
                      <span className="flex items-center text-orange-500 text-xs font-bold">
                        جاري التنفيذ
                      </span>
                    )}
                  </td>
                  <td className="p-4">
                    <div className="flex space-x-2 space-x-reverse">
                      <button 
                        onClick={() => onEdit(school.id)}
                        className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                        title="تحديث البيانات"
                      >
                        <FileEdit size={18} />
                      </button>
                      <button 
                        onClick={() => onPrint(school.id)}
                        className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        title="طباعة التقرير"
                      >
                        <Printer size={18} />
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

export default AdminDashboard;
