
import React, { useState } from 'react';
import { School, Checklist } from '../types';
import { CHECKLIST_LABELS } from '../constants';
import { Check, ArrowRight, Save } from 'lucide-react';

interface SchoolFormProps {
  school: School;
  onSave: (id: string, checklist: Checklist) => void;
  onCancel: () => void;
}

const SchoolForm: React.FC<SchoolFormProps> = ({ school, onSave, onCancel }) => {
  const [checklist, setChecklist] = useState<Checklist>(school.checklist);

  const toggleItem = (key: keyof Checklist) => {
    setChecklist(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const labels = Object.keys(CHECKLIST_LABELS) as Array<keyof Checklist>;
  const completedCount = labels.filter(key => checklist[key] === true).length;
  const totalCount = labels.length;
  const progress = Math.round((completedCount / totalCount) * 100);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">{school.name}</h2>
            <p className="text-gray-500">تحديث بنود الجودة (برجاء التحري بدقة)</p>
          </div>
          <button 
            onClick={onCancel}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowRight size={24} className="text-gray-400" />
          </button>
        </div>

        <div className="bg-blue-50 p-6 rounded-2xl mb-8 flex items-center justify-between border border-blue-100">
          <div className="flex-1">
             <div className="flex justify-between items-center mb-2">
               <p className="text-sm font-black text-blue-900">معدل الإنجاز</p>
               <p className="text-sm font-black text-blue-900">{progress}%</p>
             </div>
             <div className="w-full bg-blue-200 h-3 rounded-full overflow-hidden">
               <div className="bg-blue-600 h-full transition-all duration-700" style={{ width: `${progress}%` }}></div>
             </div>
          </div>
          <div className="mr-8 text-center bg-white px-4 py-2 rounded-xl shadow-sm border border-blue-100">
            <p className="text-2xl font-black text-blue-800 leading-none">{completedCount}/{totalCount}</p>
            <p className="text-[10px] text-blue-400 font-bold uppercase mt-1">بند مكتمل</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3">
          {labels.map((key) => (
            <div 
              key={key}
              onClick={() => toggleItem(key)}
              className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-center justify-between group ${
                checklist[key] ? 'border-green-500 bg-green-50 shadow-sm' : 'border-gray-100 hover:border-blue-200 bg-gray-50'
              }`}
            >
              <div className="flex items-center">
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center ml-4 border-2 transition-all ${
                  checklist[key] ? 'bg-green-500 border-green-500 text-white shadow-md' : 'border-gray-300 bg-white group-hover:border-blue-400'
                }`}>
                  {checklist[key] && <Check size={16} strokeWidth={3} />}
                </div>
                <span className={`font-bold text-sm ${checklist[key] ? 'text-green-900' : 'text-gray-600'}`}>
                  {CHECKLIST_LABELS[key]}
                </span>
              </div>
              <div className={`px-4 py-1.5 rounded-lg text-[10px] font-black transition-all ${
                checklist[key] ? 'bg-green-200 text-green-700' : 'bg-gray-200 text-gray-400'
              }`}>
                {checklist[key] ? 'تم المراجعة' : 'مطلوب'}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 pt-6 border-t border-gray-100 flex justify-end gap-3">
          <button 
            onClick={onCancel}
            className="px-6 py-3 rounded-xl text-gray-400 hover:bg-gray-100 font-bold transition-all"
          >
            إلغاء التعديل
          </button>
          <button 
            onClick={() => onSave(school.id, checklist)}
            className="px-10 py-3 bg-slate-900 text-white rounded-xl font-black hover:bg-blue-600 shadow-xl flex items-center transition-all transform hover:scale-[1.02]"
          >
            <Save size={18} className="ml-2" /> حفظ  
          </button>
        </div>
      </div>
    </div>
  );
};

export default SchoolForm;
