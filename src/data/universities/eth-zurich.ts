import type { UniversityTemplate } from '@/types/cv';

export const ethZurichTemplate: UniversityTemplate = {
  id: 'eth-zurich-stem',
  slug: 'eth-zurich',
  universityName: 'ETH Zurich',
  officeOrProgram: 'ETH Career Center',
  country: 'Switzerland',
  field: 'STEM, Robotics & European Engineering',
  format: 'resume-1page',
  layoutVariant: 'clean-euro',
  accentColor: '#1F407A',
  photoRecommended: true,
  photoGuidance:
    'Tại Thụy Sĩ, Đức và nhiều nước châu Âu (cũng như tại Việt Nam), ảnh chân dung chuyên nghiệp ở góc trên CV là tùy chọn phổ biến và được khuyến khích.',
  summary:
    'Mẫu chuẩn châu Âu của ETH Zurich Career Center: cấu trúc mạch lạc, cột mốc thời gian rõ ràng, hỗ trợ ảnh chân dung chuyên nghiệp, nhấn mạnh năng lực STEM và trình độ ngoại ngữ chuẩn CEFR.',
  styleRules: [
    'Cấu trúc sạch sẽ, cân đối theo phong cách kỹ thuật Thụy Sĩ — chú trọng độ rõ ràng và tính chính xác từng mốc thời gian.',
    'Ảnh chân dung (tùy chọn) nên là ảnh nền sáng, trang phục lịch sự, đặt gọn ở góc phải phần đầu trang.',
    'Ghi trình độ ngoại ngữ theo chuẩn khung tham chiếu châu Âu CEFR (A2, B1, B2, C1, C2) để nhà tuyển dụng quốc tế dễ đối chiếu.',
    'Nêu rõ kết quả thực nghiệm, thông số phần cứng/phần mềm và đóng góp kỹ thuật cá nhân trong từng dự án.',
  ],
  actionVerbs: {
    en: [
      'Designed',
      'Developed',
      'Simulated',
      'Validated',
      'Calibrated',
      'Implemented',
      'Integrated',
      'Analysed',
      'Fabricated',
      'Automated',
    ],
    vi: [
      'Thiết kế',
      'Phát triển',
      'Mô phỏng',
      'Kiểm chứng',
      'Hiệu chuẩn',
      'Triển khai',
      'Tích hợp hệ thống',
      'Phân tích',
      'Chế tạo thử nghiệm',
      'Tự động hóa',
    ],
  },
  annotations: [
    {
      id: 'eth-ann-edu',
      targetSection: 'education',
      title: 'Thang điểm & trọng tâm chuyên môn chuẩn châu Âu',
      explanation:
        'ETH Zurich dùng thang điểm 6.0 (cao nhất là 6.0). Khi nộp hồ sơ quốc tế, hãy ghi kèm thang điểm tối đa (ví dụ: 5.65/6.00 hoặc 3.75/4.00) để nhà tuyển dụng không hiểu nhầm.',
    },
    {
      id: 'eth-ann-exp',
      targetSection: 'experience',
      targetIndex: 0,
      title: 'Độ chính xác kỹ thuật & thông số thực nghiệm',
      explanation:
        'Phong cách ETH ưa chuộng con số thực tế (tần số điều khiển 200Hz, sai số định vị < 1.2cm) hơn là các tính từ hoa mỹ.',
    },
    {
      id: 'eth-ann-proj',
      targetSection: 'projects',
      title: 'Dự án phòng thí nghiệm / Focus Project',
      explanation:
        'Nêu rõ vai trò của bạn trong nhóm kỹ thuật liên ngành (cơ khí, điện tử, phần mềm) và thành quả bàn giao cuối cùng.',
    },
    {
      id: 'eth-ann-skills',
      targetSection: 'skills',
      title: 'Kỹ năng kỹ thuật kèm trình độ ngoại ngữ chuẩn CEFR',
      explanation:
        'Tại châu Âu, việc ghi rõ English (C2), German (B2), Vietnamese (Native) là tiêu chuẩn bắt buộc giúp nhà tuyển dụng biết bạn có thể làm việc trong môi trường đa ngôn ngữ nào.',
    },
  ],
  sampleCv: {
    personalInfo: {
      fullName: 'Lukas Meier',
      headline: 'MSc Robotics, Systems & Control Engineer',
      email: 'lukas.meier@ethz.ch',
      phone: '+41 44 555 01 88',
      location: 'Zurich, Switzerland',
      links: ['github.com/lukasmeier-robotics', 'linkedin.com/in/lukasmeier-eth'],
    },
    sections: [
      {
        id: 'eth-edu',
        type: 'education',
        title: 'Education',
        visible: true,
        items: [
          {
            id: 'eth-edu-1',
            title: 'ETH Zurich',
            subtitle: 'MSc in Robotics, Systems and Control — Grade: 5.65/6.00',
            location: 'Zurich, Switzerland',
            dateRange: 'Sep 2024 – Jun 2026',
            bullets: [
              'Focus: Autonomous Mobile Robots, Optimal Control, Computer Vision, Embedded C++',
            ],
          },
          {
            id: 'eth-edu-2',
            title: 'ETH Zurich',
            subtitle: 'BSc in Mechanical Engineering — Grade: 5.42/6.00',
            location: 'Zurich, Switzerland',
            dateRange: 'Sep 2021 – Aug 2024',
            bullets: [],
          },
        ],
      },
      {
        id: 'eth-exp',
        type: 'experience',
        title: 'Engineering Experience',
        visible: true,
        items: [
          {
            id: 'eth-exp-1',
            title: 'Robotics Control Intern',
            subtitle: 'Alpine Autonomous Systems AG',
            location: 'Zurich, Switzerland',
            dateRange: 'Mar 2025 – Aug 2025',
            bullets: [
              'Implemented a 200Hz Model Predictive Controller in C++17 and ROS 2, reducing quadrotor trajectory tracking error to < 1.8 cm in wind-tunnel tests',
              'Validated LiDAR-inertial odometry pipeline across 14 km of outdoor alpine terrain, cutting localization drift by 42%',
            ],
          },
        ],
      },
      {
        id: 'eth-proj',
        type: 'projects',
        title: 'Laboratory & Focus Projects',
        visible: true,
        items: [
          {
            id: 'eth-proj-1',
            title: 'Autonomous Inspection Rover (ETH Focus Project)',
            subtitle: 'Team of 8 Engineers — Perception Lead',
            location: 'Zurich, Switzerland',
            dateRange: 'Sep 2023 – May 2024',
            bullets: [
              'Integrated stereo-depth perception and real-time obstacle avoidance on NVIDIA Jetson Orin running at 30 FPS',
            ],
          },
        ],
      },
      {
        id: 'eth-skills',
        type: 'skills',
        title: 'Technical Skills & Languages',
        visible: true,
        items: [
          {
            id: 'eth-skills-1',
            title: 'Engineering & Software',
            subtitle: '',
            location: '',
            dateRange: '',
            bullets: ['C++17, Python, ROS 2, MATLAB/Simulink, PyTorch, OpenCV, Linux, Git, SolidWorks'],
          },
          {
            id: 'eth-skills-2',
            title: 'Languages (CEFR)',
            subtitle: '',
            location: '',
            dateRange: '',
            bullets: ['German (Native), English (C2), French (B2)'],
          },
        ],
      },
    ],
  },
};
