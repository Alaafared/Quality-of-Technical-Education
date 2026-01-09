
import React from 'react';
import { School } from '../types';
import { AREAS, CHECKLIST_LABELS } from '../constants';

interface PrintViewProps {
  school: School;
}

const PrintView: React.FC<PrintViewProps> = ({ school }) => {
  const areaName = AREAS.find(a => a.id === school.areaId)?.name || '';

  return (
    <div className="printable-content bg-white text-black p-4 md:p-8 w-full mx-auto border-2 border-black">
      <div className="flex justify-between items-start border-b-4 border-double border-black pb-6 mb-8">
        <div className="text-right">
          <p className="font-bold text-lg">محافظة الإسماعيلية</p>
          <p className="font-bold">مديرية التربية والتعليم</p>
          <p className="font-bold text-sm">إدارة التعليم الفني - قسم الجودة</p>
        </div>
        <div className="text-center flex-1 mx-4 pt-2">
          <h1 className="text-2xl font-black mb-2">تقرير متابعة جودة مدرسة</h1>
          <p className="text-lg font-bold border-b border-black inline-block px-4 pb-1">{school.name}</p>
        </div>
        <div className="text-left">
            <img 
                src="logo.jpg" // ضع مسار الصورة هنا (مثلاً في مجلد public)
                alt="Logo" 
                className="w-full h-full object-contain"
              />            </div>
          <p className="text-[10px] font-bold">كود التقرير: QR-{school.id.split('-').pop()}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-x-12 gap-y-3 mb-6 bg-gray-50 p-4 border border-black text-sm">
        <div>
          <span className="font-black">نوع المدرسة: </span>
          <span>{school.type}</span>
        </div>
        <div>
          <span className="font-black">الإدارة التعليمية: </span>
          <span>{areaName}</span>
        </div>
        <div>
          <span className="font-black">تاريخ الاعتماد: </span>
          <span>{school.accreditationDate}</span>
        </div>
        <div>
          <span className="font-black">تاريخ استخراج البيان: </span>
          <span>{new Date().toLocaleDateString('ar-EG')}</span>
        </div>
      </div>

      <h3 className="text-center bg-black text-white py-2 mb-4 font-black text-sm">جدول مطابقة معايير الجودة</h3>
      
      <table className="w-full border-collapse border-2 border-black mb-6 text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-black p-2 w-12 text-center">م</th>
            <th className="border border-black p-2 text-right">معيار الجودة والمتابعة</th>
            <th className="border border-black p-2 w-32 text-center">حالة التنفيذ</th>
          </tr>
        </thead>
        <tbody>
          {(Object.keys(CHECKLIST_LABELS) as Array<keyof typeof CHECKLIST_LABELS>).map((key, index) => (
            <tr key={key}>
              <td className="border border-black p-2 text-center font-bold">{index + 1}</td>
              <td className="border border-black p-2 text-right">{CHECKLIST_LABELS[key]}</td>
              <td className="border border-black p-2 text-center font-black">
                {school.checklist[key] ? (
                  <span className="text-green-800">● تم التنفيذ</span>
                ) : (
                  <span className="text-red-800">○ لم يتم</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="bg-gray-50 p-4 border-2 border-black mb-10">
        <div className="flex justify-between items-center">
          <p className="text-lg font-black">إجمالي نسبة استيفاء المعايير:</p>
          <div className="text-3xl font-black border-2 border-black px-6 py-2 bg-white">
            {school.completionPercentage}%
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 pt-4 text-center text-sm font-bold">
        <div>
          <p className="mb-10">عضو الجودة (المتابع)</p>
          <p className="border-t border-black pt-2 w-32 mx-auto">........................</p>
        </div>
        <div>
          <p className="mb-10">مسئول الجودة بالمدرسة</p>
          <p className="border-t border-black pt-2 w-32 mx-auto">........................</p>
        </div>
        <div>
          <p className="mb-10">مدير المدرسة </p>
          <p className="border-t border-black pt-2 w-32 mx-auto">........................</p>
        </div>
      </div>

      <div className="mt-16 border-t border-dotted border-black pt-4 text-[10px] text-gray-600 text-center italic">
        مستند إلكتروني رسمي مستخرج من منظومة متابعة الجودة الرقمية - تعليم فني الإسماعيلية
      </div>
    </div>
  );
};

export default PrintView;
