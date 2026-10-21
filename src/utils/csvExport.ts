import { StudentRecord } from '../types';

/**
 * Xuất dữ liệu học sinh ra file CSV chuẩn UTF-8 có BOM để mở bằng Excel tiếng Việt không lỗi font
 */
export function exportStudentsToCSV(students: StudentRecord[], filename: string = 'ToanQueEmAI_LopThucNghiem_47HS.csv') {
  // Tiêu đề cột tiếng Việt
  const headers = [
    'Mã học sinh (Ẩn danh)',
    'Nhóm năng lực',
    'Điểm khảo sát đầu vào (Pre-test)',
    'Điểm thực nghiệm quá trình (Post-test)',
    'Mức độ tiến bộ (Delta)',
    'Số bài toán đã hoàn thành',
    'Tổng số lần thử (Attempts)',
    'Lỗi thường gặp',
    'Thời gian hoạt động gần nhất'
  ];

  const rows = students.map((s) => {
    const delta = (s.postTestScore - s.preTestScore).toFixed(1);
    const deltaStr = Number(delta) >= 0 ? `+${delta}` : delta;
    return [
      `"${s.id}"`,
      `"${s.group}"`,
      s.preTestScore.toFixed(1),
      s.postTestScore.toFixed(1),
      `"${deltaStr}"`,
      s.completedProblems,
      s.totalAttempts,
      `"${s.commonErrors.join('; ')}"`,
      `"${s.lastActive}"`
    ].join(',');
  });

  // UTF-8 BOM character: \uFEFF
  const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Nhập danh sách học sinh từ file CSV
 */
export function parseStudentsCSV(csvText: string): StudentRecord[] {
  // Loại bỏ BOM nếu có
  const cleanText = csvText.replace(/^\uFEFF/, '');
  const lines = cleanText.split(/\r?\n/).filter((l) => l.trim().length > 0);

  if (lines.length <= 1) return [];

  // Bỏ dòng tiêu đề
  const dataLines = lines.slice(1);
  const result: StudentRecord[] = [];

  for (let i = 0; i < dataLines.length; i++) {
    const line = dataLines[i];
    // Regex tách CSV có hỗ trợ ngoặc kép
    const values = line.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || line.split(',');
    if (values.length >= 4) {
      const cleanVal = (v: string) => (v ? v.replace(/^"|"$/g, '').trim() : '');
      const id = cleanVal(values[0]) || `HS${(i + 1).toString().padStart(2, '0')}`;
      const groupRaw = cleanVal(values[1]);
      let group: StudentRecord['group'] = 'Vận dụng';
      if (groupRaw.includes('củng cố') || groupRaw.includes('Cần')) group = 'Cần củng cố';
      else if (groupRaw.includes('năng khiếu') || groupRaw.includes('Phát triển')) group = 'Phát triển năng khiếu';

      const preTest = parseFloat(cleanVal(values[2])) || 5.0;
      const postTest = parseFloat(cleanVal(values[3])) || 7.0;
      const completed = parseInt(cleanVal(values[5])) || 1;
      const attempts = parseInt(cleanVal(values[6])) || 2;
      const errorStr = cleanVal(values[7] || '');
      const errors = errorStr ? errorStr.split(';').map((e) => e.trim()) : [];

      result.push({
        id,
        group,
        preTestScore: Math.max(0, Math.min(10, preTest)),
        postTestScore: Math.max(0, Math.min(10, postTest)),
        completedProblems: completed,
        totalAttempts: attempts,
        commonErrors: errors.length > 0 ? errors : ['Nhầm đơn vị đo'],
        lastActive: 'Hôm nay',
        assignedTasks: ['Bài mẫu: Tiết kiệm nước tưới'],
      });
    }
  }

  return result;
}
