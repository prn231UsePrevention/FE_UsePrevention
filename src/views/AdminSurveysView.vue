<template>
  <div class="admin-assessments-container">
    <h1>Manage Assessments</h1>

    <div class="create-assessment-section card">
      <h2>Create New Assessment</h2>
      <form @submit.prevent="createAssessment">
        <div class="form-group">
          <label for="title">Title:</label>
          <input type="text" id="title" v-model="newAssessment.name" required />
        </div>
        <div class="form-group">
          <label for="description">Description:</label>
          <textarea id="description" v-model="newAssessment.description" required></textarea>
        </div>
        <button type="submit" class="btn btn-primary">Create Assessment</button>
      </form>
    </div>

    <div class="assessments-list-section card">
      <h2>Existing Assessments</h2>
      <div v-if="assessments.length > 0" class="assessment-cards">
        <div v-for="assessment in assessments" :key="assessment.id" class="card assessment-item">
          <h3>{{ assessment.name }}</h3>
          <p>{{ assessment.description }}</p>
          <div class="actions">
            <button @click="editAssessment(assessment.id)" class="btn btn-secondary">Edit</button>
            <button @click="deleteAssessment(assessment.id)" class="btn btn-danger">Delete</button>
          </div>
        </div>
      </div>
      <p v-else>No assessments created yet.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import assessmentService from '@/services/assessmentService';
import { useToast } from 'vue-toastification';

const newAssessment = ref({
  name: '',
  description: '',
});
const assessments = ref([]);
const router = useRouter();
const toast = useToast();

onMounted(() => {
  fetchAssessments();
});

async function fetchAssessments() {
  try {
    const response = await assessmentService.getAllAssessments();
    assessments.value = response.data;
  } catch (error) {
    console.error('Error fetching assessments:', error);
    toast.error('Failed to fetch assessments.');
  }
}

async function createAssessment() {
  try {
    const response = await assessmentService.createAssessment(newAssessment.value);
    toast.success('Assessment created successfully!');
    newAssessment.value.name = '';
    newAssessment.value.description = '';
    router.push({ name: 'admin-edit-assessment', params: { id: response.data.id } });
  } catch (error) {
    console.error('Error creating assessment:', error);
    toast.error('Failed to create assessment.');
  }
}

function editAssessment(id) {
  router.push({ name: 'admin-edit-assessment', params: { id: id } });
}

function manageQuestions(id) {
  router.push({ name: 'admin-assessment-questions', params: { assessmentId: id } });
}

async function deleteAssessment(id) {
  if (confirm('Are you sure you want to delete this assessment?')) {
    try {
      await assessmentService.deleteAssessment(id);
      toast.success('Assessment deleted successfully!');
      fetchAssessments();
    } catch (error) {
      console.error('Error deleting assessment:', error);
      toast.error('Failed to delete assessment.');
    }
  }
}
</script>

<style scoped>
.admin-assessments-container {
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
  margin: 0 auto var(--spacing-xl) auto; /* Center the card and add bottom margin */
  max-width: 900px; /* Ensure it has a max-width to be centered */
}

.create-assessment-section h2,
.assessments-list-section h2 {
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

.form-group textarea {
  resize: vertical;
  min-height: 100px;
}

.btn {
  padding: var(--spacing-sm) var(--spacing-md);
  border: none;
  border-radius: var(--border-radius-md);
  cursor: pointer;
  font-size: var(--font-size-md);
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

.assessment-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: var(--spacing-lg);
  justify-content: center; /* Center grid items horizontally */
  max-width: 900px; /* Limit width to allow centering */
  margin: 0 auto; /* Center the grid container itself */
}

.assessment-item {
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-md);
  padding: var(--spacing-md);
  text-align: center;
  background-color: var(--background-color);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  width: 100%; /* Ensure items take full width of their grid cell */
}

.assessment-item:hover {
  transform: translateY(-3px);
  box-shadow: var(--shadow-3);
}

.assessment-item h3 {
  margin-top: 0;
  color: var(--text-color-primary);
  font-size: var(--font-size-lg);
  margin-bottom: var(--spacing-xs);
}

.assessment-item p {
  color: var(--text-color-secondary);
  font-size: var(--font-size-sm);
  margin-bottom: var(--spacing-md);
}

.assessment-item .actions {
  margin-top: var(--spacing-md);
  display: flex;
  gap: var(--spacing-sm);
  justify-content: flex-end; /* Align buttons to the right */
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

.btn-info {
  background-color: var(--info-color);
  color: white;
}

.btn-info:hover {
  background-color: var(--info-dark);
  box-shadow: var(--shadow-1);
}
</style>