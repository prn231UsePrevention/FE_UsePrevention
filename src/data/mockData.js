export const mockCourses = [
  {
    id: 'c1',
    name: 'Nhận thức về Ma túy và Tác hại',
    description: 'Khóa học cung cấp kiến thức cơ bản về các loại ma túy, tác hại của chúng đối với sức khỏe, gia đình và xã hội.',
    location: 'Online',
    startDate: '2025-07-10',
    endDate: '2025-07-15',
    targetAudience: ['Học sinh', 'Sinh viên', 'Phụ huynh'],
    imageUrl: 'https://via.placeholder.com/300x200?text=Course+1'
  },
  {
    id: 'c2',
    name: 'Kỹ năng Phòng tránh và Từ chối Ma túy',
    description: 'Học cách nhận diện các tình huống nguy hiểm và phát triển kỹ năng từ chối ma túy một cách hiệu quả.',
    location: 'Online',
    startDate: '2025-07-20',
    endDate: '2025-07-25',
    targetAudience: ['Học sinh', 'Sinh viên'],
    imageUrl: 'https://via.placeholder.com/300x200?text=Course+2'
  },
  {
    id: 'c3',
    name: 'Hỗ trợ Con cái Phòng chống Ma túy',
    description: 'Khóa học dành cho phụ huynh, cung cấp kiến thức và kỹ năng để hỗ trợ con cái tránh xa ma túy.',
    location: 'Online',
    startDate: '2025-08-01',
    endDate: '2025-08-05',
    targetAudience: ['Phụ huynh'],
    imageUrl: 'https://via.placeholder.com/300x200?text=Course+3'
  },
  {
    id: 'c4',
    name: 'Vai trò của Giáo viên trong Phòng chống Ma túy Học đường',
    description: 'Nâng cao năng lực cho giáo viên trong việc giáo dục và phòng ngừa ma túy trong môi trường học đường.',
    location: 'Online',
    startDate: '2025-08-10',
    endDate: '2025-08-15',
    targetAudience: ['Giáo viên'],
    imageUrl: 'https://via.placeholder.com/300x200?text=Course+4'
  }
];

export const mockSurveys = [
  {
    id: 's1',
    name: 'Khảo sát ASSIST',
    description: 'Đánh giá mức độ sử dụng rượu, thuốc lá và các chất gây nghiện khác.',
    questions: [
      { id: 1, text: 'Trong 3 tháng qua, bạn đã sử dụng chất nào sau đây?', type: 'checkbox', options: ['Rượu', 'Thuốc lá', 'Cần sa', 'Ma túy đá', 'Heroin', 'Không có'] },
      { id: 2, text: 'Bạn có cảm thấy cần phải sử dụng chất đó thường xuyên hơn không?', type: 'radio', options: ['Có', 'Không'] }
    ]
  },
  {
    id: 's2',
    name: 'Khảo sát CRAFFT',
    description: 'Sàng lọc nguy cơ sử dụng chất gây nghiện ở thanh thiếu niên.',
    questions: [
      { id: 1, text: 'Bạn đã bao giờ lái xe (hoặc đi xe) với người đang sử dụng chất gây nghiện chưa?', type: 'radio', options: ['Có', 'Không'] },
      { id: 2, text: 'Bạn có sử dụng chất gây nghiện để thư giãn không?', type: 'radio', options: ['Có', 'Không'] }
    ]
  }
];

export const mockConsultants = [
  {
    id: 'con1',
    name: 'Nguyễn Thị A',
    specialization: 'Tư vấn tâm lý, Nghiện chất',
    degree: 'Thạc sĩ Tâm lý học',
    availability: [
      { date: '2025-07-10', time: ['09:00', '10:00', '14:00'] },
      { date: '2025-07-11', time: ['11:00', '15:00'] }
    ],
    bio: 'Chuyên gia tư vấn với 10 năm kinh nghiệm trong lĩnh vực hỗ trợ người nghiện và gia đình.'
  },
  {
    id: 'con2',
    name: 'Trần Văn B',
    specialization: 'Tư vấn pháp lý, Hỗ trợ tái hòa nhập cộng đồng',
    degree: 'Cử nhân Luật',
    availability: [
      { date: '2025-07-10', time: ['13:00', '16:00'] },
      { date: '2025-07-12', time: ['09:00', '10:00'] }
    ],
    bio: 'Cung cấp tư vấn pháp lý và hỗ trợ tái hòa nhập cho những người đã hoàn thành cai nghiện.'
  }
];

export const mockAdminDashboardData = {
  totalUsers: 1250,
  activeCourses: 4,
  pendingAppointments: 12,
  completedSurveys: 870,
  recentActivities: [
    { id: 1, type: 'Đăng ký khóa học', user: 'Nguyễn Văn C', item: 'Kỹ năng Phòng tránh', date: '2025-07-08' },
    { id: 2, type: 'Đặt lịch hẹn', user: 'Lê Thị D', item: 'Nguyễn Thị A', date: '2025-07-07' },
    { id: 3, type: 'Hoàn thành khảo sát', user: 'Phạm Văn E', item: 'ASSIST', date: '2025-07-06' }
  ]
};

export const mockBlogPosts = [
  {
    id: 'blog1',
    title: 'Hiểu đúng về ma túy tổng hợp',
    author: 'Nguyễn Thị A',
    date: '2025-06-20',
    excerpt: 'Ma túy tổng hợp đang trở thành mối lo ngại lớn trong cộng đồng. Bài viết này sẽ giúp bạn hiểu rõ hơn về các loại ma túy tổng hợp phổ biến và tác hại của chúng.',
    content: '<p>Ma túy tổng hợp là những chất được tổng hợp hóa học, có tác dụng kích thích thần kinh trung ương, gây ảo giác, hoang tưởng. Các loại phổ biến bao gồm: Amphetamine, Methamphetamine (ma túy đá), Ecstasy (thuốc lắc), Ketamine...</p><p>Tác hại của ma túy tổng hợp rất nghiêm trọng, ảnh hưởng đến sức khỏe thể chất và tinh thần, gây ra các bệnh về tim mạch, thần kinh, tâm thần. Người sử dụng có thể bị lệ thuộc nhanh chóng, dẫn đến hành vi bạo lực, phạm tội.</p><p>Để phòng tránh, cần nâng cao nhận thức, tránh xa các môi trường có nguy cơ, và tìm kiếm sự giúp đỡ khi cần thiết.</p>\n'
  },
  {
    id: 'blog2',
    title: 'Kỹ năng từ chối ma túy cho thanh thiếu niên',
    author: 'Trần Văn B',
    date: '2025-06-15',
    excerpt: 'Thanh thiếu niên là đối tượng dễ bị lôi kéo vào con đường ma túy. Việc trang bị kỹ năng từ chối là vô cùng quan trọng để bảo vệ bản thân.',
    content: '<p>Áp lực từ bạn bè là một trong những nguyên nhân chính khiến thanh thiếu niên thử ma túy. Để từ chối hiệu quả, bạn cần:</p><ul><li>Nói \"Không\" một cách rõ ràng và dứt khoát.</li><li>Đưa ra lý do chính đáng (ví dụ: \"Tôi không muốn làm hại sức khỏe của mình\").</li><li>Đề xuất một hoạt động khác.</li><li>Tránh xa tình huống hoặc rời đi nếu cần.</li><li>Tìm kiếm sự hỗ trợ từ người lớn đáng tin cậy.</li></ul><p>Hãy nhớ rằng, việc từ chối ma túy là một hành động dũng cảm và thể hiện sự tự trọng.</p>\n'
  }
];

export const mockUserParticipations = {
  registeredCourses: [
    { id: 'uc1', courseId: 'c1', registrationDate: '2025-07-01', status: 'Đã đăng ký' },
    { id: 'uc2', courseId: 'c3', registrationDate: '2025-07-05', status: 'Đã hoàn thành' }
  ],
  bookedAppointments: [
    { id: 'ua1', consultantId: 'con1', appointmentDate: '2025-07-12', time: '10:00', status: 'Đã xác nhận' },
    { id: 'ua2', consultantId: 'con2', appointmentDate: '2025-07-15', time: '14:00', status: 'Đã hủy' }
  ]
};

export const mockCommunityPrograms = [
  {
    id: 'cp1',
    name: 'Chương trình Tuyên truyền tại Trường học X',
    description: 'Chương trình giáo dục trực tiếp về tác hại của ma túy và kỹ năng phòng tránh cho học sinh cấp 2.',
    location: 'Trường THCS X, Quận Y',
    date: '2025-09-10',
    organizer: 'Tổ chức Tình nguyện ABC',
    targetAudience: ['Học sinh', 'Giáo viên'],
    imageUrl: 'https://via.placeholder.com/400x250?text=Community+Program+1',
    preSurveyId: 's1', // Link to a mock survey
    postSurveyId: 's2' // Link to another mock survey
  },
  {
    id: 'cp2',
    name: 'Hội thảo Cộng đồng: Gia đình và Phòng chống Ma túy',
    description: 'Hội thảo chuyên sâu dành cho phụ huynh và người chăm sóc về vai trò của gia đình trong việc bảo vệ con em khỏi ma túy.',
    location: 'Trung tâm Văn hóa Z, Thành phố A',
    date: '2025-10-05',
    organizer: 'Sở Lao động - Thương binh và Xã hội',
    targetAudience: ['Phụ huynh', 'Cộng đồng'],
    imageUrl: 'https://via.placeholder.com/400x250?text=Community+Program+2',
    preSurveyId: null,
    postSurveyId: 's1'
  },
  {
    id: 'cp3',
    name: 'Chiến dịch Truyền thông Online: Nói Không với Ma Túy',
    description: 'Chiến dịch truyền thông trên các nền tảng mạng xã hội nhằm nâng cao nhận thức về phòng chống ma túy trong giới trẻ.',
    location: 'Online',
    date: '2025-11-01',
    organizer: 'Bộ Y tế',
    targetAudience: ['Thanh thiếu niên', 'Cộng đồng'],
    imageUrl: 'https://via.placeholder.com/400x250?text=Community+Program+3',
    preSurveyId: null,
    postSurveyId: null
  },
  {
    id: 'cp4',
    name: 'Tọa đàm: Ma túy và Sức khỏe Vị thành niên',
    description: 'Tọa đàm trực tuyến với các chuyên gia y tế và tâm lý, thảo luận về ảnh hưởng của ma túy đến sức khỏe vị thành niên và cách phòng ngừa.',
    location: 'Online (Zoom)',
    date: '2025-11-15',
    organizer: 'Hội Y học Dự phòng',
    targetAudience: ['Thanh thiếu niên', 'Phụ huynh', 'Giáo viên'],
    imageUrl: 'https://via.placeholder.com/400x250?text=Community+Program+4',
    preSurveyId: 's1',
    postSurveyId: 's2'
  },
  {
    id: 'cp5',
    name: 'Ngày hội Sức khỏe Cộng đồng: Chung tay đẩy lùi Ma túy',
    description: 'Sự kiện ngoài trời với các hoạt động thể thao, văn nghệ, và gian hàng tư vấn về phòng chống ma túy.',
    location: 'Công viên Thống Nhất, Hà Nội',
    date: '2025-12-01',
    organizer: 'Ủy ban Quốc gia phòng, chống AIDS và tệ nạn ma túy, mại dâm',
    targetAudience: ['Cộng đồng', 'Gia đình'],
    imageUrl: 'https://via.placeholder.com/400x250?text=Community+Program+5',
    preSurveyId: null,
    postSurveyId: 's1'
  }
];