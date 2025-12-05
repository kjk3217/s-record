import React, { useState, useEffect } from 'react';
import { Upload, Plus, Trash2, Search, FileSpreadsheet } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';
import { storage } from '../utils/storage';
import { Student } from '../types';

export const StudentManagement: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [search, setSearch] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    setStudents(storage.getStudents());
  }, []);

  // Filter students based on search
  const filteredStudents = students.filter(s => 
    s.name.includes(search) || s.number.toString().includes(search)
  );

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    // In a real app, we would parse the file here
    // For this demo, we'll simulate adding students from an "Excel" file
    simulateFileUpload();
  };

  const simulateFileUpload = () => {
    const confirmUpload = window.confirm("엑셀 파일 업로드를 시뮬레이션 하시겠습니까?\n(예시 데이터가 추가됩니다)");
    if (confirmUpload) {
      const mockNewStudents = Array.from({ length: 5 }, (_, i) => ({
        classId: '1-1',
        number: students.length + i + 1,
        name: `새학생${i+1}`
      }));
      const updated = storage.addStudents(mockNewStudents);
      setStudents(updated);
      alert(`${mockNewStudents.length}명의 학생이 추가되었습니다.`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">학생 관리</h1>
        <Button size="sm" onClick={() => alert('기능 준비중입니다.')}>
          <Plus size={16} className="mr-2" />
          학생 직접 추가
        </Button>
      </div>

      <div 
        className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer ${
          isDragging ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300 bg-gray-50 hover:border-indigo-400'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={simulateFileUpload}
      >
        <div className="flex flex-col items-center justify-center gap-2">
          <div className="p-4 bg-white rounded-full shadow-sm">
            <Upload className="text-indigo-600 h-8 w-8" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mt-2">엑셀 파일 업로드</h3>
          <p className="text-gray-500 text-sm max-w-md">
            파일을 이곳에 드래그하거나 클릭하여 선택하세요.<br/>
            <span className="text-xs text-gray-400">(.xlsx, .xls 파일 지원 / 반번호, 이름 컬럼 필수)</span>
          </p>
        </div>
      </div>

      <Card className="p-0 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-white">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-gray-700">1학년 1반</span>
            <span className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full">총 {filteredStudents.length}명</span>
          </div>
          <div className="w-64">
             <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <input 
                    type="text" 
                    placeholder="이름 검색..." 
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500"
                />
             </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">번호</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">이름</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">상태</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">관리</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{student.number}번</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{student.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        재학중
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button className="text-gray-400 hover:text-red-600 transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                        학생 데이터가 없습니다. 엑셀 파일을 업로드해주세요.
                    </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};