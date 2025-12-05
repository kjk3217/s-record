import React from 'react';
import { Users, Edit3, Sparkles, Clock, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { storage } from '../utils/storage';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const students = storage.getStudents();
  const records = storage.getRecords();
  const generated = storage.getGenerated();

  const stats = [
    { 
      title: '등록된 학생', 
      value: `${students.length}명`, 
      icon: Users, 
      color: 'bg-blue-50 text-blue-600',
      path: '/students',
      action: '관리하기'
    },
    { 
      title: '관찰 기록', 
      value: `${records.length}건`, 
      icon: Edit3, 
      color: 'bg-emerald-50 text-emerald-600',
      path: '/record',
      action: '기록하기'
    },
    { 
      title: 'AI 문장 생성', 
      value: `${generated.length}개`, 
      icon: Sparkles, 
      color: 'bg-indigo-50 text-indigo-600',
      path: '/generate',
      action: '생성하기'
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">대시보드</h1>
          <p className="text-gray-500 mt-1">오늘도 학생들의 성장을 기록해보세요!</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer" >
             <div onClick={() => navigate(stat.path)}>
                <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${stat.color}`}>
                    <stat.icon size={24} />
                </div>
                <span className="text-sm text-gray-400 flex items-center gap-1">
                    {stat.action} <ArrowRight size={14} />
                </span>
                </div>
                <h3 className="text-gray-500 text-sm font-medium">{stat.title}</h3>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stat.value}</p>
             </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="최근 생성 활동" className="h-full">
          {generated.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
                <Sparkles className="mx-auto h-12 w-12 text-gray-300 mb-3" />
                <p>아직 생성된 문장이 없습니다.</p>
                <button onClick={() => navigate('/generate')} className="text-indigo-600 text-sm font-medium mt-2 hover:underline">
                    첫 문장 생성하러 가기
                </button>
            </div>
          ) : (
            <div className="space-y-4">
              {generated.slice(0, 5).map((item) => {
                  const student = students.find(s => s.id === item.studentId);
                  return (
                    <div key={item.id} className="flex items-start gap-4 p-3 bg-gray-50 rounded-lg">
                        <div className="p-2 bg-white rounded shadow-sm">
                            <Sparkles size={16} className="text-indigo-500" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-900">
                                {student?.name} 학생 ({item.category})
                            </p>
                            <p className="text-xs text-gray-500 mt-1 line-clamp-1">
                                {item.content}
                            </p>
                        </div>
                        <span className="text-xs text-gray-400 ml-auto whitespace-nowrap">
                            {new Date(item.createdAt).toLocaleDateString()}
                        </span>
                    </div>
                  );
              })}
            </div>
          )}
        </Card>

        <Card title="시스템 공지사항" className="h-full">
             <div className="space-y-4">
                <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="bg-blue-600 text-white text-xs px-2 py-0.5 rounded">NEW</span>
                        <h4 className="font-semibold text-blue-900 text-sm">서비스 업데이트 안내 (v1.0)</h4>
                    </div>
                    <p className="text-sm text-blue-800">
                        AI 생기부 도우미가 정식 오픈했습니다. 학생 관리부터 문장 생성까지 한번에 처리하세요.
                    </p>
                </div>
                <div className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer">
                    <Clock size={16} className="text-gray-400" />
                    <span className="text-sm text-gray-600">서버 점검 예정: 6월 15일 22:00 ~ 23:00</span>
                </div>
             </div>
        </Card>
      </div>
    </div>
  );
};