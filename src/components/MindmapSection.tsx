import React, { useState, useEffect } from 'react';
import { Network, Search, Loader2, Download, Maximize2, X } from 'lucide-react';
import { Mindmap } from '../types';
import { fetchMindmaps } from '../utils/googleSheets';

export const MindmapSection: React.FC = () => {
  const [mindmaps, setMindmaps] = useState<Mindmap[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [activeSubTab, setActiveSubTab] = useState<'Lớp 10' | 'Lớp 11' | 'Lớp 12'>('Lớp 10');

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const data = await fetchMindmaps();
      setMindmaps(data);
      setLoading(false);
    };
    loadData();
  }, []);

  const filteredMindmaps = mindmaps.filter((m) =>
    m.title.includes(activeSubTab) || m.chapter.includes(activeSubTab) || m.description.includes(activeSubTab)
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex justify-start items-center mb-6">
        {/* Sub-tabs Filter */}
        <div className="flex items-center gap-2 overflow-x-auto p-2 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 hide-scrollbar w-full md:w-auto">
          {['Lớp 10', 'Lớp 11', 'Lớp 12'].map(tab => {
            const isActive = activeSubTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveSubTab(tab as any)}
                className={`px-5 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-colors ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-transparent text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {tab}
              </button>
            )
          })}
        </div>
      </div>

      {/* Grid Content */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="w-10 h-10 text-blue-500 animate-spin mb-4" />
          <p className="text-slate-500 font-medium">Đang tải dữ liệu sơ đồ từ Google Sheets...</p>
        </div>
      ) : filteredMindmaps.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMindmaps.map((mindmap) => (
            <div key={mindmap.id} className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-sm border border-slate-200 dark:border-slate-800 group hover:shadow-md transition-shadow">
              
              {/* Image Thumbnail */}
              <div className="relative h-48 bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <img 
                  src={mindmap.imageUrl || 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&q=80&w=600'} 
                  alt={mindmap.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&q=80&w=600';
                  }}
                />
                
                {/* Overlay Actions */}
                <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                  <button 
                    onClick={() => setSelectedImage(mindmap.imageUrl)}
                    className="p-2 bg-white/20 hover:bg-blue-600 rounded-full text-white backdrop-blur-sm transition-colors"
                    title="Phóng to"
                  >
                    <Maximize2 className="w-5 h-5" />
                  </button>
                  <a 
                    href={mindmap.imageUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="p-2 bg-white/20 hover:bg-blue-600 rounded-full text-white backdrop-blur-sm transition-colors"
                    title="Tải xuống"
                  >
                    <Download className="w-5 h-5" />
                  </a>
                </div>
              </div>

              {/* Info */}
              <div className="p-5">
                <div className="inline-block px-2.5 py-1 bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-400 text-[10px] font-bold rounded-lg uppercase tracking-wider mb-3">
                  {mindmap.chapter}
                </div>
                <h3 className="font-bold text-slate-800 dark:text-white text-lg mb-2 line-clamp-1">
                  {mindmap.title}
                </h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm line-clamp-2">
                  {mindmap.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 border-dashed">
          <Network className="w-12 h-12 text-slate-300 dark:text-slate-700 mb-4" />
          <p className="text-slate-500 font-medium">Chưa có sơ đồ nào phù hợp.</p>
        </div>
      )}

      {/* Fullscreen Image Modal */}
      {selectedImage && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 z-[100]">
          <button 
            onClick={() => setSelectedImage(null)}
            className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          <img 
            src={selectedImage} 
            alt="Sơ đồ tư duy" 
            className="max-w-full max-h-[90vh] object-contain rounded-xl shadow-2xl"
          />
        </div>
      )}

    </div>
  );
};
