import React from 'react';
import { 
  Sprout, 
  ShoppingBag, 
  Warehouse, 
  Droplets, 
  ArrowRight, 
  Sparkles, 
  MapPin, 
  BookOpen, 
  CheckCircle,
  FileCheck2
} from 'lucide-react';
import { World, MathProblem, WorldId } from '../types';

interface WorldExplorerProps {
  worlds: World[];
  problems: MathProblem[];
  onSelectProblem: (problemId: string) => void;
  onExploreWorld: (worldId: WorldId) => void;
}

export const WorldExplorer: React.FC<WorldExplorerProps> = ({
  worlds,
  problems,
  onSelectProblem,
  onExploreWorld,
}) => {
  const [selectedWorldFilter, setSelectedWorldFilter] = React.useState<WorldId | 'all'>('all');

  const getWorldIcon = (iconName: string) => {
    switch (iconName) {
      case 'Sprout':
        return <Sprout className="w-6 h-6 text-emerald-600" />;
      case 'ShoppingBag':
        return <ShoppingBag className="w-6 h-6 text-amber-600" />;
      case 'Warehouse':
        return <Warehouse className="w-6 h-6 text-teal-600" />;
      case 'Droplets':
        return <Droplets className="w-6 h-6 text-cyan-600" />;
      default:
        return <Sprout className="w-6 h-6 text-emerald-600" />;
    }
  };

  const filteredProblems = selectedWorldFilter === 'all'
    ? problems
    : problems.filter((p) => p.worldId === selectedWorldFilter);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Title section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-stone-200 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100/80 px-2.5 py-1 rounded-md mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            Chức năng 1: Khám phá Toán Quê Em
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
            Bốn thế giới học Toán gắn liền quê hương Lâm Đồng
          </h2>
          <p className="text-stone-600 text-sm sm:text-base mt-1 max-w-3xl">
            Mỗi thế giới mở ra một không gian đời sống địa phương quen thuộc: từ luống rau công nghệ cao An Hiệp, 
            nhà kính hoa dâu tây, chợ đầu mối nông sản đến bảo tồn dòng nước ngọt cao nguyên.
          </p>
        </div>

        {/* Filter tags */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          <button
            onClick={() => setSelectedWorldFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              selectedWorldFilter === 'all'
                ? 'bg-emerald-900 text-white shadow-xs'
                : 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-200'
            }`}
          >
            Tất cả ({problems.length})
          </button>
          {worlds.map((w) => (
            <button
              key={w.id}
              onClick={() => setSelectedWorldFilter(w.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                selectedWorldFilter === w.id
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-200'
              }`}
            >
              {w.title}
            </button>
          ))}
        </div>
      </div>

      {/* 4 World Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {worlds.map((world, idx) => {
          const worldProblems = problems.filter((p) => p.worldId === world.id);
          return (
            <div
              key={world.id}
              onClick={() => onExploreWorld(world.id)}
              className="group bg-white rounded-3xl border border-stone-200/90 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between cursor-pointer hover:-translate-y-1"
            >
              <div>
                {/* World Card Header with dynamic gradient */}
                <div className={`p-5 bg-gradient-to-br ${world.themeColor} text-white relative overflow-hidden`}>
                  <div className="absolute top-2 right-2 opacity-15 text-white scale-150 pointer-events-none">
                    {getWorldIcon(world.iconName)}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold bg-white/20 px-2 py-0.5 rounded-full text-white backdrop-blur">
                      Thế giới 0{idx + 1}
                    </span>
                    <span className="text-xs bg-amber-400 text-stone-950 font-bold px-2 py-0.5 rounded-full">
                      {worldProblems.length} bài toán
                    </span>
                  </div>

                  <h3 className="text-xl font-bold mt-3 group-hover:text-amber-200 transition-colors">
                    {world.title}
                  </h3>
                  <p className="text-xs text-emerald-100/80 mt-1 line-clamp-1">
                    {world.subtitle}
                  </p>
                </div>

                {/* World Card Body */}
                <div className="p-5 space-y-3.5">
                  <p className="text-xs text-stone-600 leading-relaxed">
                    {world.description}
                  </p>

                  <div className="bg-amber-50/70 border border-amber-200/70 p-2.5 rounded-xl text-xs space-y-1">
                    <div className="font-semibold text-amber-900 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-amber-700" />
                      <span>Địa bàn thực tế:</span>
                    </div>
                    <p className="text-stone-700 text-[11px] leading-snug">
                      {world.localHighlight}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action link */}
              <div className="p-5 pt-0">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    const firstProblem = worldProblems[0];
                    if (firstProblem) onSelectProblem(firstProblem.id);
                  }}
                  className="w-full flex items-center justify-center gap-2 bg-stone-100 hover:bg-emerald-800 hover:text-white text-stone-800 text-xs font-bold py-2.5 rounded-xl transition-all cursor-pointer group-hover:bg-emerald-800 group-hover:text-white"
                >
                  <span>Mở bài toán thế giới này</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Problem list for the selected filter */}
      <div className="space-y-4 pt-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-stone-900 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-emerald-700" />
            <span>Danh mục bài toán thực tiễn</span>
            <span className="text-xs font-normal text-stone-700">
              (Dữ liệu có gắn nhãn Mô phỏng / Thực tế theo quy định sư phạm)
            </span>
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredProblems.map((prob) => {
            const world = worlds.find((w) => w.id === prob.worldId);
            return (
              <div
                key={prob.id}
                onClick={() => onSelectProblem(prob.id)}
                className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between hover:border-emerald-500"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-900">
                      {prob.grade} • {prob.difficulty}
                    </span>
                    <span
                      className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                        prob.isSimulated
                          ? 'bg-amber-100 text-amber-900 border border-amber-300'
                          : 'bg-green-100 text-green-900 border border-green-300'
                      }`}
                    >
                      {prob.isSimulated ? 'Dữ liệu Mô phỏng' : 'Dữ liệu Thực tế'}
                    </span>
                  </div>

                  <h4 className="font-bold text-base text-stone-900 hover:text-emerald-800 transition-colors">
                    {prob.title}
                  </h4>

                  <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                    {prob.story}
                  </p>

                  <div className="text-[11px] text-stone-700 space-y-1 bg-stone-50 p-2.5 rounded-xl border border-stone-100">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-stone-700">Chủ đề:</span>
                      <span className="font-semibold text-stone-800 truncate max-w-[200px]">{prob.topic}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-stone-700">Nguồn:</span>
                      <span className="text-stone-700 italic truncate max-w-[200px]">{prob.dataSource}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-stone-100 mt-4 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs text-emerald-800 font-semibold">
                    <FileCheck2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{prob.subQuestions.length} câu tương tác</span>
                  </div>
                  <span className="text-xs font-bold text-amber-700 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    Làm bài <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
