import React, { useState } from 'react';
import { Employee, HistoryRecord } from '../types';
import { generateEmployeeBio, enhanceHistoryDescription } from '../services/geminiService';
import { 
  Sparkles, 
  Calendar, 
  Mail, 
  Phone, 
  Plus, 
  Save, 
  X,
  History,
  FileText
} from 'lucide-react';

interface EmployeeDetailProps {
  employee: Employee;
  onUpdate: (updatedEmployee: Employee) => void;
  onClose: () => void;
}

export const EmployeeDetail: React.FC<EmployeeDetailProps> = ({ employee, onUpdate, onClose }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'history'>('overview');
  const [isGeneratingBio, setIsGeneratingBio] = useState(false);
  
  // New History State
  const [isAddingHistory, setIsAddingHistory] = useState(false);
  const [newHistoryTitle, setNewHistoryTitle] = useState('');
  const [newHistoryDesc, setNewHistoryDesc] = useState('');
  const [newHistoryType, setNewHistoryType] = useState<HistoryRecord['type']>('Performance Review');
  const [isEnhancingText, setIsEnhancingText] = useState(false);

  const handleGenerateBio = async () => {
    setIsGeneratingBio(true);
    const newBio = await generateEmployeeBio(employee);
    onUpdate({ ...employee, bio: newBio });
    setIsGeneratingBio(false);
  };

  const handleEnhanceDescription = async () => {
    if (!newHistoryDesc) return;
    setIsEnhancingText(true);
    const enhanced = await enhanceHistoryDescription(newHistoryDesc, newHistoryType);
    setNewHistoryDesc(enhanced);
    setIsEnhancingText(false);
  };

  const handleSaveHistory = () => {
    if (!newHistoryTitle || !newHistoryDesc) return;
    
    const newRecord: HistoryRecord = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      type: newHistoryType,
      title: newHistoryTitle,
      description: newHistoryDesc,
      aiEnhanced: false // Could track if we used AI
    };

    onUpdate({
      ...employee,
      history: [newRecord, ...employee.history]
    });

    setIsAddingHistory(false);
    setNewHistoryTitle('');
    setNewHistoryDesc('');
  };

  return (
    <div className="bg-white h-full flex flex-col shadow-xl overflow-hidden rounded-l-2xl border-l border-gray-200">
      {/* Header */}
      <div className="relative bg-gradient-to-r from-blue-600 to-indigo-700 h-32 flex-shrink-0">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-white/80 hover:text-white bg-black/20 hover:bg-black/30 p-1 rounded-full transition-colors md:hidden"
        >
          <X size={20} />
        </button>
        <div className="absolute -bottom-12 left-6">
          <img
            src={employee.avatarUrl}
            alt={employee.firstName}
            className="w-24 h-24 rounded-full border-4 border-white object-cover shadow-md"
          />
        </div>
      </div>

      <div className="mt-14 px-6 pb-4 border-b border-gray-100">
        <h2 className="text-2xl font-bold text-gray-900">{employee.firstName} {employee.lastName}</h2>
        <p className="text-gray-500">{employee.position} &bull; {employee.department}</p>
        
        <div className="flex gap-4 mt-4 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <Mail size={14} /> {employee.email}
          </div>
          <div className="flex items-center gap-1">
            <Phone size={14} /> {employee.phone}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex px-6 border-b border-gray-100">
        <button
          onClick={() => setActiveTab('overview')}
          className={`py-3 px-4 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'overview' 
              ? 'border-blue-600 text-blue-600' 
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          ภาพรวม (Overview)
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`py-3 px-4 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'history' 
              ? 'border-blue-600 text-blue-600' 
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          ประวัติการทำงาน (History)
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
        
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                  <Sparkles size={18} className="text-indigo-500" />
                  สรุปประวัติโดย AI (AI Bio)
                </h3>
                <button
                  onClick={handleGenerateBio}
                  disabled={isGeneratingBio}
                  className="text-xs bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-full hover:bg-indigo-100 transition-colors disabled:opacity-50"
                >
                  {isGeneratingBio ? 'กำลังสร้าง...' : 'สร้างใหม่'}
                </button>
              </div>
              
              {employee.bio ? (
                <p className="text-gray-600 leading-relaxed text-sm whitespace-pre-line">
                  {employee.bio}
                </p>
              ) : (
                <div className="text-center py-8 text-gray-400 text-sm">
                  <p>ยังไม่มีข้อมูลสรุป</p>
                  <button 
                    onClick={handleGenerateBio}
                    className="mt-2 text-indigo-600 underline"
                  >
                    กดเพื่อสร้างประวัติอัตโนมัติจากข้อมูลประวัติ
                  </button>
                </div>
              )}
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <FileText size={18} className="text-gray-500" />
                ข้อมูลทั่วไป
              </h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                 <div>
                    <span className="block text-gray-400 mb-1">วันเริ่มงาน</span>
                    <span className="font-medium text-gray-700">{employee.startDate}</span>
                 </div>
                 <div>
                    <span className="block text-gray-400 mb-1">สถานะ</span>
                    <span className="font-medium text-gray-700">{employee.status}</span>
                 </div>
                 <div>
                    <span className="block text-gray-400 mb-1">รหัสพนักงาน</span>
                    <span className="font-medium text-gray-700">{employee.id}</span>
                 </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="space-y-6">
            
            {/* Add History Form */}
            {isAddingHistory ? (
              <div className="bg-white p-6 rounded-xl shadow-md border border-indigo-100 animate-fade-in-down">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-gray-800">เพิ่มรายการใหม่</h3>
                  <button onClick={() => setIsAddingHistory(false)} className="text-gray-400 hover:text-gray-600">
                    <X size={18} />
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">ประเภท</label>
                    <select 
                      value={newHistoryType}
                      onChange={(e) => setNewHistoryType(e.target.value as any)}
                      className="w-full border-gray-300 rounded-lg shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm p-2 border"
                    >
                      <option value="Promotion">เลื่อนตำแหน่ง (Promotion)</option>
                      <option value="Transfer">ย้ายแผนก (Transfer)</option>
                      <option value="Performance Review">ประเมินผลงาน (Review)</option>
                      <option value="Incident">เหตุการณ์สำคัญ (Incident)</option>
                      <option value="Award">รางวัล (Award)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">หัวข้อ</label>
                    <input
                      type="text"
                      value={newHistoryTitle}
                      onChange={(e) => setNewHistoryTitle(e.target.value)}
                      placeholder="เช่น ได้รับรางวัลพนักงานดีเด่น"
                      className="w-full border-gray-300 rounded-lg shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm p-2 border"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">รายละเอียด (Draft)</label>
                    <textarea
                      value={newHistoryDesc}
                      onChange={(e) => setNewHistoryDesc(e.target.value)}
                      rows={3}
                      placeholder="พิมพ์สั้นๆ เช่น ทำงานเร็วมาก มาตรงเวลา..."
                      className="w-full border-gray-300 rounded-lg shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm p-2 border"
                    />
                    <div className="flex justify-end mt-2">
                      <button 
                        onClick={handleEnhanceDescription}
                        disabled={isEnhancingText || !newHistoryDesc}
                        className="text-xs flex items-center gap-1 text-indigo-600 hover:text-indigo-800 disabled:opacity-50"
                      >
                        <Sparkles size={12} />
                        {isEnhancingText ? 'กำลังปรับปรุง...' : 'ใช้ AI เขียนให้ดูเป็นทางการ'}
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={handleSaveHistory}
                    disabled={!newHistoryTitle || !newHistoryDesc}
                    className="w-full bg-indigo-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors flex justify-center items-center gap-2 disabled:bg-gray-300"
                  >
                    <Save size={16} /> บันทึก
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setIsAddingHistory(true)}
                className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 font-medium hover:border-indigo-500 hover:text-indigo-600 transition-colors flex justify-center items-center gap-2 bg-white"
              >
                <Plus size={18} /> เพิ่มประวัติใหม่
              </button>
            )}

            {/* Timeline */}
            <div className="relative border-l-2 border-gray-200 ml-4 space-y-8 pb-4">
              {employee.history.map((record) => (
                <div key={record.id} className="relative pl-8">
                  <div className={`absolute -left-[9px] top-1 w-4 h-4 rounded-full border-2 border-white shadow-sm
                    ${record.type === 'Promotion' ? 'bg-green-500' :
                      record.type === 'Incident' ? 'bg-red-500' :
                      'bg-blue-500'
                    }`} 
                  />
                  <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="text-sm font-bold text-gray-900">{record.title}</h4>
                      <span className="text-xs text-gray-400 font-mono">{record.date}</span>
                    </div>
                    <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold tracking-wide uppercase bg-gray-100 text-gray-600 mb-2">
                      {record.type}
                    </span>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {record.description}
                    </p>
                  </div>
                </div>
              ))}
              
              {employee.history.length === 0 && (
                <p className="pl-8 text-gray-400 italic text-sm">ยังไม่มีข้อมูลประวัติ</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
