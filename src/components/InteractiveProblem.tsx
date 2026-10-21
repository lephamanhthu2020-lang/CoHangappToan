import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  CheckCircle2, 
  HelpCircle, 
  AlertCircle, 
  ArrowRight, 
  Sparkles, 
  RotateCcw, 
  Lightbulb, 
  Bot, 
  ShieldAlert, 
  Layers, 
  Calendar, 
  User, 
  Award,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { MathProblem, SubQuestion, SupportLevel } from '../types';
import { verifyAnswer, formatVietnameseNumber, VerificationResult } from '../utils/mathEngine';
import { sounds } from '../utils/soundEffects';
import { InteractiveGardenVisualizer } from './InteractiveGardenVisualizer';

interface InteractiveProblemProps {
  problem: MathProblem;
  selectedStudentId: string;
  onAskTutorWithContext: (questionText: string, problemTitle: string) => void;
  onRecordAttempt: (studentId: string, problemId: string, isCorrect: boolean, error?: string) => void;
}

export const InteractiveProblem: React.FC<InteractiveProblemProps> = ({
  problem,
  selectedStudentId,
  onAskTutorWithContext,
  onRecordAttempt,
}) => {
  // State for user answers
  const [answers, setAnswers] = useState<{ [qId: string]: string }>({});
  const [results, setResults] = useState<{ [qId: string]: VerificationResult }>({});
  const [activeHints, setActiveHints] = useState<{ [qId: string]: SupportLevel | null }>({});
  const [attemptsCount, setAttemptsCount] = useState<{ [qId: string]: number }>({});

  const handleInputChange = (qId: string, val: string) => {
    setAnswers((prev) => ({ ...prev, [qId]: val }));
  };

  const handleCheckAnswer = (q: SubQuestion) => {
    const rawVal = answers[q.id] || '';
    const currentAttempts = (attemptsCount[q.id] || 0) + 1;
    setAttemptsCount((prev) => ({ ...prev, [q.id]: currentAttempts }));

    const res = verifyAnswer(
      rawVal,
      q.correctAnswer,
      q.unit,
      q.tolerance || 0.05,
      q.misconceptions
    );

    setResults((prev) => ({ ...prev, [q.id]: res }));

    if (res.isValid) {
      sounds.playCorrect();
      onRecordAttempt(selectedStudentId, problem.id, true);

      // Check if all subquestions are completed
      const allCompleted = problem.subQuestions.every((sq) => {
        if (sq.id === q.id) return true;
        return results[sq.id]?.isValid === true;
      });

      if (allCompleted) {
        // Trigger celebratory confetti
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#10b981', '#f59e0b', '#3b82f6', '#ec4899'],
        });
      }
    } else {
      sounds.playTryAgain();
      const detectedError = res.misconceptionAlert || 'Tính toán chưa chính xác';
      onRecordAttempt(selectedStudentId, problem.id, false, detectedError);
    }
  };

  const toggleHint = (qId: string, level: SupportLevel) => {
    sounds.playHint();
    setActiveHints((prev) => {
      const current = prev[qId];
      if (current === level) {
        return { ...prev, [qId]: null };
      }
      return { ...prev, [qId]: level };
    });
  };

  const resetQuestion = (qId: string) => {
    setAnswers((prev) => ({ ...prev, [qId]: '' }));
    setResults((prev) => {
      const copy = { ...prev };
      delete copy[qId];
      return copy;
    });
  };

  // Calculate completion percentage
  const correctCount = problem.subQuestions.filter((q) => results[q.id]?.isValid).length;
  const progressPercent = Math.round((correctCount / problem.subQuestions.length) * 100);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Problem Top Header */}
      <div className="bg-white rounded-3xl border border-stone-200/90 p-6 sm:p-8 shadow-xs space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-100 pb-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="bg-emerald-100 text-emerald-900 font-bold text-xs px-3 py-1 rounded-full">
              {problem.grade} • {problem.difficulty}
            </span>
            <span
              className={`text-xs font-semibold px-3 py-1 rounded-full ${
                problem.isSimulated
                  ? 'bg-amber-100 text-amber-900 border border-amber-300'
                  : 'bg-green-100 text-green-900 border border-green-300'
              }`}
            >
              {problem.isSimulated ? 'Dữ liệu Mô phỏng học tập' : 'Dữ liệu Thực tế'}
            </span>
            <span className="text-xs text-stone-700 bg-stone-100 px-2.5 py-1 rounded-full flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {problem.recordDate}
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs text-stone-700">
            <User className="w-3.5 h-3.5 text-emerald-700" />
            <span>Biên soạn: <strong className="text-stone-900">{problem.author}</strong></span>
          </div>
        </div>

        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
            {problem.title}
          </h1>
          <p className="text-xs sm:text-sm text-stone-700 mt-1 flex items-center gap-1.5">
            <span className="font-semibold text-emerald-800">Chủ đề:</span> {problem.topic}
          </p>
        </div>

        {/* Real-world local story */}
        <div className="bg-emerald-50/50 border border-emerald-200/80 p-5 rounded-2xl text-stone-800 text-sm sm:text-base leading-relaxed space-y-2">
          <div className="flex items-center gap-2 font-bold text-emerald-900 text-xs sm:text-sm uppercase tracking-wide">
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span>Tình huống thực tế quê hương Lâm Đồng</span>
          </div>
          <p className="whitespace-pre-line text-stone-700">
            {problem.story}
          </p>
        </div>

        {/* Variables summary table */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          {problem.variables.map((v, i) => (
            <div key={i} className="bg-stone-50 border border-stone-200/80 p-3 rounded-xl text-xs">
              <div className="text-stone-700 font-medium truncate">{v.name} ({v.symbol})</div>
              <div className="text-base font-extrabold text-emerald-900 mt-0.5">
                {v.value} <span className="text-xs font-normal text-stone-600">{v.unit}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive 2D Garden Visualizer (when on the starter garden problem) */}
      {problem.id === 'prob-water-garden-1' && (
        <InteractiveGardenVisualizer
          initialLength={12}
          initialWidth={8}
          initialRateA={5}
          initialRateB={3.5}
        />
      )}

      {/* Step-by-step Interactive Sub-questions */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-stone-200">
          <div className="flex items-center gap-3">
            <span className="p-2 rounded-xl bg-emerald-100 text-emerald-800 font-bold text-sm">
              Nhiệm vụ {correctCount}/{problem.subQuestions.length}
            </span>
            <div>
              <h3 className="font-bold text-stone-900 text-sm sm:text-base">
                Tiến độ giải toán của em
              </h3>
              <p className="text-xs text-stone-600">
                Mỗi câu hỏi có 3 mức hỗ trợ (Cơ bản, Vận dụng, Thử thách) và kiểm tra xác định.
              </p>
            </div>
          </div>

          {/* Progress bar */}
          <div className="w-full sm:w-48 space-y-1">
            <div className="flex justify-between text-xs font-bold text-stone-700">
              <span>Đã hoàn thành</span>
              <span className="text-emerald-700">{progressPercent}%</span>
            </div>
            <div className="w-full bg-stone-100 rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-emerald-600 h-full rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Subquestions Cards */}
        <div className="space-y-6">
          {problem.subQuestions.map((q, idx) => {
            const result = results[q.id];
            const currentAnswer = answers[q.id] || '';
            const isCorrect = result?.isValid === true;
            const hasError = result && !result.isValid;
            const currentHint = activeHints[q.id];

            return (
              <div
                key={q.id}
                className={`bg-white rounded-3xl border transition-all duration-300 p-6 sm:p-7 shadow-xs space-y-5 ${
                  isCorrect
                    ? 'border-emerald-500/80 bg-emerald-50/20'
                    : hasError
                    ? 'border-amber-400 bg-amber-50/10'
                    : 'border-stone-200'
                }`}
              >
                {/* Question title and header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-3">
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs ${
                        isCorrect
                          ? 'bg-emerald-600 text-white'
                          : 'bg-stone-200 text-stone-800'
                      }`}
                    >
                      {idx + 1}
                    </span>
                    <h4 className="font-bold text-base text-stone-900">
                      {q.title}
                    </h4>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Ask Tutor button for this question */}
                    <button
                      onClick={() => onAskTutorWithContext(q.questionText, problem.title)}
                      className="flex items-center gap-1 text-xs font-medium text-emerald-800 hover:text-emerald-950 bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-200 px-2.5 py-1 rounded-xl transition-all cursor-pointer"
                    >
                      <Bot className="w-3.5 h-3.5 text-emerald-700" />
                      <span>Hỏi Gia sư về câu này</span>
                    </button>
                  </div>
                </div>

                {/* Question text */}
                <p className="text-stone-800 text-sm sm:text-base font-medium leading-relaxed">
                  {q.questionText}
                </p>

                {/* Answer input row */}
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="relative flex-1 min-w-[200px] max-w-sm">
                      <input
                        type="text"
                        value={currentAnswer}
                        disabled={isCorrect}
                        onChange={(e) => handleInputChange(q.id, e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && currentAnswer.trim() && !isCorrect) {
                            handleCheckAnswer(q);
                          }
                        }}
                        placeholder={`Nhập đáp án số...`}
                        className={`w-full px-4 py-2.5 rounded-xl border text-base font-semibold focus:outline-hidden transition-all ${
                          isCorrect
                            ? 'bg-emerald-50 border-emerald-500 text-emerald-900'
                            : hasError
                            ? 'border-amber-500 focus:border-amber-600 focus:ring-2 focus:ring-amber-200'
                            : 'border-stone-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-200'
                        }`}
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-stone-700 bg-stone-100 px-2 py-0.5 rounded-md">
                        {q.unit}
                      </span>
                    </div>

                    {!isCorrect ? (
                      <button
                        onClick={() => handleCheckAnswer(q)}
                        disabled={!currentAnswer.trim()}
                        className="bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white font-bold text-sm px-5 py-2.5 rounded-xl transition-all cursor-pointer shadow-xs disabled:cursor-not-allowed"
                      >
                        Kiểm tra kết quả
                      </button>
                    ) : (
                      <button
                        onClick={() => resetQuestion(q.id)}
                        className="flex items-center gap-1.5 text-xs text-stone-700 hover:text-stone-800 border border-stone-200 px-3 py-2 rounded-xl transition-all cursor-pointer"
                        title="Thử lại câu hỏi này"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Làm lại câu này</span>
                      </button>
                    )}
                  </div>

                  {/* Feedback Message */}
                  {result && (
                    <div
                      className={`p-3.5 rounded-2xl text-xs sm:text-sm font-medium flex items-start gap-2.5 animate-fadeIn ${
                        isCorrect
                          ? 'bg-emerald-100/80 border border-emerald-300 text-emerald-900'
                          : 'bg-amber-100/90 border border-amber-300 text-amber-950'
                      }`}
                    >
                      {isCorrect ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                      ) : (
                        <AlertCircle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                      )}
                      <div className="space-y-1">
                        <div className="font-bold">{result.message}</div>
                        {isCorrect && (
                          <div className="text-emerald-800/90 text-xs">
                            {q.explanation}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* 3 Support Levels (Mức hỗ trợ: Cơ bản, Vận dụng, Thử thách) */}
                <div className="border-t border-stone-100 pt-3 space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-semibold text-stone-700 flex items-center gap-1">
                      <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
                      Mức hỗ trợ gợi ý:
                    </span>

                    <button
                      onClick={() => toggleHint(q.id, 'basic')}
                      className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                        currentHint === 'basic'
                          ? 'bg-emerald-700 text-white shadow-xs'
                          : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200/80'
                      }`}
                    >
                      Mức 1: Cơ bản (Công thức)
                    </button>

                    <button
                      onClick={() => toggleHint(q.id, 'applied')}
                      className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                        currentHint === 'applied'
                          ? 'bg-amber-700 text-white shadow-xs'
                          : 'bg-amber-50 text-amber-900 hover:bg-amber-100 border border-amber-200/80'
                      }`}
                    >
                      Mức 2: Vận dụng (Cách tính)
                    </button>

                    <button
                      onClick={() => toggleHint(q.id, 'challenge')}
                      className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                        currentHint === 'challenge'
                          ? 'bg-purple-700 text-white shadow-xs'
                          : 'bg-purple-50 text-purple-900 hover:bg-purple-100 border border-purple-200/80'
                      }`}
                    >
                      Mức 3: Thử thách (Mở rộng)
                    </button>
                  </div>

                  {/* Hint content display */}
                  {currentHint && (
                    <div className="p-3.5 rounded-2xl text-xs leading-relaxed transition-all bg-stone-50 border border-stone-200 text-stone-800 space-y-1">
                      <div className="font-bold text-stone-900 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                        <span>
                          {currentHint === 'basic'
                            ? 'Gợi ý Mức 1 (Cơ bản - Nhắc công thức):'
                            : currentHint === 'applied'
                            ? 'Gợi ý Mức 2 (Vận dụng - Hướng dẫn tính):'
                            : 'Gợi ý Mức 3 (Thử thách - Mở rộng suy luận):'}
                        </span>
                      </div>
                      <p className="text-stone-700">
                        {q.hints[currentHint]}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Real-life Takeaway Task */}
      <div className="bg-amber-50/80 border border-amber-200/90 rounded-3xl p-6 sm:p-7 shadow-xs space-y-3">
        <div className="flex items-center gap-2 text-amber-950 font-bold text-base">
          <Award className="w-5 h-5 text-amber-700" />
          <span>Nhiệm vụ vận dụng thực địa quê hương</span>
        </div>
        <p className="text-stone-800 text-sm sm:text-base leading-relaxed">
          {problem.realLifeTask}
        </p>
        <div className="text-xs text-amber-900 font-medium pt-1">
          📌 Em có thể ghi chép vào sổ tay toán học thực tế và nộp cho Cô Hằng / Giáo viên bộ môn tại lớp nhé!
        </div>
      </div>
    </div>
  );
};
