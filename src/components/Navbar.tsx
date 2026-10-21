import React from 'react';
import { 
  Compass, 
  Sparkles, 
  Users, 
  CheckCircle2, 
  Bot, 
  Volume2, 
  VolumeX, 
  GraduationCap, 
  BookOpen, 
  Trees 
} from 'lucide-react';
import { sounds } from '../utils/soundEffects';

interface NavbarProps {
  activeTab: 'worlds' | 'problem' | 'workshop' | 'classroom' | 'verification';
  setActiveTab: (tab: 'worlds' | 'problem' | 'workshop' | 'classroom' | 'verification') => void;
  userRole: 'student' | 'teacher';
  setUserRole: (role: 'student' | 'teacher') => void;
  selectedStudentId: string;
  setSelectedStudentId: (id: string) => void;
  openTutorModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  userRole,
  setUserRole,
  selectedStudentId,
  setSelectedStudentId,
  openTutorModal,
}) => {
  const [soundOn, setSoundOn] = React.useState(true);

  const toggleSound = () => {
    const next = !soundOn;
    setSoundOn(next);
    sounds.setEnabled(next);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-emerald-900/10 shadow-xs">
      {/* Top credit bar with Lam Dong local identity */}
      <div className="bg-emerald-900 text-emerald-100 text-xs px-4 py-1.5 flex flex-wrap items-center justify-between gap-2 border-b border-emerald-800">
        <div className="flex items-center gap-2">
          <Trees className="w-3.5 h-3.5 text-amber-300" />
          <span className="font-medium text-amber-200">Trường TH & THCS An Hiệp, xã Hiệp Thạnh, Tỉnh Lâm Đồng</span>
          <span className="text-emerald-300/60">•</span>
          <span>Tác giả: <strong className="text-white">Lê Thị Hằng</strong></span>
          <span className="hidden md:inline text-emerald-300/60">•</span>
          <span className="hidden md:inline italic text-amber-100/90">"Mỗi góc quê hương – Một bài toán mới!"</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="bg-emerald-800/80 px-2 py-0.5 rounded text-[11px] text-emerald-200 font-mono">
            CTGDPT 2018 THCS (Lớp 6 - 9)
          </span>
          <button
            onClick={toggleSound}
            title={soundOn ? 'Tắt âm thanh hiệu ứng' : 'Bật âm thanh hiệu ứng'}
            className="flex items-center gap-1 hover:text-white transition-colors text-emerald-200 cursor-pointer"
          >
            {soundOn ? <Volume2 className="w-3.5 h-3.5 text-amber-300" /> : <VolumeX className="w-3.5 h-3.5 text-stone-400" />}
            <span className="hidden sm:inline text-[11px]">{soundOn ? 'Âm thanh: Bật' : 'Âm thanh: Tắt'}</span>
          </button>
        </div>
      </div>

      {/* Main navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo & Slogan */}
          <div 
            onClick={() => setActiveTab('worlds')}
            className="flex items-center gap-3 cursor-pointer group shrink-0"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-700 to-green-900 flex items-center justify-center text-white shadow-md shadow-emerald-900/10 group-hover:scale-105 transition-transform">
              <span className="font-extrabold text-lg tracking-wider text-amber-300">TQE</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg text-emerald-950 tracking-tight">TOÁN QUÊ EM</span>
                <span className="bg-amber-500 text-stone-900 font-bold text-xs px-1.5 py-0.5 rounded-md">AI</span>
              </div>
              <p className="text-[11px] text-stone-700 font-medium hidden sm:block">
                Học Toán qua nông nghiệp & đời sống Lâm Đồng
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden lg:flex items-center gap-1">
            <button
              onClick={() => setActiveTab('worlds')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'worlds'
                  ? 'bg-emerald-100/90 text-emerald-900 shadow-xs'
                  : 'text-stone-700 hover:text-emerald-900 hover:bg-emerald-50/60'
              }`}
            >
              <Compass className="w-4 h-4 text-emerald-700" />
              <span>4 Thế giới học tập</span>
            </button>

            <button
              onClick={() => setActiveTab('problem')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'problem'
                  ? 'bg-emerald-100/90 text-emerald-900 shadow-xs'
                  : 'text-stone-700 hover:text-emerald-900 hover:bg-emerald-50/60'
              }`}
            >
              <BookOpen className="w-4 h-4 text-emerald-700" />
              <span>Bài toán tương tác</span>
              <span className="bg-amber-400/90 text-stone-900 text-[10px] font-bold px-1.5 py-0.2 rounded-full">Mẫu</span>
            </button>

            <button
              onClick={() => setActiveTab('workshop')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'workshop'
                  ? 'bg-emerald-100/90 text-emerald-900 shadow-xs'
                  : 'text-stone-700 hover:text-emerald-900 hover:bg-emerald-50/60'
              }`}
            >
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>Xưởng bài toán AI</span>
            </button>

            <button
              onClick={() => setActiveTab('classroom')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'classroom'
                  ? 'bg-emerald-100/90 text-emerald-900 shadow-xs'
                  : 'text-stone-700 hover:text-emerald-900 hover:bg-emerald-50/60'
              }`}
            >
              <Users className="w-4 h-4 text-teal-700" />
              <span>Lớp học (47 HS)</span>
            </button>

            <button
              onClick={() => setActiveTab('verification')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'verification'
                  ? 'bg-emerald-100/90 text-emerald-900 shadow-xs'
                  : 'text-stone-700 hover:text-emerald-900 hover:bg-emerald-50/60'
              }`}
            >
              <CheckCircle2 className="w-4 h-4 text-green-700" />
              <span>Kiểm định Toán</span>
            </button>
          </nav>

          {/* Right actions: Role toggle, Student Selector & AI Tutor Trigger */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* AI Tutor Button */}
            <button
              onClick={openTutorModal}
              className="flex items-center gap-1.5 bg-gradient-to-r from-emerald-700 to-green-700 hover:from-emerald-800 hover:to-green-800 text-white font-medium text-xs sm:text-sm px-3 py-2 rounded-xl shadow-xs transition-all cursor-pointer hover:shadow-md"
            >
              <Bot className="w-4 h-4 text-amber-300 animate-pulse" />
              <span>Gia sư Socratic AI</span>
            </button>

            {/* Role switch toggle */}
            <div className="flex items-center bg-stone-100 p-1 rounded-xl border border-stone-200 text-xs">
              <button
                onClick={() => setUserRole('student')}
                className={`px-2.5 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                  userRole === 'student'
                    ? 'bg-white text-emerald-900 shadow-xs'
                    : 'text-stone-500 hover:text-stone-800'
                }`}
              >
                Học sinh
              </button>
              <button
                onClick={() => setUserRole('teacher')}
                className={`px-2.5 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                  userRole === 'teacher'
                    ? 'bg-white text-emerald-900 shadow-xs'
                    : 'text-stone-500 hover:text-stone-800'
                }`}
              >
                Giáo viên
              </button>
            </div>

            {/* Anonymous student quick selector */}
            {userRole === 'student' && (
              <div className="hidden sm:flex items-center gap-1 bg-amber-50 border border-amber-200/80 px-2 py-1 rounded-lg text-xs text-amber-900">
                <GraduationCap className="w-3.5 h-3.5 text-amber-700" />
                <span className="font-medium">Mã:</span>
                <select
                  value={selectedStudentId}
                  onChange={(e) => setSelectedStudentId(e.target.value)}
                  className="bg-transparent font-bold text-amber-950 focus:outline-hidden cursor-pointer"
                >
                  {Array.from({ length: 47 }, (_, i) => {
                    const id = `HS${(i + 1).toString().padStart(2, '0')}`;
                    return <option key={id} value={id}>{id}</option>;
                  })}
                </select>
              </div>
            )}
          </div>
        </div>

        {/* Mobile secondary tab strip */}
        <div className="flex lg:hidden overflow-x-auto py-2 gap-1 border-t border-stone-100 text-xs no-scrollbar">
          <button
            onClick={() => setActiveTab('worlds')}
            className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap ${
              activeTab === 'worlds' ? 'bg-emerald-100 text-emerald-900 font-bold' : 'text-stone-600'
            }`}
          >
            4 Thế giới
          </button>
          <button
            onClick={() => setActiveTab('problem')}
            className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap ${
              activeTab === 'problem' ? 'bg-emerald-100 text-emerald-900 font-bold' : 'text-stone-600'
            }`}
          >
            Bài mẫu tưới nước
          </button>
          <button
            onClick={() => setActiveTab('workshop')}
            className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap ${
              activeTab === 'workshop' ? 'bg-emerald-100 text-emerald-900 font-bold' : 'text-stone-600'
            }`}
          >
            Xưởng AI
          </button>
          <button
            onClick={() => setActiveTab('classroom')}
            className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap ${
              activeTab === 'classroom' ? 'bg-emerald-100 text-emerald-900 font-bold' : 'text-stone-600'
            }`}
          >
            Lớp học (47 HS)
          </button>
          <button
            onClick={() => setActiveTab('verification')}
            className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap ${
              activeTab === 'verification' ? 'bg-emerald-100 text-emerald-900 font-bold' : 'text-stone-600'
            }`}
          >
            Kiểm định Toán
          </button>
        </div>
      </div>
    </header>
  );
};
