import type { UniversityTemplate } from '@/types/cv';

export const harvardTemplate: UniversityTemplate = {
  id: 'harvard-ocs',
  slug: 'harvard',
  universityName: 'Harvard University',
  officeOrProgram: 'Office of Career Services (OCS)',
  country: 'United States',
  field: 'Business, Consulting & General',
  format: 'resume-1page',
  layoutVariant: 'classic-serif',
  accentColor: '#A51C30',
  photoRecommended: false,
  photoGuidance:
    'Chuẩn Harvard OCS (Mỹ) khuyến cáo KHÔNG chèn ảnh chân dung để tránh thiên vị tuyển dụng và tối ưu hệ thống lọc hồ sơ ATS.',
  summary:
    'Mẫu 1 trang kinh điển của Harvard OCS: phông chữ có chân trang trọng, đặt Học vấn lên đầu, mỗi gạch đầu dòng bắt đầu bằng động từ hành động mạnh và chốt bằng kết quả định lượng.',
  styleRules: [
    'Giữ gói gọn trong đúng 1 trang (trừ hồ sơ học thuật hoặc trên 10 năm kinh nghiệm).',
    'Mỗi bullet point bắt đầu bằng động từ hành động mạnh (Action Verb), tránh dùng đại từ nhân xưng "I/My".',
    'Ưu tiên cấu trúc Hành động + Bối cảnh + Kết quả có số liệu (%, $, thời gian, quy mô).',
    'Không dùng màu sắc rực rỡ, thanh kỹ năng dạng phần trăm hay biểu tượng rối mắt để đảm bảo đọc chuẩn ATS.',
    'Sắp xếp các mục theo thứ tự thời gian ngược (mới nhất lên trên).',
  ],
  actionVerbs: {
    en: [
      'Spearheaded',
      'Orchestrated',
      'Quantified',
      'Streamlined',
      'Negotiated',
      'Accelerated',
      'Formulated',
      'Synthesized',
      'Executed',
      'Elevated',
    ],
    vi: [
      'Dẫn dắt',
      'Tối ưu hóa',
      'Định lượng',
      'Triển khai',
      'Đàm phán',
      'Thúc đẩy',
      'Xây dựng',
      'Tổng hợp',
      'Điều phối',
      'Nâng cao',
    ],
  },
  annotations: [
    {
      id: 'harvard-ann-edu',
      targetSection: 'education',
      title: 'Đặt Học vấn lên đầu kèm GPA & môn học trọng tâm',
      explanation:
        'Harvard OCS khuyến nghị sinh viên và người mới đi làm đưa Education lên đầu, chỉ ghi GPA khi cạnh tranh (>= 3.5/4.0) và liệt kê 2–3 môn liên quan trực tiếp đến vị trí ứng tuyển.',
    },
    {
      id: 'harvard-ann-exp',
      targetSection: 'experience',
      targetIndex: 0,
      title: 'Công thức Action Verb + Phạm vi + Con số tác động',
      explanation:
        'Thay vì viết "Responsible for market research", mẫu Harvard viết "Spearheaded market-entry sizing across 4 ASEAN countries, identifying $18M addressable revenue". Nhà tuyển dụng thấy ngay quy mô và giá trị tạo ra.',
    },
    {
      id: 'harvard-ann-proj',
      targetSection: 'projects',
      title: 'Tách riêng Hoạt động lãnh đạo & Dự án có kết quả thực tế',
      explanation:
        'Các tổ chức sinh viên hoặc dự án cộng đồng chỉ thực sự ghi điểm khi được viết như kinh nghiệm làm việc: nêu rõ quy mô nhóm, ngân sách quản lý và kết quả cụ thể.',
    },
    {
      id: 'harvard-ann-skills',
      targetSection: 'skills',
      title: 'Gộp Kỹ năng, Ngôn ngữ & Sở thích gọn trong 2–3 dòng cuối',
      explanation:
        'Không vẽ thanh chấm điểm chủ quan (như 80% Excel). Hãy phân nhóm rõ: Technical, Languages (kèm trình độ chuẩn), và Interests (cụ thể, dễ gợi chuyện khi phỏng vấn).',
    },
  ],
  sampleCv: {
    personalInfo: {
      fullName: 'Eleanor Vance',
      headline: 'Strategy & Management Consulting Candidate',
      email: 'eleanor.vance@college.harvard.edu',
      phone: '+1 (617) 555-0194',
      location: 'Cambridge, MA',
      links: ['linkedin.com/in/eleanorvance'],
    },
    sections: [
      {
        id: 'harvard-edu',
        type: 'education',
        title: 'Education',
        visible: true,
        items: [
          {
            id: 'harvard-edu-1',
            title: 'Harvard University',
            subtitle: 'A.B. in Economics, Secondary in Statistics — GPA: 3.92/4.00',
            location: 'Cambridge, MA',
            dateRange: 'Sep 2022 – May 2026',
            bullets: [
              'Relevant Coursework: Corporate Finance, Econometrics, Game Theory, Applied Machine Learning',
              'Honors: John Harvard Scholar (top 5% of class), Detur Book Prize',
            ],
          },
        ],
      },
      {
        id: 'harvard-exp',
        type: 'experience',
        title: 'Experience',
        visible: true,
        items: [
          {
            id: 'harvard-exp-1',
            title: 'Summer Business Analyst',
            subtitle: 'Meridian Strategy Group',
            location: 'New York, NY',
            dateRange: 'Jun 2025 – Aug 2025',
            bullets: [
              'Spearheaded market-entry sizing across 4 ASEAN countries for a fintech client, identifying $18M in addressable Year-1 revenue',
              'Synthesized 35+ executive interviews into a pricing tier model projected to lift annual recurring revenue by 12%',
              'Streamlined weekly KPI reporting in SQL and Excel, cutting analyst preparation time by 6 hours per week',
            ],
          },
          {
            id: 'harvard-exp-2',
            title: 'Undergraduate Research Assistant',
            subtitle: 'Harvard Department of Economics',
            location: 'Cambridge, MA',
            dateRange: 'Sep 2024 – May 2025',
            bullets: [
              'Quantified labor-market impacts of regional broadband expansion using panel regressions across 1,200 counties in Stata and R',
              'Co-authored a 28-page working paper appendix cited in a National Bureau of Economic Research seminar',
            ],
          },
        ],
      },
      {
        id: 'harvard-proj',
        type: 'projects',
        title: 'Leadership & Projects',
        visible: true,
        items: [
          {
            id: 'harvard-proj-1',
            title: 'Managing Director',
            subtitle: 'Harvard Undergraduate Consulting Group',
            location: 'Cambridge, MA',
            dateRange: 'Jan 2024 – Present',
            bullets: [
              'Orchestrated 6 pro-bono client engagements per semester across 42 student consultants with a 96% client satisfaction score',
              'Negotiated 4 corporate sponsorships totaling $24,000 to fund case workshops for 300+ undergraduates',
            ],
          },
        ],
      },
      {
        id: 'harvard-skills',
        type: 'skills',
        title: 'Skills & Additional Information',
        visible: true,
        items: [
          {
            id: 'harvard-skills-1',
            title: 'Technical & Analytical',
            subtitle: '',
            location: '',
            dateRange: '',
            bullets: [
              'SQL, Python (pandas, statsmodels), R, Stata, Financial Modeling (DCF, LBO), Tableau',
            ],
          },
          {
            id: 'harvard-skills-2',
            title: 'Languages & Interests',
            subtitle: '',
            location: '',
            dateRange: '',
            bullets: [
              'English (Native), Vietnamese (Conversational), French (Working); Marathon running, specialty coffee roasting',
            ],
          },
        ],
      },
    ],
  },
};
