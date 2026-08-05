import React, { useState, useEffect } from 'react';
import { BoardPost } from '../types';
import { MessageSquare, Plus, Heart, X, Loader2, Send } from 'lucide-react';
import { fetchBoardPosts, addBoardPost } from '../utils/googleSheets';

export const InteractionBoard: React.FC = () => {
  const [posts, setPosts] = useState<BoardPost[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form state
  const [newAuthor, setNewAuthor] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newColor, setNewColor] = useState<BoardPost['color']>('yellow');

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      const data = await fetchBoardPosts();
      
      if (data.length === 0 && !import.meta.env.VITE_GOOGLE_SCRIPT_URL) {
        // Mock initial data if no Google Sheet URL is configured
        setPosts([
          { id: 'bp-1', author: 'Thầy Phúc', content: 'Chào mừng các em đến với không gian trao đổi học tập môn Toán! Các em có câu hỏi nào bài giảng trên lớp có thể để lại ở đây nhé.', color: 'blue', timestamp: new Date().toISOString(), likes: 5 },
          { id: 'bp-2', author: 'Học sinh A', content: 'Thầy ơi cho em hỏi phần Khảo sát hàm số bậc 3, điều kiện để hàm số có 2 điểm cực trị là gì ạ?', color: 'yellow', timestamp: new Date(Date.now() - 3600000).toISOString(), likes: 2, reply: 'Để hàm số bậc 3 có 2 điểm cực trị thì phương trình đạo hàm y\' = 0 phải có 2 nghiệm phân biệt (Delta > 0) nhé em.' },
          { id: 'bp-3', author: 'Học sinh B', content: 'Cảm ơn thầy vì bài giảng Giải tích hôm nay rất dễ hiểu!', color: 'pink', timestamp: new Date(Date.now() - 7200000).toISOString(), likes: 10 },
        ]);
      } else {
        setPosts(data);
      }
      setIsLoading(false);
    };

    loadData();
  }, []);

  const handleAddPost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAuthor.trim() || !newContent.trim()) return;

    setIsSubmitting(true);

    const post: BoardPost = {
      id: `bp-${Date.now()}`,
      author: newAuthor.trim(),
      content: newContent.trim(),
      color: newColor,
      timestamp: new Date().toISOString(),
      likes: 0
    };

    if (import.meta.env.VITE_GOOGLE_SCRIPT_URL) {
      const success = await addBoardPost(post);
      if (success) {
        setPosts([post, ...posts]);
      } else {
        alert('Lỗi khi gửi bài đăng. Vui lòng thử lại sau.');
      }
    } else {
      // Offline mode
      setPosts([post, ...posts]);
    }

    setNewAuthor('');
    setNewContent('');
    setNewColor('yellow');
    setIsAdding(false);
    setIsSubmitting(false);
  };

  const handleLike = (id: string) => {
    // Note: Likes are only saved locally for now as it requires complex Google Sheet updates
    const updated = posts.map(p => 
      p.id === id ? { ...p, likes: p.likes + 1 } : p
    );
    setPosts(updated);
  };

  const getColorClass = (color: string) => {
    switch (color) {
      case 'yellow': return 'bg-yellow-200 dark:bg-yellow-900/40 text-yellow-900 dark:text-yellow-100 border-yellow-300 dark:border-yellow-700/50';
      case 'pink': return 'bg-pink-200 dark:bg-pink-900/40 text-pink-900 dark:text-pink-100 border-pink-300 dark:border-pink-700/50';
      case 'blue': return 'bg-blue-200 dark:bg-blue-900/40 text-blue-900 dark:text-blue-100 border-blue-300 dark:border-blue-700/50';
      case 'green': return 'bg-green-200 dark:bg-green-900/40 text-green-900 dark:text-green-100 border-green-300 dark:border-green-700/50';
      default: return 'bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-slate-100 border-slate-300 dark:border-slate-700';
    }
  };

  return (
    <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-3">
            <MessageSquare className="w-7 h-7 text-blue-500" />
            Góc Trao Đổi
          </h2>
          <p className="mt-2 text-slate-600 dark:text-slate-400">
            Để lại câu hỏi hoặc lời nhắn của em lên bảng tin học tập chung.
          </p>
        </div>
        
        <button 
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-lg shadow-blue-500/30 transition-all hover:-translate-y-0.5"
        >
          <Plus className="w-5 h-5" />
          <span className="hidden sm:inline">Thêm ghi chú</span>
        </button>
      </div>

      {isAdding && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-md shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <h3 className="font-bold text-lg">Tạo ghi chú mới</h3>
              <button onClick={() => setIsAdding(false)} className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddPost} className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">Tên của em</label>
                  <input 
                    type="text" 
                    required
                    value={newAuthor}
                    onChange={(e) => setNewAuthor(e.target.value)}
                    className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="VD: Học sinh Nguyễn Văn A"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">Nội dung</label>
                  <textarea 
                    required
                    rows={4}
                    value={newContent}
                    onChange={(e) => setNewContent(e.target.value)}
                    className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                    placeholder="Nhập nội dung câu hỏi hoặc lời nhắn..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">Chọn màu giấy</label>
                  <div className="flex gap-3">
                    {(['yellow', 'pink', 'blue', 'green'] as const).map(color => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setNewColor(color)}
                        className={`w-8 h-8 rounded-full border-2 transition-transform ${getColorClass(color)} ${newColor === color ? 'scale-125 border-slate-900 dark:border-white shadow-md' : 'border-transparent hover:scale-110'}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <div className="mt-8 flex justify-end gap-3">
                <button 
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="px-4 py-2 text-slate-600 dark:text-slate-400 font-medium hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition"
                >
                  Hủy
                </button>
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/30 transition flex items-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  Đăng lên bảng
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 text-blue-500">
          <Loader2 className="w-10 h-10 animate-spin mb-4" />
          <p className="text-slate-500 font-medium animate-pulse">Đang tải góc trao đổi...</p>
        </div>
      ) : (
        <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
          {posts.map((post) => (
            <div 
              key={post.id} 
              className={`break-inside-avoid p-5 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 border ${getColorClass(post.color)} animate-in zoom-in-95`}
            >
              <div className="flex justify-between items-start mb-3">
                <span className="font-bold text-sm tracking-tight">{post.author}</span>
                <span className="text-[10px] font-medium opacity-60">
                  {new Date(post.timestamp).toLocaleDateString('vi-VN', { month: 'short', day: 'numeric' })}
                </span>
              </div>
              
              <p className="text-[15px] leading-relaxed mb-4 whitespace-pre-wrap font-medium">
                {post.content}
              </p>

              {post.reply && (
                <div className="mb-4 p-3 bg-white/40 dark:bg-black/20 rounded-xl text-sm border border-white/20 dark:border-black/10">
                  <div className="flex items-center gap-1.5 font-bold mb-1.5 opacity-90">
                    <MessageSquare className="w-3.5 h-3.5" />
                    Giáo viên phản hồi:
                  </div>
                  <p className="whitespace-pre-wrap opacity-90 leading-relaxed font-medium">
                    {post.reply}
                  </p>
                </div>
              )}

              <div className="flex justify-end pt-3 border-t border-black/5 dark:border-white/10">
                <button 
                  onClick={() => handleLike(post.id)}
                  className="flex items-center gap-1.5 text-xs font-bold hover:scale-105 transition active:scale-95 bg-white/20 dark:bg-black/20 px-2 py-1 rounded-full"
                >
                  <Heart className={`w-3.5 h-3.5 ${post.likes > 0 ? 'fill-red-500 text-red-500' : 'text-current opacity-70'}`} />
                  <span className={post.likes > 0 ? 'text-red-600 dark:text-red-400' : 'opacity-70'}>{post.likes}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {posts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-slate-500 dark:text-slate-400">Chưa có bài đăng nào. Hãy là người đầu tiên!</p>
        </div>
      )}
    </section>
  );
};
