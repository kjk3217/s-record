import React, { useState, useEffect } from 'react';
import { Sparkles, Copy, Download, Check } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Select } from '../components/ui/Select';
import { Card } from '../components/ui/Card';
import { storage } from '../utils/storage';
import { Student, GeneratedContent } from '../types';

export const AIGeneration: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('세특');
  const [style, setStyle] = useState('서술체');
  const [lengthOpt, setLengthOpt] = useState('300');
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedResults, setGeneratedResults] = useState<GeneratedContent[]>([]);
  const [selectedStudentIds, setSelectedStudentIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    const loadedStudents = storage.getStudents();
    setStudents(loadedStudents);
    // Select all by default
    setSelectedStudentIds(new Set(loadedStudents.map(s => s.id)));
    // Load existing generations
    setGeneratedResults(storage.getGenerated());
  }, []);

  const handleGenerate = async () => {
    setIsGenerating(true);
    
    // Simulate processing time per student
    const targets = students.filter(s => selectedStudentIds.has(s.id));
    
    if (targets.length === 0) {
      alert('생성할 학생을 선택해주세요.');
      setIsGenerating(false);
      return;
    }

    // Mock API Call & Generation Logic
    const newGenerations: GeneratedContent[] = [];
    
    for (const student of targets) {
      await new Promise(resolve => setTimeout(resolve, 500)); // 0.5s per student sim
      
      const records = storage.getRecords(selectedCategory).filter(r => r.studentId === student.id);
      
      // Basic logic to construct a sentence from records (Simulating Claude's output)
      let content = `${student.name} 학생은 ${selectedCategory} 활동에서 `;
      
      if (records.length > 0) {
        const points = records.map(r => r.point).join(', ');
        content += `${points} 등의 역량이 돋보임. `;
        records.forEach(r => {
           if (r.memo) content += `특히 ${r.memo}하는 모습이 인상적임. `;
        });
        content += `앞으로도 적극적인 자세로 교과 활동에 임할 것으로 기대됨.`;
      } else {
        content += `성실한 태도로 수업에 참여하며, 교사의 설명을 경청하는 자세가 바름. 과제 수행에 있어서도 책임감 있는 모습을 보여주며 꾸준히 노력하는 모습이 긍정적임.`;
      }

      const genItem = storage.saveGenerated({
        studentId: student.id,
        category: selectedCategory,
        content: content,
        charCount: parseInt(lengthOpt),
        style: style
      });
      newGenerations.push(genItem);
    }

    setGeneratedResults(prev => [...newGenerations, ...prev]);
    setIsGenerating(false);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('복사되었습니다!');
  };

  const toggleSelectAll = () => {
    if (selectedStudentIds.size === students.length) {
      setSelectedStudentIds(new Set());
    } else {
      setSelectedStudentIds(new Set(students.map(s => s.id)));
    }
  };

  const toggleStudent = (id: string) => {
    const newSet = new Set(selectedStudentIds);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setSelectedStudentIds(newSet);
  };

  return (
    <div className="space-y-6">
       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-900">AI 문장 생성</h1>
        <Button onClick={handleGenerate} disabled={isGenerating} className="w-full sm:w-auto">
          {isGenerating ? (
            <>
              <Sparkles className="animate-spin mr-2" size={18} />
              생성 중...
            </>
          ) : (
            <>
              <Sparkles className="mr-2" size={18} />
              AI 문장 생성
            </>
          )}
        </Button>
      </div>

      {/* Options */}
      <Card className="p-4 bg-indigo-50 border-indigo-100">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Select 
            label="생성 영역" 
            options={[
              { value: '세특', label: '세부능력 및 특기사항' },
              { value: '행특', label: '행동특성 및 종합의견' },
              { value: '자율', label: '자율활동' },
              { value: '진로', label: '진로활동' }
            ]}
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          />
          <Select 
            label="글자수 (약)" 
            options={[
              { value: '200', label: '200자 내외' },
              { value: '300', label: '300자 내외' },
              { value: '500', label: '500자 내외' }
            ]}
            value={lengthOpt}
            onChange={(e) => setLengthOpt(e.target.value)}
          />
          <Select 
            label="문체 스타일" 
            options={[
              { value: '서술체', label: '서술체 (~함, ~임)' },
              { value: '간결체', label: '간결체' },
              { value: '구체적', label: '구체적 사례 중심' }
            ]}
            value={style}
            onChange={(e) => setStyle(e.target.value)}
          />
        </div>
      </Card>

      {/* Student Selection & Results */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Selection List */}
        <div className="lg:col-span-1 space-y-4">
           <div className="flex justify-between items-center px-1">
             <h3 className="font-semibold text-gray-700">대상 학생 선택</h3>
             <button onClick={toggleSelectAll} className="text-sm text-indigo-600 font-medium hover:underline">
               {selectedStudentIds.size === students.length ? '전체 해제' : '전체 선택'}
             </button>
           </div>
           <Card className="p-0 max-h-[600px] overflow-y-auto">
             <ul className="divide-y divide-gray-100">
               {students.map(student => (
                 <li key={student.id} className="p-3 hover:bg-gray-50 flex items-center gap-3">
                   <input 
                      type="checkbox" 
                      checked={selectedStudentIds.has(student.id)}
                      onChange={() => toggleStudent(student.id)}
                      className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                   />
                   <span className="text-sm text-gray-700 font-medium w-8">{student.number}번</span>
                   <span className="text-sm text-gray-900">{student.name}</span>
                 </li>
               ))}
               {students.length === 0 && <li className="p-4 text-center text-gray-500 text-sm">학생 없음</li>}
             </ul>
           </Card>
        </div>

        {/* Right: Results */}
        <div className="lg:col-span-2 space-y-4">
           <div className="flex justify-between items-center px-1">
             <h3 className="font-semibold text-gray-700">생성 결과</h3>
             <Button size="sm" variant="outline" onClick={() => alert('엑셀 다운로드 준비중')}>
               <Download size={14} className="mr-1" /> 엑셀 저장
             </Button>
           </div>
           <div className="space-y-4">
             {generatedResults
                .filter(r => r.category === selectedCategory) // Show only selected category results
                .slice(0, 10) // Show last 10 for demo
                .map((result) => {
               const student = students.find(s => s.id === result.studentId);
               if (!student) return null;
               return (
                 <Card key={result.id} className="p-4 relative group">
                   <div className="flex justify-between items-start mb-2">
                     <div className="flex items-center gap-2">
                       <span className="bg-indigo-100 text-indigo-700 text-xs font-bold px-2 py-0.5 rounded">
                         {student.number}번 {student.name}
                       </span>
                       <span className="text-xs text-gray-400">
                         {new Date(result.createdAt).toLocaleTimeString()}
                       </span>
                     </div>
                     <button 
                        onClick={() => copyToClipboard(result.content)}
                        className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors"
                        title="복사하기"
                     >
                       <Copy size={16} />
                     </button>
                   </div>
                   <p className="text-gray-800 text-sm leading-relaxed bg-gray-50 p-3 rounded-lg border border-gray-100">
                     {result.content}
                   </p>
                 </Card>
               );
             })}
             {generatedResults.length === 0 && (
               <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300 text-gray-500">
                 왼쪽에서 학생을 선택하고 'AI 문장 생성' 버튼을 눌러주세요.
               </div>
             )}
           </div>
        </div>
      </div>
    </div>
  );
};