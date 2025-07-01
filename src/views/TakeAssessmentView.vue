<template>
  <div class="assessment-page-layout">
    <aside class="assessment-sidebar">
      <h2>Thông tin khảo sát</h2>
      <div class="info-item">
        <strong>Số lượng câu hỏi:</strong> {{ questions.length }}
      </div>
      <div class="question-navigation">
        <h4>Danh sách câu hỏi:</h4>
        <div class="question-grid">
          <button
            v-for="(question, index) in questions"
            :key="question.id"
            @click="scrollToQuestion(question.id)"
            :class="{ 'question-button': true, 'unanswered': !userAnswers[question.id] }"
          >
            {{ index + 1 }}
          </button>
        </div>
      </div>
      <div class="info-item">
        <strong>Thời gian làm bài:</strong> {{ formatTime(timeTaken) }}
      </div>
      <button @click="submitAssessment" class="btn btn-success submit-button">Nộp bài</button>
    </aside>

    <div class="main-content">
      <h1 v-if="assessment">{{ assessment.name }}</h1>
      <p v-if="assessment">{{ assessment.description }}</p>

      <div v-if="questions.length > 0" class="questions-list">
        <div v-for="(question, index) in questions" :key="question.id" class="card question-card" :id="`question-${question.id}`">
          <p class="question-text">{{ index + 1 }}. {{ question.content }}</p>
          <div class="answer-options">
            <div v-if="question.type === 'MultipleChoice'">
              <div v-for="option in question.options.split(',')" :key="option.trim()" class="form-check">
                <input
                  class="form-check-input"
                  type="radio"
                  :name="`question-${question.id}`"
                  :id="`option-${question.id}-${option.trim()}`"
                  :value="option.trim()"
                  v-model="userAnswers[question.id]"
                />
                <label class="form-check-label" :for="`option-${question.id}-${option.trim()}`">
                  {{ option.trim() }}
                </label>
              </div>
            </div>
            <div v-else-if="question.type === 'Text'">
              <input type="text" class="form-control" v-model="userAnswers[question.id]" placeholder="Câu trả lời của bạn" />
            </div>
          </div>
          <button @click="clearAnswer(question.id)" class="btn btn-sm btn-outline-secondary clear-answer-btn">Xóa câu trả lời</button>
        </div>
      </div>
      <p v-else>Đang tải câu hỏi...</p>
    </div>

    <!-- Custom Validation Dialog -->
    <div v-if="showValidationDialog" class="validation-dialog-overlay">
      <div class="validation-dialog">
        <h3>Lỗi xác thực</h3>
        <p>Vui lòng trả lời tất cả các câu hỏi trước khi nộp bài đánh giá.</p>
        <button @click="showValidationDialog = false" class="btn btn-primary">Đồng ý</button>
      </div>
    </div>
  </div>
</template>

<script>
import assessmentService from '@/services/assessmentService';
import { useAuthStore } from '@/stores/auth';
import { mapGetters } from 'vuex'; // Import mapGetters

export default {
  name: 'TakeAssessmentView',
  data() {
    return {
      assessment: null,
      questions: [],
      userAnswers: {},
      showValidationDialog: false,
      timeTaken: 0, // in seconds
      timerInterval: null,
    };
  },
  computed: {
    ...mapGetters(['userId']), // Map userId from Vuex store
  },
  async created() {
    const assessmentId = parseInt(this.$route.params.id);
    const authStore = useAuthStore();
    const userId = authStore.user?.id; // Get userId from authStore

    if (!userId) {
      alert('User not logged in. Please log in to take the assessment.');
      this.$router.push({ name: 'login' }); // Redirect to login page
      return;
    }

    try {
      // Check if the user has already taken this assessment
      const userResultsResponse = await assessmentService.getUserAssessmentResults(userId);
      const existingResult = userResultsResponse.data.find(result => result.assessmentId === assessmentId);

      if (existingResult) {
        this.$router.push({ name: 'assessment-result', params: { resultId: existingResult.id } });
        return;
      }

      const assessmentResponse = await assessmentService.getAssessmentById(assessmentId);
      this.assessment = assessmentResponse.data;

      const questionsResponse = await assessmentService.getQuestionsForAssessment(assessmentId);
      this.questions = questionsResponse.data;

      // Initialize userAnswers with empty values
      this.questions.forEach(q => {
        this.userAnswers[q.id] = null;
      });

      this.startTimer();

    } catch (error) {
      console.error('Error fetching assessment or questions:', error);
      alert('Failed to load assessment. Please try again later.');
      this.$router.push({ name: 'assessments' }); // Redirect to assessment list on error
    }
  },
  beforeUnmount() {
    this.stopTimer();
  },
  methods: {
    startTimer() {
      this.timerInterval = setInterval(() => {
        this.timeTaken++;
      }, 1000);
    },
    stopTimer() {
      if (this.timerInterval) {
        clearInterval(this.timerInterval);
        this.timerInterval = null;
      }
    },
    formatTime(seconds) {
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = seconds % 60;
      return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    },
    scrollToQuestion(questionId) {
      const element = document.getElementById(`question-${questionId}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    },
    clearAnswer(questionId) {
      this.userAnswers[questionId] = null;
    },
    async submitAssessment() {
      const authStore = useAuthStore();
      const userId = authStore.user.id;

      if (!userId) {
        alert('User not logged in.');
        return;
      }

      // Validate that all questions have been answered
      const allAnswered = this.questions.every(q => {
        const answer = this.userAnswers[q.id];
        return answer !== null && answer !== undefined && answer !== '';
      });

      if (!allAnswered) {
        this.showValidationDialog = true;
        return;
      }

      const answers = Object.keys(this.userAnswers).map(questionId => ({
        questionId: parseInt(questionId),
        value: this.userAnswers[questionId],
      }));

      const submissionData = {
        userId: userId,
        assessmentId: this.assessment.id,
        answers: answers,
      };

      try {
        const result = await assessmentService.submitAssessment(submissionData);
        alert('Assessment submitted successfully!');
        this.$router.push({ name: 'assessment-result', params: { resultId: result.data.id } });
      } catch (error) {
        console.error('Error submitting assessment:', error);
        alert('Failed to submit assessment.');
      }
    },
  },
};
</script>

<style scoped>
:root {
  --primary-color: #4CAF50; /* Green */
  --primary-dark: #43A047;
  --primary-light: #A5D6A7;
  --secondary-color: #2196F3; /* Blue */
  --secondary-dark: #1976D2;
  --success-color: #4CAF50;
  --success-dark: #388E3C;
  --danger-color: #F44336; /* Red */
  --warning-color: #FFC107; /* Amber */
  --warning-light: #FFECB3;

  --text-color-primary: #333;
  --text-color-secondary: #555;
  --text-color-light: #fff;

  --background-color-light: #f5f5f5;
  --background-color-dark: #e0e0e0;
  --surface-color: #ffffff;
  --border-color: #e0e0e0;

  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
  --spacing-xl: 32px;

  --border-radius-sm: 4px;
  --border-radius-md: 8px;
  --border-radius-lg: 12px;

  --font-family-sans: 'Arial', sans-serif;
  --font-size-sm: 0.875rem;
  --font-size-md: 1rem;
  --font-size-lg: 1.125rem;
  --font-size-h1: 2.5rem;
  --font-size-h2: 2rem;
  --font-size-h3: 1.75rem;

  --shadow-1: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
  --shadow-2: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);
  --shadow-3: 0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23);
}

/* New Layout Styles */
.assessment-page-layout {
  display: flex;
  min-height: calc(100vh - var(--header-height) - var(--footer-height));
  background-color: var(--background-color-light);
  padding: var(--spacing-lg);
  gap: var(--spacing-lg);
}

.assessment-sidebar {
  width: 300px; /* Slightly wider */
  padding: var(--spacing-xl);
  background-color: var(--surface-color);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-3); /* More prominent shadow */
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  flex-shrink: 0;
}

.assessment-sidebar h2 {
  color: var(--text-color-primary);
  font-size: var(--font-size-h3);
  margin-bottom: var(--spacing-md);
  text-align: center;
}

.assessment-sidebar .info-item {
  background-color: var(--background-color-dark);
  padding: var(--spacing-md);
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-md);
  color: var(--text-color-light);
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: var(--shadow-1);
}

.assessment-sidebar .info-item strong {
  color: var(--text-color-primary);
}

.question-navigation ul {
  list-style: none;
  padding: 0;
  margin-top: var(--spacing-sm);
}

.question-navigation li a {
  display: block;
  padding: var(--spacing-xs) var(--spacing-sm);
  margin-bottom: var(--spacing-xs);
  background-color: var(--background-color-light);
  border-radius: var(--border-radius-sm);
  text-decoration: none;
  color: var(--text-color-secondary);
  transition: background-color 0.2s ease;
}

.question-navigation li a:hover {
  background-color: var(--primary-light);
}

.question-navigation li a.unanswered {
  background-color: var(--warning-light);
  color: var(--warning-dark);
  font-weight: bold;
}

.question-navigation li a.unanswered:hover {
  background-color: var(--warning-color);
  color: white;
}

.question-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr); /* 3 columns */
  gap: 10px; /* Space between buttons */
  margin-top: var(--spacing-sm);
}

.question-button {
  width: 55px; /* Slightly larger */
  height: 55px; /* Slightly larger */
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: var(--background-color-light);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-lg);
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.2s ease, border-color 0.2s ease, transform 0.2s ease;
}

.question-button:hover {
  background-color: var(--primary-light);
  border-color: var(--primary-color);
  transform: translateY(-2px); /* Slight lift on hover */
}

.question-button.unanswered {
  background-color: var(--warning-light);
  border-color: var(--warning-dark);
  color: var(--warning-dark);
}

.question-button.unanswered:hover {
  background-color: var(--warning-color);
  color: white;
  transform: translateY(-2px);
}

.assessment-sidebar .submit-button {
  margin-top: auto; /* Pushes the button to the bottom */
  width: 100%;
  padding: var(--spacing-md);
  font-size: var(--font-size-lg);
}

.main-content {
  flex-grow: 1;
  padding: var(--spacing-xl);
  background-color: var(--surface-color);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-3);
  font-family: var(--font-family-sans);
  max-width: 900px; /* Keep content readable */
  margin: 0 auto; /* Center content */
}

.main-content h1 {
  text-align: center;
  margin-bottom: var(--spacing-md);
  color: var(--text-color-primary);
  font-size: var(--font-size-h1); /* Larger font size */
  font-weight: 700; /* Bolder */
}

.main-content p {
  text-align: center;
  margin-bottom: var(--spacing-xl);
  color: var(--text-color-secondary);
  font-size: var(--font-size-lg);
  line-height: 1.6; /* Better readability */
}

.questions-list {
  margin-top: var(--spacing-lg);
}

.question-card {
  background-color: var(--background-color-light);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-2);
  padding: var(--spacing-xl); /* Increased padding */
  margin-bottom: var(--spacing-lg);
  text-align: left;
  border: 1px solid var(--border-color); /* Subtle border */
}

.question-text {
  font-weight: bold;
  margin-bottom: var(--spacing-md);
  color: var(--text-color-primary);
  font-size: var(--font-size-lg);
}

.answer-options .form-check {
  margin-bottom: var(--spacing-sm);
}

.form-check-input {
  margin-right: var(--spacing-sm);
}

.form-check-label {
  color: var(--text-color-secondary);
  font-size: var(--font-size-md);
}


.validation-dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.validation-dialog {
  background-color: white;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  text-align: center;
  max-width: 400px;
  width: 90%;
}

.validation-dialog h3 {
  margin-top: 0;
  color: var(--danger-color);
  font-size: var(--font-size-h3);
}

.validation-dialog p {
  margin-bottom: 20px;
  color: var(--text-color-secondary);
}

.validation-dialog .btn-primary {
  background-color: var(--primary-color);
  color: white;
  padding: 10px 20px;
  border-radius: 5px;
  text-decoration: none;
  display: inline-block;
  border: none;
  cursor: pointer;
  font-weight: 600;
  transition: background-color 0.3s ease;
}

.validation-dialog .btn-primary:hover {
  background-color: var(--primary-dark);
}

.clear-answer-btn {
  margin-top: var(--spacing-sm);
  align-self: flex-end; /* Align to the right within the card */
}

.btn-sm {
  padding: var(--spacing-xs) var(--spacing-sm);
  font-size: var(--font-size-sm);
}

.btn-outline-secondary {
  background-color: transparent;
  color: var(--secondary-color);
  border: 1px solid var(--secondary-color);
}

.btn-outline-secondary:hover {
  background-color: var(--secondary-color);
  color: white;
}

.main-content h1 {
  font-size: var(--font-size-h1); /* Larger font size */
  font-weight: 700; /* Bolder */
}

.main-content p {
  line-height: 1.6; /* Better readability */
}

.question-card {
  background-color: var(--background-color-light);
  padding: var(--spacing-xl); /* Increased padding */
  border: 1px solid var(--border-color); /* Subtle border */
}

.btn-success {
  padding: var(--spacing-md) var(--spacing-lg); /* Larger padding */
  border-radius: var(--border-radius-lg); /* More rounded */
  font-weight: 700; /* Bolder */
  letter-spacing: 0.5px; /* Slightly spaced letters */
  text-transform: uppercase; /* Uppercase text */
}
</style>
