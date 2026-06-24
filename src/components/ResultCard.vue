<template>
  <div class="result-card" v-if="results.length">
    <div class="result-item" v-for="item in results" :key="item.label">
      <span class="result-label">{{ item.label }}</span>
      <span class="result-value">{{ item.value }}{{ item.unit || 'mm' }}</span>
    </div>
    <van-button type="warning" size="small" block @click="copy" style="margin-top: 12px;">
      复制数据
    </van-button>
  </div>
</template>

<script setup>
import { showToast } from 'vant'

const props = defineProps({
  results: { type: Array, default: () => [] }
})

async function copy() {
  const text = props.results.map(r => `${r.label}: ${r.value}${r.unit || 'mm'}`).join('\n')
  try {
    await navigator.clipboard.writeText(text)
    showToast('已复制')
  } catch (e) {
    showToast('复制失败')
  }
}
</script>

<style scoped>
.result-card {
  background: #FFF3E0;
  border-radius: 8px;
  padding: 16px;
  margin: 16px 0;
}
.result-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #FFE0B2;
}
.result-item:last-of-type { border-bottom: none; }
.result-label { font-size: 16px; color: #333; }
.result-value { font-size: 28px; font-weight: bold; color: #FF6B00; }
</style>
