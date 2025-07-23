<template>
  <div class="assessment-list-container">
    <h1>Available Assessments</h1>
    <div v-if="assessments.length > 0" class="assessment-cards">
      <div v-for="assessment in assessments" :key="assessment.id" class="card assessment-card">
        <h2>{{ assessment.name }}</h2>
        <p>
          {{ getDisplayedDescription(assessment) }}
          <span
            v-if="assessment.description.length > 100"
            @click.stop="toggleDescription(assessment)"
            class="read-more-btn"
          >
            {{ assessment.showFullDescription ? 'Thu gọn' : 'Xem thêm' }}
          </span>
        </p>
        <router-link
          v-if="getAssessmentResult(assessment.id)"
          :to="{ name: 'assessment-result', params: { resultId: getAssessmentResult(assessment.id).id } }"
          class="btn btn-outline-primary"
        >
          <span class="icon">&#128065;</span> Xem chi tiết
        </router-link>
        <router-link
          v-else
          :to="{ name: 'take-assessment', params: { id: assessment.id } }"
          class="btn btn-outline-primary"
        >
          <span class="icon">&#10148;</span> Làm khảo sát
        </router-link>
      </div>
    </div>
    <p v-else>No assessments available at the moment.</p>
  </div>
</template>

<script>
import assessmentService from '@/services/assessmentService';
import { useAuthStore } from '@/stores/auth';

export default {
  name: 'AssessmentListView',
  data() {
    return {
      assessments: [],
      userAssessmentResults: [],
    };
  },
  setup() {
    const authStore = useAuthStore();
    return {
      authStore
    };
  },
  computed: {
    userId() {
      return this.authStore.user ? this.authStore.user.id : null;
    }
  },
  methods: {
    getAssessmentResult(assessmentId) {
      return this.userAssessmentResults.find(result => result.assessmentId === assessmentId);
    },
    getDisplayedDescription(assessment) {
      if (assessment.showFullDescription || assessment.description.length <= 100) {
        return assessment.description;
      } else {
        return assessment.description.substring(0, 100) + '...';
      }
    },
    toggleDescription(assessment) {
      assessment.showFullDescription = !assessment.showFullDescription;
    },
  },
  async created() {
    try {
      const assessmentsResponse = await assessmentService.getAllAssessments();
      this.assessments = assessmentsResponse.data.map(assessment => ({
        ...assessment,
        showFullDescription: false, // Add new property for description toggle
      }));

      if (this.userId) {
        const resultsResponse = await assessmentService.getUserAssessmentResults(this.userId);
        this.userAssessmentResults = resultsResponse.data;
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  },
};
</script>

<style scoped>
.assessment-list-container {
  padding: var(--spacing-lg);
  max-width: 1300px; /* Tăng chiều rộng tối đa để chứa nhiều thẻ hơn */
  margin: 0 auto;
  text-align: center;
  font-family: var(--font-family-sans);
  background-color: var(--background-color-light); /* Thêm màu nền nhẹ */
  min-height: calc(100vh - var(--header-height, 0px) - var(--footer-height, 0px)); /* Đảm bảo chiều cao tối thiểu */
  display: flex;
  flex-direction: column;
  align-items: center;
}

h1 {
  text-align: center;
  margin-bottom: var(--spacing-xl);
  color: var(--text-color-primary);
  font-size: var(--font-size-h1); /* Tăng kích thước tiêu đề chính */
  font-weight: 700;
  letter-spacing: -0.5px; /* Điều chỉnh khoảng cách chữ */
}

.assessment-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); /* Điều chỉnh kích thước thẻ linh hoạt hơn */
  gap: var(--spacing-xl); /* Khoảng cách lớn hơn giữa các thẻ */
  margin-top: var(--spacing-lg);
  width: 100%; /* Đảm bảo lưới chiếm toàn bộ chiều rộng */
}

.assessment-card {
  background-color: var(--vt-c-white-mute); /* Màu xám nhạt tinh tế */
  border-radius: var(--border-radius-md); /* Độ bo tròn vừa phải */
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08); /* Đổ bóng rõ ràng hơn, mềm mại */
  border: 1px solid var(--border-color-light); /* Viền nhẹ hơn */
  padding: var(--spacing-xl); /* Giữ nguyên padding */
  text-align: left; /* Căn trái nội dung thẻ */
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  cursor: pointer;
  overflow: hidden;
}

.assessment-card:hover {
  transform: translateY(-4px); /* Nâng lên vừa phải khi hover */
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12); /* Đổ bóng rõ hơn khi hover */
}

.assessment-card h2 {
  margin-top: 0;
  color: var(--text-color-primary);
  font-size: var(--font-size-xl);
  margin-bottom: var(--spacing-sm); /* Đảm bảo khoảng cách dưới tiêu đề */
  font-weight: 600;
  line-height: 1.3;
}

.assessment-card p {
  color: var(--text-color-secondary);
  font-size: var(--font-size-md);
  line-height: 1.6;
  margin-bottom: var(--spacing-lg); /* Đảm bảo khoảng cách dưới đoạn văn */
  flex-grow: 1;
}

.read-more-btn {
  color: var(--primary-color);
  cursor: pointer;
  font-weight: 600;
  margin-left: 5px;
  text-decoration: none;
}

.read-more-btn:hover {
  text-decoration: underline;
  color: var(--primary-dark);
}

.btn-outline-primary {
  background-color: transparent; /* Nền trong suốt */
  color: var(--primary-color); /* Chữ màu chính */
  border: 2px solid var(--primary-color); /* Viền màu chính */
  padding: var(--spacing-sm) var(--spacing-md); /* Padding vừa phải */
  border-radius: 9999px; /* Bo tròn hoàn toàn (pill shape) */
  text-decoration: none;
  display: flex; /* Dùng flexbox để căn giữa icon và chữ */
  align-items: center;
  justify-content: center;
  width: 100%;
  margin-top: var(--spacing-md);
  font-weight: 600;
  transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease, transform 0.2s ease;
  font-size: var(--font-size-md); /* Kích thước chữ vừa phải */
  cursor: pointer;
}

.btn-outline-primary:hover {
  background-color: var(--primary-color); /* Nền màu chính khi hover */
  color: white; /* Chữ màu trắng khi hover */
  border-color: var(--primary-color); /* Giữ nguyên màu viền hoặc thay đổi nếu muốn */
  transform: translateY(-1px); /* Nâng nhẹ nút khi hover */
}

.btn-outline-primary .icon {
  margin-right: var(--spacing-xs); /* Khoảng cách giữa icon và chữ */
  font-size: var(--font-size-md); /* Kích thước icon */
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .assessment-cards {
    grid-template-columns: 1fr;
  }
  .assessment-card {
    margin: 0 var(--spacing-md);
  }
  h1 {
    font-size: var(--font-size-h2);
  }
}

</style>
