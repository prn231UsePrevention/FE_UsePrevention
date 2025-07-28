<template>
  <div style="min-width:220px;max-width:320px; background: white !important; border-radius: 8px; padding: 16px; box-shadow: 0 4px 12px rgba(0,0,0,0.15);">
    <div style="margin-bottom: 12px; font-weight:500; color: #374151;">{{ message }}</div>
    <button @click="confirm" style="background: linear-gradient(135deg, #ef4444, #dc2626); color:#fff; padding:8px 16px; border:none; border-radius:6px; cursor:pointer; margin-right:8px; font-weight:500; transition: all 0.2s;">Xác nhận</button>
    <button @click="close" style="background: linear-gradient(135deg, #f3f4f6, #e5e7eb); color:#374151; padding:8px 16px; border:none; border-radius:6px; cursor:pointer; font-weight:500; transition: all 0.2s;">Hủy</button>
  </div>
</template>
<script setup>
const props = defineProps(['toastId', 'message', 'onConfirm'])
const emit = defineEmits(['close'])

function confirm() {
  emit('close')
  props.onConfirm && props.onConfirm()
}
function close() {
  emit('close')
}
</script> 