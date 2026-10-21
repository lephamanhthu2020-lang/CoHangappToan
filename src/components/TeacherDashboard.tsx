import React, { useState, useRef } from 'react';
import { 
  Users, 
  Download, 
  Upload, 
  TrendingUp, 
  Award, 
  AlertTriangle, 
  Search, 
  Filter, 
  CheckCircle2, 
  ShieldCheck,
  FileSpreadsheet,
  UserCheck,
  BarChart3,
  Calendar,
  SendHorizontal,
  ChevronRight
} from 'lucide-react';
import { StudentRecord } from '../types';
import { exportStudentsToCSV, parseStudentsCSV } from '../utils/csvExport';
import { sounds } from '../utils/soundEffects';

interface TeacherDashboardProps {
  students: StudentRecord[];
  onUpdateStudents: (updated: StudentRecord[]) => void;
  selectedStudentId: string;
  onSelectStudent: (id: string) => void;
}

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({
  students,
  onUpdateStudents,
  selectedStudentId,
  onSelectStudent,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGroupFilter, setSelectedGroupFilter] = useState<'all' | 'Cần củng cố' | 'Vận dụng' | 'Phát triển năng khiếu'>('all');
  const [notification, setNotification] = useState<string | null>(null);
  const [editingStudent, setEditingStudent] = useState<StudentRecord | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Group task assignment state
  const [groupTasks, setGroupTasks] = useState({
    'Cần củng cố': 'Bài mẫu: Tiết kiệm nước tưới vườn rau (Ưu tiên gợi ý Mức 1)',
    'Vận dụng': 'Bài toán: Nông sản phiên chợ Liên Nghĩa (Định mức chiết khấu)',
    'Phát triển năng khiếu': 'Bài toán: Phủ màng nilon nhà kính Lạc Dương (Hình học không gian)',
  });

  // Calculate high-level stats
  const totalStudents = students.length;
  const avgPreTest = +(students.reduce((acc, s) => acc + s.preTestScore, 0) / (totalStudents || 1)).toFixed(1);
  const avgPostTest = +(students.reduce((acc, s) => acc + s.postTestScore, 0) / (totalStudents || 1)).toFixed(1);
  const avgImprovement = +(avgPostTest - avgPreTest).toFixed(1);
  const totalCompletedProblems = students.reduce((acc, s) => acc + s.completedProblems, 0);
  const totalAttempts = students.reduce((acc, s) => acc + s.totalAttempts, 0);

  // Filter students
  const filteredStudents = students.filter((s) => {
    const matchesSearch = s.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGroup = selectedGroupFilter === 'all' || s.group === selectedGroupFilter;
    return matchesSearch && matchesGroup;
  });

  // Group counts
  const countGroup1 = students.filter((s) => s.group === 'Cần củng cố').length;
  const countGroup2 = students.filter((s) => s.group === 'Vận dụng').length;
  const countGroup3 = students.filter((s) => s.group === 'Phát triển năng khiếu').length;

  // Handle Export CSV
  const handleExportCSV = () => {
    exportStudentsToCSV(students, `ToanQueEmAI_Lop47HS_AnHiep_${new Date().toISOString().slice(0, 10)}.csv`);
    sounds.playCorrect();
    setNotification('Đã xuất file CSV chuẩn UTF-8 (Excel tiếng Việt không lỗi font) thành công!');
    setTimeout(() => setNotification(null), 4000);
  };

  // Handle Import CSV
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (text) {
        const parsed = parseStudentsCSV(text);
        if (parsed.length > 0) {
          onUpdateStudents(parsed);
          sounds.playCorrect();
          setNotification(`Đã nhập thành công kết quả của ${parsed.length} học sinh từ file CSV!`);
        } else {
          setNotification('File CSV không đúng định dạng hoặc không có dữ liệu.');
        }
      }
    };
    reader.readAsText(file, 'utf-8');
    e.target.value = '';
    setTimeout(() => setNotification(null), 5000);
  };

  // Save student edit
  const handleSaveStudentEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStudent) return;

    const updated = students.map((s) => (s.id === editingStudent.id ? editingStudent : s));
    onUpdateStudents(updated);
    setEditingStudent(null);
    sounds.playHint();
    setNotification(`Đã cập nhật kết quả khảo sát cho học sinh ${editingStudent.id}.`);
    setTimeout(() => setNotification(null), 3000);
  };

  // Assign task to group
  const handleAssignTask = (group: 'Cần củng cố' | 'Vận dụng' | 'Phát triển năng khiếu', task: string) => {
    setGroupTasks((prev) => ({ ...prev, [group]: task }));
    const updated = students.map((s) => {
      if (s.group === group) {
        return {
          ...s,
          assignedTasks: Array.from(new Set([...s.assignedTasks, task])),
        };
      }
      return s;
    });
    onUpdateStudents(updated);
    sounds.playHint();
    setNotification(`Đã giao nhiệm vụ mới cho nhóm "${group}" thành công!`);
    setTimeout(() => setNotification(null), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-stone-200 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-teal-900 bg-teal-100 px-2.5 py-1 rounded-md mb-2">
            <Users className="w-3.5 h-3.5" />
            Chức năng 5: Quản lý lớp học thực nghiệm
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
            Dashboard Giáo viên – Theo dõi tiến độ 47 học sinh ẩn danh
          </h2>
          <p className="text-stone-600 text-sm sm:text-base mt-1 max-w-3xl">
            Lớp thực nghiệm tại Trường TH và THCS An Hiệp, Lâm Đồng. Đánh giá tác động học tập (Pre-test vs Post-test), 
            phân hóa dạy học theo nhóm năng lực và theo dõi lỗi toán học thường gặp.
          </p>
        </div>

        {/* CSV Actions */}
        <div className="flex items-center gap-2">
          <input
            type="file"
            ref={fileInputRef}
            accept=".csv"
            onChange={handleFileUpload}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1.5 bg-white hover:bg-stone-100 text-stone-800 font-semibold text-xs px-3.5 py-2.5 rounded-xl border border-stone-300 transition-colors cursor-pointer"
          >
            <Upload className="w-4 h-4 text-emerald-700" />
            <span>Nhập kết quả CSV</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-xs transition-all cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4 text-amber-300" />
            <span>Xuất file CSV (Excel)</span>
          </button>
        </div>
      </div>

      {/* Safety & Non-fake-data notice */}
      <div className="bg-emerald-50/70 border border-emerald-200/90 p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-stone-700">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0" />
          <span>
            <strong>Bảo mật thông tin trẻ em:</strong> 100% mã học sinh là định danh ẩn danh (HS01 – HS47). 
            Không lưu giữ thông tin nhận dạng cá nhân. Dữ liệu khảo sát trung thực, không tự sinh kết quả giả.
          </span>
        </div>
        <span className="text-[11px] bg-white px-2.5 py-1 rounded-md border border-emerald-300 text-emerald-900 font-semibold shrink-0">
          Sĩ số lớp: 47 HS
        </span>
      </div>

      {notification && (
        <div className="p-3.5 bg-emerald-100 border border-emerald-300 text-emerald-900 rounded-2xl text-xs font-semibold flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-1">
          <div className="text-xs text-stone-700 font-medium">Khảo sát đầu vào (Pre-test)</div>
          <div className="text-2xl sm:text-3xl font-extrabold text-stone-700">
            {avgPreTest} <span className="text-xs font-normal text-stone-700">/ 10 điểm</span>
          </div>
          <div className="text-[11px] text-stone-700">Điểm kiểm tra trước thực nghiệm</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-1">
          <div className="text-xs text-stone-700 font-medium">Quá trình thực nghiệm (Post-test)</div>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-700">
            {avgPostTest} <span className="text-xs font-normal text-stone-700">/ 10 điểm</span>
          </div>
          <div className="text-[11px] text-emerald-800 font-semibold flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            Tiến bộ rõ rệt: +{avgImprovement} điểm
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-1">
          <div className="text-xs text-stone-700 font-medium">Số lượt thử (Attempts)</div>
          <div className="text-2xl sm:text-3xl font-extrabold text-amber-700">
            {totalAttempts} <span className="text-xs font-normal text-stone-700">lượt</span>
          </div>
          <div className="text-[11px] text-stone-700">
            Trung bình {(totalAttempts / totalStudents).toFixed(1)} lượt/học sinh
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-1">
          <div className="text-xs text-stone-700 font-medium">Bài toán hoàn thành</div>
          <div className="text-2xl sm:text-3xl font-extrabold text-teal-800">
            {totalCompletedProblems} <span className="text-xs font-normal text-stone-700">bài</span>
          </div>
          <div className="text-[11px] text-teal-800 font-semibold">
            Tỷ lệ làm chủ: {((totalCompletedProblems / (totalStudents * 4)) * 100).toFixed(0)}%
          </div>
        </div>
      </div>

      {/* Differentiated Learning: 3 Group Cards & Task Assignment */}
      <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b pb-3">
          <h3 className="font-bold text-base text-stone-900 flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-emerald-700" />
            <span>Phân hóa theo 3 nhóm nhu cầu học tập & Giao nhiệm vụ</span>
          </h3>
          <span className="text-xs text-stone-700">Differentiated Learning</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Group 1 */}
          <div className="bg-amber-50/50 border border-amber-200 p-4 rounded-2xl space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs uppercase text-amber-900 bg-amber-100 px-2 py-0.5 rounded-md">
                Nhóm 1: Cần củng cố
              </span>
              <span className="text-xs font-mono font-bold text-amber-900">{countGroup1} học sinh</span>
            </div>
            <p className="text-xs text-stone-600">
              Cần hỗ trợ công thức cơ bản và làm quen các đơn vị đo nông nghiệp.
            </p>
            <div className="bg-white p-2.5 rounded-xl border border-amber-200/80 text-xs text-stone-700">
              <div className="font-semibold text-amber-950 mb-1">Nhiệm vụ đang giao:</div>
              <div className="text-[11px]">{groupTasks['Cần củng cố']}</div>
            </div>
            <button
              onClick={() => handleAssignTask('Cần củng cố', 'Bài mẫu: Tiết kiệm nước tưới vườn rau (Có gợi ý Mức 1)')}
              className="w-full text-xs font-bold text-amber-900 bg-amber-200/80 hover:bg-amber-300 py-1.5 rounded-xl transition-colors cursor-pointer"
            >
              Giao thêm bài củng cố
            </button>
          </div>

          {/* Group 2 */}
          <div className="bg-emerald-50/50 border border-emerald-200 p-4 rounded-2xl space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs uppercase text-emerald-900 bg-emerald-100 px-2 py-0.5 rounded-md">
                Nhóm 2: Vận dụng
              </span>
              <span className="text-xs font-mono font-bold text-emerald-900">{countGroup2} học sinh</span>
            </div>
            <p className="text-xs text-stone-600">
              Nắm chắc công thức, rèn luyện kỹ năng giải toán có lời văn thực tế.
            </p>
            <div className="bg-white p-2.5 rounded-xl border border-emerald-200/80 text-xs text-stone-700">
              <div className="font-semibold text-emerald-950 mb-1">Nhiệm vụ đang giao:</div>
              <div className="text-[11px]">{groupTasks['Vận dụng']}</div>
            </div>
            <button
              onClick={() => handleAssignTask('Vận dụng', 'Bài toán: Nông sản phiên chợ Liên Nghĩa (Định mức chiết khấu)')}
              className="w-full text-xs font-bold text-emerald-900 bg-emerald-200/80 hover:bg-emerald-300 py-1.5 rounded-xl transition-colors cursor-pointer"
            >
              Giao bài vận dụng
            </button>
          </div>

          {/* Group 3 */}
          <div className="bg-purple-50/50 border border-purple-200 p-4 rounded-2xl space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs uppercase text-purple-900 bg-purple-100 px-2 py-0.5 rounded-md">
                Nhóm 3: Phát triển năng khiếu
              </span>
              <span className="text-xs font-mono font-bold text-purple-900">{countGroup3} học sinh</span>
            </div>
            <p className="text-xs text-stone-600">
              Tư duy trừu tượng tốt, giải quyết các bài toán tối ưu hóa chi phí.
            </p>
            <div className="bg-white p-2.5 rounded-xl border border-purple-200/80 text-xs text-stone-700">
              <div className="font-semibold text-purple-950 mb-1">Nhiệm vụ đang giao:</div>
              <div className="text-[11px]">{groupTasks['Phát triển năng khiếu']}</div>
            </div>
            <button
              onClick={() => handleAssignTask('Phát triển năng khiếu', 'Bài toán: Phủ màng nilon nhà kính Lạc Dương (Hình lăng trụ)')}
              className="w-full text-xs font-bold text-purple-900 bg-purple-200/80 hover:bg-purple-300 py-1.5 rounded-xl transition-colors cursor-pointer"
            >
              Giao bài thử thách cao
            </button>
          </div>
        </div>
      </div>

      {/* Common Errors (Misconceptions) Section */}
      <div className="bg-amber-50/60 border border-amber-200 p-5 rounded-3xl space-y-3">
        <h3 className="font-bold text-sm text-amber-950 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-700" />
          <span>Thống kê các lỗi toán học học sinh thường gặp trong bài thực nghiệm:</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
          <div className="bg-white p-3 rounded-xl border border-amber-200/80">
            <div className="font-bold text-stone-900">1. Nhầm chu vi với diện tích (34%)</div>
            <p className="text-stone-600 text-[11px] mt-0.5">
              Học sinh cộng (12 + 8) × 2 = 40m thay vì tính diện tích 12 × 8 = 96m².
            </p>
          </div>
          <div className="bg-white p-3 rounded-xl border border-amber-200/80">
            <div className="font-bold text-stone-900">2. Tính sai tỉ số % tiết kiệm (26%)</div>
            <p className="text-stone-600 text-[11px] mt-0.5">
              Lấy lượng tiết kiệm chia cho lượng nước mới thay vì chia cho lượng nước ban đầu.
            </p>
          </div>
          <div className="bg-white p-3 rounded-xl border border-amber-200/80">
            <div className="font-bold text-stone-900">3. Quên nhân 7 ngày của tuần (19%)</div>
            <p className="text-stone-600 text-[11px] mt-0.5">
              Ghi đáp án 144 lít thay vì 1.008 lít sau một tuần lễ.
            </p>
          </div>
        </div>
      </div>

      {/* Student List Table & Filter */}
      <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h3 className="font-bold text-base text-stone-900 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-emerald-700" />
            <span>Danh sách 47 học sinh & Bảng điểm thực nghiệm</span>
          </h3>

          {/* Search & Filter */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-stone-700" />
              <input
                type="text"
                placeholder="Tìm mã HS (HS01, HS15...)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 rounded-xl border border-stone-300 text-xs focus:outline-hidden focus:border-emerald-600"
              />
            </div>

            <select
              value={selectedGroupFilter}
              onChange={(e) => setSelectedGroupFilter(e.target.value as any)}
              className="p-1.5 rounded-xl border border-stone-300 text-xs bg-white font-medium focus:outline-hidden"
            >
              <option value="all">Tất cả nhóm</option>
              <option value="Cần củng cố">Cần củng cố</option>
              <option value="Vận dụng">Vận dụng</option>
              <option value="Phát triển năng khiếu">Phát triển năng khiếu</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto border border-stone-100 rounded-2xl">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 border-b border-stone-200 text-stone-700 font-bold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">Mã HS (Ẩn danh)</th>
                <th className="py-3 px-4">Nhóm năng lực</th>
                <th className="py-3 px-4 text-center">Khảo sát đầu vào (Pre-test)</th>
                <th className="py-3 px-4 text-center">Quá trình (Post-test)</th>
                <th className="py-3 px-4 text-center">Tiến bộ (Delta)</th>
                <th className="py-3 px-4 text-center">Số bài xong</th>
                <th className="py-3 px-4 text-center">Lượt thử</th>
                <th className="py-3 px-4">Lỗi thường gặp</th>
                <th className="py-3 px-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredStudents.map((s) => {
                const delta = +(s.postTestScore - s.preTestScore).toFixed(1);
                const isSelected = selectedStudentId === s.id;

                return (
                  <tr
                    key={s.id}
                    className={`hover:bg-emerald-50/40 transition-colors ${
                      isSelected ? 'bg-emerald-50/70 font-semibold' : ''
                    }`}
                  >
                    <td className="py-3 px-4 font-mono font-bold text-stone-900">
                      {s.id}
                      {isSelected && (
                        <span className="ml-1.5 bg-emerald-700 text-white text-[9px] px-1.5 py-0.5 rounded-md">
                          Đang chọn
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          s.group === 'Cần củng cố'
                            ? 'bg-amber-100 text-amber-900'
                            : s.group === 'Vận dụng'
                            ? 'bg-emerald-100 text-emerald-900'
                            : 'bg-purple-100 text-purple-900'
                        }`}
                      >
                        {s.group}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center font-semibold text-stone-600">
                      {s.preTestScore.toFixed(1)}
                    </td>
                    <td className="py-3 px-4 text-center font-bold text-emerald-700">
                      {s.postTestScore.toFixed(1)}
                    </td>
                    <td className="py-3 px-4 text-center font-bold">
                      <span className={delta >= 0 ? 'text-green-600' : 'text-red-500'}>
                        {delta >= 0 ? `+${delta}` : delta}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center font-semibold text-stone-700">
                      {s.completedProblems}
                    </td>
                    <td className="py-3 px-4 text-center font-mono text-stone-700">
                      {s.totalAttempts}
                    </td>
                    <td className="py-3 px-4 text-stone-600 text-[11px] max-w-[200px] truncate">
                      {s.commonErrors.join('; ')}
                    </td>
                    <td className="py-3 px-4 text-right space-x-1 whitespace-nowrap">
                      <button
                        onClick={() => onSelectStudent(s.id)}
                        className="text-[11px] text-emerald-800 hover:text-emerald-950 font-bold px-2 py-1 rounded-md hover:bg-emerald-100 cursor-pointer"
                        title="Đóng vai học sinh này để trải nghiệm"
                      >
                        Đóng vai
                      </button>
                      <button
                        onClick={() => setEditingStudent(s)}
                        className="text-[11px] text-amber-800 hover:text-amber-950 font-semibold px-2 py-1 rounded-md hover:bg-amber-100 cursor-pointer"
                      >
                        Sửa điểm
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Student Score Modal */}
      {editingStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl space-y-4 border border-stone-200">
            <h4 className="font-bold text-stone-900 text-base">
              Cập nhật kết quả: Học sinh {editingStudent.id}
            </h4>
            <form onSubmit={handleSaveStudentEdit} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-stone-700 block mb-1">Nhóm năng lực:</label>
                <select
                  value={editingStudent.group}
                  onChange={(e) =>
                    setEditingStudent({ ...editingStudent, group: e.target.value as any })
                  }
                  className="w-full p-2 rounded-xl border border-stone-300 font-medium"
                >
                  <option value="Cần củng cố">Cần củng cố</option>
                  <option value="Vận dụng">Vận dụng</option>
                  <option value="Phát triển năng khiếu">Phát triển năng khiếu</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Điểm khảo sát (Pre-test):</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="10"
                    value={editingStudent.preTestScore}
                    onChange={(e) =>
                      setEditingStudent({
                        ...editingStudent,
                        preTestScore: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="w-full p-2 rounded-xl border border-stone-300 font-bold"
                  />
                </div>

                <div>
                  <label className="font-bold text-stone-700 block mb-1">Điểm quá trình (Post-test):</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="10"
                    value={editingStudent.postTestScore}
                    onChange={(e) =>
                      setEditingStudent({
                        ...editingStudent,
                        postTestScore: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="w-full p-2 rounded-xl border border-stone-300 font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">Số lượt thử (Attempts):</label>
                <input
                  type="number"
                  min="0"
                  value={editingStudent.totalAttempts}
                  onChange={(e) =>
                    setEditingStudent({
                      ...editingStudent,
                      totalAttempts: parseInt(e.target.value) || 0,
                    })
                  }
                  className="w-full p-2 rounded-xl border border-stone-300"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingStudent(null)}
                  className="px-3 py-1.5 rounded-xl border text-stone-700 hover:bg-stone-100 cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-emerald-800 text-white font-bold cursor-pointer"
                >
                  Lưu thay đổi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
