import { AppData, Project, BlogPost, Experience, Education, Certification } from '../types';

export const INITIAL_APP_DATA: AppData = {
  subjects: [
    {
      id: 'giai-tich-12',
      name: 'Giải tích 12',
      icon: 'fa-solid fa-calculator',
      description: 'Hàm số, Mũ và Logarit, Nguyên hàm - Tích phân, Số phức.',
      questionsCount: 4,
      color: 'from-blue-400 to-blue-600',
    },
    {
      id: 'hinh-hoc-12',
      name: 'Hình học 12',
      icon: 'fa-solid fa-cube',
      description: 'Khối đa diện, Mặt nón - Trụ - Cầu, Hình học không gian Oxyz.',
      questionsCount: 4,
      color: 'from-emerald-400 to-green-600',
    }
  ],
  questions: [
    // Giải tích 12 Questions
    {
      id: 'q-gt-1',
      subjectId: 'giai-tich-12',
      content: 'Hàm số y = x^3 - 3x + 2 đồng biến trên khoảng nào dưới đây?',
      type: 'multiple_choice',
      options: [
        '(-1; 1)',
        '(-∞; -1) và (1; +∞)',
        '(1; +∞)',
        '(-∞; 1)'
      ],
      correctAnswer: 1,
      explanation: 'Ta có y\' = 3x^2 - 3. y\' > 0 khi x < -1 hoặc x > 1.',
      difficulty: 'easy'
    },
    {
      id: 'q-gt-2',
      subjectId: 'giai-tich-12',
      content: 'Tập xác định của hàm số y = log_2(x - 1) là?',
      type: 'multiple_choice',
      options: [
        '[1; +∞)',
        '(1; +∞)',
        'R \\ {1}',
        '(0; +∞)'
      ],
      correctAnswer: 1,
      explanation: 'Điều kiện: x - 1 > 0 <=> x > 1.',
      difficulty: 'easy'
    },
    {
      id: 'q-gt-3',
      subjectId: 'giai-tich-12',
      content: 'Nguyên hàm của hàm số f(x) = 2x là:',
      type: 'multiple_choice',
      options: [
        'x^2 + C',
        '2 + C',
        'x^2/2 + C',
        '2x^2 + C'
      ],
      correctAnswer: 0,
      explanation: 'Áp dụng công thức nguyên hàm cơ bản.',
      difficulty: 'easy'
    },
    {
      id: 'q-gt-4',
      subjectId: 'giai-tich-12',
      content: 'Cho số phức z = 3 - 4i. Mô-đun của z bằng:',
      type: 'multiple_choice',
      options: ['3', '4', '5', '7'],
      correctAnswer: 2,
      explanation: '|z| = √(3^2 + (-4)^2) = 5.',
      difficulty: 'easy'
    },

    // Hình học 12 Questions
    {
      id: 'q-hh-1',
      subjectId: 'hinh-hoc-12',
      content: 'Thể tích khối lập phương cạnh a bằng:',
      type: 'multiple_choice',
      options: ['a^2', '3a', 'a^3', 'a^3/3'],
      correctAnswer: 2,
      explanation: 'Công thức thể tích khối lập phương V = a^3.',
      difficulty: 'easy'
    },
    {
      id: 'q-hh-2',
      subjectId: 'hinh-hoc-12',
      content: 'Diện tích mặt cầu bán kính R là:',
      type: 'multiple_choice',
      options: ['4πR^2', 'πR^2', '4/3 πR^3', '2πR'],
      correctAnswer: 0,
      explanation: 'Công thức diện tích mặt cầu S = 4πR^2.',
      difficulty: 'easy'
    },
    {
      id: 'q-hh-3',
      subjectId: 'hinh-hoc-12',
      content: 'Trong không gian Oxyz, véc tơ pháp tuyến của mặt phẳng (Oxy) là:',
      type: 'multiple_choice',
      options: ['(1; 0; 0)', '(0; 1; 0)', '(0; 0; 1)', '(1; 1; 0)'],
      correctAnswer: 2,
      explanation: 'Mặt phẳng (Oxy) vuông góc với trục Oz nên nhận véc tơ đơn vị k = (0; 0; 1) làm véc tơ pháp tuyến.',
      difficulty: 'easy'
    },
    {
      id: 'q-hh-4',
      subjectId: 'hinh-hoc-12',
      content: 'Trong không gian Oxyz, điểm M(1; -2; 3) thuộc mặt phẳng nào sau đây?',
      type: 'multiple_choice',
      options: [
        'x - y + z - 6 = 0',
        'x + y + z - 2 = 0',
        '2x - y - z - 1 = 0',
        'x - 2y + 3z - 10 = 0'
      ],
      correctAnswer: 1,
      explanation: 'Thay tọa độ M vào phương trình x + y + z - 2 = 1 - 2 + 3 - 2 = 0 (Thỏa mãn).',
      difficulty: 'medium'
    }
  ],
  sessions: [],
  progress: {
    totalAttempts: 0,
    averageScore: 0,
    streakDays: 0,
    weakTopics: []
  },
  settings: {
    theme: 'light',
    soundEnabled: true,
    autoSave: true,
    selectedModel: 'gemini-3.6-flash'
  }
};

// Portfolio Info
export const PROFILE_INFO = {
  name: 'Lê Vĩnh Phúc',
  role: 'Giáo viên môn Toán THPT',
  bio: 'Chào mừng các em học sinh đến với trang web học Toán trực tuyến! Đây là nơi thầy chia sẻ tài liệu, bài giảng và các đề thi trắc nghiệm giúp các em nắm vững kiến thức, tự tin bước vào các kỳ thi quan trọng.',
  location: 'Ấp Bình Hòa, xã Bình Đại, tỉnh Vĩnh Long',
  email: 'levinhphuc@example.com',
  phone: '0944405124',
  github: '#',
  linkedin: '#',
  website: '#',
  avatar: 'https://images.unsplash.com/photo-1544717302-de2939b7ef71?auto=format&fit=crop&w=600&q=80',
  stats: {
    yearsExp: '10+',
    projectsDone: '50+',
    githubStars: '1k+',
    coffeeCups: 'Lớp học'
  },
  skills: [
    { name: 'Toán Đại số & Giải tích', level: 95, icon: 'fa-solid fa-calculator' },
    { name: 'Hình học Không gian', level: 90, icon: 'fa-solid fa-shapes' },
    { name: 'Luyện thi THPT Quốc gia', level: 95, icon: 'fa-solid fa-graduation-cap' },
    { name: 'Sư phạm & Tư vấn', level: 92, icon: 'fa-solid fa-chalkboard-teacher' }
  ]
};

// Projects Showcase
export const FEATURED_PROJECTS: Project[] = [
  {
    id: 'proj-1',
    title: 'AI Education & Practice Studio',
    category: 'AI',
    description: 'Nền tảng học tập thông minh tích hợp AI Gemini tự động tạo câu hỏi trắc nghiệm, giải thích đáp án và tư vấn lộ trình học tập.',
    longDescription: 'Hệ thống học tập cá nhân hóa đa nền tảng cho phép người dùng kiểm tra kiến thức lập trình, tương tác trực tiếp với Trợ lý AI Tutor, theo dõi tiến độ và phân tích điểm yếu bằng thuật toán thông minh.',
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80',
    tags: ['React 19', 'TypeScript', 'Gemini AI API', 'Tailwind CSS', 'Express'],
    demoUrl: '#',
    githubUrl: 'https://github.com',
    highlights: [
      'Tích hợp Gemini 3.6 Flash tự động đề xuất câu hỏi theo trình độ',
      'Dashboard phân tích biểu đồ tiến độ học tập và chuỗi học tập (Streak)',
      'Hệ thống AI Tutor phản hồi thời gian thực hỗ trợ markdown & code highlight',
      'Đạt 99/100 điểm Lighthouse Performance & SEO Optimization'
    ]
  },
  {
    id: 'proj-2',
    title: 'DevSpace - Blog & Developer Hub',
    category: 'Web',
    description: 'Nền tảng chia sẻ kiến thức công nghệ tốc độ cao với khả năng tóm tắt bài viết bằng AI và giao diện đọc bài tối ưu mắt.',
    longDescription: 'DevSpace giúp lập trình viên viết, đọc và tương tác với các bài viết kĩ thuật. Tích hợp AI Summarizer rút gọn nội dung bài viết dài thành các gạch đầu dòng cô đọng trong 3 giây.',
    image: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=800&q=80',
    tags: ['React', 'Node.js', 'Marked.js', 'Tailwind CSS', 'PWA'],
    demoUrl: '#',
    githubUrl: 'https://github.com',
    highlights: [
      'Parse Markdown tốc độ cao hỗ trợ toán học và biểu đồ',
      'Trợ lý AI tóm tắt nội dung chính tức thì',
      'Tối ưu chế độ đọc ban đêm (Dark Mode) bảo vệ thị lực',
      'Lưu trữ Offline với Service Workers'
    ]
  },
  {
    id: 'proj-3',
    title: 'Cloud Analytics & Monitoring Dashboard',
    category: 'Cloud',
    description: 'Bảng điều khiển giám sát hệ thống hạ tầng đám mây trực quan với cảnh báo thời gian thực và tự động dự đoán lưu lượng.',
    longDescription: 'Giải pháp SaaS giúp doanh nghiệp theo dõi sức khỏe ứng dụng, CPU, RAM, Network I/O và phát hiện bất thường bằng thuật toán Machine Learning.',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
    tags: ['TypeScript', 'Recharts', 'Express', 'WebSocket', 'Tailwind'],
    demoUrl: '#',
    githubUrl: 'https://github.com',
    highlights: [
      'Cập nhật metrics thời gian thực qua WebSocket',
      'Tích hợp biểu đồ tương tác Recharts đa dạng',
      'Cảnh báo sự cố tức thì qua Telegram / Email webhook',
      'Phân quyền truy cập đa vai trò (RBAC)'
    ]
  },
  {
    id: 'proj-4',
    title: 'Smart Task & Productivity App',
    category: 'Mobile',
    description: 'Ứng dụng quản lý công việc thông minh gợi ý thứ tự ưu tiên bằng AI và đồng bộ hóa đa thiết bị.',
    longDescription: 'Giúp người dùng sắp xếp thời gian hiệu quả theo phương pháp Pomodoro & Eisenhower Matrix, tự động xếp lịch họp thông minh.',
    image: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?auto=format&fit=crop&w=800&q=80',
    tags: ['React Native', 'TypeScript', 'LocalStorage', 'Gemini AI'],
    demoUrl: '#',
    githubUrl: 'https://github.com',
    highlights: [
      'Giao diện kéo thả mượt mà với Framer Motion',
      'AI sắp xếp lịch trình thông minh',
      'Chế độ tập trung Focus Mode kèm nhạc nền lo-fi',
      'Đồng bộ tức thì không gián đoạn'
    ]
  }
];

// Blog Posts
export const INITIAL_BLOG_POSTS: BlogPost[] = [
  {
    id: 'post-1',
    title: 'Tối ưu hóa hiệu năng React 19 & Vite cho ứng dụng quy mô lớn',
    excerpt: 'Khám phá các kỹ thuật Code Splitting, Memoization đúng cách, và tận dụng React Compiler mới nhất để đạt điểm tối đa trên Google Lighthouse.',
    content: `
### Giới thiệu
Hiệu năng ứng dụng web trực tiếp ảnh hưởng đến trải nghiệm người dùng và tỷ lệ chuyển đổi. Trong bài viết này, chúng ta sẽ cùng đi qua các bước tối ưu hóa React 19 thực tế.

#### 1. Sử dụng React.memo & useCallback đúng mục đích
Không phải component nào cũng cần \`React.memo\`. Hãy tập trung memoize các component nặng ở vị trí cao trên cây render hoặc các component chấp nhận callback phức tạp.

#### 2. Tận dụng Lazy Loading & Suspense
Tách nhỏ bundle bằng cách lazy load các route và modal không bắt buộc ban đầu:
\`\`\`tsx
const LazyQuizRunner = React.lazy(() => import('./components/QuizRunner'));
\`\`\`

#### 3. Tối ưu CSS với Tailwind v4
Tailwind v4 giúp giảm thiểu đáng kể dung lượng CSS nhờ công nghệ JIT nâng cấp, chỉ include các utility thực sự được sử dụng.
    `,
    category: 'React & Frontend',
    date: '02/08/2026',
    readTime: '5 phút đọc',
    author: 'Nguyễn Văn A',
    tags: ['React', 'Vite', 'Performance', 'Web Dev'],
    image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'post-2',
    title: 'Tích hợp Gemini AI vào ứng dụng Web full-stack an toàn & hiệu quả',
    excerpt: 'Hướng dẫn chi tiết cách xây dựng API Proxy phía Server-side với @google/genai SDK, quản lý API Key và triển khai fallback model linh hoạt.',
    content: `
### Tại sao phải gọi Gemini API qua Server-side?
Khi phát triển ứng dụng thương mại hoặc sản phẩm thực tế, việc để Gemini API Key phía trình duyệt (Client-side) là rủi ro bảo mật lớn. 

#### Kiến trúc khuyến nghị:
1. Client gửi request đơn giản lên Express backend (/api/gemini/generate)
2. Server đọc \`process.env.GEMINI_API_KEY\` hoặc Key người dùng cấu hình
3. Server khởi tạo \`new GoogleGenAI({ apiKey })\` và thực hiện lời gọi
4. Xử lý lỗi Rate Limit (429) hoặc Model Quota bằng danh sách Fallback Models (\`gemini-3.6-flash\`, \`gemini-3.1-flash-lite\`...)

#### Code mẫu Express Backend:
\`\`\`ts
import { GoogleGenAI } from "@google/genai";
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const response = await ai.models.generateContent({
  model: 'gemini-3.6-flash',
  contents: prompt
});
\`\`\`
    `,
    category: 'AI & Gemini API',
    date: '28/07/2026',
    readTime: '7 phút đọc',
    author: 'Nguyễn Văn A',
    tags: ['Gemini AI', 'Node.js', 'Express', 'Security'],
    image: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'post-3',
    title: 'Lộ trình trở thành Senior Full-Stack Developer năm 2026',
    excerpt: 'Tóm tắt những tư duy quan trọng, kỹ năng cốt lõi về System Design, Clean Code và tư duy sản phẩm giúp bạn bứt phá sự nghiệp.',
    content: `
### Định nghĩa Senior Developer hiện đại
Trở thành Senior không chỉ là việc viết code nhanh hơn, mà là khả năng đưa ra quyết định kỹ thuật đúng đắn, làm chủ kiến trúc hệ thống và giúp đỡ đồng đội phát triển.

#### Key Pillars:
1. **Chủ động bảo mật & hiệu năng**: Hiểu rõ CORS, XSS, OAuth2, caching strategy.
2. **Kỹ năng làm việc với AI**: Sử dụng AI như một trợ lý đắc lực để x3 năng suất thay vì phụ thuộc thụ động.
3. **Communication & Product Mindset**: Đặt câu hỏi "Tính năng này giải quyết vấn đề gì cho người dùng?" trước khi gõ code.
    `,
    category: 'Sự nghiệp & Định hướng',
    date: '15/07/2026',
    readTime: '6 phút đọc',
    author: 'Nguyễn Văn A',
    tags: ['Career', 'FullStack', 'Roadmap', 'Advice'],
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80'
  }
];

// Experience
export const WORK_EXPERIENCES: Experience[] = [
  {
    id: 'exp-1',
    period: '2023 - Hiện tại',
    role: 'Senior Full-Stack & AI Engineer',
    company: 'TechVision Global Solutions',
    location: 'TP. Hồ Chí Minh',
    description: 'Dẫn dắt đội ngũ 6 kỹ sư xây dựng hệ thống SaaS tích hợp Generative AI. Thiết kế kiến trúc Microservices, phục vụ hơn 100.000 người dùng hàng tháng.',
    skills: ['React 19', 'Node.js', 'Gemini AI', 'TypeScript', 'Docker', 'PostgreSQL']
  },
  {
    id: 'exp-2',
    period: '2021 - 2023',
    role: 'Frontend Tech Lead',
    company: 'InnovateX Digital Corp',
    location: 'TP. Hồ Chí Minh',
    description: 'Chịu trách nhiệm toàn bộ mảng Web Frontend. Xây dựng Design System dùng chung, tái cấu trúc mã nguồn giúp tăng 40% tốc độ tải trang.',
    skills: ['React', 'Next.js', 'Redux Toolkit', 'Tailwind CSS', 'GraphQL']
  },
  {
    id: 'exp-3',
    period: '2019 - 2021',
    role: 'Full-Stack Developer',
    company: 'SoftCore Systems',
    location: 'TP. Hồ Chí Minh',
    description: 'Phát triển các ứng dụng E-commerce và Dashboard quản lý kho vận cho các đối tác bán lẻ lớn tại Việt Nam.',
    skills: ['JavaScript ES6+', 'Express.js', 'MongoDB', 'Vue.js', 'REST API']
  }
];

// Education
export const EDUCATION_HISTORY: Education[] = [
  {
    id: 'edu-1',
    period: '2015 - 2019',
    degree: 'Kỹ sư Khoa học Máy tính (B.S. in Computer Science)',
    school: 'Đại học Bách Khoa TP. Hồ Chí Minh (HCMUT)',
    gpa: '3.6 / 4.0 (Loại Giỏi)',
    achievements: [
      'Giải Nhì Cuộc thi Lập trình Sinh viên Hackathon 2018',
      'Học bổng Khuyến khích Học tập 6 học kỳ liên tiếp',
      'Tác giả đề tài nghiên cứu khoa học cấp Trường về Xử lý Ngôn ngữ Tự nhiên'
    ]
  }
];

// Certifications
export const CERTIFICATIONS: Certification[] = [
  {
    id: 'cert-1',
    name: 'Google Cloud Certified - Professional Cloud Architect',
    issuer: 'Google Cloud',
    year: '2025',
    badge: 'fa-brands fa-google'
  },
  {
    id: 'cert-2',
    name: 'AWS Certified Solutions Architect – Associate',
    issuer: 'Amazon Web Services',
    year: '2024',
    badge: 'fa-brands fa-aws'
  },
  {
    id: 'cert-3',
    name: 'Meta Front-End Developer Professional Certificate',
    issuer: 'Meta / Coursera',
    year: '2023',
    badge: 'fa-brands fa-meta'
  }
];
