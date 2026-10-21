/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { BannerHero } from './components/BannerHero';
import { WorldExplorer } from './components/WorldExplorer';
import { InteractiveProblem } from './components/InteractiveProblem';
import { AIProblemWorkshop } from './components/AIProblemWorkshop';
import { TeacherDashboard } from './components/TeacherDashboard';
import { MathVerificationModal } from './components/MathVerificationModal';
import { AITutorModal } from './components/AITutorModal';
import { WORLDS_DATA, INITIAL_PROBLEMS, generate47Students } from './data/mockData';
import { MathProblem, StudentRecord, WorldId } from './types';
import { MapPin, Trees, Award, Heart, CheckCircle2 } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'worlds' | 'problem' | 'workshop' | 'classroom' | 'verification'>('problem');
  const [userRole, setUserRole] = useState<'student' | 'teacher'>('student');
  const [selectedStudentId, setSelectedStudentId] = useState<string>('HS12');
  const [selectedProblemId, setSelectedProblemId] = useState<string>('prob-water-garden-1');
  const [problems, setProblems] = useState<MathProblem[]>(INITIAL_PROBLEMS);
  const [students, setStudents] = useState<StudentRecord[]>(() => {
    const saved = localStorage.getItem('toan_que_em_students_47');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback
      }
    }
    return generate47Students();
  });

  // AI Tutor Modal state
  const [isTutorOpen, setIsTutorOpen] = useState(false);
  const [tutorContextQuestion, setTutorContextQuestion] = useState('');

  // Persist students data in local storage
  useEffect(() => {
    try {
      localStorage.setItem('toan_que_em_students_47', JSON.stringify(students));
    } catch (e) {
      // ignore
    }
  }, [students]);

  // Current problem
  const currentProblem = problems.find((p) => p.id === selectedProblemId) || problems[0];

  const handleSelectProblem = (pId: string) => {
    setSelectedProblemId(pId);
    setActiveTab('problem');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleExploreWorld = (worldId: WorldId) => {
    const match = problems.find((p) => p.worldId === worldId);
    if (match) {
      setSelectedProblemId(match.id);
    }
    setActiveTab('worlds');
  };

  const handlePublishProblem = (newProblem: MathProblem) => {
    setProblems((prev) => [newProblem, ...prev]);
    setSelectedProblemId(newProblem.id);
    setActiveTab('problem');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRecordAttempt = (
    studentId: string,
    problemId: string,
    isCorrect: boolean,
    detectedError?: string
  ) => {
    setStudents((prev) =>
      prev.map((s) => {
        if (s.id !== studentId) return s;

        const nextAttempts = s.totalAttempts + 1;
        const newCompleted = isCorrect ? s.completedProblems + 1 : s.completedProblems;
        // Bump score moderately upon solving
        const newPostTest = isCorrect
          ? Math.min(10, +(s.postTestScore + 0.1).toFixed(1))
          : s.postTestScore;

        let nextErrors = [...s.commonErrors];
        if (detectedError && !nextErrors.includes(detectedError)) {
          nextErrors = [detectedError, ...nextErrors.slice(0, 3)];
        }

        return {
          ...s,
          totalAttempts: nextAttempts,
          completedProblems: newCompleted,
          postTestScore: newPostTest,
          commonErrors: nextErrors,
          lastActive: 'Vừa xong',
        };
      })
    );
  };

  const handleAskTutorWithContext = (questionText: string, problemTitle: string) => {
    setTutorContextQuestion(questionText);
    setIsTutorOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 text-stone-900 selection:bg-emerald-200 selection:text-emerald-900">
      {/* Sticky Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        userRole={userRole}
        setUserRole={setUserRole}
        selectedStudentId={selectedStudentId}
        setSelectedStudentId={setSelectedStudentId}
        openTutorModal={() => {
          setTutorContextQuestion('');
          setIsTutorOpen(true);
        }}
      />

      {/* Main Content Area */}
      <main className="flex-1 pb-16">
        {/* Banner Hero on Worlds and Problem tabs */}
        {(activeTab === 'worlds' || activeTab === 'problem') && (
          <BannerHero
            onExploreWorlds={() => setActiveTab('worlds')}
            onOpenSampleProblem={() => {
              setSelectedProblemId('prob-water-garden-1');
              setActiveTab('problem');
            }}
            onOpenWorkshop={() => setActiveTab('workshop')}
          />
        )}

        {/* Tab 1: 4 Worlds Explorer */}
        {activeTab === 'worlds' && (
          <WorldExplorer
            worlds={WORLDS_DATA}
            problems={problems}
            onSelectProblem={handleSelectProblem}
            onExploreWorld={handleExploreWorld}
          />
        )}

        {/* Tab 2: Interactive Problem Solving */}
        {activeTab === 'problem' && (
          <InteractiveProblem
            problem={currentProblem}
            selectedStudentId={selectedStudentId}
            onAskTutorWithContext={handleAskTutorWithContext}
            onRecordAttempt={handleRecordAttempt}
          />
        )}

        {/* Tab 3: AI Problem Workshop */}
        {activeTab === 'workshop' && (
          <AIProblemWorkshop
            onPublishProblem={handlePublishProblem}
            publishedCount={problems.length}
          />
        )}

        {/* Tab 4: Teacher Classroom Management Dashboard (47 Students) */}
        {activeTab === 'classroom' && (
          <TeacherDashboard
            students={students}
            onUpdateStudents={setStudents}
            selectedStudentId={selectedStudentId}
            onSelectStudent={(id) => {
              setSelectedStudentId(id);
              setUserRole('student');
              setActiveTab('problem');
            }}
          />
        )}

        {/* Tab 5: Mathematical Verification Engine */}
        {activeTab === 'verification' && <MathVerificationModal />}
      </main>

      {/* Socratic AI Tutor Modal */}
      <AITutorModal
        isOpen={isTutorOpen}
        onClose={() => setIsTutorOpen(false)}
        initialQuestion={tutorContextQuestion}
        problemContext={{
          problemTitle: currentProblem.title,
          grade: currentProblem.grade,
          topic: currentProblem.topic,
          story: currentProblem.story,
          variables: currentProblem.variables,
          subQuestions: currentProblem.subQuestions.map((sq) => ({
            text: sq.questionText,
            unit: sq.unit,
            hints: sq.hints,
          })),
        }}
        studentLevel={currentProblem.grade}
      />

      {/* Footer with Full Credit & Identity */}
      <footer className="bg-emerald-950 text-emerald-100 border-t border-emerald-900 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            {/* Left Column: Brand & Slogan */}
            <div className="md:col-span-5 space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-400 text-stone-950 flex items-center justify-center font-extrabold text-sm">
                  TQE
                </div>
                <span className="font-extrabold text-xl text-white tracking-tight">TOÁN QUÊ EM AI</span>
              </div>
              <p className="text-amber-300 font-bold text-sm italic">
                “Mỗi góc quê hương – Một bài toán mới!”
              </p>
              <p className="text-xs text-emerald-300/80 leading-relaxed max-w-sm">
                Đưa đời sống nông nghiệp công nghệ cao và bảo vệ môi trường quê hương Lâm Đồng vào từng tiết học Toán, 
                giúp các em học sinh THCS phát triển phẩm chất và năng lực giải quyết vấn đề thực tiễn.
              </p>
            </div>

            {/* Middle Column: Author & School Info */}
            <div className="md:col-span-4 space-y-2 text-xs text-emerald-200">
              <div className="font-bold text-white text-sm uppercase tracking-wider text-amber-300">
                Thông tin bản quyền & Đơn vị
              </div>
              <div className="space-y-1.5 pt-1">
                <div className="flex items-start gap-2">
                  <Award className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>Tác giả: <strong className="text-white text-sm">Lê Thị Hằng</strong></span>
                </div>
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Đơn vị: <strong>Trường TH & THCS An Hiệp</strong>, xã Hiệp Thạnh, Tỉnh Lâm Đồng</span>
                </div>
                <div className="flex items-start gap-2">
                  <Trees className="w-4 h-4 text-green-400 shrink-0 mt-0.5" />
                  <span>Đối tượng học tập: Học sinh lớp 6, 7, 8, 9 (THCS)</span>
                </div>
              </div>
            </div>

            {/* Right Column: Standards & Pedagogical Compliance */}
            <div className="md:col-span-3 space-y-2 text-xs text-emerald-200">
              <div className="font-bold text-white text-sm uppercase tracking-wider text-amber-300">
                Chuẩn sư phạm & Kỹ thuật
              </div>
              <ul className="space-y-1.5 text-xs text-emerald-300/80">
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                  <span>Chương trình GDPT 2018 môn Toán</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                  <span>Phương pháp Socratic gợi mở tư duy</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                  <span>Kiểm định số học xác định 100%</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                  <span>Bảo vệ dữ liệu ẩn danh 47 HS</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-emerald-900 pt-5 flex flex-col sm:flex-row items-center justify-between text-[11px] text-emerald-400 gap-2">
            <div>
              © 2026 Toán Quê Em AI • Bản quyền thuộc về tác giả Lê Thị Hằng – Trường TH & THCS An Hiệp, xã Hiệp Thạnh, Tỉnh Lâm Đồng.
            </div>
            <div className="text-emerald-400/80">
              Phát triển với React, TypeScript, Tailwind CSS & Gemini API
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
