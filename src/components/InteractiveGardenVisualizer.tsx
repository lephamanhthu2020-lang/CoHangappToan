import React, { useState } from 'react';
import { Droplets, Gauge, Sparkles, RefreshCw, Eye, Sliders, Check } from 'lucide-react';

interface InteractiveGardenVisualizerProps {
  initialLength?: number;
  initialWidth?: number;
  initialRateA?: number;
  initialRateB?: number;
}

export const InteractiveGardenVisualizer: React.FC<InteractiveGardenVisualizerProps> = ({
  initialLength = 12,
  initialWidth = 8,
  initialRateA = 5,
  initialRateB = 3.5,
}) => {
  const [length, setLength] = useState(initialLength);
  const [width, setWidth] = useState(initialWidth);
  const [rateA, setRateA] = useState(initialRateA);
  const [rateB, setRateB] = useState(initialRateB);
  const [activeMethod, setActiveMethod] = useState<'both' | 'A' | 'B'>('both');
  const [showSandbox, setShowSandbox] = useState(false);

  // Dynamic calculations
  const area = length * width;
  const waterA = area * rateA;
  const waterB = area * rateB;
  const savedDaily = waterA - waterB;
  const savedPercentage = waterA > 0 ? (savedDaily / waterA) * 100 : 0;
  const savedWeek = savedDaily * 7;

  // Reset to original problem values
  const resetToStandard = () => {
    setLength(12);
    setWidth(8);
    setRateA(5);
    setRateB(3.5);
    setActiveMethod('both');
  };

  const isDefaultValues = length === 12 && width === 8 && rateA === 5 && rateB === 3.5;

  return (
    <div className="bg-stone-50 border border-stone-200 rounded-3xl p-5 sm:p-6 shadow-xs space-y-6">
      {/* Header of simulator */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-200/80 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-100 text-emerald-800">
              <Droplets className="w-5 h-5 text-emerald-700" />
            </span>
            <h3 className="font-bold text-lg text-stone-900">
              Mô hình trực quan: Luống rau & Hệ thống tưới An Hiệp
            </h3>
          </div>
          <p className="text-xs text-stone-600 mt-1">
            Mô phỏng hình học không gian và lưu lượng nước tưới thực nghiệm tại Lâm Đồng
          </p>
        </div>

        {/* View toggles */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowSandbox(!showSandbox)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
              showSandbox
                ? 'bg-amber-100 text-amber-900 border-amber-300'
                : 'bg-white text-stone-700 hover:bg-stone-100 border-stone-200'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>{showSandbox ? 'Đóng thử nghiệm' : 'Thử nghiệm số đo'}</span>
          </button>

          {!isDefaultValues && (
            <button
              onClick={resetToStandard}
              className="flex items-center gap-1 text-xs text-stone-700 hover:text-stone-900 bg-white border border-stone-200 px-2.5 py-1.5 rounded-xl cursor-pointer"
              title="Khôi phục số liệu gốc bài toán (12m x 8m)"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Gốc (12×8m)</span>
            </button>
          )}
        </div>
      </div>

      {/* Sandbox sliders when student wants to experiment */}
      {showSandbox && (
        <div className="bg-amber-50/60 border border-amber-200 p-4 rounded-2xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div>
            <div className="flex justify-between font-semibold text-stone-700 mb-1">
              <span>Chiều dài (a):</span>
              <span className="font-bold text-amber-900">{length} mét</span>
            </div>
            <input
              type="range"
              min="6"
              max="20"
              step="1"
              value={length}
              onChange={(e) => setLength(Number(e.target.value))}
              className="w-full accent-emerald-700 cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between font-semibold text-stone-700 mb-1">
              <span>Chiều rộng (b):</span>
              <span className="font-bold text-amber-900">{width} mét</span>
            </div>
            <input
              type="range"
              min="4"
              max="15"
              step="1"
              value={width}
              onChange={(e) => setWidth(Number(e.target.value))}
              className="w-full accent-emerald-700 cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between font-semibold text-stone-700 mb-1">
              <span>Định mức A:</span>
              <span className="font-bold text-stone-900">{rateA} lít/m²</span>
            </div>
            <input
              type="range"
              min="4"
              max="8"
              step="0.5"
              value={rateA}
              onChange={(e) => setRateA(Number(e.target.value))}
              className="w-full accent-blue-600 cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between font-semibold text-stone-700 mb-1">
              <span>Định mức B:</span>
              <span className="font-bold text-emerald-900">{rateB} lít/m²</span>
            </div>
            <input
              type="range"
              min="2"
              max="5"
              step="0.5"
              value={rateB}
              onChange={(e) => setRateB(Number(e.target.value))}
              className="w-full accent-emerald-600 cursor-pointer"
            />
          </div>
        </div>
      )}

      {/* Main visual display */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left: 2D Vegetable Garden Grid Graphic */}
        <div className="lg:col-span-7 bg-white p-5 rounded-2xl border border-stone-200/90 shadow-inner space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold text-stone-600 border-b pb-2">
            <span>Sơ đồ mặt bằng luống rau (Tỉ lệ mô phỏng)</span>
            <div className="flex items-center gap-2">
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
              <span className="text-emerald-900 font-bold">Dài {length}m × Rộng {width}m = {area} m²</span>
            </div>
          </div>

          {/* Visual canvas grid */}
          <div className="relative w-full aspect-16/9 bg-gradient-to-br from-amber-900/10 via-stone-200/40 to-emerald-950/10 rounded-xl border-2 border-dashed border-amber-800/40 flex flex-col justify-between p-3 overflow-hidden select-none">
            {/* Dimension Indicators */}
            <div className="absolute top-1 left-1/2 -translate-x-1/2 bg-amber-100 text-amber-950 text-[11px] font-bold px-2 py-0.5 rounded-md border border-amber-300 shadow-xs z-10">
              Chiều dài: {length} mét
            </div>
            <div className="absolute left-1 top-1/2 -translate-y-1/2 -rotate-90 bg-amber-100 text-amber-950 text-[11px] font-bold px-2 py-0.5 rounded-md border border-amber-300 shadow-xs z-10 origin-center">
              Rộng: {width}m
            </div>

            {/* Vegetable rows */}
            <div className="h-full w-full grid grid-cols-6 grid-rows-4 gap-1.5 p-3">
              {Array.from({ length: 24 }).map((_, i) => (
                <div
                  key={i}
                  className={`rounded-lg flex flex-col items-center justify-center transition-all duration-300 ${
                    activeMethod === 'B'
                      ? 'bg-emerald-100/80 border border-emerald-400 text-emerald-800 shadow-xs'
                      : activeMethod === 'A'
                      ? 'bg-blue-100/80 border border-blue-400 text-blue-800'
                      : 'bg-emerald-50 border border-emerald-300 text-emerald-700'
                  }`}
                >
                  <span className="text-sm">🌱</span>
                  <span className="text-[9px] font-mono opacity-60">{(area / 24).toFixed(1)}m²</span>
                </div>
              ))}
            </div>

            {/* Sprinkler / Drip line overlays */}
            <div className="absolute inset-0 pointer-events-none flex items-center justify-around">
              {activeMethod === 'A' && (
                <div className="absolute inset-0 bg-blue-500/10 backdrop-blur-[0.5px] flex items-center justify-center">
                  <span className="bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md animate-pulse">
                    💦 Đang tưới phun mưa: {rateA} lít/m² (Tiêu thụ cao)
                  </span>
                </div>
              )}
              {activeMethod === 'B' && (
                <div className="absolute inset-0 bg-emerald-500/10 backdrop-blur-[0.5px] flex items-center justify-center">
                  <span className="bg-emerald-700 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md animate-pulse">
                    💧 Đang tưới nhỏ giọt rễ: {rateB} lít/m² (Tiết kiệm 30%)
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Mode Switcher */}
          <div className="flex items-center justify-center gap-2 pt-1 text-xs">
            <button
              onClick={() => setActiveMethod('both')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                activeMethod === 'both' ? 'bg-stone-800 text-white' : 'bg-stone-100 text-stone-700'
              }`}
            >
              So sánh cả hai
            </button>
            <button
              onClick={() => setActiveMethod('A')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                activeMethod === 'A' ? 'bg-blue-600 text-white' : 'bg-stone-100 text-blue-800'
              }`}
            >
              Phương án A (5 L/m²)
            </button>
            <button
              onClick={() => setActiveMethod('B')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                activeMethod === 'B' ? 'bg-emerald-700 text-white' : 'bg-stone-100 text-emerald-800'
              }`}
            >
              Phương án B (3,5 L/m²)
            </button>
          </div>
        </div>

        {/* Right: Real-time Mathematical Comparison Cards */}
        <div className="lg:col-span-5 space-y-3">
          {/* Daily Consumption Card */}
          <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-stone-700 border-b pb-2">
              <span className="flex items-center gap-1.5">
                <Gauge className="w-4 h-4 text-emerald-600" />
                Lượng nước mỗi ngày
              </span>
              <span className="text-emerald-700 font-mono">S = {area} m²</span>
            </div>

            {/* PA A bar */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-stone-700">PA A (Tưới phun):</span>
                <span className="font-bold text-blue-700">{waterA.toLocaleString('vi-VN')} lít/ngày</span>
              </div>
              <div className="w-full bg-stone-100 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-blue-500 h-full rounded-full transition-all duration-500"
                  style={{ width: '100%' }}
                />
              </div>
              <div className="text-[10px] text-stone-700 italic">
                Công thức: {area} m² × {rateA} lít/m² = {waterA} lít
              </div>
            </div>

            {/* PA B bar */}
            <div className="space-y-1 pt-1">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-emerald-800">PA B (Tưới nhỏ giọt):</span>
                <span className="font-bold text-emerald-700">{waterB.toLocaleString('vi-VN')} lít/ngày</span>
              </div>
              <div className="w-full bg-stone-100 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-emerald-600 h-full rounded-full transition-all duration-500"
                  style={{ width: `${(waterB / waterA) * 100}%` }}
                />
              </div>
              <div className="text-[10px] text-stone-700 italic">
                Công thức: {area} m² × {rateB} lít/m² = {waterB} lít
              </div>
            </div>
          </div>

          {/* Savings Highlight Box */}
          <div className="bg-gradient-to-br from-emerald-800 to-green-900 text-white p-4 rounded-2xl shadow-md space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-amber-300 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                Hiệu quả tiết kiệm nước sạch
              </span>
              <span className="bg-amber-400 text-stone-950 font-black px-2 py-0.5 rounded-md text-[11px]">
                -{savedPercentage.toFixed(0)}%
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <div className="bg-emerald-950/50 p-2.5 rounded-xl border border-emerald-600/40">
                <div className="text-[11px] text-emerald-200">Tiết kiệm / ngày</div>
                <div className="text-xl font-extrabold text-white">
                  {savedDaily.toLocaleString('vi-VN')} <span className="text-xs font-normal text-emerald-200">lít</span>
                </div>
                <div className="text-[10px] text-emerald-300 mt-0.5">
                  ({waterA} - {waterB})
                </div>
              </div>

              <div className="bg-emerald-950/50 p-2.5 rounded-xl border border-emerald-600/40">
                <div className="text-[11px] text-emerald-200">Sau 1 tuần (7 ngày)</div>
                <div className="text-xl font-extrabold text-amber-300">
                  {savedWeek.toLocaleString('vi-VN')} <span className="text-xs font-normal text-emerald-200">lít</span>
                </div>
                <div className="text-[10px] text-emerald-300 mt-0.5">
                  ({savedDaily} × 7 ngày)
                </div>
              </div>
            </div>

            <p className="text-[11px] text-emerald-100/90 leading-tight pt-1">
              💡 1.008 lít nước tiết kiệm tương đương bảo tồn hơn 1m³ nước ngầm cho vùng đất An Hiệp trong một tuần!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
