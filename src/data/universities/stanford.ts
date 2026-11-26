import type { UniversityTemplate } from '@/types/cv';

export const stanfordTemplate: UniversityTemplate = {
  id: 'stanford-careered',
  slug: 'stanford',
  universityName: 'Stanford University',
  officeOrProgram: 'Stanford Career Education (CareerEd)',
  country: 'United States',
  field: 'Product Management, Tech & Startups',
  format: 'resume-1page',
  layoutVariant: 'modern-tech',
  accentColor: '#8C1515',
  photoRecommended: false,
  photoGuidance:
    'Stanford CareerEd không sử dụng ảnh chân dung trên resume; trọng tâm là câu chuyện sản phẩm, số liệu tăng trưởng người dùng và tinh thần chủ động.',
  summary:
    'Mẫu phong cách Thung lũng Silicon của Stanford CareerEd: tập trung vào tác động sản phẩm (Product Impact), tăng trưởng người dùng và khả năng phối hợp liên phòng ban.',
  styleRules: [
    'Mở đầu bằng Summary ngắn 2 dòng (nếu chuyển ngành hoặc ứng tuyển Product/Startup) nêu rõ thế mạnh và lĩnh vực mục tiêu.',
    'Ưu tiên kết quả kinh doanh & người dùng (retention, conversion, DAU, doanh thu) trước chi tiết kỹ thuật.',
    'Thể hiện rõ khả năng dẫn dắt đa chức năng (Engineering, Design, Data, Marketing).',
    'Mỗi kinh nghiệm chỉ chọn 3–4 bullet mạnh nhất, tránh liệt kê đầu việc thường ngày.',
  ],
  actionVerbs: {
    en: [
      'Launched',
      'Drove',
      'Pioneered',
      'Prioritized',
      'Scaled',
      'Validated',
      'Converted',
      'Partnered',
      'Redesigned',
      'Shipped',
    ],
    vi: [
      'Ra mắt',
      'Thúc đẩy tăng trưởng',
      'Tiên phong',
      'Ưu tiên hóa',
      'Mở rộng',
      'Kiểm chứng',
      'Tăng tỷ lệ chuyển đổi',
      'Phối hợp liên phòng ban',
      'Thiết kế lại',
      'Đưa vào vận hành',
    ],
  },
  annotations: [
    {
      id: 'stanford-ann-summary',
      targetSection: 'summary',
      title: 'Tóm tắt 2 dòng định vị giá trị sản phẩm',
      explanation:
        'Khác với Harvard thường bỏ qua Summary, mẫu Product/Startup của Stanford dùng 2 câu ngắn gọn để định vị ngay bạn giỏi mảng sản phẩm nào và đã tạo ra quy mô tác động gì.',
    },
    {
      id: 'stanford-ann-exp',
      targetSection: 'experience',
      targetIndex: 0,
      title: 'Đặt số liệu người dùng & tăng trưởng làm trung tâm',
      explanation:
        'Ví dụ: "Launched AI onboarding checklist across 120K MAU, lifting Day-7 activation from 41% to 58%". Cho thấy bạn biết đo lường sản phẩm chứ không chỉ ra tính năng.',
    },
    {
      id: 'stanford-ann-proj',
      targetSection: 'projects',
      title: 'Dự án khởi nghiệp / 0-to-1 tạo khác biệt lớn',
      explanation:
        'Stanford đánh giá rất cao năng lực tự xây sản phẩm từ số 0 (0-to-1): nêu rõ số người dùng thật, doanh thu hoặc bài học kiểm chứng thị trường.',
    },
    {
      id: 'stanford-ann-edu',
      targetSection: 'education',
      title: 'Học vấn đặt gọn phía dưới khi đã có kinh nghiệm sản phẩm mạnh',
      explanation:
        'Khi kinh nghiệm thực tế và sản phẩm đã đủ sức nặng, Stanford khuyên đưa Experience lên trên Education để gây ấn tượng ngay trong nửa đầu trang.',
    },
  ],
  sampleCv: {
    personalInfo: {
      fullName: 'Maya Lin',
      headline: 'Product Manager — Consumer AI & Growth',
      email: 'mayalin@alumni.stanford.edu',
      phone: '+1 (650) 555-0172',
      location: 'Palo Alto, CA',
      links: ['linkedin.com/in/mayalin-pm', 'mayalin.co'],
    },
    sections: [
      {
        id: 'stanford-summary',
        type: 'summary',
        title: 'Summary',
        visible: true,
        items: [
          {
            id: 'stanford-summary-1',
            title: '',
            subtitle: '',
            location: '',
            dateRange: '',
            bullets: [
              'Product Manager with 3+ years shipping consumer and B2B SaaS workflows from 0-to-1, combining quantitative experimentation (SQL/A/B testing) with user-centered design.',
            ],
          },
        ],
      },
      {
        id: 'stanford-exp',
        type: 'experience',
        title: 'Experience',
        visible: true,
        items: [
          {
            id: 'stanford-exp-1',
            title: 'Product Manager, Activation & AI Workflows',
            subtitle: 'NotionFlow Labs',
            location: 'San Francisco, CA',
            dateRange: 'Jul 2024 – Present',
            bullets: [
              'Launched guided AI template onboarding across 120K MAU, lifting Day-7 activation from 41% to 58% (+17 pts)',
              'Partnered with 6 engineers and 2 designers to ship collaborative comment threads, increasing weekly team retention by 14%',
              'Prioritized Q3 roadmap using funnel telemetry and 40+ customer interviews, cutting churn in SMB tier by 22%',
            ],
          },
          {
            id: 'stanford-exp-2',
            title: 'Associate Product Manager Intern',
            subtitle: 'PulsePay',
            location: 'Mountain View, CA',
            dateRange: 'Jun 2023 – Sep 2023',
            bullets: [
              'Redesigned mobile checkout retry flow via 4 A/B experiments, recovering $1.4M in annualized failed transactions',
              'Authored PRDs and success metrics for instant merchant payouts adopted by 2,800+ small businesses in 60 days',
            ],
          },
        ],
      },
      {
        id: 'stanford-proj',
        type: 'projects',
        title: 'Ventures & Projects',
        visible: true,
        items: [
          {
            id: 'stanford-proj-1',
            title: 'Co-Founder — StudyPulse (EdTech Web App)',
            subtitle: 'Stanford StartX Student Track',
            location: 'Stanford, CA',
            dateRange: '2023 – 2024',
            bullets: [
              'Validated spaced-repetition flashcard workflow with 180 students and grew organically to 4,200 monthly active learners',
            ],
          },
        ],
      },
      {
        id: 'stanford-edu',
        type: 'education',
        title: 'Education',
        visible: true,
        items: [
          {
            id: 'stanford-edu-1',
            title: 'Stanford University',
            subtitle: 'B.S. in Symbolic Systems (Human-Computer Interaction Track)',
            location: 'Stanford, CA',
            dateRange: 'Sep 2020 – Jun 2024',
            bullets: ['Teaching Assistant for CS 147 (Introduction to Human-Computer Interaction Design)'],
          },
        ],
      },
      {
        id: 'stanford-skills',
        type: 'skills',
        title: 'Skills',
        visible: true,
        items: [
          {
            id: 'stanford-skills-1',
            title: 'Product & Analytics',
            subtitle: '',
            location: '',
            dateRange: '',
            bullets: ['SQL, Amplitude, Mixpanel, Figma, A/B Experimentation, PRD & Roadmap Strategy, Python'],
          },
        ],
      },
    ],
  },
};
