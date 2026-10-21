/**
 * Math Verification Engine - Kiểm định Toán học xác định
 * Đảm bảo mọi kết quả số học đều được kiểm tra bằng logic tính toán xác định.
 */

export interface VerificationResult {
  isValid: boolean;
  userNumericValue: number | null;
  expectedValue: number | string;
  difference: number;
  message: string;
  detectedUnit: string | null;
  isUnitMatched: boolean;
  misconceptionAlert?: string;
}

/**
 * Chuẩn hóa chuỗi số từ học sinh:
 * - Chấp nhận cả dấu phẩy thập phân kiểu Việt Nam (3,5) và dấu chấm (3.5)
 * - Xử lý dấu chấm ngăn cách hàng nghìn (1.008 -> 1008 hoặc 1008)
 * - Tách phần số và phần đơn vị
 */
export function parseVietnameseNumberInput(rawInput: string): {
  numericValue: number | null;
  extractedUnit: string;
} {
  if (!rawInput || typeof rawInput !== 'string') {
    return { numericValue: null, extractedUnit: '' };
  }

  let text = rawInput.trim();

  // Phát hiện đơn vị đo kèm theo nếu có
  const unitPatterns = [
    'lít/ngày', 'lít', 'lit', 'l',
    'm²', 'm2', 'mét vuông', 'met vuong', 'm',
    '%', 'phần trăm', 'phan tram',
    'đồng', 'nghìn đồng', 'kg', 'tạ', 'tấn'
  ];

  let extractedUnit = '';
  for (const u of unitPatterns) {
    const reg = new RegExp(`\\s*${u.replace('/', '\\/')}\\s*$`, 'i');
    if (reg.test(text)) {
      extractedUnit = u;
      text = text.replace(reg, '').trim();
      break;
    }
  }

  // Trường hợp số có dấu chấm hàng nghìn như 1.008 hoặc 1,008
  // Nếu chuỗi khớp định dạng số nguyên hàng nghìn: ví dụ "1.008" hoặc "10.000"
  if (/^\d{1,3}(\.\d{3})+$/.test(text)) {
    // 1.008 -> 1008
    text = text.replace(/\./g, '');
  } else if (/^\d{1,3}(,\d{3})+$/.test(text)) {
    // 1,008 -> 1008 (nếu dùng phẩy hàng nghìn)
    text = text.replace(/,/g, '');
  } else {
    // Nếu có dấu phẩy đơn lẻ làm dấu thập phân: 3,5 -> 3.5
    text = text.replace(',', '.');
  }

  // Làm sạch các ký tự không phải số hoặc dấu âm, dấu chấm
  text = text.replace(/[^0-9.-]/g, '');

  const val = parseFloat(text);
  return {
    numericValue: isNaN(val) ? null : val,
    extractedUnit,
  };
}

/**
 * Kiểm định đáp án học sinh với đáp án chuẩn
 */
export function verifyAnswer(
  rawInput: string,
  expectedAnswer: number | string,
  expectedUnit: string = '',
  tolerance: number = 0.01,
  misconceptions?: { [key: string]: string }
): VerificationResult {
  if (typeof expectedAnswer === 'string' && isNaN(Number(expectedAnswer))) {
    // Trắc nghiệm lựa chọn (A, B, C, D hoặc id text)
    const normalizedInput = rawInput.trim().toUpperCase();
    const normalizedExpected = expectedAnswer.trim().toUpperCase();
    const isCorrect = normalizedInput === normalizedExpected;
    return {
      isValid: isCorrect,
      userNumericValue: null,
      expectedValue: expectedAnswer,
      difference: 0,
      message: isCorrect
        ? 'Chính xác! Lập luận của em rất chuẩn xác.'
        : 'Chưa chính xác, em hãy đọc kỹ bối cảnh bài toán và thử lại nhé!',
      detectedUnit: null,
      isUnitMatched: true,
    };
  }

  const expectedNum = Number(expectedAnswer);
  const { numericValue, extractedUnit } = parseVietnameseNumberInput(rawInput);

  if (numericValue === null) {
    return {
      isValid: false,
      userNumericValue: null,
      expectedValue: expectedNum,
      difference: Infinity,
      message: 'Vui lòng nhập một giá trị số hợp lệ (ví dụ: 96 hoặc 1008).',
      detectedUnit: null,
      isUnitMatched: false,
    };
  }

  // Kiểm tra đơn vị nếu học sinh có gõ kèm đơn vị
  let isUnitMatched = true;
  if (extractedUnit && expectedUnit) {
    const normUserUnit = normalizeUnit(extractedUnit);
    const normExpUnit = normalizeUnit(expectedUnit);
    if (normUserUnit !== normExpUnit) {
      isUnitMatched = false;
    }
  }

  const diff = Math.abs(numericValue - expectedNum);
  const isValid = diff <= tolerance;

  // Kiểm tra lỗi thường gặp (misconceptions)
  let misconceptionAlert: string | undefined;
  if (!isValid && misconceptions) {
    for (const [wrongValStr, reason] of Object.entries(misconceptions)) {
      const wrongVal = parseFloat(wrongValStr);
      if (!isNaN(wrongVal) && Math.abs(numericValue - wrongVal) <= tolerance) {
        misconceptionAlert = reason;
        break;
      }
    }
  }

  let message = '';
  if (isValid) {
    if (!isUnitMatched) {
      message = `Giá trị số ${numericValue} rất chính xác, nhưng em lưu ý đơn vị chuẩn bài toán yêu cầu là ${expectedUnit} nhé!`;
    } else {
      message = `Xuất sắc! Kết quả ${formatVietnameseNumber(numericValue)} ${expectedUnit} hoàn toàn chính xác.`;
    }
  } else {
    if (misconceptionAlert) {
      message = misconceptionAlert;
    } else if (diff < 1) {
      message = `Gần đúng rồi! Em kiểm tra lại thao tác làm tròn số xem nhé.`;
    } else {
      message = `Kết quả chưa đúng. Em hãy bấm vào nút "Gợi ý" hoặc hỏi "Gia sư AI" để được hướng dẫn từng bước nhé!`;
    }
  }

  return {
    isValid,
    userNumericValue: numericValue,
    expectedValue: expectedNum,
    difference: diff,
    message,
    detectedUnit: extractedUnit || null,
    isUnitMatched,
    misconceptionAlert,
  };
}

/**
 * Chuẩn hóa tên đơn vị đo tiếng Việt
 */
function normalizeUnit(unit: string): string {
  const u = unit.toLowerCase().replace(/\s+/g, '');
  if (['m2', 'm²', 'metvuong', 'métvuông'].includes(u)) return 'm²';
  if (['l', 'lit', 'lít'].includes(u)) return 'lít';
  if (['lit/ngay', 'lít/ngày'].includes(u)) return 'lít/ngày';
  if (['%', 'phantram', 'phầntrăm'].includes(u)) return '%';
  if (['dong', 'đồng', 'vnd'].includes(u)) return 'đồng';
  return u;
}

/**
 * Định dạng số theo chuẩn tiếng Việt (dấu phẩy cho phần thập phân)
 */
export function formatVietnameseNumber(num: number): string {
  return new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 2 }).format(num);
}
