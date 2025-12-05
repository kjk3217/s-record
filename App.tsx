import React from 'react';
import { HashRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { StudentManagement } from './pages/StudentManagement';
import { RecordObservation } from './pages/RecordObservation';
import { AIGeneration } from './pages/AIGeneration';

// Simple Login Page Component
const Login: React.FC = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    // Mock login
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-indigo-600 flex flex-col items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
        <div className="mb-6 flex justify-center">
          <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">AI 생기부 도우미</h1>
        <p className="text-gray-500 mb-8">
          클릭 몇 번으로 완성하는 생활기록부.<br/>
          선생님의 업무 시간을 획기적으로 줄여드립니다.
        </p>

        <button 
          onClick={handleLogin}
          className="w-full bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-3 px-4 rounded-lg flex items-center justify-center gap-3 transition-colors shadow-sm"
        >
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
          Google 계정으로 시작하기
        </button>
        
        <div className="mt-8 pt-6 border-t border-gray-100 flex justify-between text-xs text-gray-400">
           <span>이용약관</span>
           <span>개인정보처리방침</span>
        </div>
      </div>
      <p className="mt-8 text-indigo-200 text-sm">© 2024 AI Student Record Assistant. All rights reserved.</p>
    </div>
  );
};

const Settings: React.FC = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">설정</h1>
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="font-semibold text-lg mb-4">내 정보</h3>
        <div className="space-y-2 text-gray-600">
          <p>이름: 홍길동</p>
          <p>이메일: teacher@school.com</p>
          <p>담당: 1학년 1반</p>
        </div>
        <div className="mt-6 pt-6 border-t border-gray-100">
           <button className="text-red-500 text-sm hover:underline">데이터 초기화</button>
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/*" element={
          <Layout>
            <Routes>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/students" element={<StudentManagement />} />
              <Route path="/record" element={<RecordObservation />} />
              <Route path="/generate" element={<AIGeneration />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </Layout>
        } />
      </Routes>
    </Router>
  );
};

export default App;