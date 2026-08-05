import { Material, BoardPost, Mindmap, VideoLecture, InfoPost } from '../types';

// Lấy URL từ biến môi trường (File .env)
const SCRIPT_URL = import.meta.env.VITE_GOOGLE_SCRIPT_URL || '';

export const fetchMaterials = async (): Promise<Material[]> => {
  if (!SCRIPT_URL) {
    console.warn('VITE_GOOGLE_SCRIPT_URL chưa được cấu hình. Đang dùng dữ liệu trống.');
    return [];
  }

  try {
    const response = await fetch(`${SCRIPT_URL}?sheet=TaiLieu`);
    if (!response.ok) throw new Error('Không thể tải dữ liệu');
    
    const data = await response.json();
    
    // Loại bỏ dòng tiêu đề (header row) và chuyển đổi thành Object Material
    if (Array.isArray(data) && data.length > 1) {
      return data.slice(1).map((row: any[]) => ({
        id: String(row[0] || ''),
        title: String(row[1] || ''),
        description: '', // QuanLi.xlsx không có cột này
        category: String(row[2] || ''),
        format: 'LINK' as Material['format'], // Mặc định là LINK
        size: '',
        url: String(row[3] || '#'),
        dateAdded: ''
      })).filter(m => m.id !== ''); // Lọc bỏ dòng trống
    }
    
    return [];
  } catch (error) {
    console.error('Lỗi khi tải tài liệu:', error);
    return [];
  }
};

export const fetchBoardPosts = async (): Promise<BoardPost[]> => {
  if (!SCRIPT_URL) {
    console.warn('VITE_GOOGLE_SCRIPT_URL chưa được cấu hình. Đang dùng dữ liệu trống.');
    return [];
  }

  try {
    const response = await fetch(`${SCRIPT_URL}?sheet=GocTraoDoi`);
    if (!response.ok) throw new Error('Không thể tải dữ liệu');
    
    const data = await response.json();
    
    if (Array.isArray(data) && data.length > 1) {
      return data.slice(1).map((row: any[]) => ({
        id: String(row[0] || ''),
        author: String(row[1] || ''),
        content: String(row[2] || ''),
        color: String(row[3] || 'yellow') as BoardPost['color'],
        timestamp: String(row[4] || ''),
        likes: Number(row[5]) || 0,
        reply: row[6] ? String(row[6]) : undefined
      })).filter(p => p.id !== '').reverse(); // Đảo ngược để bài mới lên đầu
    }
    
    return [];
  } catch (error) {
    console.error('Lỗi khi tải góc trao đổi:', error);
    return [];
  }
};

export const addBoardPost = async (post: BoardPost): Promise<boolean> => {
  if (!SCRIPT_URL) {
    console.warn('VITE_GOOGLE_SCRIPT_URL chưa được cấu hình. Không thể gửi dữ liệu.');
    return false;
  }

  try {
    // Chuyển đổi Object thành Mảng (Array) để phù hợp cấu trúc Google Sheet
    const rowData = [
      post.id,
      post.author,
      post.content,
      post.color,
      post.timestamp,
      post.likes,
      post.reply || ''
    ];

    const response = await fetch(`${SCRIPT_URL}?sheet=GocTraoDoi`, {
      method: 'POST',
      body: JSON.stringify(rowData),
    });

    const result = await response.json();
    return result.status === 'success';
  } catch (error) {
    console.error('Lỗi khi gửi bài đăng:', error);
    return false;
  }
};

export const fetchMindmaps = async (): Promise<Mindmap[]> => {
  if (!SCRIPT_URL) return [];
  try {
    const response = await fetch(`${SCRIPT_URL}?sheet=SoDo`);
    if (!response.ok) return [];
    const data = await response.json();
    if (Array.isArray(data) && data.length > 1) {
      return data.slice(1).map((row: any[]) => ({
        id: String(row[0] || ''),
        title: String(row[1] || ''),
        description: '', // QuanLi.xlsx không có
        imageUrl: String(row[3] || ''), // Cột 4: Link Tải
        chapter: String(row[2] || '') // Cột 3: Phân loại
      })).filter(m => m.id !== '');
    }
    return [];
  } catch (error) {
    console.error('Lỗi khi tải sơ đồ:', error);
    return [];
  }
};

export const fetchVideos = async (): Promise<VideoLecture[]> => {
  if (!SCRIPT_URL) return [];
  try {
    const response = await fetch(`${SCRIPT_URL}?sheet=Video`);
    if (!response.ok) return [];
    const data = await response.json();
    if (Array.isArray(data) && data.length > 1) {
      return data.slice(1).map((row: any[]) => ({
        id: String(row[0] || ''),
        title: String(row[1] || ''),
        description: '',
        videoUrl: String(row[3] || ''), // Cột 4: Link Tải
        duration: '',
        chapter: String(row[2] || '') // Cột 3: Phân loại
      })).filter(v => v.id !== '');
    }
    return [];
  } catch (error) {
    console.error('Lỗi khi tải video:', error);
    return [];
  }
};

export const fetchInfoPosts = async (): Promise<InfoPost[]> => {
  if (!SCRIPT_URL) return [];
  try {
    const response = await fetch(`${SCRIPT_URL}?sheet=ThongTin`);
    if (!response.ok) return [];
    const data = await response.json();
    if (Array.isArray(data) && data.length > 1) {
      return data.slice(1).map((row: any[]) => ({
        id: String(row[0] || ''),
        title: String(row[1] || ''),
        content: String(row[2] || ''),
        imageUrl: String(row[3] || ''),
        date: new Date().toLocaleDateString('vi-VN') // Không có cột Ngày đăng, tự lấy ngày hiện tại
      })).filter(p => p.id !== '').reverse(); // Đảo ngược để bài mới lên đầu
    }
    return [];
  } catch (error) {
    console.error('Lỗi khi tải thông tin:', error);
    return [];
  }
};
