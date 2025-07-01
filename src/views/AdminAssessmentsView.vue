<template>
  <div class="admin-assessments-container">
    <h1>Manage Assessments</h1>

    <div class="create-assessment-section card">
      <h2>Create New Assessment</h2>
      <form @submit.prevent="createAssessment">
        <div class="form-group">
          <label for="title">Title:</label>
          <input type="text" id="title" v-model="newAssessment.title" required />
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
          <h3>{{ assessment.title }}</h3>
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

<script>
import assessmentService from '@/services/assessmentService';

export default {
  name: 'AdminAssessmentsView',
  data() {
    return {
      newAssessment: {
        title: '',
        description: '',
      },
      assessments: [],
    };
  },
  async created() {
    this.fetchAssessments();
  },
  methods: {
    async fetchAssessments() {
      try {
        const response = await assessmentService.getAllAssessments();
        this.assessments = response.data;
      } catch (error) {
        console.error('Error fetching assessments:', error);
      }
    },
    async createAssessment() {
      try {
        await assessmentService.createAssessment(this.newAssessment);
        alert('Assessment created successfully!');
        this.newAssessment.title = '';
        this.newAssessment.description = '';
        this.fetchAssessments(); // Refresh the list
      } catch (error) {
        console.error('Error creating assessment:', error);
        alert('Failed to create assessment.');
      }
    },
    editAssessment(id) {
      // Implement edit functionality (e.g., navigate to an edit page or open a modal)
      alert(`Edit assessment with ID: ${id}`);
    },
    async deleteAssessment(id) {
      if (confirm('Are you sure you want to delete this assessment?')) {
        try {
          await assessmentService.deleteAssessment(id);
          alert('Assessment deleted successfully!');
          this.fetchAssessments(); // Refresh the list
        } catch (error) {
          console.error('Error deleting assessment:', error);
          alert('Failed to delete assessment.');
        }
      }
    },
  },
};
</script>

<style scoped>
.admin-assessments-container {
  padding: 20px;
  max-width: 900px;
  margin: 0 auto;
}

h1 {
  text-align: center;
  margin-bottom: 30px;
  color: #333;
}

.card {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 20px;
  margin-bottom: 20px;
}

.create-assessment-section h2,
.assessments-list-section h2 {
  color: #007bff;
  margin-bottom: 20px;
  text-align: center;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
  color: #555;
}

.form-group input[type="text"],
.form-group textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-sizing: border-box; /* Include padding in width */
}

.form-group textarea {
  resize: vertical;
  min-height: 80px;
}

.btn {
  padding: 10px 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s ease;
}

.btn-primary {
  background-color: #007bff;
  color: white;
}

.btn-primary:hover {
  background-color: #0056b3;
}

.assessment-cards {
  display: grid;
  justify-content: center;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}

.assessment-item {
  border: 1px solid #eee;
  padding: 15px;
  text-align: center; /* Căn giữa text */
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center; /* Căn giữa nội dung theo chiều ngang */
}

.assessment-item h3 {
  margin-top: 0;
  color: #333;
}

.assessment-item p {
  color: #666;
  font-size: 0.9em;
}

.assessment-item .actions {
  margin-top: 15px;
  display: flex;
  gap: 10px;
}

.btn-secondary {
  background-color: #6c757d;
  color: white;
}

.btn-secondary:hover {
  background-color: #5a6268;
}

.btn-danger {
  background-color: #dc3545;
  color: white;
}

.btn-danger:hover {
  background-color: #c82333;
}
</style>
