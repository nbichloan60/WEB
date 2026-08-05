import React, { useState, useEffect } from 'react';
import { Video, Search, Loader2, PlayCircle, ExternalLink, Clock } from 'lucide-react';
import { VideoLecture } from '../types';
import { fetchVideos } from '../utils/googleSheets';

export const VideoSection: React.FC = () => {
  const [videos, setVideos] = useState<VideoLecture[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSubTab, setActiveSubTab] = useState<'Lớp 10' | 'Lớp 11' | 'Lớp 12' | 'Học sinh giỏi'>('Lớp 10');

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const data = await fetchVideos();
      setVideos(data);
      setLoading(false);
    };
    loadData();
  }, []);

  const filteredVideos = videos.filter((v) =>
    v.title.includes(activeSubTab) || v.chapter.includes(activeSubTab) || v.description.includes(activeSubTab)
  );

  // Helper function to extract YouTube ID
  const getYouTubeId = (url: string) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex justify-start items-center mb-6">
        {/* Sub-tabs Filter */}
        <div className="flex items-center gap-2 overflow-x-auto p-2 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 hide-scrollbar w-full md:w-auto">
          {['Lớp 10', 'Lớp 11', 'Lớp 12', 'Học sinh giỏi'].map(tab => {
            const isActive = activeSubTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveSubTab(tab as any)}
                className={`px-5 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-colors ${
                  isActive
                    ? 'bg-red-600 text-white shadow-md'
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
          <Loader2 className="w-10 h-10 text-red-500 animate-spin mb-4" />
          <p className="text-slate-500 font-medium">Đang tải danh sách video từ Google Sheets...</p>
        </div>
      ) : filteredVideos.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVideos.map((video) => {
            const ytId = getYouTubeId(video.videoUrl);
            const isYouTube = !!ytId;
            const thumbnailUrl = isYouTube 
              ? `https://img.youtube.com/vi/${ytId}/maxresdefault.jpg`
              : 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&q=80&w=600'; // Fallback if Drive link

            return (
              <div key={video.id} className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-sm border border-slate-200 dark:border-slate-800 group hover:shadow-md transition-all flex flex-col">
                
                {/* Video Thumbnail */}
                <div className="relative h-48 bg-slate-100 dark:bg-slate-800 overflow-hidden flex-shrink-0">
                  <img 
                    src={thumbnailUrl} 
                    alt={video.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`;
                    }}
                  />
                  
                  {/* Overlay Play Button */}
                  <a 
                    href={video.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute inset-0 bg-slate-900/40 flex items-center justify-center group-hover:bg-slate-900/20 transition-colors"
                  >
                    <div className="w-14 h-14 rounded-full bg-red-600/90 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <PlayCircle className="w-8 h-8 ml-1" />
                    </div>
                  </a>

                  {/* Duration Badge */}
                  {video.duration && (
                    <div className="absolute bottom-3 right-3 px-2 py-1 bg-black/80 text-white text-xs font-semibold rounded flex items-center gap-1 backdrop-blur-sm">
                      <Clock className="w-3 h-3" />
                      {video.duration}
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="p-5 flex-1 flex flex-col">
                  <div className="inline-block px-2.5 py-1 bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-400 text-[10px] font-bold rounded-lg uppercase tracking-wider mb-3 w-fit">
                    {video.chapter}
                  </div>
                  <h3 className="font-bold text-slate-800 dark:text-white text-lg mb-2 line-clamp-2">
                    {video.title}
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm line-clamp-2 flex-1">
                    {video.description}
                  </p>
                  
                  <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                    <a 
                      href={video.videoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-red-600 dark:text-red-400 font-semibold text-sm flex items-center gap-1.5 hover:underline"
                    >
                      {isYouTube ? 'Xem trên YouTube' : 'Mở liên kết'}
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 border-dashed">
          <Video className="w-12 h-12 text-slate-300 dark:text-slate-700 mb-4" />
          <p className="text-slate-500 font-medium">Chưa có video bài giảng nào.</p>
        </div>
      )}

    </div>
  );
};
