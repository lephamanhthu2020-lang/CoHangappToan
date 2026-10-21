import React from 'react';
import { 
  Sprout, 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  Award, 
  MapPin, 
  Bot, 
  Droplets,
  Layers
} from 'lucide-react';

interface BannerHeroProps {
  onExploreWorlds: () => void;
  onOpenSampleProblem: () => void;
  onOpenWorkshop: () => void;
}

export const BannerHero: React.FC<BannerHeroProps> = ({
  onExploreWorlds,
  onOpenSampleProblem,
  onOpenWorkshop,
}) => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-emerald-900 via-emerald-800 to-green-900 text-white rounded-3xl shadow-xl my-6 mx-4 sm:mx-6 lg:mx-8 border border-emerald-700/50">
      {/* Decorative background grid and highland contours */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fde047_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-600/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 py-10 sm:py-14 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Main textual intro */}
          <div className="lg:col-span-7 space-y-5">
            {/* Location & Author badge */}
            <div className="inline-flex items-center gap-2 bg-emerald-950/60 backdrop-blur border border-emerald-600/50 px-3.5 py-1.5 rounded-full text-xs sm:text-sm text-emerald-200 shadow-inner">
              <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Trường TH & THCS An Hiệp, xã Hiệp Thạnh, Tỉnh Lâm Đồng</span>
              <span className="text-emerald-500">•</span>
              <span className="font-semibold text-amber-300">Tác giả: Lê Thị Hằng</span>
            </div>

            <div className="space-y-2">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight">
                TOÁN QUÊ EM <span className="text-amber-400">AI</span>
              </h1>
              <p className="text-xl sm:text-2xl font-bold text-amber-200 italic tracking-wide">
                “Mỗi góc quê hương – Một bài toán mới!”
              </p>
            </div>

            <p className="text-emerald-100/90 text-sm sm:text-base leading-relaxed max-w-2xl">
              Nền tảng chuyển hóa các hoạt động đời sống thực tế tại tỉnh Lâm Đồng thành nhiệm vụ học Toán sinh động.
              Học sinh THCS tự khám phá, lập luận và giải quyết vấn đề toán học với sự đồng hành của 
              <strong> Gia sư Socratic AI</strong> gợi mở tư duy theo chuẩn Chương trình GDPT 2018.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={onOpenSampleProblem}
                className="flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold px-5 py-3 rounded-2xl shadow-lg shadow-amber-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer text-sm sm:text-base"
              >
                <Droplets className="w-4 h-4 text-emerald-900" />
                <span>Giải bài toán mẫu: Tiết kiệm nước tưới</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onExploreWorlds}
                className="flex items-center gap-2 bg-emerald-800/80 hover:bg-emerald-700/80 border border-emerald-500/40 text-white font-medium px-4 py-3 rounded-2xl transition-all cursor-pointer text-sm"
              >
                <Layers className="w-4 h-4 text-emerald-300" />
                <span>Khám phá 4 thế giới học tập</span>
              </button>

              <button
                onClick={onOpenWorkshop}
                className="flex items-center gap-1.5 text-emerald-200 hover:text-white px-3 py-2 text-sm underline decoration-amber-400/60 underline-offset-4 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Xưởng sáng tạo bài toán AI</span>
              </button>
            </div>
          </div>

          {/* Right feature card summary */}
          <div className="lg:col-span-5">
            <div className="bg-emerald-950/70 backdrop-blur border border-emerald-700/60 rounded-3xl p-5 sm:p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-emerald-800/80 pb-3">
                <span className="text-xs uppercase tracking-wider font-bold text-amber-300 flex items-center gap-1.5">
                  <Award className="w-4 h-4" />
                  Đặc sắc sư phạm Lâm Đồng
                </span>
                <span className="text-[11px] bg-emerald-800 px-2 py-0.5 rounded-full text-emerald-200">
                  THCS Lớp 6 - 9
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-emerald-900/60 p-3 rounded-xl border border-emerald-700/30">
                  <div className="text-amber-300 font-extrabold text-xl">4 Thế giới</div>
                  <div className="text-xs text-emerald-200 font-medium">Vườn rau, Chợ quê, Nhà kính, Nguồn nước</div>
                </div>
                <div className="bg-emerald-900/60 p-3 rounded-xl border border-emerald-700/30">
                  <div className="text-amber-300 font-extrabold text-xl">47 Mã HS</div>
                  <div className="text-xs text-emerald-200 font-medium">Lớp thực nghiệm ẩn danh, bảo mật an toàn</div>
                </div>
                <div className="bg-emerald-900/60 p-3 rounded-xl border border-emerald-700/30">
                  <div className="text-amber-300 font-extrabold text-xl">Socratic AI</div>
                  <div className="text-xs text-emerald-200 font-medium">Hỏi ngược gợi mở, không cho ngay đáp án</div>
                </div>
                <div className="bg-emerald-900/60 p-3 rounded-xl border border-emerald-700/30">
                  <div className="text-amber-300 font-extrabold text-xl">100% Xác thực</div>
                  <div className="text-xs text-emerald-200 font-medium">Kiểm định số học & giáo viên duyệt bài</div>
                </div>
              </div>

              <div className="pt-2 text-xs text-emerald-300/90 flex items-start gap-2 bg-emerald-900/30 p-2.5 rounded-lg border border-emerald-800/50">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  Bảo vệ an toàn dữ liệu trẻ em theo Luật Trẻ em 2016: Không thu thập họ tên đầy đủ, CCCD hay vị trí cá nhân.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
