import type { UniversityTemplate } from '@/types/cv';

export const oxfordTemplate: UniversityTemplate = {
  id: 'oxford-careers',
  slug: 'oxford',
  universityName: 'University of Oxford',
  officeOrProgram: 'Oxford University Careers Service',
  country: 'United Kingdom',
  field: 'Academic, Research & Graduate Admissions',
  format: 'academic-cv',
  layoutVariant: 'academic-cv',
  accentColor: '#002147',
  photoRecommended: false,
  photoGuidance:
    'CV học thuật chuẩn Oxford (Anh) không chèn ảnh chân dung và không giới hạn cứng ở 1 trang; thường dài 2 trang cho ứng viên cao học/nghiên cứu.',
  summary:
    'Mẫu Academic CV chuẩn University of Oxford: dành cho nộp học bổng, Thạc sĩ/Tiến sĩ và vị trí nghiên cứu với cấu trúc tách bạch Học vấn, Công bố khoa học, Giảng dạy và Học bổng.',
  styleRules: [
    'Academic CV có thể dài 2 trang (khác với Resume 1 trang của Mỹ) để trình bày đầy đủ công bố, nghiên cứu và giảng dạy.',
    'Ghi rõ tên luận văn (Dissertation/Thesis) và tên giáo sư hướng dẫn (Supervisor) ngay dưới mục Học vấn.',
    'Trình bày Công bố khoa học (Publications) theo chuẩn trích dẫn nhất quán, in đậm tên của bạn.',
    'Tách riêng Học bổng & Giải thưởng (Grants, Fellowships & Awards) kèm đơn vị cấp và giá trị/tính cạnh tranh.',
  ],
  actionVerbs: {
    en: [
      'Investigated',
      'Published',
      'Synthesized',
      'Demonstrated',
      'Presented',
      'Mentored',
      'Evaluated',
      'Formulated',
      'Collaborated',
      'Authored',
    ],
    vi: [
      'Nghiên cứu',
      'Công bố',
      'Tổng hợp',
      'Chứng minh',
      'Trình bày tại hội thảo',
      'Hướng dẫn học thuật',
      'Đánh giá thực nghiệm',
      'Xây dựng mô hình',
      'Hợp tác nghiên cứu',
      'Đồng tác giả',
    ],
  },
  annotations: [
    {
      id: 'oxford-ann-edu',
      targetSection: 'education',
      title: 'Nêu rõ đề tài luận văn và Giáo sư hướng dẫn',
      explanation:
        'Hội đồng tuyển sinh và phòng lab tại Oxford đọc rất kỹ đề tài nghiên cứu và người hướng dẫn để đánh giá mức độ khớp hướng chuyên môn của bạn.',
    },
    {
      id: 'oxford-ann-pub',
      targetSection: 'publications',
      title: 'Mục Công bố khoa học trình bày theo chuẩn trích dẫn học thuật',
      explanation:
        'Liệt kê đầy đủ tác giả, năm, tên bài báo, hội nghị/tạp chí (ví dụ NeurIPS, ACL, Nature). Có thể tách "Peer-Reviewed" và "Preprints/Working Papers".',
    },
    {
      id: 'oxford-ann-exp',
      targetSection: 'experience',
      title: 'Phân biệt Kinh nghiệm nghiên cứu & Trợ giảng',
      explanation:
        'Nếu bạn từng làm Research Assistant hoặc Teaching Assistant, hãy nêu rõ phương pháp nghiên cứu, bộ dữ liệu và số lượng sinh viên đã hướng dẫn.',
    },
    {
      id: 'oxford-ann-awards',
      targetSection: 'awards',
      title: 'Học bổng & Tài trợ nghiên cứu chứng minh năng lực cạnh tranh',
      explanation:
        'Ghi rõ tên học bổng, cơ quan tài trợ và tỷ lệ chọn lọc (ví dụ: top 2% ứng viên toàn quốc) thay vì chỉ ghi tên giải.',
    },
  ],
  sampleCv: {
    personalInfo: {
      fullName: 'Dr. Clara Ashford',
      headline: 'Computational Linguistics & Natural Language Processing Researcher',
      email: 'clara.ashford@ox.ac.uk',
      phone: '+44 1865 550192',
      location: 'Oxford, United Kingdom',
      links: ['scholar.google.com/citations?user=clara', 'orcid.org/0000-0002-1234-5678'],
    },
    sections: [
      {
        id: 'oxford-edu',
        type: 'education',
        title: 'Education',
        visible: true,
        items: [
          {
            id: 'oxford-edu-1',
            title: 'University of Oxford — Balliol College',
            subtitle: 'DPhil in Computer Science (Natural Language Processing)',
            location: 'Oxford, UK',
            dateRange: 'Oct 2022 – Jun 2026',
            bullets: [
              'Thesis: "Low-Resource Cross-Lingual Alignment for Southeast Asian Languages" (Supervisor: Prof. R. Hughes)',
            ],
          },
          {
            id: 'oxford-edu-2',
            title: 'University of Edinburgh',
            subtitle: 'MSc in Artificial Intelligence (Distinction)',
            location: 'Edinburgh, UK',
            dateRange: 'Sep 2021 – Aug 2022',
            bullets: ['Dissertation awarded Best MSc Project in Language Technology'],
          },
        ],
      },
      {
        id: 'oxford-pub',
        type: 'publications',
        title: 'Publications & Research',
        visible: true,
        items: [
          {
            id: 'oxford-pub-1',
            title: 'Peer-Reviewed Conference Papers',
            subtitle: '',
            location: '',
            dateRange: '2024 – 2025',
            bullets: [
              'Ashford, C., Nguyen, T., & Hughes, R. (2025). "Subword Transfer Dynamics in Low-Resource Multilingual Models." Proceedings of ACL 2025 (Oral Presentation).',
              'Ashford, C., & Patel, S. (2024). "Calibrated Uncertainty Estimation for Academic Summarization." Findings of EMNLP 2024.',
            ],
          },
        ],
      },
      {
        id: 'oxford-exp',
        type: 'experience',
        title: 'Research & Teaching Experience',
        visible: true,
        items: [
          {
            id: 'oxford-exp-1',
            title: 'Visiting Research Intern',
            subtitle: 'DeepMind Language Team',
            location: 'London, UK',
            dateRange: 'Jun 2025 – Sep 2025',
            bullets: [
              'Investigated retrieval-augmented fine-tuning across 12 typologically diverse languages, improving F1 by +4.6 points on low-resource QA benchmarks',
            ],
          },
          {
            id: 'oxford-exp-2',
            title: 'Graduate Teaching Assistant',
            subtitle: 'Department of Computer Science, University of Oxford',
            location: 'Oxford, UK',
            dateRange: 'Oct 2023 – May 2025',
            bullets: [
              'Led weekly tutorials and graded coursework for 45 undergraduates in Machine Learning and Probabilistic Models',
            ],
          },
        ],
      },
      {
        id: 'oxford-awards',
        type: 'awards',
        title: 'Honors, Grants & Fellowships',
        visible: true,
        items: [
          {
            id: 'oxford-awards-1',
            title: 'Clarendon Fund Scholarship',
            subtitle: 'University of Oxford — Full tuition and living stipend (top 2% of graduate applicants)',
            location: 'Oxford, UK',
            dateRange: '2022 – 2026',
            bullets: [],
          },
        ],
      },
      {
        id: 'oxford-skills',
        type: 'skills',
        title: 'Technical & Language Proficiencies',
        visible: true,
        items: [
          {
            id: 'oxford-skills-1',
            title: 'Research Stack',
            subtitle: '',
            location: '',
            dateRange: '',
            bullets: ['Python, PyTorch, JAX, Hugging Face, LaTeX, Slurm HPC clusters; English (Native), French (C1)'],
          },
        ],
      },
    ],
  },
};
