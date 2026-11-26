import type { UniversityTemplate } from '@/types/cv';

export const mitTemplate: UniversityTemplate = {
  id: 'mit-capd',
  slug: 'mit',
  universityName: 'Massachusetts Institute of Technology (MIT)',
  officeOrProgram: 'Career Advising & Professional Development (CAPD)',
  country: 'United States',
  field: 'Software Engineering & Computer Science',
  format: 'resume-1page',
  layoutVariant: 'modern-tech',
  accentColor: '#750014',
  photoRecommended: false,
  photoGuidance:
    'Mẫu kỹ thuật MIT CAPD không dùng ảnh chân dung; thay vào đó ưu tiên không gian cho link GitHub, công nghệ sử dụng và độ phức tạp hệ thống.',
  summary:
    'Mẫu kỹ sư chuẩn MIT CAPD: bố cục sans-serif sắc nét, làm nổi bật Kỹ năng kỹ thuật, Kinh nghiệm kỹ thuật và Dự án hệ thống kèm chỉ số hiệu năng cụ thể.',
  styleRules: [
    'Đưa kỹ năng kỹ thuật (Languages, Frameworks, Systems) phân nhóm rõ ràng để recruiter kỹ thuật quét trong 5 giây.',
    'Mỗi gạch đầu dòng kỹ thuật cần nêu rõ: đã xây gì + bằng công nghệ nào + cải thiện hiệu năng/độ tin cậy bao nhiêu.',
    'Gắn link GitHub, Portfolio hoặc demo sống trực tiếp ở phần đầu trang.',
    'Không viết mô tả chung chung kiểu "Worked on backend"; thay bằng kiến trúc, lưu lượng (QPS), độ trễ (ms) hoặc tỷ lệ test coverage.',
  ],
  actionVerbs: {
    en: [
      'Architected',
      'Engineered',
      'Optimized',
      'Automated',
      'Refactored',
      'Benchmarked',
      'Deployed',
      'Scaled',
      'Instrumented',
      'Migrated',
    ],
    vi: [
      'Thiết kế kiến trúc',
      'Phát triển',
      'Tối ưu hiệu năng',
      'Tự động hóa',
      'Tái cấu trúc',
      'Đo kiểm',
      'Triển khai',
      'Mở rộng quy mô',
      'Giám sát',
      'Chuyển đổi hệ thống',
    ],
  },
  annotations: [
    {
      id: 'mit-ann-skills',
      targetSection: 'skills',
      title: 'Phân loại Tech Stack ngay tầm mắt nhà tuyển dụng',
      explanation:
        'MIT CAPD khuyến khích chia kỹ năng theo nhóm (Languages, Systems/Infra, ML/Data) thay vì liệt kê hỗn độn, giúp vượt qua bộ lọc từ khóa ATS cực nhanh.',
    },
    {
      id: 'mit-ann-exp',
      targetSection: 'experience',
      targetIndex: 0,
      title: 'Kỹ thuật + Chỉ số hệ thống (Latency, Throughput, Cost)',
      explanation:
        'Ví dụ: "Engineered a distributed Rust caching proxy handling 45K req/s, reducing p99 read latency from 140ms to 28ms". Con số p99 và QPS chứng minh năng lực kỹ thuật thực thụ.',
    },
    {
      id: 'mit-ann-proj',
      targetSection: 'projects',
      title: 'Dự án cá nhân / Open-source phải có chiều sâu kỹ thuật',
      explanation:
        'Với ngành CS/SE, dự án mạnh có thể ngang sức với thực tập. Nêu rõ tên công nghệ cạnh tiêu đề dự án và lượng người dùng hoặc benchmark đạt được.',
    },
    {
      id: 'mit-ann-edu',
      targetSection: 'education',
      title: 'Ghi rõ chuyên ngành EECS/CS và các môn hệ thống cốt lõi',
      explanation:
        'Nêu các môn nền tảng như Distributed Systems, Operating Systems, Algorithms giúp nhà tuyển dụng đánh giá độ chắc kiến thức gốc.',
    },
  ],
  sampleCv: {
    personalInfo: {
      fullName: 'Daniel Park',
      headline: 'Software Engineer — Distributed Systems & ML Infrastructure',
      email: 'dpark@mit.edu',
      phone: '+1 (617) 555-0148',
      location: 'Cambridge, MA',
      links: ['github.com/danielpark-dev', 'danielpark.dev'],
    },
    sections: [
      {
        id: 'mit-edu',
        type: 'education',
        title: 'Education',
        visible: true,
        items: [
          {
            id: 'mit-edu-1',
            title: 'Massachusetts Institute of Technology',
            subtitle: 'B.S. in Computer Science and Engineering (Course 6-3) — GPA: 4.9/5.0',
            location: 'Cambridge, MA',
            dateRange: 'Sep 2022 – May 2026',
            bullets: [
              'Coursework: Distributed Systems (6.5840), Operating System Engineering, Computer Systems Security, Machine Learning',
            ],
          },
        ],
      },
      {
        id: 'mit-skills',
        type: 'skills',
        title: 'Technical Skills',
        visible: true,
        items: [
          {
            id: 'mit-skills-1',
            title: 'Languages',
            subtitle: '',
            location: '',
            dateRange: '',
            bullets: ['TypeScript, Python, Go, Rust, C++, SQL'],
          },
          {
            id: 'mit-skills-2',
            title: 'Systems & Frameworks',
            subtitle: '',
            location: '',
            dateRange: '',
            bullets: ['Next.js, React, PostgreSQL, Redis, Docker, Kubernetes, gRPC, Kafka, PyTorch'],
          },
        ],
      },
      {
        id: 'mit-exp',
        type: 'experience',
        title: 'Engineering Experience',
        visible: true,
        items: [
          {
            id: 'mit-exp-1',
            title: 'Software Engineering Intern, Core Infrastructure',
            subtitle: 'CloudScale Systems',
            location: 'San Francisco, CA',
            dateRange: 'May 2025 – Aug 2025',
            bullets: [
              'Engineered a distributed Go caching proxy handling 45K req/s, reducing p99 read latency from 140ms to 28ms',
              'Automated canary rollback checks in CI/CD pipelines, cutting mean time to recovery (MTTR) by 62%',
              'Instrumented OpenTelemetry tracing across 9 microservices, uncovering a connection-pool leak saving $14K/month in compute',
            ],
          },
          {
            id: 'mit-exp-2',
            title: 'Undergraduate Researcher (UROP)',
            subtitle: 'MIT CSAIL — Parallel & Distributed Operating Systems Group',
            location: 'Cambridge, MA',
            dateRange: 'Sep 2024 – Present',
            bullets: [
              'Architected a Raft-based key-value store benchmark harness in Rust to evaluate tail latency under packet-loss faults',
              'Optimized lock contention in log compaction, improving sustained write throughput by 1.8x on 32-core nodes',
            ],
          },
        ],
      },
      {
        id: 'mit-proj',
        type: 'projects',
        title: 'Selected Technical Projects',
        visible: true,
        items: [
          {
            id: 'mit-proj-1',
            title: 'TraceLite — Lightweight Local Distributed Tracer',
            subtitle: 'Rust, TypeScript, WebAssembly, SQLite',
            location: 'github.com/danielpark-dev/tracelite',
            dateRange: '2025',
            bullets: [
              'Built an embedded OpenTelemetry collector and flamegraph UI with zero external dependencies; reached 1,400+ GitHub stars',
              'Compressed trace spans using columnar delta encoding, reducing disk footprint by 71% on 10M-span workloads',
            ],
          },
        ],
      },
    ],
  },
};
