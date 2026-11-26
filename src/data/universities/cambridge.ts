import type { UniversityTemplate } from '@/types/cv';

export const cambridgeTemplate: UniversityTemplate = {
  id: 'cambridge-careers',
  slug: 'cambridge',
  universityName: 'University of Cambridge',
  officeOrProgram: 'Cambridge Careers Service',
  country: 'United Kingdom',
  field: 'Finance, Investment Banking & Strategy',
  format: 'resume-1page',
  layoutVariant: 'classic-serif',
  accentColor: '#003E51',
  photoRecommended: false,
  photoGuidance:
    'Chuẩn tuyển dụng Anh Quốc (Cambridge Careers Service) không để ảnh, ngày sinh hay tình trạng hôn nhân trên CV để tuân thủ bình đẳng tuyển dụng.',
  summary:
    'Mẫu 1 trang sắc sảo theo chuẩn Cambridge Careers Service dành cho Tài chính, Ngân hàng đầu tư và Chiến lược: nhấn mạnh tư duy định lượng, thương vụ/mô hình và kết quả rõ ràng.',
  styleRules: [
    'Giữ đúng 1 trang chuẩn A4 với căn lề đều và khoảng trắng thoáng dễ đọc.',
    'Thể hiện tư duy định lượng qua các thương vụ, định giá (DCF, Comps, LBO) và độ chính xác mô hình.',
    'Không ghi thông tin cá nhân thừa (ngày sinh, giới tính, ảnh) theo chuẩn tuyển dụng UK.',
    'Đưa Giải thưởng học thuật hoặc chứng chỉ nghề nghiệp (CFA, IMC) nổi bật ngay trong Học vấn hoặc Danh hiệu.',
  ],
  actionVerbs: {
    en: [
      'Modelled',
      'Evaluated',
      'Structured',
      'Analysed',
      'Advised',
      'Forecasted',
      'Audited',
      'Benchmarked',
      'Synthesised',
      'Delivered',
    ],
    vi: [
      'Lập mô hình tài chính',
      'Định giá',
      'Cấu trúc thương vụ',
      'Phân tích',
      'Tư vấn',
      'Dự báo',
      'Kiểm toán',
      'So sánh chuẩn ngành',
      'Tổng hợp báo cáo',
      'Hoàn thành',
    ],
  },
  annotations: [
    {
      id: 'cambridge-ann-edu',
      targetSection: 'education',
      title: 'Ghi xếp loại bằng chuẩn Anh (First-Class Honours) & thứ hạng',
      explanation:
        'CV kiểu Anh luôn làm rõ xếp loại bằng (First-Class / 2:1) hoặc điểm A-Level/IB mạnh để chứng minh năng lực học thuật đồng đều.',
    },
    {
      id: 'cambridge-ann-exp',
      targetSection: 'experience',
      targetIndex: 0,
      title: 'Chi tiết thương vụ & công cụ định giá cụ thể',
      explanation:
        'Nhà tuyển dụng tài chính tìm kiếm bằng chứng bạn đã tự tay dựng mô hình: nêu rõ quy mô thương vụ (£/$/€), phương pháp định giá và đầu ra trình bày cho Managing Director.',
    },
    {
      id: 'cambridge-ann-awards',
      targetSection: 'awards',
      title: 'Giải thưởng định lượng & cuộc thi đầu tư',
      explanation:
        'Các giải thi Stock Pitch, CFA Research Challenge hay Olympic Toán giúp hồ sơ tài chính nổi bật giữa hàng trăm ứng viên cùng GPA cao.',
    },
    {
      id: 'cambridge-ann-skills',
      targetSection: 'skills',
      title: 'Công cụ thị trường & chứng chỉ tài chính',
      explanation:
        'Liệt kê Bloomberg, Capital IQ, FactSet, Excel/VBA, Python gọn gàng để vượt qua vòng sàng lọc hồ sơ tự động.',
    },
  ],
  sampleCv: {
    personalInfo: {
      fullName: 'Oliver Bennett',
      headline: 'Investment Banking & Corporate Finance Analyst',
      email: 'oliver.bennett@cantab.ac.uk',
      phone: '+44 7700 900412',
      location: 'London, United Kingdom',
      links: ['linkedin.com/in/oliverbennett-uk'],
    },
    sections: [
      {
        id: 'cambridge-edu',
        type: 'education',
        title: 'Education',
        visible: true,
        items: [
          {
            id: 'cambridge-edu-1',
            title: 'University of Cambridge — Trinity College',
            subtitle: 'BA (Hons) Economics — First-Class Honours (Top 10% of cohort)',
            location: 'Cambridge, UK',
            dateRange: 'Oct 2022 – Jun 2025',
            bullets: [
              'Modules: Corporate Finance, Quantitative Methods, Macroeconomics, Financial Econometrics',
            ],
          },
        ],
      },
      {
        id: 'cambridge-exp',
        type: 'experience',
        title: 'Finance Experience',
        visible: true,
        items: [
          {
            id: 'cambridge-exp-1',
            title: 'Investment Banking Summer Analyst (M&A)',
            subtitle: 'Albion Capital Partners',
            location: 'London, UK',
            dateRange: 'Jun 2024 – Aug 2024',
            bullets: [
              'Modelled a £420M cross-border industrial acquisition using DCF, trading comparables, and accretion/dilution analyses',
              'Prepared 25-slide board presentation deck evaluating 3 strategic divestiture options for a FTSE 250 client',
              'Automated peer-group multiples extraction via Bloomberg API and Excel VBA, reducing update cycle from 3 hours to 20 minutes',
            ],
          },
          {
            id: 'cambridge-exp-2',
            title: 'Equity Research Intern',
            subtitle: 'Thames Asset Management',
            location: 'London, UK',
            dateRange: 'Jul 2023 – Sep 2023',
            bullets: [
              'Analysed European renewable energy utilities and authored an initiation memo whose "Overweight" call outperformed sector index by +9.4%',
            ],
          },
        ],
      },
      {
        id: 'cambridge-awards',
        type: 'awards',
        title: 'Honors & Competitions',
        visible: true,
        items: [
          {
            id: 'cambridge-awards-1',
            title: '1st Place — UK University Equity Research Challenge',
            subtitle: 'CFA Society of the UK (48 university teams)',
            location: 'London, UK',
            dateRange: '2024',
            bullets: [],
          },
        ],
      },
      {
        id: 'cambridge-skills',
        type: 'skills',
        title: 'Skills & Certifications',
        visible: true,
        items: [
          {
            id: 'cambridge-skills-1',
            title: 'Financial Tools & Programming',
            subtitle: '',
            location: '',
            dateRange: '',
            bullets: ['Bloomberg Terminal, Capital IQ, FactSet, Excel (VBA), Python, SQL; CFA Level I Candidate'],
          },
        ],
      },
    ],
  },
};
