import React, { useState } from 'react';
import { 
  CheckCircle2, 
  ShieldCheck, 
  Calculator, 
  Binary, 
  Scale, 
  BookOpen, 
  Check, 
  HelpCircle,
  FileCode2,
  Sparkles
} from 'lucide-react';
import { verifyAnswer } from '../utils/mathEngine';

export const MathVerificationModal: React.FC = () => {
  // Interactive test calculator for Ban Giám Khảo & Teachers to test any formula
  const [testInput, setTestInput] = useState('1.008 lít');
  const [expectedVal, setExpectedVal] = useState('1008');
  const [expectedUnit, setExpectedUnit] = useState('lít');
  const [tolerance, setTolerance] = useState('0.1');

  const testResult = verifyAnswer(testInput, expectedVal, expectedUnit, parseFloat(tolerance) || 0.1);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Title */}
      <div className="border-b border-stone-200 pb-5">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-green-900 bg-green-100 px-2.5 py-1 rounded-md mb-2">
          <ShieldCheck className="w-3.5 h-3.5 text-green-700" />
          Chức năng 6: Động cơ Kiểm định Toán học xác định
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
          Hệ thống Kiểm định Toán học & Tính toán xác định
        </h2>
        <p className="text-stone-600 text-sm sm:text-base mt-1 max-w-3xl">
          Đảm bảo tính chính xác khoa học 100%: Mọi kết quả số học, đơn vị đo, sai số làm tròn và đáp án tương đương 
          <strong> không phụ thuộc thuần túy vào câu trả lời của AI</strong> mà được đối chiếu bằng động cơ tính toán xác định (Deterministic Verification Engine).
        </p>
      </div>

      {/* Grid: 4 Core Verification Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-xs space-y-2">
          <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
            <Calculator className="w-5 h-5 text-emerald-700" />
          </div>
          <h4 className="font-bold text-stone-900 text-sm">Tính toán xác định</h4>
          <p className="text-xs text-stone-600 leading-relaxed">
            Các công thức diện tích ($S = a \times b$), lưu lượng ($V = S \times q$), phần trăm ($\% = \Delta / V_0$) được tính bằng thuật toán số học chuẩn xác.
          </p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-xs space-y-2">
          <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-900 flex items-center justify-center font-bold">
            <Scale className="w-5 h-5 text-amber-700" />
          </div>
          <h4 className="font-bold text-stone-900 text-sm">Chuẩn hóa dấu số Việt Nam</h4>
          <p className="text-xs text-stone-600 leading-relaxed">
            Xử lý mượt mà cả dấu phẩy thập phân kiểu Việt Nam (3,5) và dấu chấm (3.5), cũng như dấu chấm phân cách hàng nghìn (1.008 = 1008).
          </p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-xs space-y-2">
          <div className="w-10 h-10 rounded-2xl bg-teal-100 text-teal-900 flex items-center justify-center font-bold">
            <Binary className="w-5 h-5 text-teal-700" />
          </div>
          <h4 className="font-bold text-stone-900 text-sm">Đối chiếu tương đương đơn vị</h4>
          <p className="text-xs text-stone-600 leading-relaxed">
            Nhận diện linh hoạt giữa các cách viết đơn vị đo: m² / m2, lít / l / lit, % / phần trăm, giúp học sinh tập trung vào bản chất toán học.
          </p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-xs space-y-2">
          <div className="w-10 h-10 rounded-2xl bg-purple-100 text-purple-900 flex items-center justify-center font-bold">
            <CheckCircle2 className="w-5 h-5 text-purple-700" />
          </div>
          <h4 className="font-bold text-stone-900 text-sm">Giáo viên kiểm duyệt 100%</h4>
          <p className="text-xs text-stone-600 leading-relaxed">
            Mọi bài toán sinh ra từ xưởng AI đều phải trải qua bước kiểm duyệt, xác minh lời giải và phê duyệt của giáo viên trước khi đưa vào kho bài học.
          </p>
        </div>
      </div>

      {/* Starter Problem Proof Table */}
      <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-7 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b pb-3">
          <h3 className="font-bold text-stone-900 text-base flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-emerald-700" />
            <span>Bảng kiểm định xác thực bài mẫu: "Tiết kiệm nước tưới vườn rau"</span>
          </h3>
          <span className="text-xs font-mono font-bold text-amber-700 bg-amber-100 px-2.5 py-0.5 rounded-full">
            Dữ liệu mô phỏng học tập
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-stone-50 border-b border-stone-200 text-stone-700 font-bold uppercase text-[11px]">
              <tr>
                <th className="py-2.5 px-3">Bước tính</th>
                <th className="py-2.5 px-3">Công thức xác định</th>
                <th className="py-2.5 px-3">Thay số cụ thể</th>
                <th className="py-2.5 px-3">Đáp án chuẩn</th>
                <th className="py-2.5 px-3">Đơn vị</th>
                <th className="py-2.5 px-3">Trạng thái kiểm định</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 font-medium">
              <tr>
                <td className="py-3 px-3 font-bold text-stone-900">Bước 1: Diện tích vườn</td>
                <td className="py-3 px-3 font-mono text-stone-600">S = a × b</td>
                <td className="py-3 px-3 font-mono">12 × 8</td>
                <td className="py-3 px-3 font-bold text-emerald-700 font-mono">96</td>
                <td className="py-3 px-3">m²</td>
                <td className="py-3 px-3 text-emerald-700 font-bold flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> Khớp xác định
                </td>
              </tr>
              <tr>
                <td className="py-3 px-3 font-bold text-stone-900">Bước 2: Lượng nước PA B</td>
                <td className="py-3 px-3 font-mono text-stone-600">V_B = S × q_B</td>
                <td className="py-3 px-3 font-mono">96 × 3,5</td>
                <td className="py-3 px-3 font-bold text-emerald-700 font-mono">336</td>
                <td className="py-3 px-3">lít/ngày</td>
                <td className="py-3 px-3 text-emerald-700 font-bold flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> Khớp xác định
                </td>
              </tr>
              <tr>
                <td className="py-3 px-3 font-bold text-stone-900">Bước 3: Tiết kiệm mỗi ngày</td>
                <td className="py-3 px-3 font-mono text-stone-600">ΔV = V_A - V_B</td>
                <td className="py-3 px-3 font-mono">480 - 336</td>
                <td className="py-3 px-3 font-bold text-emerald-700 font-mono">144 (30%)</td>
                <td className="py-3 px-3">lít/ngày</td>
                <td className="py-3 px-3 text-emerald-700 font-bold flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> Khớp xác định
                </td>
              </tr>
              <tr>
                <td className="py-3 px-3 font-bold text-stone-900">Bước 4: Sau 7 ngày (1 tuần)</td>
                <td className="py-3 px-3 font-mono text-stone-600">V_7 = ΔV × 7</td>
                <td className="py-3 px-3 font-mono">144 × 7</td>
                <td className="py-3 px-3 font-bold text-emerald-700 font-mono">1.008</td>
                <td className="py-3 px-3">lít</td>
                <td className="py-3 px-3 text-emerald-700 font-bold flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> Khớp xác định
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Live Interactive Parser Sandbox */}
      <div className="bg-emerald-50/70 border border-emerald-200 p-6 rounded-3xl space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-stone-900 text-sm flex items-center gap-2">
            <FileCode2 className="w-4 h-4 text-emerald-700" />
            <span>Thử nghiệm công cụ phân tích chuỗi học sinh nhập (Interactive Parser Tester)</span>
          </h3>
          <span className="text-xs text-stone-700">Dành cho Thầy/Cô & Ban Giám khảo</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
          <div>
            <label className="font-bold text-stone-700 block mb-1">Chuỗi học sinh gõ:</label>
            <input
              type="text"
              value={testInput}
              onChange={(e) => setTestInput(e.target.value)}
              className="w-full p-2 rounded-xl border border-stone-300 font-mono font-bold bg-white"
              placeholder="Ví dụ: 1.008 lít hoặc 1008"
            />
          </div>

          <div>
            <label className="font-bold text-stone-700 block mb-1">Đáp án kỳ vọng:</label>
            <input
              type="text"
              value={expectedVal}
              onChange={(e) => setExpectedVal(e.target.value)}
              className="w-full p-2 rounded-xl border border-stone-300 font-mono bg-white"
            />
          </div>

          <div>
            <label className="font-bold text-stone-700 block mb-1">Đơn vị chuẩn:</label>
            <input
              type="text"
              value={expectedUnit}
              onChange={(e) => setExpectedUnit(e.target.value)}
              className="w-full p-2 rounded-xl border border-stone-300 bg-white"
            />
          </div>

          <div>
            <label className="font-bold text-stone-700 block mb-1">Dung sai (Tolerance):</label>
            <input
              type="text"
              value={tolerance}
              onChange={(e) => setTolerance(e.target.value)}
              className="w-full p-2 rounded-xl border border-stone-300 bg-white font-mono"
            />
          </div>
        </div>

        {/* Live Output */}
        <div className="bg-white p-4 rounded-2xl border border-emerald-300 text-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-bold text-stone-800">Kết quả phân tích xác định:</span>
            <span
              className={`px-2.5 py-0.5 rounded-full font-bold ${
                testResult.isValid ? 'bg-green-100 text-green-900' : 'bg-red-100 text-red-900'
              }`}
            >
              {testResult.isValid ? 'HỢP LỆ (ĐÚNG)' : 'CHƯA HỢP LỆ'}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-stone-700 text-[11px] font-mono">
            <div>Số trích xuất: <strong>{testResult.userNumericValue ?? 'Không nhận diện được'}</strong></div>
            <div>Đơn vị trích xuất: <strong>{testResult.detectedUnit || '(Không có)'}</strong></div>
            <div>Khớp đơn vị: <strong>{testResult.isUnitMatched ? 'Có' : 'Không'}</strong></div>
            <div>Độ lệch: <strong>{testResult.difference.toFixed(4)}</strong></div>
          </div>

          <p className="text-stone-800 font-medium pt-1 text-xs">
            💬 Thông báo phản hồi cho học sinh: <em>"{testResult.message}"</em>
          </p>
        </div>
      </div>
    </div>
  );
};
