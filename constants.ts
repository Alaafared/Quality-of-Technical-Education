
import { Area, School, Checklist, SchoolType } from './types';

export const CHECKLIST_LABELS: Record<keyof Checklist, string> = {
  teamFormed: "تشكيل فريق الجودة",
  visionMission: "رؤية ورسالة وأهداف",
  safetyProcedures: "إجراءات الأمن والسلامة",
  attendanceStats: "إحصائيات الغياب والانجازات",
  qualityDatabase: "قاعدة بيانات الجودة",
  programFiles: "ملفات البرنامج (مشرفي البرامج)",
  assignmentsLog: "سجل التكليفات محدث",
  warningSigns: "إرشادات تحذيرية في الورش",
  fireExtinguishers: "صيانة طفايات الحريق",
  trainingNeeds: "تحديد الاحتياجات التدريبية"
};

// خريطة المسؤولين: ربط البريد الإلكتروني بالمنطقة
export const ADMIN_MAP: Record<string, string> = {
  'admin1@gmail.com': 'north',
  'admin2@gmail.com': 'south',
  'admin3@gmail.com': 'abusoweir',
  'admin4@gmail.com': 'kassasin',
  'admin5@gmail.com': 'tall',
  'admin6@gmail.com': 'fayed',
  'admin7@gmail.com': 'qantara_west',
  'admin8@gmail.com': 'qantara_east',
  'superadmin@gmail.com': 'all' // حساب المدير العام
};

export const AREAS: Area[] = [
  { id: 'north', name: 'شمال الإسماعيلية', adminId: 'admin1@gmail.com' },
  { id: 'south', name: 'جنوب الإسماعيلية', adminId: 'admin2@gmail.com' },
  { id: 'abusoweir', name: 'منطقة أبو صوير', adminId: 'admin3@gmail.com' },
  { id: 'kassasin', name: 'منطقة القصاصين', adminId: 'admin4@gmail.com' },
  { id: 'tall', name: 'منطقة التل الكبير', adminId: 'admin5@gmail.com' },
  { id: 'fayed', name: 'منطقة فايد', adminId: 'admin6@gmail.com' },
  { id: 'qantara_west', name: 'منطقة القنطرة غرب', adminId: 'admin7@gmail.com' },
  { id: 'qantara_east', name: 'منطقة القنطرة شرق', adminId: 'admin8@gmail.com' },
];

const createEmptyChecklist = (): Checklist => ({
  teamFormed: false,
  visionMission: false,
  safetyProcedures: false,
  attendanceStats: false,
  qualityDatabase: false,
  programFiles: false,
  assignmentsLog: false,
  warningSigns: false,
  fireExtinguishers: false,
  trainingNeeds: false,
});

const schoolDataRaw: { areaId: string; schools: { name: string; type: SchoolType }[] }[] = [
  {
    areaId: 'north',
    schools: [
      { name: 'تكنولوجيا المعلومات المتقدمة ص. ع. بنين', type: 'صناعي' },
      { name: 'إبراهيم أحمد عثمان ص. ع. بنين', type: 'صناعي' },
      { name: 'المعدات الثقيلة ص. ع. بنين', type: 'صناعي' },
      { name: 'الإسماعيلية المعمارية ص. ع. بنين', type: 'صناعي' },
      { name: 'السلام الزخرفية ص. ع. بنين', type: 'صناعي' },
      { name: 'الفنية الكهربية الصناعية بنات', type: 'صناعي' },
      { name: 'الفنية الزخرفية الصناعية بنات', type: 'صناعي' },
      { name: 'طلعت حرب التجارية ع بنين', type: 'تجاري' },
      { name: 'المدرسة الفنية التجارية المتقدمة', type: 'تجاري' },
      { name: 'التجارة القديمة التجارية بنات', type: 'تجاري' },
      { name: 'أم المؤمنين التجارية بنات', type: 'تجاري' },
      { name: 'الفنية التجريبية للاستصلاح الأراضي', type: 'زراعي' },
      { name: 'الإسماعيلية الزراعية المشتركة', type: 'زراعي' },
    ]
  },
  {
    areaId: 'south',
    schools: [
      { name: 'أبو عطوة الصناعية بنات', type: 'صناعي' },
      { name: 'أبو عطوة التجارية بنات', type: 'تجاري' },
    ]
  },
  {
    areaId: 'abusoweir',
    schools: [
      { name: 'الشهيد محمد محمد علي إبراهيم ص. ع. مشتركة', type: 'صناعي' },
      { name: 'الشهيد صلاح إبراهيم النجار التجارية ع المشتركة', type: 'تجاري' },
      { name: 'صلاح عبد الغني الزراعية المشتركة', type: 'زراعي' },
    ]
  },
  {
    areaId: 'kassasin',
    schools: [
      { name: 'القصاصين ص. ع. مشتركة', type: 'صناعي' },
      { name: 'حسن غنيمي التجارية المشتركة', type: 'تجاري' },
      { name: 'القصاصين الزراعية المشتركة', type: 'زراعي' },
    ]
  },
  {
    areaId: 'tall',
    schools: [
      { name: 'الشهيد أحمد عادل وصفي ص. ع. مشتركة', type: 'صناعي' },
      { name: 'التل الكبير التجارية المشتركة', type: 'تجاري' },
      { name: 'التل الكبير الزراعية المشتركة', type: 'زراعي' },
    ]
  },
  {
    areaId: 'fayed',
    schools: [
      { name: 'فايد الصناعية ع بنين', type: 'صناعي' },
      { name: 'الشهيد طيار محمد جمال الدين ص بنين', type: 'صناعي' },
      { name: 'الشهيد طيار محمود محمد فؤاد التجارية بنات', type: 'تجاري' },
      { name: 'الشهيد حسن ربيع حسين التجارية بنين', type: 'تجاري' },
      { name: 'فنارة الزراعية المشتركة', type: 'زراعي' },
      { name: 'سرابيوم الزراعية المشتركة', type: 'زراعي' },
    ]
  },
  {
    areaId: 'qantara_west',
    schools: [
      { name: 'القنطرة غرب الصناعية ع بنين (١)', type: 'صناعي' },
      { name: 'القنطرة غرب الصناعية ع بنين (٢)', type: 'صناعي' },
      { name: 'القنطرة غرب التجارية المشتركة', type: 'تجاري' },
      { name: 'أبو خليفة التجارية بنات', type: 'تجاري' },
      { name: 'القنطرة غرب الزراعية المشتركة', type: 'زراعي' },
    ]
  },
  {
    areaId: 'qantara_east',
    schools: [
      { name: 'الشهيد مقدم محمد عبد الإله صالح علي السيد ص ع المشتركة', type: 'صناعي' },
      { name: 'القنطرة شرق التجارية المشتركة', type: 'تجاري' },
      { name: 'القنطرة شرق الزراعية المشتركة', type: 'زراعي' },
      { name: 'الأحرار الزراعية المشتركة', type: 'زراعي' },
    ]
  }
];

export const INITIAL_SCHOOLS: School[] = schoolDataRaw.flatMap((areaGroup, idx) => 
  areaGroup.schools.map((s, sIdx) => ({
    id: `school-${idx}-${sIdx}`,
    name: s.name,
    type: s.type,
    areaId: areaGroup.areaId,
    adminId: AREAS.find(a => a.id === areaGroup.areaId)?.adminId || '',
    accreditationDate: '2024-01-01',
    checklist: createEmptyChecklist(),
    completionPercentage: 0
  }))
);
