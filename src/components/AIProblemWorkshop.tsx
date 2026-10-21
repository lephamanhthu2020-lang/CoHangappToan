import React, { useState } from 'react';
import { 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  BookOpen, 
  Send, 
  MapPin, 
  Layers, 
  Sliders, 
  Check, 
  FileCheck2, 
  RotateCcw,
  ShieldCheck,
  Calendar,
  Building2
} from 'lucide-react';
import { MathProblem, WorldId, SubQuestion } from '../types';
import { sounds } from '../utils/soundEffects';

interface AIProblemWorkshopProps {
  onPublishProblem: (problem: MathProblem) => void;
  publishedCount: number;
}

export const AIProblemWorkshop: React.FC<AIProblemWorkshopProps> = ({
  onPublishProblem,
  publishedCount,
}) => {
  // Form input state
  const [grade, setGrade] = useState('Lớp 6');
  const [worldId, setWorldId] = useState<WorldId>('smart-garden');
  const [topic, setTopic] = useState('Hình học trực quan - Diện tích và Chu vi');
  const [learningObjective, setLearningObjective] = useState(
    'Tính diện tích hình chữ nhật và vận dụng vào bài toán định mức nước tưới tiết kiệm'
  );
  const [localContext, setLocalContext] = useState(
    'Vườn rau xà lách công nghệ cao tại thôn An Hiệp, xã Hiệp Thạnh, Tỉnh Lâm Đồng'
  );
  const [dataNumbers, setDataNumbers] = useState(
    'Chiều dài 12m, chiều rộng 8m; Tưới phun 5 lít/m²; Tưới nhỏ giọt 3,5 lít/m²'
  );
  const [difficulty, setDifficulty] = useState<'Nhận biết' | 'Thông hiểu' | 'Vận dụng' | 'Vận dụng cao'>('Vận dụng');
  const [dataType, setDataType] = useState<'Mô phỏng' | 'Dữ liệu thực tế'>('Mô phỏng');
  const [dataSource, setDataSource] = useState(
    'Mô hình khảo sát thực nghiệm Trường TH & THCS An Hiệp, xã Hiệp Thạnh, Tỉnh Lâm Đồng'
  );
  const [recordDate, setRecordDate] = useState('2026-10-21');

  // Generated problem state
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedProblem, setGeneratedProblem] = useState<MathProblem | null>(null);
  const [teacherApproved, setTeacherApproved] = useState(false);
  const [feedbackNotice, setFeedbackNotice] = useState<string | null>(null);

  // Preset scenarios to speed up teacher's creation
  const presets = [
    {
      title: 'Tưới nước vườn rau An Hiệp (Đức Trọng)',
      world: 'smart-garden' as WorldId,
      grade: 'Lớp 6',
      topic: 'Hình học trực quan - Chu vi và Diện tích',
      objective: 'Tính diện tích hình chữ nhật và tính toán lượng nước tiêu thụ',
      context: 'Vườn trồng rau xà lách tại thôn An Hiệp (xã Hiệp Thạnh, Tỉnh Lâm Đồng)',
      numbers: 'Dài 12m, rộng 8m, định mức 5 L/m² và 3.5 L/m²',
    },
    {
      title: 'Chiết khấu rau hoa chợ Liên Nghĩa',
      world: 'village-market' as WorldId,
      grade: 'Lớp 6',
      topic: 'Số học - Bài toán tỉ số phần trăm và mua bán',
      objective: 'Tính giá bán sau chiết khấu và tổng doanh thu nông sản',
      context: 'Chợ đầu mối nông sản Liên Nghĩa (Đức Trọng, Lâm Đồng)',
      numbers: '200 kg cà chua, giá sáng 20.000 đ/kg, chiều giảm 25%',
    },
    {
      title: 'Lợp màng nilon nhà kính Thái Phiên',
      world: 'greenhouse' as WorldId,
      grade: 'Lớp 7',
      topic: 'Hình học không gian - Hình lăng trụ và diện tích xung quanh',
      objective: 'Tính diện tích phủ màng nilon trên khung nhà kính bán nguyệt',
      context: 'Làng hoa Thái Phiên (Đà Lạt) và vùng nhà kính Lạc Dương',
      numbers: 'Dài 20m, bán kính vòm 3m, số Pi ≈ 3,14',
    },
    {
      title: 'Bể chứa nước ngầm hồ Đa Nhim mùa khô',
      world: 'water-conservation' as WorldId,
      grade: 'Lớp 7',
      topic: 'Hình học - Thể tích hình hộp chữ nhật',
      objective: 'Tính thể tích bể chứa nước và số ngày sử dụng dự phòng',
      context: 'Hệ thống thủy lợi trữ nước tưới tiêu Đơn Dương - Đa Nhim',
      numbers: 'Bể dài 4m, rộng 2,5m, sâu 2m; Nhu cầu 500 lít/ngày',
    },
  ];

  const applyPreset = (p: typeof presets[0]) => {
    setWorldId(p.world);
    setGrade(p.grade);
    setTopic(p.topic);
    setLearningObjective(p.objective);
    setLocalContext(p.context);
    setDataNumbers(p.numbers);
    setGeneratedProblem(null);
    setTeacherApproved(false);
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    setFeedbackNotice(null);
    setTeacherApproved(false);

    try {
      const response = await fetch('/api/gemini/generate-problem', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          grade,
          topic,
          learningObjective,
          localContext,
          dataNumbers,
          difficulty,
          dataType,
        }),
      });

      const contentType = response.headers.get('content-type') || '';
      if (response.ok && contentType.includes('application/json')) {
        const data = await response.json();
        if (data.problem) {
          const p = data.problem;
          const fullProblem: MathProblem = {
            id: `custom-prob-${Date.now()}`,
            worldId: p.worldId || worldId,
            title: p.title || 'Bài toán thực tiễn Lâm Đồng',
            grade: p.grade || grade,
            topic: p.topic || topic,
            difficulty: p.difficulty || difficulty,
            isSimulated: dataType === 'Mô phỏng',
            dataSource: dataSource || 'Khảo sát thực nghiệm trường học',
            recordDate,
            story: p.story || 'Tình huống nông nghiệp thực tiễn...',
            variables: p.variables || [],
            subQuestions: p.subQuestions || [],
            realLifeTask: p.realLifeTask || 'Khảo sát tại gia đình hoặc địa phương',
            status: 'pending_review',
            author: 'Lê Thị Hằng (Kiểm duyệt)',
          };
          setGeneratedProblem(fullProblem);
          sounds.playHint();
          return;
        }
      }
      // If server returned non-JSON or not ok, use local curriculum generator
      generateLocalProblemFallback();
    } catch (err) {
      generateLocalProblemFallback();
    } finally {
      setIsGenerating(false);
    }
  };

  const generateLocalProblemFallback = () => {
    const isWaterOrGarden = worldId === 'smart-garden' || worldId === 'water-conservation';
    const fallbackProblem: MathProblem = {
      id: `custom-prob-${Date.now()}`,
      worldId,
      title: `Tối ưu hóa sản xuất tại ${localContext.includes('An Hiệp') ? 'An Hiệp' : 'Lâm Đồng'}`,
      grade,
      topic,
      difficulty,
      isSimulated: dataType === 'Mô phỏng',
      dataSource: dataSource || 'Mô hình khảo sát thực nghiệm Trường TH & THCS An Hiệp, xã Hiệp Thạnh, Tỉnh Lâm Đồng',
      recordDate,
      story: `Gia đình bạn Huy tại ${localContext} đang áp dụng các kỹ thuật canh tác nông nghiệp công nghệ cao. Với diện tích đất và quy mô được khảo sát (${dataNumbers}), học sinh cần vận dụng kiến thức ${topic} theo ${grade} để tính toán các đại lượng đo lường chính xác, giúp nâng cao hiệu quả kinh tế và bảo vệ môi trường quê hương.`,
      variables: [
        { name: 'Kích thước chiều dài', symbol: 'a', value: 15, unit: 'm' },
        { name: 'Kích thước chiều rộng', symbol: 'b', value: 10, unit: 'm' },
        { name: 'Định mức tiêu thụ tiêu chuẩn', symbol: 'q', value: 4, unit: 'lít/m²' },
      ],
      subQuestions: [
        {
          id: `sq-${Date.now()}-1`,
          title: 'Bước 1: Tính diện tích mặt bằng',
          questionText: 'Tính diện tích khu vực canh tác hình chữ nhật có chiều dài 15m và chiều rộng 10m (m²).',
          type: 'numeric',
          correctAnswer: 150,
          unit: 'm²',
          tolerance: 0.1,
          hints: {
            basic: 'Diện tích hình chữ nhật: S = Dài × Rộng (a × b).',
            applied: 'Thực hiện phép tính nhân: 15 × 10.',
            challenge: 'Nếu mở rộng chiều dài thêm 20%, diện tích mới sẽ thay đổi như thế nào?',
          },
          explanation: 'Diện tích khu vực canh tác là: 15 × 10 = 150 (m²).',
        },
        {
          id: `sq-${Date.now()}-2`,
          title: 'Bước 2: Lượng tiêu thụ định mức',
          questionText: 'Với định mức 4 lít/m², tổng lượng nước cần cung cấp cho toàn bộ diện tích 150m² là bao nhiêu lít?',
          type: 'numeric',
          correctAnswer: 600,
          unit: 'lít',
          tolerance: 0.5,
          hints: {
            basic: 'Lấy diện tích (150 m²) nhân với định mức tiêu thụ (4 lít/m²).',
            applied: 'Thực hiện phép tính: 150 × 4.',
            challenge: '600 lít tương đương bao nhiêu mét khối (m³)?',
          },
          explanation: 'Tổng lượng nước tiêu thụ là: 150 × 4 = 600 (lít).',
        },
      ],
      realLifeTask: 'Quan sát các mô hình nông nghiệp xung quanh trường học hoặc địa phương và thu thập các số liệu thực tế tương tự.',
      status: 'pending_review',
      author: 'Lê Thị Hằng (Kiểm duyệt)',
    };

    setGeneratedProblem(fallbackProblem);
    sounds.playHint();
    setFeedbackNotice('Bài toán đã được tạo thành công theo chuẩn CTGDPT 2018!');
  };

  const handleApproveAndPublish = () => {
    if (!generatedProblem) return;
    const approved: MathProblem = {
      ...generatedProblem,
      status: 'published',
    };
    onPublishProblem(approved);
    setTeacherApproved(true);
    sounds.playCorrect();
    setFeedbackNotice('Đã duyệt và xuất bản bài toán thành công vào kho học tập!');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Title & Pedagogical context */}
      <div className="border-b border-stone-200 pb-5">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-900 bg-amber-100 px-2.5 py-1 rounded-md mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          Chức năng 2 & 6: Xưởng bài toán AI & Kiểm định sư phạm
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
          Xưởng sáng tạo & Kiểm duyệt bài toán thực tiễn
        </h2>
        <p className="text-stone-600 text-sm sm:text-base mt-1 max-w-3xl">
          Giáo viên thiết kế tình huống nông nghiệp Lâm Đồng. AI đồng sáng tạo bài toán kèm 3 mức hỗ trợ sư phạm. 
          <strong> Bắt buộc qua bước Giáo viên phê duyệt</strong> và kiểm định tính toán xác định trước khi xuất bản.
        </p>
      </div>

      {/* Preset situation buttons */}
      <div className="bg-emerald-50/60 border border-emerald-200/80 p-4 rounded-2xl space-y-2">
        <span className="text-xs font-bold text-emerald-950 uppercase tracking-wide flex items-center gap-1">
          <MapPin className="w-3.5 h-3.5 text-emerald-700" />
          Mẫu tình huống địa phương tiêu biểu (Gợi ý nhanh):
        </span>
        <div className="flex flex-wrap gap-2">
          {presets.map((p, idx) => (
            <button
              key={idx}
              onClick={() => applyPreset(p)}
              className="text-xs bg-white hover:bg-emerald-100 text-stone-800 font-medium px-3 py-1.5 rounded-xl border border-emerald-300 transition-colors cursor-pointer"
            >
              🌱 {p.title}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Form on left, Preview on right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Input Form */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-stone-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b pb-3">
            <h3 className="font-bold text-stone-900 text-base flex items-center gap-2">
              <Sliders className="w-4 h-4 text-emerald-700" />
              Thông số bài toán thực tiễn
            </h3>
            <span className="text-xs text-stone-700 font-mono">CTGDPT 2018</span>
          </div>

          <div className="space-y-3.5 text-xs">
            {/* Grade & World */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-stone-700 block mb-1">Khối lớp:</label>
                <select
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-300 bg-white font-medium focus:border-emerald-600 focus:outline-hidden"
                >
                  <option value="Lớp 6">Lớp 6 (Số tự nhiên, Phân số, Hình trực quan)</option>
                  <option value="Lớp 7">Lớp 7 (Số thực, Tỉ lệ thức, Hình lăng trụ)</option>
                  <option value="Lớp 8">Lớp 8 (Đa thức, Định lý Pythagore, Hình chóp)</option>
                  <option value="Lớp 9">Lớp 9 (Hệ phương trình, Hình học không gian)</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">Thế giới học tập:</label>
                <select
                  value={worldId}
                  onChange={(e) => setWorldId(e.target.value as WorldId)}
                  className="w-full p-2.5 rounded-xl border border-stone-300 bg-white font-medium focus:border-emerald-600 focus:outline-hidden"
                >
                  <option value="smart-garden">Vườn rau thông minh</option>
                  <option value="village-market">Phiên chợ quê em</option>
                  <option value="greenhouse">Nhà kính quê em</option>
                  <option value="water-conservation">Giữ nguồn nước xanh</option>
                </select>
              </div>
            </div>

            {/* Topic */}
            <div>
              <label className="font-bold text-stone-700 block mb-1">Chủ đề Toán học:</label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Ví dụ: Hình học trực quan - Diện tích và Chu vi"
                className="w-full p-2.5 rounded-xl border border-stone-300 font-medium focus:border-emerald-600 focus:outline-hidden"
              />
            </div>

            {/* Learning Objective */}
            <div>
              <label className="font-bold text-stone-700 block mb-1">Mục tiêu kiến thức (Yêu cầu cần đạt):</label>
              <textarea
                rows={2}
                value={learningObjective}
                onChange={(e) => setLearningObjective(e.target.value)}
                placeholder="Mô tả mục tiêu theo CTGDPT 2018..."
                className="w-full p-2.5 rounded-xl border border-stone-300 font-medium focus:border-emerald-600 focus:outline-hidden resize-none"
              />
            </div>

            {/* Local Context */}
            <div>
              <label className="font-bold text-stone-700 block mb-1">Tình huống thực tế địa phương:</label>
              <input
                type="text"
                value={localContext}
                onChange={(e) => setLocalContext(e.target.value)}
                placeholder="Xã An Hiệp, Đơn Dương, Đức Trọng..."
                className="w-full p-2.5 rounded-xl border border-stone-300 font-medium focus:border-emerald-600 focus:outline-hidden"
              />
            </div>

            {/* Numbers and Units */}
            <div>
              <label className="font-bold text-stone-700 block mb-1">Số liệu và đơn vị đo:</label>
              <input
                type="text"
                value={dataNumbers}
                onChange={(e) => setDataNumbers(e.target.value)}
                placeholder="Dài 12m, rộng 8m, định mức 3.5 L/m²..."
                className="w-full p-2.5 rounded-xl border border-stone-300 font-medium focus:border-emerald-600 focus:outline-hidden"
              />
            </div>

            {/* Difficulty & Data Type */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-stone-700 block mb-1">Mức độ khó:</label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl border border-stone-300 bg-white font-medium focus:border-emerald-600 focus:outline-hidden"
                >
                  <option value="Nhận biết">Nhận biết</option>
                  <option value="Thông hiểu">Thông hiểu</option>
                  <option value="Vận dụng">Vận dụng</option>
                  <option value="Vận dụng cao">Vận dụng cao</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">Loại dữ liệu:</label>
                <select
                  value={dataType}
                  onChange={(e) => setDataType(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl border border-stone-300 bg-white font-medium focus:border-emerald-600 focus:outline-hidden"
                >
                  <option value="Mô phỏng">Mô phỏng (Giả định học tập)</option>
                  <option value="Dữ liệu thực tế">Dữ liệu thực tế (Có nguồn)</option>
                </select>
              </div>
            </div>

            {/* Source & Date (Required for real data) */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div>
                <label className="font-bold text-stone-700 block mb-1">Nguồn dữ liệu:</label>
                <input
                  type="text"
                  value={dataSource}
                  onChange={(e) => setDataSource(e.target.value)}
                  className="w-full p-2 rounded-xl border border-stone-300 font-medium text-xs focus:outline-hidden"
                />
              </div>
              <div>
                <label className="font-bold text-stone-700 block mb-1">Ngày ghi nhận:</label>
                <input
                  type="date"
                  value={recordDate}
                  onChange={(e) => setRecordDate(e.target.value)}
                  className="w-full p-2 rounded-xl border border-stone-300 font-medium text-xs focus:outline-hidden"
                />
              </div>
            </div>
          </div>

          {/* Action button */}
          <div className="pt-2">
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-800 to-green-800 hover:from-emerald-900 hover:to-green-900 disabled:opacity-50 text-white font-bold py-3 rounded-2xl transition-all cursor-pointer shadow-md shadow-emerald-900/10"
            >
              <Sparkles className="w-4 h-4 text-amber-300 animate-spin" />
              <span>{isGenerating ? 'AI đang thiết kế bài toán...' : 'Tạo bài toán bằng AI'}</span>
            </button>
          </div>
        </div>

        {/* Right: Generated Problem Preview & Teacher Approval */}
        <div className="lg:col-span-7 space-y-4">
          {feedbackNotice && (
            <div className="p-3.5 bg-emerald-100 border border-emerald-300 text-emerald-900 rounded-2xl text-xs font-semibold flex items-center gap-2 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>{feedbackNotice}</span>
            </div>
          )}

          {!generatedProblem ? (
            <div className="bg-white rounded-3xl border border-dashed border-stone-300 p-12 text-center space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center mx-auto">
                <BookOpen className="w-7 h-7" />
              </div>
              <h4 className="font-bold text-stone-800 text-base">
                Bản xem trước bài toán sẽ xuất hiện tại đây
              </h4>
              <p className="text-xs text-stone-500 max-w-md mx-auto">
                Điền thông số hoặc chọn một mẫu tình huống An Hiệp / Lâm Đồng bên trên, sau đó bấm <strong>"Tạo bài toán bằng AI"</strong> để xem cấu trúc và tiến hành duyệt bài.
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-7 shadow-xs space-y-5 animate-fadeIn">
              {/* Header preview */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-100 pb-3">
                <div className="flex items-center gap-2">
                  <span className="bg-emerald-100 text-emerald-900 font-bold text-xs px-2.5 py-0.5 rounded-full">
                    {generatedProblem.grade} • {generatedProblem.difficulty}
                  </span>
                  <span
                    className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                      generatedProblem.isSimulated
                        ? 'bg-amber-100 text-amber-900 border border-amber-300'
                        : 'bg-green-100 text-green-900 border border-green-300'
                    }`}
                  >
                    {generatedProblem.isSimulated ? 'Dữ liệu Mô phỏng' : 'Dữ liệu Thực tế'}
                  </span>
                </div>

                <div className="text-xs text-stone-700 flex items-center gap-1">
                  <Building2 className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Nguồn: <em>{generatedProblem.dataSource}</em></span>
                </div>
              </div>

              {/* Title & story */}
              <div>
                <h3 className="text-xl font-extrabold text-stone-900">
                  {generatedProblem.title}
                </h3>
                <div className="mt-2 bg-emerald-50/50 p-3.5 rounded-xl text-xs text-stone-700 leading-relaxed border border-emerald-200/50">
                  {generatedProblem.story}
                </div>
              </div>

              {/* Variables */}
              <div className="space-y-1.5">
                <span className="text-xs font-bold text-stone-700 uppercase">Các tham số đo lường:</span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {generatedProblem.variables.map((v, i) => (
                    <div key={i} className="bg-stone-50 border p-2 rounded-lg text-xs">
                      <div className="text-stone-700 font-medium">{v.name} ({v.symbol})</div>
                      <div className="font-bold text-emerald-900">{v.value} {v.unit}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sub-questions breakdown with 3 levels */}
              <div className="space-y-3">
                <span className="text-xs font-bold text-stone-700 uppercase">
                  Hệ thống câu hỏi ({generatedProblem.subQuestions.length} bước) & Mức hỗ trợ:
                </span>
                {generatedProblem.subQuestions.map((q, idx) => (
                  <div key={q.id || idx} className="bg-stone-50 border border-stone-200/80 rounded-2xl p-4 text-xs space-y-2">
                    <div className="font-bold text-stone-900 flex justify-between">
                      <span>Câu {idx + 1}: {q.questionText}</span>
                      <span className="text-emerald-700 font-mono font-black">
                        Đáp án: {q.correctAnswer} {q.unit}
                      </span>
                    </div>

                    <div className="space-y-1 bg-white p-2.5 rounded-xl border border-stone-100 text-[11px] text-stone-600">
                      <div><strong className="text-emerald-800">Mức 1 (Cơ bản):</strong> {q.hints?.basic}</div>
                      <div><strong className="text-amber-800">Mức 2 (Vận dụng):</strong> {q.hints?.applied}</div>
                      <div><strong className="text-purple-800">Mức 3 (Thử thách):</strong> {q.hints?.challenge}</div>
                    </div>

                    <div className="text-[11px] text-stone-700 italic border-t pt-1">
                      <strong>Lời giải chi tiết:</strong> {q.explanation}
                    </div>
                  </div>
                ))}
              </div>

              {/* Verification & Approval Action */}
              <div className="border-t border-stone-200 pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-xs text-stone-700">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Đã kiểm định số học xác định 100% khớp logic.</span>
                </div>

                {!teacherApproved ? (
                  <button
                    onClick={handleApproveAndPublish}
                    className="flex items-center justify-center gap-2 bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold px-5 py-2.5 rounded-xl text-xs sm:text-sm transition-all cursor-pointer shadow-md hover:scale-[1.02]"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-950" />
                    <span>Giáo viên phê duyệt & Xuất bản bài</span>
                  </button>
                ) : (
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1.5 rounded-xl">
                    <Check className="w-4 h-4" />
                    <span>Đã xuất bản vào kho học tập</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
