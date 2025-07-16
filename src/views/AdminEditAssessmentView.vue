<template>
  <div class="admin-edit-assessment-container">
    <h1>Edit Assessment</h1>

    <div v-if="assessment" class="assessment-details card">
      <form @submit.prevent="updateAssessment">
        <div class="form-group">
          <label for="name">Title:</label>
          <input type="text" id="name" v-model="assessment.name" required />
        </div>
        <div class="form-group">
          <label for="description">Description:</label>
          <textarea id="description" v-model="assessment.description" required></textarea>
        </div>
        <button type="submit" class="btn btn-primary">Update Assessment</button>
      </form>

      <hr />

      <div class="manage-questions-link">
        <h2>Manage Questions</h2>
        <p>Click the button below to add, edit, or delete questions for this assessment.</p>
        <router-link
          :to="{ name: 'admin-assessment-questions', params: { assessmentId: assessment.id } }"
          class="btn btn-secondary"
        >
          Manage Questions
        </router-link>
      </div>
    </div>
    <p v-else>Loading assessment details...</p>
  </div>
</template>

<script>
import assessmentService from '@/services/assessmentService';

export default {
  name: 'AdminEditAssessmentView',
  data() {
    return {
      assessmentId: null,
      assessment: null,
    };
  },
  async created() {
    this.assessmentId = this.$route.params.id;
    await this.fetchAssessmentDetails();
  },
  methods: {
    async fetchAssessmentDetails() {
      try {
        const response = await assessmentService.getAssessmentById(this.assessmentId);
        this.assessment = response.data;
      } catch (error) {
        console.error('Error fetching assessment details:', error);
        alert('Failed to load assessment details.');
        this.$router.push({ name: 'admin-surveys' }); // Redirect if not found
      }
    },
    async updateAssessment() {
      try {
        await assessmentService.updateAssessment(this.assessment.id, this.assessment);
        alert('Assessment updated successfully!');
        // Optionally, redirect back to the surveys list or stay on the page
        // this.$router.push({ name: 'admin-surveys' });
      } catch (error) {
        console.error('Error updating assessment:', error);
        alert('Failed to update assessment.');
      }
    },
  },
};
</script>

<style scoped>
.admin-edit-assessment-container {
  padding: var(--spacing-lg);
  max-width: 800px;
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

.manage-questions-link {
  margin-top: var(--spacing-xl);
  padding-top: var(--spacing-lg);
  border-top: 1px solid var(--border-color);
  text-align: center;
}

.manage-questions-link h2 {
  color: var(--primary-color);
  margin-bottom: var(--spacing-md);
  font-size: var(--font-size-xl);
}

.btn-secondary {
  background-color: var(--secondary-color);
  color: white;
}

.btn-secondary:hover {
  background-color: var(--secondary-dark);
  box-shadow: var(--shadow-1);
}
</style>
