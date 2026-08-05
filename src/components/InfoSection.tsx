import React, { useState, useEffect } from 'react';
import { Newspaper, Loader2, Calendar, Image as ImageIcon } from 'lucide-react';
import { InfoPost } from '../types';
import { fetchInfoPosts } from '../utils/googleSheets';

export const InfoSection: React.FC = () => {
  const [posts, setPosts] = useState<InfoPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const data = await fetchInfoPosts();
      
      // Mock data nếu rỗng
      if (data.length === 0 && !import.meta.env.VITE_GOOGLE_SCRIPT_URL) {
        setPosts([
          {
            id: '1',
            title: 'Chào mừng năm học mới 2026-2027!',
            content: 'Chúc các em học sinh một năm học mới thật nhiều năng lượng, niềm vui và đạt được những thành tích xuất sắc. Thầy sẽ luôn đồng hành cùng các em trong chặng đường chinh phục tri thức sắp tới.',
            imageUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=1200',
            date: '05/09/2026'
          },
          {
            id: '2',
            title: 'Lịch học tăng cường chuẩn bị Thi Học kì 1',
            content: 'Thông báo đến toàn thể học sinh Khối 12: Lịch học tăng cường môn Toán sẽ bắt đầu từ tuần sau (thứ 3 và thứ 5). Các em nhớ xem kỹ nội dung đã dặn dò trên lớp và làm bài tập đầy đủ trước khi đến học nhé.',
            date: '10/11/2026'
          }
        ]);
      } else {
        setPosts(data);
      }
      setLoading(false);
    };

    loadData();
  }, []);

  return (
    <section className="animate-in fade-in duration-500 max-w-4xl mx-auto space-y-8">
      {/* Content */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-white/50 dark:border-slate-800/50 shadow-xl">
          <Loader2 className="w-10 h-10 text-blue-500 animate-spin mb-4" />
          <p className="text-slate-500 font-medium">Đang tải thông tin...</p>
        </div>
      ) : posts.length > 0 ? (
        <div className="space-y-8">
          {posts.map((post) => (
            <article key={post.id} className="group bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] border border-white/50 dark:border-slate-700/50 flex flex-col">
              
              {/* Image Header if exists */}
              {post.imageUrl && (
                <div className="relative w-full h-64 sm:h-80 md:h-96 bg-slate-100 dark:bg-slate-800 border-b border-slate-100 dark:border-slate-800">
                  <img 
                    src={post.imageUrl} 
                    alt={post.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                </div>
              )}

              {/* Text Content */}
              <div className="p-6 md:p-8">
                <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 font-medium mb-3">
                  <Calendar className="w-4 h-4" />
                  <span>{post.date || 'Gần đây'}</span>
                </div>
                
                <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 mb-4 leading-tight group-hover:from-blue-500 group-hover:to-purple-500 transition-all duration-300">
                  {post.title}
                </h3>
                
                <div className="prose prose-slate dark:prose-invert max-w-none">
                  {/* Handle newline chars from Google Sheets */}
                  {post.content.split('\n').map((paragraph, idx) => (
                    <p key={idx} className="mb-4 text-slate-700 dark:text-slate-300 leading-relaxed text-lg">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-white/50 dark:border-slate-800/50 shadow-xl border-dashed">
          <ImageIcon className="w-12 h-12 text-slate-300 dark:text-slate-700 mb-4 animate-pulse-glow" />
          <p className="text-slate-500 font-medium">Chưa có bài đăng nào.</p>
        </div>
      )}
    </section>
  );
};
