<template>
  <div class="admin-questions-container">
    <h1>Manage Questions for Assessment: {{ assessmentName }}</h1>

    <div class="create-question-section card">
      <h2>Add New Question</h2>
      <form @submit.prevent="addQuestion">
        <div class="form-group">
          <label for="content">Question Content:</label>
          <input type="text" id="content" v-model="newQuestion.content" required />
        </div>
        <div class="form-group">
          <label for="type">Question Type:</label>
          <select id="type" v-model="newQuestion.type" required>
            <option value="MultipleChoice">Multiple Choice</option>
            <option value="Text">Text</option>
          </select>
        </div>
        <div v-if="newQuestion.type === 'MultipleChoice'" class="form-group">
          <label>Options (comma-separated):</label>
          <input type="text" v-model="newQuestionOptionsInput" placeholder="Option 1, Option 2" />
        </div>
        <div class="form-group">
          <label for="correctAnswer">Correct Answer (for Multiple Choice, use option text):</label>
          <input type="text" id="correctAnswer" v-model="newQuestion.correctAnswer" />
        </div>
        <button type="submit" class="btn btn-primary">Add Question</button>
      </form>
    </div>

    <div class="questions-list-section card">
      <h2>Existing Questions</h2>
      <div v-if="questions.length > 0" class="question-cards">
        <div v-for="question in questions" :key="question.id" class="card question-item">
          <h3>{{ question.content }} ({{ question.type }})</h3>
          <ul v-if="question.options && question.options.length">
            <li v-for="option in question.options.split(',')" :key="option">{{ option.trim() }}</li>
          </ul>
          <p v-if="question.correctAnswer">Correct Answer: {{ question.correctAnswer }}</p>
          <div class="actions">
            <button @click="editQuestion(question.id)" class="btn btn-secondary">Edit</button>
            <button @click="deleteQuestion(question.id)" class="btn btn-danger">Delete</button>
          </div>
        </div>
      </div>
      <p v-else>No questions added yet for this assessment.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import assessmentQuestionService from '@/services/assessmentQuestionService';
import assessmentService from '@/services/assessmentService';
import { useToast } from 'vue-toastification';

const route = useRoute();
const toast = useToast();

const assessmentId = ref(null);
const assessmentName = ref('');
const newQuestion = ref({
  assessmentId: null,
  content: '',
  type: 'MultipleChoice',
  options: '',
  correctAnswer: '',
});
const newQuestionOptionsInput = ref('');
const questions = ref([]);

onMounted(async () => {
  assessmentId.value = route.params.assessmentId;
  newQuestion.value.assessmentId = assessmentId.value;
  await fetchAssessmentDetails();
  await fetchQuestions();
});

watch(newQuestionOptionsInput, (newValue) => {
  newQuestion.value.options = newValue; // options is now a string
});

async function fetchAssessmentDetails() {
  try {
    const response = await assessmentService.getAssessmentById(assessmentId.value);
    assessmentName.value = response.data.name; // Assuming the assessment object has a 'name' property
  } catch (error) {
    console.error('Error fetching assessment details:', error);
    assessmentName.value = 'Unknown Assessment';
    toast.error('Failed to fetch assessment details.');
  }
}

async function fetchQuestions() {
  try {
    const response = await assessmentQuestionService.getQuestionsByAssessmentId(assessmentId.value);
    questions.value = response.data;
  } catch (error) {
    console.error('Error fetching questions:', error);
    toast.error('Failed to fetch questions.');
  }
}

async function addQuestion() {
  try {
    const questionPayload = {
      assessmentId: newQuestion.value.assessmentId,
      content: newQuestion.value.content,
      type: newQuestion.value.type,
      options: newQuestion.value.type === 'MultipleChoice' ? newQuestion.value.options : null,
      correctAnswer: newQuestion.value.correctAnswer || null,
    };
    await assessmentQuestionService.createQuestion(questionPayload);
    toast.success('Question added successfully!');
    newQuestion.value.content = '';
    newQuestion.value.type = 'MultipleChoice';
    newQuestionOptionsInput.value = '';
    newQuestion.value.options = '';
    newQuestion.value.correctAnswer = '';
    fetchQuestions();
  } catch (error) {
    console.error('Error adding question:', error);
    toast.error('Failed to add question.');
  }
}

function editQuestion(id) {
  toast.info(`Edit question with ID: ${id}`);
}

async function deleteQuestion(id) {
  if (confirm('Are you sure you want to delete this question?')) {
    try {
      await assessmentQuestionService.deleteQuestion(id);
      toast.success('Question deleted successfully!');
      fetchQuestions();
    } catch (error) {
      console.error('Error deleting question:', error);
      toast.error('Failed to delete question.');
    }
  }
}
</script>

<style scoped>
.admin-questions-container {
  padding: var(--spacing-lg);
  max-width: 900px;
  margin: 0 auto;
  font-family: var(--font-family-sans);
}

h1 {
  text-align: center;
  margin-bottom: var(--spacing-xl);
  color: var(--text-color-primary);
  font-size: var(--font-size-h2);
}

.card {
  background-color: var(--surface-color);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-2);
  padding: var(--spacing-lg);
  margin-bottom: var(--spacing-xl);
}

.create-question-section h2,
.questions-list-section h2 {
  color: var(--primary-color);
  margin-bottom: var(--spacing-lg);
  text-align: center;
  font-size: var(--font-size-xl);
}

.form-group {
  margin-bottom: var(--spacing-md);
}

.form-group label {
  display: block;
  margin-bottom: var(--spacing-xs);
  font-weight: bold;
  color: var(--text-color-secondary);
  font-size: var(--font-size-md);
}

.form-group input[type="text"],
.form-group select,
.form-group textarea {
  width: 100%;
  padding: var(--spacing-sm);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-md);
  box-sizing: border-box;
  font-size: var(--font-size-md);
  color: var(--text-color-primary);
  background-color: var(--background-color);
}

.btn {
  padding: var(--spacing-sm) var(--spacing-md);
  border: none;
  border-radius: var(--border-radius-md);
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s ease, box-shadow 0.3s ease;
  font-weight: 600;
}

.btn-primary {
  background-color: var(--primary-color);
  color: white;
}

.btn-primary:hover {
  background-color: var(--primary-dark);
  box-shadow: var(--shadow-1);
}

.question-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: var(--spacing-lg);
}

.question-item {
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-md);
  padding: var(--spacing-md);
  text-align: left;
  background-color: var(--background-color);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.question-item:hover {
  transform: translateY(-3px);
  box-shadow: var(--shadow-3);
}

.question-item h3 {
  margin-top: 0;
  color: var(--text-color-primary);
  font-size: var(--font-size-lg);
  margin-bottom: var(--spacing-xs);
}

.question-item ul {
  list-style: none;
  padding: 0;
  margin-top: var(--spacing-sm);
}

.question-item li {
  background-color: var(--surface-color);
  border-radius: var(--border-radius-sm);
  padding: var(--spacing-xs);
  margin-bottom: var(--spacing-xs);
  font-size: var(--font-size-sm);
  color: var(--text-color-secondary);
}

.question-item .actions {
  margin-top: var(--spacing-md);
  display: flex;
  gap: var(--spacing-sm);
  justify-content: flex-end;
}

.btn-secondary {
  background-color: var(--secondary-color);
  color: white;
}

.btn-secondary:hover {
  background-color: var(--secondary-dark);
  box-shadow: var(--shadow-1);
}

.btn-danger {
  background-color: var(--error-color);
  color: white;
}

.btn-danger:hover {
  background-color: var(--error-dark);
  box-shadow: var(--shadow-1);
}
</style>
