<template>
  <div class="confirm-toast">
    <h2 class="confirm-title">{{ message || 'Are you sure you want to delete this item?' }}</h2>
    <p class="confirm-description">This action cannot be undone.</p>
    <div class="confirm-actions">
      <button class="btn btn-cancel" @click="close">
        Cancel
      </button>
      <button class="btn btn-delete" @click="confirm">
        Delete
      </button>
    </div>
  </div>
</template>
<script setup>
import { useToast } from 'vue-toastification'

// Props: message, onConfirm, toastId
// Emits: confirm, cancel
const props = defineProps(['message', 'onConfirm', 'toastId'])
const emit = defineEmits(['confirm', 'cancel'])

function confirm() {
  emit('confirm')
  props.onConfirm && props.onConfirm()
}

function close() {
  emit('cancel')
  // Close the toast when cancel is clicked
  if (props.toastId) {
    // If used in toast context, dismiss the toast
    const toast = useToast()
    toast.dismiss(props.toastId)
  }
}
</script>

<style scoped>
.confirm-toast {
  background-color: var(--surface-color);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-3);
  padding: var(--spacing-xl);
  width: 100%;
  max-width: 400px;
  min-height: 150px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.confirm-title {
  font-size: var(--font-size-lg);
  font-weight: bold;
  color: var(--text-color-primary);
  margin-bottom: var(--spacing-sm);
  line-height: 1.4;
}

.confirm-description {
  font-size: var(--font-size-sm);
  color: var(--text-color-secondary);
  margin-bottom: var(--spacing-md);
  line-height: 1.4;
}

.confirm-actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--spacing-md);
  margin-top: auto;
}

.btn {
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-md);
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  border: none;
  min-width: 80px;
}

.btn-cancel {
  background-color: var(--surface-color);
  color: var(--text-color-primary);
  border: 1px solid var(--border-color);
}

.btn-cancel:hover {
  background-color: var(--background-color);
}

.btn-delete {
  background-color: var(--error-color);
  color: white;
}

.btn-delete:hover {
  background-color: var(--error-dark);
}
</style> 