<template>
  <!-- Re-parsing trigger -->
  <div class="assessment-result-container">
    <h1>Kết quả khảo sát của bạn</h1>
    <div v-if="result">
      <p class="score">Điểm của bạn: <span>{{ result.score }} / 10</span></p>
      <p class="score">Hạng của bạn: <span :class="gradeClass">{{ courseGrade }}</span></p>

      <div v-if="result.score === 0" class="suggestion-card danger">
        <h3>Cần hỗ trợ khẩn cấp!</h3>
        <p>Điểm số của bạn cho thấy bạn đang ở trong tình trạng cần sự hỗ trợ chuyên sâu ngay lập tức. Vui lòng liên hệ chuyên gia tư vấn hoặc gọi đường dây nóng <strong>113</strong> để được giúp đỡ khẩn cấp.</p>
        <p><strong>Hành động ngay:</strong> Chúng tôi khuyến khích bạn tìm kiếm sự hỗ trợ từ các chuyên gia y tế hoặc tâm lý để có kế hoạch can thiệp phù hợp và kịp thời.</p>
      </div>

      <div v-else class="suggestions">
        <h2>Đề xuất dành cho bạn</h2>

        <!-- Detailed Suggestion Text -->
        <div class="suggestion-card" :class="gradeClass">
          <h3>Lời khuyên chi tiết</h3>
          <p>{{ suggestionDetails.text }}</p>
        </div>

        <!-- Suggested Courses -->
        <div v-if="suggestedCourses.length > 0" class="mt-6">
    <h3 class="text-xl font-semibold">Các khóa học được đề xuất</h3>
    <div class="suggested-courses-grid">
        <div v-for="course in suggestedCourses" :key="course.id" class="course-card">
            <img v-if="course.imageUrl" :src="course.imageUrl" alt="Course Image" class="course-card-image">
            <div class="course-card-content">
                <h4 class="course-card-title">{{ course.title }}</h4>
                <p class="course-card-description">{{ course.description }}</p>
                <router-link :to="{ name: 'course-detail', params: { id: course.id } }" class="course-card-link">
                    Xem chi tiết
                </router-link>
            </div>
        </div>
    </div>
</div>
        <div v-else class="suggestion-card">
          <h3>Không có khóa học nào được đề xuất</h3>
          <p>Hiện tại không có khóa học nào phù hợp với hạng của bạn. Hãy khám phá các tài nguyên khác của chúng tôi.</p>
        </div>

        <!-- Suggested Community Programs -->
        <div v-if="suggestedCommunityPrograms.length > 0" class="suggestion-card info">
          <h3>Chương trình cộng đồng</h3>
          <p>Tham gia các chương trình cộng đồng có thể giúp bạn kết nối và nhận được sự hỗ trợ từ những người có cùng hoàn cảnh:</p>
          <ul>
            <li v-for="program in suggestedCommunityPrograms" :key="program.id">{{ program.title }}</li>
          </ul>
          <router-link to="/community-programs" class="btn btn-info">Khám phá chương trình cộng đồng</router-link>
        </div>

        <!-- Suggestion for consulting a doctor if score is less than 5 -->
        <div v-if="result.score < 5" class="suggestion-card danger">
          <h3>Cần tư vấn chuyên gia</h3>
          <p>Điểm số của bạn cho thấy bạn có thể cần sự hỗ trợ từ chuyên gia. Chúng tôi khuyến khích bạn đặt lịch hẹn với bác sĩ tư vấn để được hỗ trợ kịp thời.</p>
          <router-link :to="{ name: 'appointments' }" class="btn btn-danger">Đặt lịch tư vấn ngay</router-link>
        </div>
      </div>

      <button @click="showRetakeConfirmDialog = true" class="btn btn-secondary retake-button">Làm lại khảo sát</button>
    </div>
    <div v-else>
      <p>Đang tải kết quả...</p>
    </div>

    <!-- Custom Confirmation Dialog -->
    <div v-if="showRetakeConfirmDialog" class="custom-dialog-overlay">
      <div class="custom-dialog">
        <div class="dialog-icon">&#9888;</div>
        <h3>Xác nhận làm lại khảo sát</h3>
        <p>Bạn có chắc chắn muốn làm lại khảo sát? Kết quả hiện tại sẽ bị xóa vĩnh viễn.</p>
        <div class="dialog-actions">
          <button @click="confirmRetake" class="btn btn-danger">Có</button>
          <button @click="cancelRetake" class="btn btn-secondary">Không</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import assessmentService from '@/services/assessmentService';
import courseService from '@/services/courseService';
import { getAllCommunityPrograms } from '@/services/communityProgramService'; // Import service

export default {
  name: 'AssessmentResultView',
  data() {
    return {
      result: null,
      showRetakeConfirmDialog: false,
      allCourses: [],
      allCommunityPrograms: [], // Add state for community programs
    };
  },
  computed: {
    courseGrade() {
      if (!this.result) return '';
      if (this.result.score >= 9) return 'A';
      if (this.result.score >= 7) return 'B';
      if (this.result.score >= 5) return 'C';
      return 'D';
    },
    suggestedCourses() {
      return this.allCourses.filter(course => course.courseGrade && course.courseGrade === this.courseGrade);
    },
    suggestedCommunityPrograms() {
      // Suggest programs for those with lower scores
      if (this.courseGrade === 'C' || this.courseGrade === 'D') {
        return this.allCommunityPrograms;
      }
      return [];
    },
    gradeClass() {
      switch (this.courseGrade) {
        case 'A':
        case 'B':
          return 'success';
        case 'C':
          return 'warning';
        case 'D':
          return 'danger';
        default:
          return '';
      }
    },
    suggestionDetails() {
      switch (this.courseGrade) {
        case 'A':
          return {
            text: 'Xuất sắc! Điểm số từ 9-10 cho thấy bạn có sức khỏe tinh thần rất tốt và khả năng phục hồi cao. Hãy tiếp tục phát huy những thói quen tích cực này và lan tỏa năng lượng đến mọi người xung quanh.'
          };
        case 'B':
          return {
            text: 'Khá tốt! Với điểm số từ 7-8, bạn đang làm tốt việc chăm sóc sức khỏe tinh thần của mình. Một vài khóa học bổ sung có thể giúp bạn hoàn thiện hơn nữa các kỹ năng cần thiết.'
          };
        case 'C':
          return {
            text: 'Cần chú ý. Điểm số từ 5-6 cho thấy có một vài vấn đề bạn cần quan tâm. Đây là lúc để tìm hiểu các phương pháp đối phó mới và cân nhắc tham gia các chương trình hỗ trợ của chúng tôi.'
          };
        case 'D':
          return {
            text: 'Cần cải thiện. Điểm số dưới 5 cho thấy bạn có thể đang đối mặt với nhiều thách thức. Đừng ngần ngại tìm kiếm sự giúp đỡ. Các khóa học và chương trình cộng đồng của chúng tôi luôn sẵn sàng hỗ trợ bạn.'
          };
        default:
          return { text: '' };
      }
    }
  },
  methods: {
    async retakeAssessment() {
      try {
        const token = localStorage.getItem('token');
        await assessmentService.deleteAssessmentResult(this.result.id, token);
        this.$router.push({ name: 'take-assessment', params: { id: this.result.assessmentId } });
      } catch (error) {
        console.error('Error retaking assessment:', error);
        alert('Không thể làm lại khảo sát. Vui lòng thử lại sau.');
      }
    },
    confirmRetake() {
      this.showRetakeConfirmDialog = false;
      this.retakeAssessment();
    },
    cancelRetake() {
      this.showRetakeConfirmDialog = false;
    },
    async fetchAllData() {
      try {
        // Fetch courses and programs in parallel
        const [coursesResponse, programsResponse] = await Promise.all([
          courseService.getAllCourses(),
          getAllCommunityPrograms()
        ]);
        console.log('Type of coursesResponse before assignment:', typeof coursesResponse, 'Is Array:', Array.isArray(coursesResponse));
        this.allCourses = coursesResponse || [];
        this.allCommunityPrograms = programsResponse || [];
        console.log('Courses and community programs fetched successfully');
        console.log('Courses (raw response):', coursesResponse);
        console.log('this.allCourses after assignment:', this.allCourses);
        console.log('Type of this.allCourses after assignment:', typeof this.allCourses, 'Is Array:', Array.isArray(this.allCourses));
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
  },
  async created() {
    const resultId = this.$route.params.resultId;
    const token = localStorage.getItem('token');
    if (resultId && token) {
      try {
        const response = await assessmentService.getResultById(resultId, token);
        this.result = response.data;
        await this.fetchAllData(); // Fetch all required data
      } catch (error) {
        console.error('Error fetching assessment result:', error);
        if (error.response && error.response.status === 404) {
          alert('Không tìm thấy kết quả khảo sát.');
          this.$router.push({ name: 'assessment-list' });
        } else {
        alert('Không thể tải kết quả khảo sát.');
      }
    }
    } else {
      // Handle case where resultId or token is missing
      this.$router.push({ name: 'login' });
    }
  },
};
</script>

<style scoped>
.assessment-result-container {
  max-width: 800px;
  margin: 40px auto;
  padding: 30px;
  background-color: #f9f9f9;
  border-radius: 10px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  text-align: center;
  font-family: 'Arial', sans-serif;
}

h1 {
  color: #333;
  margin-bottom: 20px;
  font-size: 2.2em;
}

.score {
  font-size: 1.8em;
  color: #555;
  margin-bottom: 30px;
}

.score span {
  font-weight: bold;
}

.score span.success { color: #388E3C; }
.score span.warning { color: #ffa000; }
.score span.danger { color: #d32f2f; }


.suggestions {
  margin-top: 40px;
  border-top: 1px solid #eee;
  padding-top: 30px;
}

.suggestions h2 {
  color: #333;
  margin-bottom: 25px;
  font-size: 1.8em;
}

.suggestion-card {
  background-color: #fff;
  padding: 25px;
  border-radius: 8px;
  margin-bottom: 25px;
  text-align: left;
  line-height: 1.6;
  border-left: 5px solid;
}

.suggestion-card h3 {
  margin-top: 0;
  font-size: 1.5em;
  margin-bottom: 15px;
}

.suggestion-card ul {
  list-style: none;
  padding: 0;
  margin-top: 15px;
}

.suggestion-card ul li {
  background-color: rgba(0, 0, 0, 0.03);
  padding: 10px 15px;
  border-radius: 5px;
  margin-bottom: 8px;
  font-size: 0.95em;
}

.btn {
  display: inline-block;
    font-weight: 400;
    text-align: center;
    white-space: nowrap;
    vertical-align: middle;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    border: 1px solid transparent;
    padding: 0.375rem 0.75rem;
    font-size: 1rem;
    line-height: 1.5;
    border-radius: 0.25rem;
    text-decoration: none;
    transition: color .15s ease-in-out,background-color .15s ease-in-out,border-color .15s ease-in-out,box-shadow .15s ease-in-out;
}

.btn-primary {
  background-color: #007bff;
  color: white;
  margin-top: 20px;
}

.btn-primary:hover {
  background-color: #0056b3;
}

.btn-info {
    color: #fff;
    background-color: #17a2b8;
    border-color: #17a2b8;
    margin-top: 20px;
}

.btn-info:hover {
    color: #fff;
    background-color: #138496;
    border-color: #117a8b;
}


/* Card specific colors */
.suggestion-card.danger {
  border-left-color: #f44336;
}

.suggestion-card.danger h3 {
  color: #d32f2f;
}

.suggestion-card.warning {
  border-left-color: #ffc107;
}

.suggestion-card.warning h3 {
  color: #ffa000;
}

.suggestion-card.success {
  border-left-color: #4CAF50;
}

.suggestion-card.success h3 {
  color: #388E3C;
}

.suggestion-card.info {
    border-left-color: #17a2b8;
}

.suggestion-card.info h3 {
    color: #138496;
}


.retake-button {
  margin-top: 30px;
  padding: 12px 25px;
  font-size: 1.1em;
  background-color: #6c757d; /* Grey */
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.retake-button:hover {
  background-color: #5a6268;
}

/* Custom Dialog Styles */
.custom-dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6); /* Darker overlay */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.custom-dialog {
  background-color: #fff;
  padding: 40px;
  border-radius: 10px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2); /* Stronger shadow */
  text-align: center;
  max-width: 450px; /* Slightly wider */
  width: 90%;
  transform: translateY(-20px); /* Slight lift animation */
  animation: dialog-open 0.3s ease-out forwards;
}

@keyframes dialog-open {
  from {
    opacity: 0;
    transform: translateY(-50px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.dialog-icon {
  font-size: 3em; /* Larger icon */
  color: #ffc107; /* Warning color */
  margin-bottom: 20px;
}

.custom-dialog h3 {
  margin-top: 0;
  color: #333;
  font-size: 1.8em;
  margin-bottom: 15px;
}

.custom-dialog p {
  color: #555;
  margin-bottom: 30px;
  line-height: 1.6;
}

.dialog-actions button {
  margin: 0 10px;
  padding: 12px 25px;
  border-radius: 5px;
  font-size: 1em;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

.dialog-actions .btn-danger {
  background-color: #dc3545;
  color: white;
  border: none;
}

.dialog-actions .btn-danger:hover {
  background-color: #c82333;
  transform: translateY(-2px);
}

.dialog-actions .btn-secondary {
  background-color: #6c757d;
  color: white;
  border: none;
}

.dialog-actions .btn-secondary:hover {
  background-color: #5a6268;
  transform: translateY(-2px);
}
.suggested-courses-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 25px; /* Tăng khoảng cách giữa các card */
  margin-top: 30px; /* Tăng khoảng cách trên */
}

.course-card {
  background-color: #fff;
  border-radius: 12px; /* Bo tròn góc nhiều hơn */
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.12); /* Đổ bóng mạnh hơn */
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out; /* Thêm transition cho box-shadow */
  border: 1px solid #e0e0e0; /* Thêm đường viền nhẹ */
}

.course-card:hover {
  transform: translateY(-8px); /* Nâng card lên cao hơn khi hover */
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.18); /* Đổ bóng mạnh hơn khi hover */
}

.course-card-image {
  width: 100%;
  height: 190px; /* Chiều cao hình ảnh lớn hơn */
  object-fit: cover;
  border-bottom: 1px solid #f0f0f0; /* Đường viền dưới hình ảnh */
}

.course-card-content {
  padding: 20px; /* Tăng padding */
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.course-card-title {
  font-size: 1.4em; /* Tiêu đề lớn hơn */
  font-weight: 600; /* Chữ đậm hơn */
  color: #2c3e50; /* Màu chữ tối hơn */
  margin-top: 0;
  margin-bottom: 12px;
  min-height: 60px; /* Đảm bảo chiều cao nhất quán cho tiêu đề */
  line-height: 1.3; /* Khoảng cách dòng */
}

.course-card-description {
  font-size: 0.95em; /* Mô tả lớn hơn một chút */
  color: #7f8c8d; /* Màu chữ xám hơn */
  line-height: 1.6;
  flex-grow: 1;
  margin-bottom: 20px; /* Tăng khoảng cách dưới */
}

.course-card-link {
  display: inline-block;
  background-color: #3498db; /* Màu xanh dương đẹp hơn */
  color: white;
  padding: 10px 20px; /* Tăng padding */
  border-radius: 6px; /* Bo tròn góc nhiều hơn */
  text-decoration: none;
  font-size: 1em; /* Kích thước chữ lớn hơn */
  font-weight: 500; /* Chữ đậm vừa */
  align-self: flex-start;
  transition: background-color 0.2s ease, transform 0.2s ease;
}

.course-card-link:hover {
  background-color: #2980b9; /* Màu xanh đậm hơn khi hover */
  transform: translateY(-2px); /* Nâng nhẹ nút khi hover */
}

</style>
