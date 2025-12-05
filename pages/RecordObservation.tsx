import React, { useState, useEffect } from 'react';
import { Save, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Select } from '../components/ui/Select';
import { Card } from '../components/ui/Card';
import { CATEGORIES, EXAMPLES, DEFAULT_EXAMPLES } from '../constants';
import { storage } from '../utils/storage';
import { Student } from '../types';

export const RecordObservation: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [category, setCategory] = useState('세특');
  const [subCategory, setSubCategory] = useState('듣기말하기');
  const [point, setPoint] = useState('경청태도');
  
  // Local state for the form [studentId]: { checked: [], memo: '' }
  const [formData, setFormData] = useState<Record<string, { checked: Set<number>, memo: string }>>({});
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

  // Load data
  useEffect(() => {
    setStudents(storage.getStudents());
    // Load existing records for this category if any (simulation)
    // For simplicity, we start fresh or would map existing DB records here
  }, []);

  // Update dropdowns based on dependencies
  useEffect(() => {
    const subs = Object.keys(CATEGORIES[category] || {});
    if (!subs.includes(subCategory)) setSubCategory(subs[0]);
  }, [category, subCategory]);

  useEffect(() => {
    const points = CATEGORIES[category]?.[subCategory] || [];
    if (!points.includes(point)) setPoint(points[0]);
  }, [category, subCategory, point]);

  // Determine current examples
  const currentExamples = EXAMPLES[category]?.[subCategory]?.[point] || DEFAULT_EXAMPLES;

  const handleCheck = (studentId: string, exampleIndex: number) => {
    setFormData(prev => {
      const studentData = prev[studentId] || { checked: new Set(), memo: '' };
      const newChecked = new Set(studentData.checked);
      if (newChecked.has(exampleIndex)) {
        newChecked.delete(exampleIndex);
      } else {
        newChecked.add(exampleIndex);
      }
      return { ...prev, [studentId]: { ...studentData, checked: newChecked } };
    });
    setSaveStatus('idle');
  };

  const handleMemo = (studentId: string, text: string) => {
    setFormData(prev => {
      const studentData = prev[studentId] || { checked: new Set(), memo: '' };
      return { ...prev, [studentId]: { ...studentData, memo: text } };
    });
    setSaveStatus('idle');
  };

  const handleSave = () => {
    setSaveStatus('saving');
    
    // Simulate API delay
    setTimeout(() => {
      Object.entries(formData).forEach(([studentId, data]) => {
        if (data.checked.size > 0 || data.memo) {
          storage.saveRecord({
            studentId,
            category,
            subCategory,
            point,
            checkedExamples: Array.from(data.checked),
            memo: data.memo
          });
        }
      });
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    }, 800);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-900">관찰 기록 입력</h1>
        <Button onClick={handleSave} disabled={saveStatus === 'saving' || students.length === 0} className="w-full sm:w-auto">
          {saveStatus === 'saving' ? '저장 중...' : saveStatus === 'saved' ? '저장 완료!' : '저장하기'}
          <Save size={18} className="ml-2" />
        </Button>
      </div>

      {/* Filters */}
      <Card className="p-4 grid grid-cols-1 sm:grid-cols-3 gap-4 bg-indigo-50 border-indigo-100">
        <Select 
          label="영역" 
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          options={Object.keys(CATEGORIES).map(k => ({ value: k, label: k }))}
        />
        <Select 
          label="세부 항목" 
          value={subCategory}
          onChange={(e) => setSubCategory(e.target.value)}
          options={Object.keys(CATEGORIES[category] || {}).map(k => ({ value: k, label: k }))}
        />
        <Select 
          label="관찰 포인트" 
          value={point}
          onChange={(e) => setPoint(e.target.value)}
          options={(CATEGORIES[category]?.[subCategory] || []).map(k => ({ value: k, label: k }))}
        />
      </Card>

      {/* Example Legend */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
          <CheckCircle size={18} className="text-indigo-600" />
          상황 예시 (학생별로 해당하는 항목을 체크하세요)
        </h3>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {currentExamples.map((ex, idx) => (
            <li key={idx} className="text-sm text-gray-600 flex items-start gap-2">
              <span className="bg-gray-100 text-gray-500 rounded-full w-5 h-5 flex items-center justify-center text-xs flex-shrink-0 mt-0.5">{idx + 1}</span>
              {ex}
            </li>
          ))}
        </ul>
      </div>

      {/* Student List */}
      <Card className="p-0 overflow-hidden">
        {students.length === 0 ? (
           <div className="p-12 text-center text-gray-500">
             <AlertCircle className="mx-auto h-12 w-12 text-gray-300 mb-3" />
             학생이 등록되지 않았습니다. [학생 관리] 메뉴에서 학생을 먼저 등록해주세요.
           </div>
        ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase w-20">번호</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase w-24">이름</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">상황 체크 (1~{currentExamples.length})</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase w-64">특이사항/메모</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {students.map((student) => {
                const data = formData[student.id] || { checked: new Set(), memo: '' };
                return (
                  <tr key={student.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{student.number}</td>
                    <td className="px-4 py-3 text-sm text-gray-800">{student.name}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-3 flex-wrap">
                        {currentExamples.map((_, idx) => (
                          <label key={idx} className="flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={data.checked.has(idx)}
                              onChange={() => handleCheck(student.id, idx)}
                              className="w-5 h-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 transition-colors"
                            />
                            <span className="ml-1 text-xs text-gray-400 font-medium">{idx + 1}</span>
                          </label>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="text"
                        placeholder="추가 관찰 내용..."
                        value={data.memo}
                        onChange={(e) => handleMemo(student.id, e.target.value)}
                        className="w-full text-sm border-b border-gray-200 focus:border-indigo-500 focus:outline-none bg-transparent py-1 transition-colors"
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        )}
      </Card>
    </div>
  );
};