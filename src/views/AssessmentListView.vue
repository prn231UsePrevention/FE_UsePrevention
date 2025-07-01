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
          class="btn btn-primary"
        >
          Xem chi tiết
        </router-link>
        <router-link
          v-else
          :to="{ name: 'take-assessment', params: { id: assessment.id } }"
          class="btn btn-primary"
        >
          Làm khảo sát
        </router-link>
      </div>
    </div>
    <p v-else>No assessments available at the moment.</p>
  </div>
</template>

<script>
import assessmentService from '@/services/assessmentService';
import { mapGetters } from 'vuex'; // Assuming you are using Vuex for state management

export default {
  name: 'AssessmentListView',
  data() {
    return {
      assessments: [],
      userAssessmentResults: [],
    };
  },
  computed: {
    ...mapGetters(['userId']), // Map userId from Vuex store
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
  max-width: 1200px; /* Tăng chiều rộng tối đa để chứa nhiều thẻ hơn */
  margin: 0 auto;
  text-align: center;
  font-family: var(--font-family-sans);
}

h1 {
  text-align: center;
  margin-bottom: var(--spacing-xl);
  color: var(--text-color-primary);
  font-size: var(--font-size-h2);
  font-weight: 700; /* Đậm hơn */
}

.assessment-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); /* Thẻ rộng hơn */
  gap: var(--spacing-xl); /* Khoảng cách lớn hơn giữa các thẻ */
  margin-top: var(--spacing-lg);
}

.assessment-card {
  background-color: var(--surface-color);
  border-radius: var(--border-radius-lg); /* Bo tròn hơn */
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1); /* Đổ bóng mềm mại hơn */
  border: 1px solid var(--border-color); /* Viền nhẹ */
  padding: var(--spacing-xl); /* Tăng padding */
  text-align: center; /* Căn giữa nội dung thẻ */
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  display: flex;
  flex-direction: column;
  justify-content: space-between; /* Đẩy nút xuống dưới */
  cursor: pointer;
}

.assessment-card:hover {
  transform: translateY(-5px); /* Nâng lên nhiều hơn khi hover */
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15); /* Đổ bóng rõ hơn khi hover */
}

.assessment-card h2 {
  margin-top: 0;
  color: var(--text-color-primary);
  font-size: var(--font-size-xl); /* Giữ nguyên kích thước */
  margin-bottom: var(--spacing-sm);
  font-weight: 600; /* Đậm hơn */
}

.assessment-card p {
  color: var(--text-color-secondary);
  font-size: var(--font-size-md);
  margin-bottom: var(--spacing-lg);
  flex-grow: 1; /* Cho phép mô tả chiếm không gian còn lại */
}

.read-more-btn {
  color: var(--primary-color);
  cursor: pointer;
  font-weight: 600;
  margin-left: 5px;
}

.read-more-btn:hover {
  text-decoration: underline;
}

.btn-primary {
  background-color: var(--primary-color);
  color: white;
  padding: var(--spacing-md) var(--spacing-lg); /* Tăng padding nút */
  border-radius: var(--border-radius-md);
  text-decoration: none;
  display: block; /* Chiếm toàn bộ chiều rộng */
  width: 100%; /* Đảm bảo chiếm 100% */
  margin-top: var(--spacing-md); /* Khoảng cách trên nút */
  font-weight: 600;
  transition: background-color 0.3s ease, box-shadow 0.3s ease;
  font-size: var(--font-size-lg); /* Kích thước chữ lớn hơn */
}

.btn-primary:hover {
  background-color: var(--primary-dark);
  box-shadow: var(--shadow-1);
}
</style>
