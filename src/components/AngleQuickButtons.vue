<template>
  <div class="angle-quick-buttons">
    <span class="label">快捷角度</span>
    <div class="buttons">
      <van-button
        v-for="a in angles"
        :key="a"
        size="small"
        :type="modelValue === a ? 'primary' : 'default'"
        @click="select(a)"
      >
        {{ a }}°
      </van-button>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  modelValue: { type: Number, default: null }
})
const emit = defineEmits(['update:modelValue'])
const angles = [30, 45, 60, 90]

function select(a) {
  emit('update:modelValue', a)
}
</script>

<style scoped>
.angle-quick-buttons { margin: 12px 0; }
.label { font-size: 14px; color: #666; display: block; margin-bottom: 8px; }
.buttons { display: flex; gap: 8px; }
</style>
