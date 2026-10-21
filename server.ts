import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '10mb' }));

// Helper to get GoogleGenAI client safely
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// ==========================================
// API: Gia sư Toán AI Socratic (/api/gemini/tutor)
// ==========================================
app.post('/api/gemini/tutor', async (req: Request, res: Response) => {
  try {
    const { message, problemContext, history, studentLevel = 'Lớp 6' } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Nội dung câu hỏi không được để trống.' });
    }

    const ai = getGeminiClient();

    const systemInstruction = `Bạn là "Gia sư Toán Quê Em AI" - người thầy/cô gia sư dạy Toán THCS (Chương trình GDPT 2018) thân thiện, kiên nhẫn và giàu kinh nghiệm tại vùng đất Lâm Đồng (Trường TH & THCS An Hiệp, xã Hiệp Thạnh, Tỉnh Lâm Đồng).
Học sinh của bạn đang ở độ tuổi 11 - 15 (${studentLevel}).

NGUYÊN TẮC SƯ PHẠM BẮT BUỘC:
1. PHƯƠNG PHÁP SOCRATIC: TUYỆT ĐỐI KHÔNG đưa ra ngay đáp án số học cuối cùng. Hãy hỏi ngược lại, gợi mở từng bước, giúp học sinh tự tìm ra công thức và phép tính.
2. GẮN VỚI THỰC TIỄN ĐỊA PHƯƠNG: Dùng các hình ảnh quen thuộc của Lâm Đồng (vườn rau công nghệ cao, nhà kính cà chua, đồi chè Ô Long, dòng nước hồ Đa Nhim, phiên chợ nông sản) để giải thích các khái niệm toán học.
3. DIỄN ĐẠT DỄ HIỂU: Giải thích các thuật ngữ toán học (diện tích, chu vi, tỉ số phần trăm, định mức nước, lưu lượng) bằng ngôn ngữ giản dị, trong sáng của tiếng Việt.
4. AN TOÀN & BÌNH ĐẲNG: Không phân loại năng lực theo dân tộc hay hoàn cảnh cá nhân. Luôn động viên, khích lệ tinh thần học tập của học sinh.
5. KHI KHÔNG CHẮC CHẮN: Nếu bài toán có nhiều cách hiểu hoặc ngoài phạm vi, hãy hướng dẫn học sinh trao đổi thêm với Cô Hằng hoặc giáo viên bộ môn tại lớp.

Bối cảnh bài toán hiện tại của học sinh:
${problemContext ? JSON.stringify(problemContext, null, 2) : 'Toán học thực tiễn THCS Lâm Đồng.'}

Hãy trả lời ngắn gọn (khoảng 2-4 đoạn văn ngắn), ấm áp, có câu hỏi gợi ý để học sinh suy nghĩ tiếp!`;

    if (!ai) {
      // Fallback Socratic heuristic when API key is not configured
      const fallbackResponse = generateSocraticFallback(message, problemContext);
      return res.json({
        reply: fallbackResponse,
        source: 'socratic-engine-local',
        note: 'Đang hoạt động với Bộ suy luận Socratic sư phạm chuẩn CT GDPT 2018.',
      });
    }

    // Call Gemini 3.8 Flash model
    const contents: any[] = [];
    if (Array.isArray(history)) {
      for (const h of history.slice(-6)) {
        contents.push({
          role: h.sender === 'user' ? 'user' : 'model',
          parts: [{ text: h.text }],
        });
      }
    }
    contents.push({
      role: 'user',
      parts: [{ text: message }],
    });

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    const replyText = response.text || 'Thầy cô gia sư rất vui được đồng hành cùng em. Em hãy xem lại đề bài và cho biết ta đang cần tính đại lượng nào trước nhé!';
    return res.json({ reply: replyText, source: 'gemini-3.8-flash' });
  } catch (error: any) {
    console.error('Gemini Tutor Error:', error);
    // Graceful fallback response
    const fallbackResponse = generateSocraticFallback(req.body.message, req.body.problemContext);
    return res.json({
      reply: fallbackResponse,
      source: 'socratic-engine-fallback',
      warning: 'Tạm thời kết nối máy chủ ngoại tuyến, Gia sư sư phạm thông minh đã tiếp quản hỗ trợ em.',
    });
  }
});

// ==========================================
// API: Xưởng tạo bài toán AI (/api/gemini/generate-problem)
// ==========================================
app.post('/api/gemini/generate-problem', async (req: Request, res: Response) => {
  try {
    const {
      grade = 'Lớp 6',
      topic = 'Hình học trực quan - Diện tích và Chu vi',
      learningObjective = 'Tính diện tích hình chữ nhật và vận dụng vào bài toán tiết kiệm nước tưới',
      localContext = 'Vườn rau công nghệ cao tại xã An Hiệp, Lâm Đồng',
      dataNumbers = 'Dài 12m, rộng 8m, tưới nhỏ giọt 3.5 lít/m2',
      difficulty = 'Vận dụng',
      dataType = 'Mô phỏng',
    } = req.body;

    const ai = getGeminiClient();

    const prompt = `Bạn là chuyên gia thiết kế bài toán thực tiễn THCS môn Toán theo Chương trình GDPT 2018 cho tỉnh Lâm Đồng.
Hãy tạo một bài toán thực tiễn hấp dẫn, bám sát đời sống quê hương Lâm Đồng (An Hiệp, Đơn Dương, Đức Trọng, Đà Lạt, Lạc Dương).

YÊU CẦU:
- Khối lớp: ${grade}
- Chủ đề: ${topic}
- Mục tiêu kiến thức: ${learningObjective}
- Tình huống thực tế địa phương: ${localContext}
- Số liệu và đơn vị đo: ${dataNumbers}
- Mức độ: ${difficulty}
- Loại dữ liệu: ${dataType}

ĐẶC BIỆT: Mọi phép tính số học phải chính xác 100%, có kiểm định công thức rõ ràng.
Hãy trả về JSON theo đúng cấu trúc sau (không kèm markdown ngoài JSON):
{
  "title": "Tên bài toán ngắn gọn, cuốn hút",
  "worldId": "smart-garden" (hoặc "village-market" hoặc "greenhouse" hoặc "water-conservation"),
  "grade": "${grade}",
  "topic": "${topic}",
  "difficulty": "${difficulty}",
  "isSimulated": ${dataType === 'Mô phỏng' ? 'true' : 'false'},
  "dataSource": "Nguồn dữ liệu (ví dụ: Mô hình khảo sát thực nghiệm Trường TH & THCS An Hiệp, xã Hiệp Thạnh, Tỉnh Lâm Đồng)",
  "recordDate": "2026-10-21",
  "story": "Đoạn văn bối cảnh thực tế đời sống Lâm Đồng dẫn dắt vào bài toán (3-5 câu)",
  "variables": [
    { "name": "Tên biến (ví dụ: Chiều dài vườn)", "symbol": "a", "value": 12, "unit": "m" }
  ],
  "subQuestions": [
    {
      "id": "q1",
      "questionText": "Câu hỏi cụ thể bước 1",
      "type": "numeric",
      "correctAnswer": 96,
      "unit": "m²",
      "tolerance": 0.1,
      "hints": {
        "basic": "Gợi ý mức 1: Nhắc lại công thức",
        "applied": "Gợi ý mức 2: Hướng dẫn thay số",
        "challenge": "Gợi ý mức 3: Câu hỏi mở rộng suy luận"
      },
      "explanation": "Lời giải chi tiết từng bước có giải thích ý nghĩa thực tế"
    }
  ],
  "realLifeTask": "Nhiệm vụ vận dụng thực tế cho học sinh về nhà hoặc tại địa phương"
}`;

    if (!ai) {
      const template = generateProblemTemplate(grade, topic, localContext, difficulty, dataType);
      return res.json({ problem: template, source: 'curriculum-engine-local' });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.4,
      },
    });

    const jsonText = response.text?.trim() || '{}';
    const problem = JSON.parse(jsonText);
    return res.json({ problem, source: 'gemini-3.8-flash' });
  } catch (error: any) {
    console.error('Gemini Generate Problem Error:', error);
    const template = generateProblemTemplate(
      req.body.grade || 'Lớp 6',
      req.body.topic || 'Hình học trực quan',
      req.body.localContext || 'Lâm Đồng',
      req.body.difficulty || 'Vận dụng',
      req.body.dataType || 'Mô phỏng'
    );
    return res.json({ problem: template, source: 'curriculum-engine-fallback' });
  }
});

// Heuristic Socratic engine for offline/fallback math tutoring
function generateSocraticFallback(message: string, context: any): string {
  const msgLower = (message || '').toLowerCase();

  if (msgLower.includes('diện tích') || msgLower.includes('hình chữ nhật')) {
    return 'Chào em! Để tính diện tích của một mảnh vườn hình chữ nhật (như vườn rau ở An Hiệp), em hãy nhớ lại: ta cần biết hai kích thước nào của vườn nhỉ? Giữa chiều dài và chiều rộng có mối liên hệ phép tính gì?';
  }
  if (msgLower.includes('tiết kiệm') || msgLower.includes('phần trăm') || msgLower.includes('%')) {
    return 'Gia sư gợi ý cho em nhé! Để biết Phương án B tiết kiệm được bao nhiêu so với Phương án A, trước tiên em hãy tìm xem: mỗi ngày Phương án B dùng ít hơn Phương án A bao nhiêu lít nước? Sau đó lấy lượng nước tiết kiệm chia cho lượng nước ban đầu (Phương án A) xem được tỉ số là bao nhiêu nào!';
  }
  if (msgLower.includes('tuần') || msgLower.includes('7 ngày')) {
    return 'Rất tốt! Nếu mỗi ngày em đã tính được số lít nước tiết kiệm rồi, thì trong cả một tuần lễ gồm 7 ngày, lượng nước ấy sẽ được gấp lên mấy lần? Em thử đặt phép nhân xem nhé!';
  }
  if (msgLower.includes('đáp án') || msgLower.includes('kết quả là')) {
    return 'Thầy/Cô Gia sư tin em hoàn toàn có thể tự tính được! Em hãy nêu cho thầy/cô biết các bước tính em vừa làm, xem mình đang băn khoăn ở phép tính nào nào?';
  }
  return `Chào em! Thầy/cô Gia sư Toán Quê Em luôn sẵn sàng hỗ trợ em. Với bài toán thực tiễn ở quê hương mình, bước đầu tiên em hãy đọc kỹ: đề bài đã cho những số liệu nào và hỏi đại lượng gì? Em hãy chia sẻ suy nghĩ bước đầu của em nhé!`;
}

// Curriculum-aligned problem template fallback
function generateProblemTemplate(grade: string, topic: string, localContext: string, difficulty: string, dataType: string) {
  return {
    title: `Tối ưu hóa sản xuất nông sản tại ${localContext.includes('An Hiệp') ? 'An Hiệp' : 'Lâm Đồng'}`,
    worldId: 'smart-garden',
    grade,
    topic,
    difficulty,
    isSimulated: dataType === 'Mô phỏng',
    dataSource: 'Khảo sát thực tiễn mô hình nông nghiệp Trường TH & THCS An Hiệp, xã Hiệp Thạnh, Tỉnh Lâm Đồng',
    recordDate: '2026-10-21',
    story: `Gia đình bạn Nam ở thôn An Hiệp (xã Hiệp Thạnh, huyện Đức Trọng, Tỉnh Lâm Đồng) có một vườn trồng rau xà lách thủy canh và cà chua bi. Để bảo vệ nguồn nước ngầm và nâng cao năng suất, gia đình dự định lắp đặt hệ thống tưới tự động kết hợp cảm biến độ ẩm đất.`,
    variables: [
      { name: 'Chiều dài luống rau', symbol: 'a', value: 12, unit: 'm' },
      { name: 'Chiều rộng luống rau', symbol: 'b', value: 8, unit: 'm' },
      { name: 'Định mức tưới truyền thống', symbol: 'q_A', value: 5, unit: 'lít/m²/ngày' },
      { name: 'Định mức tưới nhỏ giọt thông minh', symbol: 'q_B', value: 3.5, unit: 'lít/m²/ngày' },
    ],
    subQuestions: [
      {
        id: 'q1',
        questionText: 'Tính diện tích của mảnh vườn trồng rau hình chữ nhật (m²).',
        type: 'numeric',
        correctAnswer: 96,
        unit: 'm²',
        tolerance: 0.1,
        hints: {
          basic: 'Diện tích hình chữ nhật = Chiều dài × Chiều rộng (S = a × b).',
          applied: 'Thay số: Chiều dài là 12m, chiều rộng là 8m. Thực hiện phép nhân: 12 × 8.',
          challenge: 'Nếu tăng chiều dài thêm 2m mà giữ nguyên chiều rộng thì diện tích tăng thêm bao nhiêu m²?',
        },
        explanation: 'Diện tích vườn rau là: 12 × 8 = 96 (m²).',
      },
      {
        id: 'q2',
        questionText: 'Một ngày, phương án tưới nhỏ giọt thông minh tiết kiệm được bao nhiêu lít nước so với tưới truyền thống?',
        type: 'numeric',
        correctAnswer: 144,
        unit: 'lít/ngày',
        tolerance: 0.5,
        hints: {
          basic: 'Tính lượng nước của mỗi phương án: Nước = Diện tích × Định mức.',
          applied: 'Phương án A: 96 × 5 = 480 lít. Phương án B: 96 × 3.5 = 336 lít. Lấy Nước A trừ Nước B.',
          challenge: 'Tỉ số phần trăm lượng nước tiết kiệm so với phương án truyền thống là bao nhiêu %?',
        },
        explanation: 'Lượng nước phương án A: 96 × 5 = 480 (lít/ngày). Lượng nước phương án B: 96 × 3,5 = 336 (lít/ngày). Lượng nước tiết kiệm: 480 - 336 = 144 (lít/ngày), tương đương tiết kiệm 30%.',
      },
      {
        id: 'q3',
        questionText: 'Sau một tuần lễ (7 ngày), tổng lượng nước sạch tiết kiệm được là bao nhiêu lít?',
        type: 'numeric',
        correctAnswer: 1008,
        unit: 'lít',
        tolerance: 1,
        hints: {
          basic: 'Lấy số lít nước tiết kiệm trong 1 ngày nhân với 7 ngày.',
          applied: 'Thực hiện phép tính: 144 × 7.',
          challenge: '1.008 lít nước này tương đương bao nhiêu mét khối (m³) nước ngầm được bảo tồn?',
        },
        explanation: 'Tổng lượng nước tiết kiệm sau 7 ngày: 144 × 7 = 1.008 (lít).',
      },
    ],
    realLifeTask: 'Em hãy quan sát cách tưới rau hoặc cây cảnh tại nhà/trường và ước lượng lượng nước tiêu thụ mỗi ngày.',
  };
}

// Start full-stack server
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static('dist'));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve('dist/index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Toán Quê Em AI server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
