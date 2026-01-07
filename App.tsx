import React, { useState, useEffect } from 'react';
import { Employee, Department, EmployeeStatus } from './types';
import { EmployeeList } from './components/EmployeeList';
import { EmployeeDetail } from './components/EmployeeDetail';
import { DepartmentChart } from './components/DepartmentChart';
import { Users, Search, Plus, Settings, Download, Upload, X, Clipboard, Save, UserPlus, Github, CloudDownload } from 'lucide-react';

// Mock Data
const MOCK_EMPLOYEES: Employee[] = [
  {
    id: 'EMP-001',
    firstName: 'Somchai',
    lastName: 'Jaidee',
    email: 'somchai.j@company.com',
    phone: '081-234-5678',
    position: 'Senior Developer',
    department: Department.IT,
    status: EmployeeStatus.ACTIVE,
    startDate: '2020-05-15',
    avatarUrl: 'https://picsum.photos/seed/somchai/200/200',
    bio: '',
    history: [
      {
        id: '1',
        date: '2023-01-15',
        type: 'Promotion',
        title: 'Promoted to Senior',
        description: 'Demonstrated exceptional leadership in the Mobile App project.',
      },
      {
        id: '2',
        date: '2021-12-01',
        type: 'Performance Review',
        title: 'Year End Review 2021',
        description: 'Met all KPIs. Needs to improve English communication skills.',
      }
    ]
  },
  {
    id: 'EMP-002',
    firstName: 'Somsri',
    lastName: 'Rakngan',
    email: 'somsri.r@company.com',
    phone: '089-987-6543',
    position: 'HR Manager',
    department: Department.HR,
    status: EmployeeStatus.ACTIVE,
    startDate: '2019-02-01',
    avatarUrl: 'https://picsum.photos/seed/somsri/200/200',
    bio: 'Somsri is a dedicated HR professional with over 5 years of experience in talent acquisition and employee relations. She has successfully streamlined the recruitment process and implemented effective employee retention strategies.',
    history: []
  },
  {
    id: 'EMP-003',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.d@company.com',
    phone: '02-111-2222',
    position: 'Sales Executive',
    department: Department.SALES,
    status: EmployeeStatus.PROBATION,
    startDate: '2023-11-01',
    avatarUrl: 'https://picsum.photos/seed/john/200/200',
    bio: '',
    history: []
  }
];

const STORAGE_KEY = 'hr_smart_records_data';

const App: React.FC = () => {
  // Initialize state from LocalStorage if available, otherwise use Mock Data
  const [employees, setEmployees] = useState<Employee[]>(() => {
    try {
      const savedData = localStorage.getItem(STORAGE_KEY);
      return savedData ? JSON.parse(savedData) : MOCK_EMPLOYEES;
    } catch (error) {
      console.error('Failed to load data from storage:', error);
      return MOCK_EMPLOYEES;
    }
  });

  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Settings Modal State
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [pasteData, setPasteData] = useState('');

  // Add Employee Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newEmp, setNewEmp] = useState({
    firstName: '',
    lastName: '',
    email: '',
    position: '',
    department: Department.IT,
    startDate: new Date().toISOString().split('T')[0]
  });

  const selectedEmployee = employees.find(e => e.id === selectedEmployeeId);

  // Auto-save to LocalStorage whenever employees change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(employees));
  }, [employees]);

  const handleUpdateEmployee = (updated: Employee) => {
    setEmployees(prev => prev.map(e => e.id === updated.id ? updated : e));
  };

  // --- Data Management Functions ---
  const handleExportData = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(employees, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "hr_records_backup.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const handleImportFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    if (event.target.files && event.target.files[0]) {
      fileReader.readAsText(event.target.files[0], "UTF-8");
      fileReader.onload = (e) => {
        if (e.target?.result) {
          try {
            const parsedData = JSON.parse(e.target.result as string);
            processImportData(parsedData);
          } catch (err) {
            console.error(err);
            alert('ไม่สามารถอ่านไฟล์ได้ (Invalid JSON)');
          }
        }
      };
    }
  };

  const handlePasteImport = () => {
    try {
      const parsedData = JSON.parse(pasteData.trim());
      processImportData(parsedData);
      setPasteData('');
    } catch (err) {
      alert('ข้อมูลที่วางไม่ถูกต้อง (Invalid JSON Format) กรุณาตรวจสอบว่าก๊อปปี้มาครบถ้วนและถูกต้อง');
    }
  };

  const processImportData = (data: any) => {
    if (Array.isArray(data) && data.length > 0 && data[0].id) {
       setEmployees(data);
       setIsSettingsOpen(false);
       alert(`นำเข้าข้อมูลพนักงาน ${data.length} คนสำเร็จ!`);
    } else {
       alert('รูปแบบข้อมูลไม่ถูกต้อง (ต้องเป็น Array ของข้อมูลพนักงาน)');
    }
  };

  // --- Add Employee Functions ---
  const handleAddEmployee = () => {
    if (!newEmp.firstName || !newEmp.lastName || !newEmp.position) return;

    const newId = `EMP-${String(employees.length + 1).padStart(3, '0')}`;
    const newEmployeeFull: Employee = {
      id: newId,
      firstName: newEmp.firstName,
      lastName: newEmp.lastName,
      email: newEmp.email || `${newEmp.firstName.toLowerCase()}@company.com`,
      phone: '-',
      position: newEmp.position,
      department: newEmp.department,
      status: EmployeeStatus.PROBATION,
      startDate: newEmp.startDate,
      avatarUrl: `https://ui-avatars.com/api/?name=${newEmp.firstName}+${newEmp.lastName}&background=random`,
      bio: '',
      history: []
    };

    setEmployees([...employees, newEmployeeFull]);
    setIsAddModalOpen(false);
    setSelectedEmployeeId(newId);
    
    // Reset Form
    setNewEmp({
      firstName: '',
      lastName: '',
      email: '',
      position: '',
      department: Department.IT,
      startDate: new Date().toISOString().split('T')[0]
    });
  };

  const filteredEmployees = employees.filter(e => 
    e.firstName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    e.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.position.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50 text-gray-800 font-sans relative">
      
      {/* Settings Modal (Data Manager) */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 relative max-h-[90vh] overflow-y-auto">
            <button 
              onClick={() => setIsSettingsOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X size={24} />
            </button>
            
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <CloudDownload className="text-indigo-600" /> Data Sync & Settings
            </h2>

            <div className="space-y-6">
              
              {/* Paste JSON / GitHub Import */}
              <div className="bg-white border-2 border-indigo-100 rounded-xl p-4 shadow-sm">
                <h3 className="font-semibold text-indigo-900 mb-2 flex items-center gap-2">
                  <Github size={18} /> นำเข้าข้อมูลจาก GitHub / Text
                </h3>
                
                <div className="bg-indigo-50 p-3 rounded-lg mb-3 text-xs text-indigo-800 border border-indigo-100">
                  <strong className="block mb-1">วิธีซิงค์ข้อมูลจาก GitHub:</strong>
                  <ol className="list-decimal ml-4 space-y-1 opacity-80">
                    <li>ไปที่ GitHub > เปิดไฟล์ <code>data.json</code></li>
                    <li>คลิกปุ่ม <strong>Raw</strong></li>
                    <li>ก๊อปปี้ข้อความทั้งหมด (Ctrl+A, Ctrl+C)</li>
                    <li>นำมาวางในช่องด้านล่าง แล้วกดปุ่มยืนยัน</li>
                  </ol>
                </div>

                <textarea 
                  value={pasteData}
                  onChange={(e) => setPasteData(e.target.value)}
                  placeholder='วางข้อมูล JSON ที่นี่...'
                  className="w-full h-32 p-3 text-xs font-mono border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 mb-3"
                />
                <button 
                  onClick={handlePasteImport}
                  disabled={!pasteData}
                  className="w-full bg-indigo-600 text-white py-2.5 rounded-lg text-sm font-bold hover:bg-indigo-700 transition-colors disabled:bg-gray-300 flex justify-center items-center gap-2 shadow-md shadow-indigo-200"
                >
                  <Save size={16} /> ยืนยันการนำเข้าข้อมูล (Import)
                </button>
              </div>

              <div className="relative flex items-center py-2">
                <div className="flex-grow border-t border-gray-200"></div>
                <span className="flex-shrink-0 mx-4 text-gray-400 text-xs uppercase">หรือ</span>
                <div className="flex-grow border-t border-gray-200"></div>
              </div>

              {/* Import File */}
              <div>
                <h3 className="font-semibold text-gray-700 mb-2 flex items-center gap-2 text-sm">
                  <Upload size={16} /> นำเข้าจากไฟล์ (.json)
                </h3>
                <label className="flex flex-col items-center justify-center w-full h-16 border border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                    <div className="flex flex-col items-center justify-center pt-2 pb-2">
                        <p className="text-xs text-gray-500">คลิกเพื่อเลือกไฟล์จากคอมพิวเตอร์</p>
                    </div>
                    <input type="file" className="hidden" accept=".json" onChange={handleImportFile} />
                </label>
              </div>

               {/* Export */}
               <div>
                <h3 className="font-semibold text-gray-700 mb-2 flex items-center gap-2 text-sm">
                  <Download size={16} /> สำรองข้อมูล (Backup)
                </h3>
                <button 
                  onClick={handleExportData}
                  className="w-full bg-white border border-gray-300 text-gray-700 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors flex justify-center items-center gap-2"
                >
                  <Download size={14} /> ดาวน์โหลด JSON ปัจจุบัน
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* Add Employee Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 relative">
            <button 
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X size={24} />
            </button>
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <UserPlus className="text-indigo-600" /> เพิ่มพนักงานใหม่
            </h2>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">ชื่อจริง</label>
                  <input 
                    type="text" 
                    value={newEmp.firstName}
                    onChange={e => setNewEmp({...newEmp, firstName: e.target.value})}
                    className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 p-2 border"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">นามสกุล</label>
                  <input 
                    type="text" 
                    value={newEmp.lastName}
                    onChange={e => setNewEmp({...newEmp, lastName: e.target.value})}
                    className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 p-2 border"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ตำแหน่ง (Position)</label>
                <input 
                  type="text" 
                  value={newEmp.position}
                  onChange={e => setNewEmp({...newEmp, position: e.target.value})}
                  className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 p-2 border"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">แผนก</label>
                  <select 
                    value={newEmp.department}
                    onChange={e => setNewEmp({...newEmp, department: e.target.value as Department})}
                    className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 p-2 border"
                  >
                    {Object.values(Department).map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">วันที่เริ่มงาน</label>
                  <input 
                    type="date" 
                    value={newEmp.startDate}
                    onChange={e => setNewEmp({...newEmp, startDate: e.target.value})}
                    className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 p-2 border"
                  />
                </div>
              </div>

              <button 
                onClick={handleAddEmployee}
                className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all mt-4"
              >
                บันทึกข้อมูลพนักงาน
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sidebar / List Area */}
      <div className={`md:w-1/3 lg:w-1/4 bg-white border-r border-gray-200 flex flex-col h-screen ${selectedEmployeeId ? 'hidden md:flex' : 'flex'}`}>
        
        {/* App Header */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-indigo-200">
                <Users size={20} />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 tracking-tight">HR Smart</h1>
                <p className="text-xs text-gray-400">ระบบจัดการประวัติ</p>
              </div>
            </div>
            <div className="flex gap-1">
              <button 
                onClick={() => setIsSettingsOpen(true)}
                className="p-2 text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors border border-indigo-100"
                title="Sync from GitHub / นำเข้าข้อมูล"
              >
                <CloudDownload size={20} />
              </button>
              <button 
                onClick={() => setIsSettingsOpen(true)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                title="ตั้งค่าอื่นๆ"
              >
                <Settings size={20} />
              </button>
            </div>
          </div>
          
          {/* Stats/Chart Mini View */}
          <div className="mb-6">
            <DepartmentChart employees={employees} />
          </div>

          {/* Search */}
          <div className="relative">
             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
             <input 
               type="text" 
               placeholder="ค้นหาชื่อ, ตำแหน่ง..." 
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
               className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
             />
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
          <div className="flex justify-between items-center mb-2 px-2">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">All Employees ({filteredEmployees.length})</h3>
            <button 
              onClick={() => setIsAddModalOpen(true)}
              className="text-indigo-600 hover:bg-indigo-50 p-1 rounded transition-colors"
              title="เพิ่มพนักงานใหม่"
            >
              <Plus size={16} />
            </button>
          </div>
          <EmployeeList 
            employees={filteredEmployees} 
            onSelect={(e) => setSelectedEmployeeId(e.id)} 
            selectedId={selectedEmployeeId || undefined}
          />
        </div>
      </div>

      {/* Main Content / Detail View */}
      <div className={`flex-1 h-screen bg-gray-50 p-4 md:p-6 overflow-hidden ${!selectedEmployeeId ? 'hidden md:flex items-center justify-center' : 'flex'}`}>
        {selectedEmployee ? (
          <div className="w-full h-full max-w-4xl mx-auto animate-fade-in">
            <EmployeeDetail 
              employee={selectedEmployee} 
              onUpdate={handleUpdateEmployee}
              onClose={() => setSelectedEmployeeId(null)}
            />
          </div>
        ) : (
          <div className="text-center text-gray-400">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users size={40} className="text-gray-300" />
            </div>
            <h2 className="text-xl font-semibold text-gray-600">ยินดีต้อนรับสู่ HR Smart Records</h2>
            <p className="mt-2 text-sm">เลือกพนักงานจากรายการด้านซ้ายเพื่อดูรายละเอียด <br/> หรือกดปุ่ม <CloudDownload size={14} className="inline"/> ด้านบนเพื่อดึงข้อมูลจาก GitHub</p>
          </div>
        )}
      </div>

    </div>
  );
};

export default App;
