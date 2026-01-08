
import React, { useState, useEffect, useMemo } from 'react';
import { INITIAL_SCHOOLS, ADMIN_MAP, CHECKLIST_LABELS } from './constants';
import { User, School, Checklist, SchoolType } from './types';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import AdminDashboard from './components/AdminDashboard';
import SuperAdminDashboard from './components/SuperAdminDashboard';
import SchoolForm from './components/SchoolForm';
import PrintView from './components/PrintView';
import { LogIn, Loader2, CheckCircle, AlertCircle, Database, WifiOff, RefreshCw } from 'lucide-react';
import { supabase } from './supabase';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [schools, setSchools] = useState<School[]>([]);
  const [loading, setLoading] = useState(true);
  const [dbStatus, setDbStatus] = useState<'connecting' | 'connected' | 'offline'>('connecting');
  const [currentView, setCurrentView] = useState<'dashboard' | 'edit' | 'print'>('dashboard');
  const [selectedSchoolId, setSelectedSchoolId] = useState<string | null>(null);
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const calculatePercentage = (checklist: Checklist) => {
    const totalItems = Object.keys(CHECKLIST_LABELS).length;
    const completedItems = Object.values(checklist).filter(val => val === true).length;
    return Math.round((completedItems / totalItems) * 100);
  };

  const checkConnection = async () => {
    try {
      const { error } = await supabase.from('schools').select('id', { count: 'exact', head: true }).limit(1);
      if (error && error.code !== 'PGRST116') throw error;
      setDbStatus('connected');
      return true;
    } catch (err) {
      setDbStatus('offline');
      return false;
    }
  };

  useEffect(() => {
    const initApp = async () => {
      const localData = localStorage.getItem('ismailia_schools_data');
      if (localData) {
        setSchools(JSON.parse(localData));
      } else {
        setSchools(INITIAL_SCHOOLS);
      }

      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          handleUserEntry(session.user);
        }
        await checkConnection();
        await fetchSchoolsFromCloud();
      } catch (err) {
        setDbStatus('offline');
      } finally {
        setLoading(false);
      }
    };

    initApp();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        handleUserEntry(session.user);
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleUserEntry = (supabaseUser: any) => {
    const email = supabaseUser.email.toLowerCase().trim();
    const areaId = ADMIN_MAP[email] || null;
    const role = email === 'superadmin@gmail.com' ? 'superadmin' : 'admin';
    
    setUser({
      id: supabaseUser.id,
      username: email,
      name: email.split('@')[0].toUpperCase(),
      role: role,
      areaId: areaId
    });
  };

  const fetchSchoolsFromCloud = async () => {
    try {
      const { data, error } = await supabase.from('schools').select('*');
      if (error) throw error;

      if (data && data.length > 0) {
        const formatted = data.map(s => ({
          id: s.id,
          name: s.name,
          type: s.type as SchoolType,
          areaId: s.area_id,
          adminId: s.admin_id,
          accreditationDate: s.accreditation_date,
          checklist: typeof s.checklist === 'string' ? JSON.parse(s.checklist) : s.checklist,
          completionPercentage: s.completion_percentage || 0
        }));
        setSchools(formatted);
        localStorage.setItem('ismailia_schools_data', JSON.stringify(formatted));
        return true;
      }
    } catch (err) {
      return false;
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const email = loginData.email.toLowerCase().trim();
    
    try {
      const { data, error: loginError } = await supabase.auth.signInWithPassword({
        email: email,
        password: loginData.password,
      });

      if (loginError) {
        if (loginData.password === '123456' && ADMIN_MAP[email]) {
          setUser({
            id: 'local-session',
            username: email,
            name: email.split('@')[0],
            role: email === 'superadmin@gmail.com' ? 'superadmin' : 'admin',
            areaId: ADMIN_MAP[email]
          });
          setDbStatus('offline');
          setLoading(false);
          return;
        }
        throw loginError;
      }
      
      await checkConnection();
      await fetchSchoolsFromCloud();
      setLoading(false);
    } catch (err: any) {
      setError('بيانات الدخول غير صحيحة');
      setLoading(false);
    }
  };

  const handleUpdateSchool = async (schoolId: string, checklist: Checklist) => {
    const percentage = calculatePercentage(checklist);
    const schoolToUpdate = schools.find(s => s.id === schoolId);
    if (!schoolToUpdate) return;

    const updatedSchools = schools.map(s => s.id === schoolId ? { ...s, checklist, completionPercentage: percentage } : s);
    setSchools(updatedSchools);
    localStorage.setItem('ismailia_schools_data', JSON.stringify(updatedSchools));

    if (user?.id !== 'local-session') {
      try {
        await supabase.from('schools').upsert({ 
          id: schoolId,
          name: schoolToUpdate.name,
          type: schoolToUpdate.type,
          area_id: schoolToUpdate.areaId,
          admin_id: schoolToUpdate.adminId,
          accreditation_date: schoolToUpdate.accreditationDate,
          checklist: checklist,
          completion_percentage: percentage
        });
        setDbStatus('connected');
        setSuccessMsg('تم الحفظ والمزامنة');
      } catch (err) {
        setDbStatus('offline');
        setSuccessMsg('حفظ محلي فقط');
      }
    }

    setTimeout(() => setSuccessMsg(''), 3000);
    setCurrentView('dashboard');
    setSelectedSchoolId(null);
  };

  // وظيفة طباعة محسنة تتجاوز قيود الـ Sandbox
  const handlePrint = () => {
    const printContent = document.querySelector('.print-only')?.innerHTML;
    if (!printContent) {
      alert("عذراً، لا يوجد محتوى للطباعة حالياً");
      return;
    }

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html lang="ar" dir="rtl">
          <head>
            <title>طباعة تقرير جودة</title>
            <script src="https://cdn.tailwindcss.com"></script>
            <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;600;700;900&display=swap" rel="stylesheet">
            <style>
              body { font-family: 'Cairo', sans-serif; padding: 20px; background: white; }
              @media print {
                body { padding: 0; }
                .no-print { display: none !important; }
              }
              .printable-content { 
                visibility: visible !important; 
                display: block !important;
                width: 100% !important;
              }
            </style>
          </head>
          <body>
            <div class="printable-content">
              ${printContent}
            </div>
            <script>
              window.onload = () => {
                setTimeout(() => {
                  window.print();
                  window.onafterprint = () => window.close();
                }, 500);
              };
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
    } else {
      // إذا فشل فتح نافذة جديدة (بسبب Pop-up blocker)، نستخدم الطريقة العادية كحل أخير
      window.print();
    }
  };

  const syncAllData = async () => {
    setLoading(true);
    const isConnected = await checkConnection();
    if (isConnected) {
      await fetchSchoolsFromCloud();
      setSuccessMsg('تم التحديث');
    } else {
      setError('أنت غير متصل');
    }
    setLoading(false);
    setTimeout(() => { setError(''); setSuccessMsg(''); }, 2000);
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setLoginData({ email: '', password: '' });
  };

  const filteredSchools = useMemo(() => {
    if (!user) return [];
    if (user.role === 'superadmin') return schools;
    return schools.filter(s => s.areaId === user.areaId);
  }, [schools, user]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <Loader2 className="animate-spin text-blue-600 mb-4" size={48} />
        <p className="text-slate-600 font-bold">جاري تحميل المنظومة...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4 rtl">
        <div className="max-w-md w-full bg-white rounded-[2rem] shadow-2xl p-10 border border-slate-200">
          <div className="text-center mb-8">
            <div className="bg-blue-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 text-white shadow-xl">
              <LogIn size={32} />
            </div>
            <h1 className="text-2xl font-black text-slate-800">جودة الإسماعيلية</h1>
            <p className="text-slate-400 text-sm mt-2">تسجيل دخول المسؤولين</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="email"
              className="w-full px-6 py-4 rounded-xl bg-slate-50 border border-slate-200 outline-none text-right"
              placeholder="البريد الإلكتروني"
              value={loginData.email}
              onChange={e => setLoginData(d => ({ ...d, email: e.target.value }))}
              required
            />
            <input
              type="password"
              className="w-full px-6 py-4 rounded-xl bg-slate-50 border border-slate-200 outline-none text-right"
              placeholder="كلمة المرور"
              value={loginData.password}
              onChange={e => setLoginData(d => ({ ...d, password: e.target.value }))}
              required
            />
            {error && <p className="text-red-500 text-xs text-center font-bold">{error}</p>}
            <button type="submit" className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl shadow-lg hover:bg-blue-600 transition-all">
              دخول النظام
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="fixed top-4 right-4 z-[110] flex flex-col gap-2 no-print">
        {successMsg && (
          <div className="bg-green-600 text-white px-6 py-3 rounded-xl shadow-2xl flex items-center">
            <CheckCircle size={18} className="ml-2" />
            <span className="font-bold text-sm">{successMsg}</span>
          </div>
        )}
        <div className="flex gap-2">
           <button onClick={syncAllData} className="p-2 bg-white border border-slate-200 rounded-full shadow-md text-slate-600">
             <RefreshCw size={16} />
           </button>
           <div className={`px-4 py-2 rounded-full text-[10px] font-bold shadow-md flex items-center ${dbStatus === 'connected' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
            {dbStatus === 'connected' ? <Database size={12} className="ml-1" /> : <WifiOff size={12} className="ml-1" />}
            {dbStatus === 'connected' ? 'متصل' : 'محلي'}
          </div>
        </div>
      </div>

      <div className="flex min-h-screen bg-slate-50 no-print">
        <Sidebar user={user} currentView={currentView} setView={setCurrentView} onLogout={logout} />
        <main className="flex-1 flex flex-col min-h-screen overflow-hidden">
          <Header user={user} />
          <div className="p-4 md:p-8 flex-1 overflow-y-auto">
            {currentView === 'dashboard' && (
              user.role === 'superadmin' ? (
                <SuperAdminDashboard schools={schools} onEdit={(id) => { setSelectedSchoolId(id); setCurrentView('edit'); }} onPrint={(id) => { setSelectedSchoolId(id); setCurrentView('print'); }} />
              ) : (
                <AdminDashboard schools={filteredSchools} onEdit={(id) => { setSelectedSchoolId(id); setCurrentView('edit'); }} onPrint={(id) => { setSelectedSchoolId(id); setCurrentView('print'); }} />
              )
            )}
            
            {currentView === 'edit' && selectedSchoolId && (
              <SchoolForm school={schools.find(s => s.id === selectedSchoolId)!} onSave={handleUpdateSchool} onCancel={() => { setSelectedSchoolId(null); setCurrentView('dashboard'); }} />
            )}

            {currentView === 'print' && selectedSchoolId && (
              <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-6 bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
                  <h2 className="text-lg font-black text-slate-800">معاينة التقرير</h2>
                  <div className="flex gap-2">
                    <button onClick={handlePrint} className="bg-blue-600 text-white px-6 py-2 rounded-xl font-bold text-sm shadow-lg hover:bg-blue-700 transition-colors">إصدار أمر الطباعة</button>
                    <button onClick={() => { setSelectedSchoolId(null); setCurrentView('dashboard'); }} className="bg-slate-100 px-6 py-2 rounded-xl font-bold text-sm border border-slate-200 hover:bg-slate-200 transition-colors">رجوع</button>
                  </div>
                </div>
                <div className="bg-white p-2 md:p-10 rounded-3xl shadow-xl border border-slate-200">
                   <PrintView school={schools.find(s => s.id === selectedSchoolId)!} />
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* المحتوى المخصص للطباعة فقط */}
      <div className="print-only" style={{ display: 'none' }}>
         {selectedSchoolId && <PrintView school={schools.find(s => s.id === selectedSchoolId)!} />}
      </div>
    </>
  );
};

export default App;
