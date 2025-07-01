<template>
  <div class="assessment-result-container">
    <h1>Kết quả khảo sát của bạn</h1>
    <div v-if="result">
      <p class="score">Điểm của bạn: <span>{{ result.score }} / 10</span></p>
      <div class="suggestions">
        <h2>Đề xuất dành cho bạn:</h2>
        <div v-if="result.score < 5" class="suggestion-card danger">
          <h3>Cần hỗ trợ khẩn cấp</h3>
          <p>Điểm số của bạn cho thấy bạn có thể cần sự hỗ trợ chuyên sâu. Vui lòng liên hệ chuyên gia tư vấn ngay lập tức hoặc gọi đường dây nóng <strong>113</strong> để được giúp đỡ.</p>
          <p>Chúng tôi khuyến khán bạn tìm kiếm sự hỗ trợ từ các chuyên gia y tế hoặc tâm lý để có kế hoạch hỗ trợ phù hợp.</p>
        </div>
        <div v-else-if="result.score < 8" class="suggestion-card warning">
          <h3>Khóa học cơ bản được đề xuất</h3>
          <p>Điểm số của bạn cho thấy bạn có thể hưởng lợi từ các khóa học cơ bản về phòng chống ma túy. Các khóa học này sẽ cung cấp kiến thức nền tảng và kỹ năng cần thiết.</p>
          <p>Chúng tôi đề xuất các khóa học sau:</p>
          <ul>
            <li>Khóa học 1: Kiến thức cơ bản về ma túy</li>
            <li>Khóa học 2: Kỹ năng từ chối và đối phó</li>
            <li>Khóa học 3: Hỗ trợ cộng đồng</li>
          </ul>
          <button class="btn btn-primary">Xem các khóa học cơ bản</button>
        </div>
        <div v-else class="suggestion-card success">
          <h3>Khóa học nâng cao được đề xuất</h3>
          <p>Chúc mừng! Điểm số của bạn rất tốt. Để nâng cao hơn nữa kiến thức và kỹ năng của mình, chúng tôi khuyến nghị các khóa học nâng cao.</p>
          <p>Chúng tôi đề xuất các khóa học sau:</p>
          <ul>
            <li>Khóa học 4: Phòng chống ma túy chuyên sâu</li>
            <li>Khóa học 5: Lãnh đạo và vận động cộng đồng</li>
            <li>Khóa học 6: Hỗ trợ phục hồi</li>
          </ul>
          <button class="btn btn-primary">Xem các khóa học nâng cao</button>
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
        <div class="dialog-icon">&#9888;</div> <!-- Warning Icon -->
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

export default {
  name: 'AssessmentResultView',
  data() {
    return {
      result: null,
      showRetakeConfirmDialog: false,
    };
  },
  methods: {
    async retakeAssessment() {
      try {
        await assessmentService.deleteAssessmentResult(this.result.id);
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
  },
  async created() {
    const resultId = this.$route.params.resultId;
    if (resultId) {
      try {
        const response = await assessmentService.getResultById(resultId);
        this.result = response.data;
      } catch (error) {
        console.error('Error fetching assessment result:', error);
        alert('Không thể tải kết quả khảo sát.');
      }
    }
  },
};
</script>

<style scoped>
.assessment-result-container {
  max-width: 800px;
  margin: 40px auto;
  padding: 30px;
  background-color: #fff;
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
  color: #4CAF50; /* Green for score */
}

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
  padding: 25px;
  border-radius: 8px;
  margin-bottom: 20px;
  text-align: left;
  line-height: 1.6;
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
  background-color: rgba(0, 0, 0, 0.05);
  padding: 10px 15px;
  border-radius: 5px;
  margin-bottom: 8px;
  font-size: 0.95em;
}

.suggestion-card .btn-primary {
  display: inline-block;
  background-color: #007bff;
  color: white;
  padding: 10px 20px;
  border-radius: 5px;
  text-decoration: none;
  margin-top: 20px;
  transition: background-color 0.3s ease;
}

.suggestion-card .btn-primary:hover {
  background-color: #0056b3;
}

/* Card specific colors */
.suggestion-card.danger {
  background-color: #ffe0e0; /* Light red */
  border: 1px solid #f44336;
  color: #f44336;
}

.suggestion-card.danger h3 {
  color: #d32f2f;
}

.suggestion-card.warning {
  background-color: #fff8e1; /* Light amber */
  border: 1px solid #ffc107;
  color: #ffc107;
}

.suggestion-card.warning h3 {
  color: #ffa000;
}

.suggestion-card.success {
  background-color: #e8f5e9; /* Light green */
  border: 1px solid #4CAF50;
  color: #4CAF50;
}

.suggestion-card.success h3 {
  color: #388E3C;
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
</style>
