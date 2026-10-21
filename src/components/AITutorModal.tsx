import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Send, 
  Bot, 
  User, 
  Volume2, 
  Sparkles, 
  ShieldCheck, 
  HelpCircle, 
  Lightbulb,
  RefreshCw
} from 'lucide-react';
import { TutorMessage } from '../types';

interface AITutorModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialQuestion?: string;
  problemContext?: any;
  studentLevel?: string;
}

export const AITutorModal: React.FC<AITutorModalProps> = ({
  isOpen,
  onClose,
  initialQuestion,
  problemContext,
  studentLevel = 'Lớp 6',
}) => {
  const [messages, setMessages] = useState<TutorMessage[]>([
    {
      id: 'welcome',
      sender: 'tutor',
      text: 'Chào em! Thầy/Cô là Gia sư Toán Quê Em AI. Thầy/Cô sẽ không đưa ngay đáp án số học, mà sẽ cùng em đặt các câu hỏi gợi mở để em tự tin khám phá bài toán nhé. Em đang gặp khó khăn ở bước nào?',
      timestamp: 'Vừa xong',
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Quick suggestion chips
  const quickChips = [
    'Tại sao diện tích lại lấy 12 nhân 8?',
    'Cách tính tỉ số % tiết kiệm (30%)',
    'Sau 7 ngày sao lại nhân 7?',
    'Giải thích định mức tưới nhỏ giọt',
    'Cho em một ví dụ thực tế khác',
  ];

  useEffect(() => {
    if (initialQuestion && isOpen) {
      setInputText(`Thầy/cô hướng dẫn em câu hỏi này với: "${initialQuestion}"`);
    }
  }, [initialQuestion, isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  if (!isOpen) return null;

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || loading) return;

    const userMsg: TutorMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text,
      timestamp: 'Vừa xong',
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setLoading(true);

    try {
      const response = await fetch('/api/gemini/tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          problemContext,
          history: messages,
          studentLevel,
        }),
      });

      const contentType = response.headers.get('content-type') || '';
      if (response.ok && contentType.includes('application/json')) {
        const data = await response.json();
        const tutorReply = data.reply || getLocalSocraticReply(text, problemContext);

        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            sender: 'tutor',
            text: tutorReply,
            timestamp: 'Vừa xong',
          },
        ]);
      } else {
        // Local educational Socratic response
        const fallbackReply = getLocalSocraticReply(text, problemContext);
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            sender: 'tutor',
            text: fallbackReply,
            timestamp: 'Vừa xong',
          },
        ]);
      }
    } catch (err) {
      const fallbackReply = getLocalSocraticReply(text, problemContext);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'tutor',
          text: fallbackReply,
          timestamp: 'Vừa xong',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Local Socratic reasoning engine
  const getLocalSocraticReply = (query: string, ctx: any) => {
    const q = query.toLowerCase();
    if (q.includes('diện tích') || q.includes('nhân 8') || q.includes('12 nhân 8')) {
      return 'Chào em! Khi tính diện tích mảnh vườn hình chữ nhật (12m × 8m), em hãy hình dung: mỗi mét chiều dài ta có 8 mét vuông, vậy 12 mét chiều dài sẽ có bao nhiêu mét vuông? Phép tính nhân sẽ giúp ta gộp các hàng diện tích lại một cách nhanh chóng nhất. Em hãy thử tính xem 12 × 8 bằng bao nhiêu nhé!';
    }
    if (q.includes('tiết kiệm') || q.includes('30%') || q.includes('phần trăm')) {
      return 'Gia sư hướng dẫn em nhé: Phương án A dùng 480 lít, Phương án B dùng 336 lít. Mỗi ngày tiết kiệm được 480 - 336 = 144 lít. Để tìm tỉ số phần trăm so với lượng nước ban đầu, ta lấy lượng tiết kiệm (144) chia cho lượng ban đầu (480) rồi nhân 100%. Em thử đặt phép tính xem có ra đúng 30% không nhé!';
    }
    if (q.includes('7 ngày') || q.includes('nhân 7') || q.includes('1.008') || q.includes('1008')) {
      return 'Rất chính xác! Một ngày hệ thống nhỏ giọt tiết kiệm được 144 lít. Một tuần lễ có đúng 7 ngày. Lấy 144 lít nhân với 7 ngày sẽ ra tổng lượng nước bảo tồn được. Em thử nhẩm tính xem: 144 × 7 có đúng bằng 1.008 lít (hơn 1 mét khối nước ngầm) không nào?';
    }
    if (q.includes('định mức') || q.includes('nhỏ giọt')) {
      return '"Định mức tưới" là lượng nước dự tính cần cung cấp cho 1 mét vuông đất trong 1 ngày (lít/m²/ngày). Phương án B nhỏ giọt trực tiếp vào gốc rễ cây xà lách nên tránh bị bốc hơi dưới ánh nắng gay gắt, giúp tiết kiệm từ 5 lít xuống chỉ còn 3,5 lít trên mỗi mét vuông đấy em!';
    }
    return 'Chào em! Thầy/cô Gia sư luôn sẵn sàng đồng hành cùng em. Trong bài toán thực tiễn quê mình, em hãy đọc kỹ: bài toán đã cho ta những số liệu nào và câu hỏi đang yêu cầu tính đại lượng gì? Em hãy chia sẻ suy nghĩ ban đầu của em để thầy cô hướng dẫn từng bước nhé!';
  };

  // Text-to-speech reading in Vietnamese
  const speakText = (text: string) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'vi-VN';
    utterance.rate = 0.95;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-900/60 backdrop-blur-xs">
      <div className="bg-white w-full max-w-2xl h-[88vh] max-h-[700px] rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-emerald-900/20 animate-scaleUp">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-800 to-green-900 text-white p-4 sm:p-5 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-400 text-stone-950 flex items-center justify-center shadow-md">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base sm:text-lg">Gia sư Socratic AI</h3>
                <span className="bg-emerald-950 text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-700">
                  CTGDPT 2018
                </span>
              </div>
              <p className="text-xs text-emerald-200">
                Gợi mở tư duy – Không cho ngay đáp án – Đồng hành cùng học sinh THCS
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-emerald-200 hover:text-white p-2 rounded-xl hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Child Safety & Pedagogical Banner */}
        <div className="bg-amber-50/80 px-4 py-2 border-b border-amber-200/80 text-[11px] text-amber-950 flex items-center justify-between">
          <span className="flex items-center gap-1.5 font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
            Gia sư an toàn, không phân loại cá nhân, ngôn ngữ trong sáng.
          </span>
          <span className="text-stone-700 hidden sm:inline">
            Nếu cần xác minh thêm: Hỏi Cô Hằng
          </span>
        </div>

        {/* Chat message list */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 bg-stone-50/50">
          {messages.map((m) => {
            const isTutor = m.sender === 'tutor';
            return (
              <div
                key={m.id}
                className={`flex gap-3 ${isTutor ? 'justify-start' : 'justify-end'}`}
              >
                {isTutor && (
                  <div className="w-8 h-8 rounded-xl bg-emerald-700 text-white flex items-center justify-center shrink-0 mt-1 shadow-xs">
                    <Bot className="w-4 h-4 text-amber-300" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed space-y-1.5 shadow-xs ${
                    isTutor
                      ? 'bg-white border border-stone-200/90 text-stone-800 rounded-tl-xs'
                      : 'bg-emerald-800 text-white rounded-tr-xs'
                  }`}
                >
                  <p className="whitespace-pre-line">{m.text}</p>
                  <div className="flex items-center justify-between pt-1">
                    <span
                      className={`text-[10px] ${
                        isTutor ? 'text-stone-700' : 'text-emerald-200'
                      }`}
                    >
                      {m.timestamp}
                    </span>
                    {isTutor && (
                      <button
                        onClick={() => speakText(m.text)}
                        title="Nghe giọng đọc tiếng Việt"
                        className="text-stone-700 hover:text-emerald-700 p-1 transition-colors cursor-pointer"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {!isTutor && (
                  <div className="w-8 h-8 rounded-xl bg-amber-500 text-stone-900 flex items-center justify-center shrink-0 mt-1 shadow-xs font-bold text-xs">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}

          {loading && (
            <div className="flex gap-3 items-center text-xs text-stone-700 animate-pulse">
              <div className="w-8 h-8 rounded-xl bg-emerald-700 text-white flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4 text-amber-300" />
              </div>
              <div className="bg-white border border-stone-200 p-3 rounded-2xl rounded-tl-xs">
                Gia sư đang suy nghĩ câu hỏi gợi mở cho em...
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Suggestion Chips */}
        <div className="p-3 bg-white border-t border-stone-100 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          <span className="text-[11px] font-bold text-stone-700 whitespace-nowrap pl-1 flex items-center gap-1">
            <Lightbulb className="w-3 h-3 text-amber-600" /> Gợi ý hỏi:
          </span>
          {quickChips.map((chip, i) => (
            <button
              key={i}
              onClick={() => handleSendMessage(chip)}
              className="text-[11px] whitespace-nowrap bg-stone-100 hover:bg-emerald-50 hover:text-emerald-900 text-stone-700 px-2.5 py-1 rounded-lg border border-stone-200 transition-colors cursor-pointer"
            >
              {chip}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 sm:p-4 bg-white border-t border-stone-200">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Nhập câu hỏi hoặc băn khoăn toán học của em..."
              className="flex-1 px-4 py-2.5 rounded-xl border border-stone-300 focus:outline-hidden focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 text-xs sm:text-sm"
            />
            <button
              type="submit"
              disabled={!inputText.trim() || loading}
              className="bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white p-2.5 sm:px-4 sm:py-2.5 rounded-xl font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline text-xs">Gửi hỏi</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
