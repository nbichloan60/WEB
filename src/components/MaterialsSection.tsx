import React, { useState, useEffect } from 'react';
import { Material } from '../types';
import { FileText, Download, FileArchive, FileVideo, Link as LinkIcon, Loader2, DatabaseBackup, Eye, X } from 'lucide-react';
import { fetchMaterials } from '../utils/googleSheets';

export const MaterialsSection: React.FC = () => {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [activeSubTab, setActiveSubTab] = useState<'Lớp 10' | 'Lớp 11' | 'Lớp 12' | 'Học sinh giỏi'>('Lớp 10');

  const handlePreview = (e: React.MouseEvent, url: string) => {
    e.preventDefault();
    if (url === '#') {
      alert('Tài liệu mẫu! Thầy cần gắn link Google Drive vào Sheet.');
      return;
    }
    // Chuyển đổi link Drive sang dạng preview để nhúng iframe
    let embedUrl = url;
    if (url.includes('drive.google.com/file/d/')) {
      embedUrl = url.replace(/\/view.*$/, '/preview');
    }
    setPreviewUrl(embedUrl);
  };

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      const data = await fetchMaterials();
      
      // Nếu dữ liệu trống, dùng Mock Data tạm thời để demo (nếu chưa cấu hình URL)
      if (data.length === 0 && !import.meta.env.VITE_GOOGLE_SCRIPT_URL) {
        setMaterials([
          {
            id: 'mat-1',
            title: 'Đề thi thử THPT Quốc gia môn Toán năm 2026',
            description: 'Đề thi bám sát cấu trúc đề minh họa của Bộ GD&ĐT, kèm đáp án chi tiết.',
            category: 'Lớp 12',
            format: 'PDF',
            size: '2.4 MB',
            url: '#',
            dateAdded: '01/08/2026'
          },
          {
            id: 'mat-2',
            title: '50 Bài tập trắc nghiệm Khảo sát hàm số',
            description: 'Tuyển tập các dạng bài tập hàm số thường gặp trong kỳ thi Đại học.',
            category: 'Lớp 12',
            format: 'DOCX',
            size: '1.1 MB',
            url: '#',
            dateAdded: '02/08/2026'
          }
        ]);
      } else {
        setMaterials(data);
      }
      setIsLoading(false);
    };

    loadData();
  }, []);

  const getIcon = (format: string) => {
    switch (format) {
      case 'PDF': return <FileText className="w-8 h-8 text-red-500" />;
      case 'DOCX': return <FileText className="w-8 h-8 text-blue-500" />;
      case 'ZIP': return <FileArchive className="w-8 h-8 text-amber-500" />;
      case 'VIDEO': return <FileVideo className="w-8 h-8 text-purple-500" />;
      default: return <LinkIcon className="w-8 h-8 text-slate-500" />;
    }
  };

  const filteredMaterials = materials.filter(m => {
    return m.category.includes(activeSubTab) || m.title.includes(activeSubTab) || m.description.includes(activeSubTab);
  });

  return (
    <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8 flex flex-col xl:flex-row xl:items-center justify-start gap-6">
        {/* Sub-tabs Filter */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 hide-scrollbar">
          {['Lớp 10', 'Lớp 11', 'Lớp 12', 'Học sinh giỏi'].map(tab => {
            const isActive = activeSubTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveSubTab(tab as any)}
                className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-colors ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {tab}
              </button>
            )
          })}
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 text-blue-500">
          <Loader2 className="w-10 h-10 animate-spin mb-4" />
          <p className="text-slate-500 font-medium animate-pulse">Đang kết nối Google Sheets...</p>
        </div>
      ) : filteredMaterials.length === 0 ? (
        <div className="text-center py-20 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700">
          <DatabaseBackup className="w-12 h-12 text-slate-400 mx-auto mb-3" />
          <p className="text-slate-500 dark:text-slate-400 font-medium">Chưa có tài liệu nào trong thư mục này.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMaterials.map((material) => (
            <div key={material.id} className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow group flex flex-col h-full">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                  {getIcon(material.format)}
                </div>
                <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                  {material.category}
                </span>
              </div>
              
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 line-clamp-2">
                {material.title}
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 flex-grow line-clamp-3">
                {material.description}
              </p>
              
              <div className="pt-4 mt-auto border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div className="text-xs font-medium text-slate-500 dark:text-slate-400 flex items-center gap-3">
                  <span>{material.format}</span>
                  {material.size && (
                    <>
                      <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700"></span>
                      <span>{material.size}</span>
                    </>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={(e) => handlePreview(e, material.url)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-semibold rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                    title="Đọc trước tài liệu"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Xem trước</span>
                  </button>
                  <a 
                    href={material.url}
                    target={material.url !== '#' ? '_blank' : '_self'}
                    rel="noreferrer"
                    onClick={(e) => { if (material.url === '#') { e.preventDefault(); alert('Tài liệu mẫu! Thầy cần gắn link Google Drive vào Sheet.'); } }}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-semibold rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Tải về
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {/* Preview Modal */}
      {previewUrl && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-5xl h-[85vh] rounded-2xl flex flex-col overflow-hidden shadow-2xl animate-in zoom-in duration-300">
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-900/50">
              <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
                <Eye className="w-5 h-5 text-blue-500" />
                Chế độ đọc trước tài liệu
              </h3>
              <button 
                onClick={() => setPreviewUrl(null)}
                className="p-2 bg-slate-200 dark:bg-slate-800 hover:bg-red-100 dark:hover:bg-red-900/50 hover:text-red-600 rounded-full text-slate-500 transition-colors"
                title="Đóng"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 bg-slate-100 dark:bg-slate-950 p-2 md:p-4 relative">
              <iframe 
                src={previewUrl} 
                className="w-full h-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white"
                allow="autoplay"
                title="Preview Document"
              ></iframe>
            </div>
          </div>
        </div>
      )}

    </section>
  );
};
