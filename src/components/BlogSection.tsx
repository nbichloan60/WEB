import React, { useState } from 'react';
import { INITIAL_BLOG_POSTS } from '../data/initialData';
import { BlogPost } from '../types';
import { 
  FileText, 
  Search, 
  Sparkles, 
  Clock, 
  User, 
  X, 
  Tag, 
  BookOpen, 
  Loader2 
} from 'lucide-react';
import { summarizeBlogArticle } from '../utils/gemini';

export const BlogSection: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [activePost, setActivePost] = useState<BlogPost | null>(null);
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [summarizing, setSummarizing] = useState(false);

  const filteredPosts = INITIAL_BLOG_POSTS.filter((post) => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTag = selectedTag ? post.tags.includes(selectedTag) : true;
    return matchesSearch && matchesTag;
  });

  const allTags = Array.from(new Set(INITIAL_BLOG_POSTS.flatMap(p => p.tags)));

  const handleOpenPost = (post: BlogPost) => {
    setActivePost(post);
    setAiSummary(null);
  };

  const handleSummarize = async () => {
    if (!activePost) return;
    setSummarizing(true);
    setAiSummary(null);

    try {
      const res = await summarizeBlogArticle(activePost.title, activePost.content);
      if (res.error) {
        setAiSummary(`Lỗi: ${res.error}`);
      } else {
        setAiSummary(res.text);
      }
    } catch (err: any) {
      setAiSummary(`Lỗi tóm tắt: ${err?.message || 'Không thể gọi AI'}`);
    } finally {
      setSummarizing(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Top Banner & Search */}
      <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-purple-900 to-indigo-900 text-white shadow-xl space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-extrabold flex items-center gap-2">
              <FileText className="w-6 h-6 text-purple-400" />
              Blog Chia Sẻ Kỹ Thuật (Tech Articles & Insights)
            </h2>
            <p className="text-purple-200 text-xs sm:text-sm mt-1">
              Bài viết chuyên sâu về Frontend, Node.js, Kiến trúc AI và Lộ trình phát triển sự nghiệp.
            </p>
          </div>

          {/* Search Bar */}
          <div className="relative max-w-xs w-full">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm bài viết..."
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-slate-800/80 border border-purple-400/30 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-purple-800/60 text-xs">
          <span className="text-purple-300 font-semibold flex items-center gap-1">
            <Tag className="w-3.5 h-3.5" /> Chủ đề:
          </span>
          <button
            onClick={() => setSelectedTag(null)}
            className={`px-3 py-1 rounded-lg transition ${
              selectedTag === null ? 'bg-purple-500 text-white font-bold' : 'bg-purple-950/60 text-purple-200 hover:bg-purple-800/60'
            }`}
          >
            Tất cả
          </button>
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`px-3 py-1 rounded-lg transition ${
                selectedTag === tag ? 'bg-purple-500 text-white font-bold' : 'bg-purple-950/60 text-purple-200 hover:bg-purple-800/60'
              }`}
            >
              #{tag}
            </button>
          ))}
        </div>
      </div>

      {/* Blog Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filteredPosts.map((post) => (
          <div
            key={post.id}
            className="group bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-lg hover:shadow-2xl transition duration-300 flex flex-col justify-between"
          >
            <div>
              <div className="relative h-44 overflow-hidden bg-slate-100 dark:bg-slate-800">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-purple-950/80 backdrop-blur-md text-purple-200 text-[10px] font-bold uppercase tracking-wider border border-purple-400/20">
                  {post.category}
                </div>
              </div>

              <div className="p-5 space-y-3">
                <div className="flex items-center gap-3 text-[11px] text-slate-500 dark:text-slate-400">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-purple-500" />
                    {post.readTime}
                  </span>
                  <span>•</span>
                  <span>{post.date}</span>
                </div>

                <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition leading-snug">
                  {post.title}
                </h3>

                <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-3 leading-relaxed">
                  {post.excerpt}
                </p>
              </div>
            </div>

            <div className="p-5 pt-0">
              <button
                onClick={() => handleOpenPost(post)}
                className="w-full py-2.5 rounded-xl border border-purple-200 dark:border-purple-900/60 bg-purple-50 dark:bg-purple-950/30 text-purple-700 dark:text-purple-300 text-xs font-bold hover:bg-purple-100 dark:hover:bg-purple-900/50 transition flex items-center justify-center gap-2"
              >
                <BookOpen className="w-4 h-4" />
                Đọc Bài Viết Hoàn Chỉnh
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Article Reader Modal */}
      {activePost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-3xl w-full shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            
            {/* Reader Header */}
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 flex items-start justify-between gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
                  {activePost.category}
                </span>
                <h3 className="text-xl font-black text-slate-900 dark:text-white mt-1">{activePost.title}</h3>
                <div className="flex items-center gap-3 text-xs text-slate-500 mt-2">
                  <span className="flex items-center gap-1"><User className="w-3.5 h-3.5" /> {activePost.author}</span>
                  <span>•</span>
                  <span>{activePost.date}</span>
                  <span>•</span>
                  <span>{activePost.readTime}</span>
                </div>
              </div>

              <button
                onClick={() => setActivePost(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 transition shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Reader Body */}
            <div className="p-6 sm:p-8 space-y-6 overflow-y-auto">
              
              {/* AI Summarizer Banner */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-950/40 dark:to-indigo-950/40 border border-purple-200 dark:border-purple-800/60 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-purple-900 dark:text-purple-200 font-bold text-xs">
                    <Sparkles className="w-4 h-4 text-purple-500 animate-pulse" />
                    Tóm tắt bài viết bằng Gemini AI
                  </div>
                  <button
                    onClick={handleSummarize}
                    disabled={summarizing}
                    className="px-3 py-1.5 rounded-lg bg-purple-600 text-white text-xs font-bold hover:bg-purple-700 transition disabled:opacity-50 flex items-center gap-1.5"
                  >
                    {summarizing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                    {summarizing ? 'Đang tóm tắt...' : 'Tóm Tắt Ngay'}
                  </button>
                </div>

                {aiSummary && (
                  <div className="p-3 bg-white dark:bg-slate-900 rounded-lg border border-purple-200 dark:border-purple-800 text-xs text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line animate-in fade-in">
                    {aiSummary}
                  </div>
                )}
              </div>

              {/* Main Content */}
              <div className="prose dark:prose-invert text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                {activePost.content}
              </div>

            </div>

            {/* Footer */}
            <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex justify-end">
              <button
                onClick={() => setActivePost(null)}
                className="px-5 py-2 rounded-xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-xs font-bold hover:bg-blue-600 transition"
              >
                Đóng Bài Viết
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
