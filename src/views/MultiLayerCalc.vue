<template>
  <div class="page">
    <van-nav-bar title="多层过桥计算" left-arrow @click-left="$router.back()" />
    <div class="content">
      <div class="wake-lock" v-if="wakeLock.isSupported">
        <span>保持常亮</span>
        <van-switch v-model="wakeActive" @change="onWakeChange" />
      </div>

      <van-field v-model.number="form.angle" type="number" label="角度" placeholder="输入角度（度）" size="large">
        <template #button>°</template>
      </van-field>
      <AngleQuickButtons v-model="form.angle" />

      <van-field v-model.number="form.layerSpacing" type="number" label="层间距" placeholder="毫米" size="large" />
      <van-field v-model.number="form.layerCount" type="digit" label="层数" placeholder="层数" size="large" />

      <van-button type="primary" block @click="calc" style="margin-top: 16px;">计算</van-button>

      <div v-if="result" class="result-card">
        <table class="layer-table">
          <thead>
            <tr>
              <th>层号</th>
              <th>单层错位量</th>
              <th>累计错位距离</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in result" :key="row.layer">
              <td>第 {{ row.layer }} 层</td>
              <td>{{ row.staggerPerLayer }} mm</td>
              <td>{{ row.staggerFromBase }} mm</td>
            </tr>
          </tbody>
        </table>
        <van-button type="warning" size="small" block @click="copy" style="margin-top: 12px;">复制数据</van-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { showToast } from 'vant'
import { multiLayerCalc } from '../math/trayMath.js'
import AngleQuickButtons from '../components/AngleQuickButtons.vue'
import { useWakeLock } from '../composables/useWakeLock.js'

const wakeLock = useWakeLock()
const wakeActive = ref(false)
const form = reactive({ angle: null, layerSpacing: null, layerCount: null })
const result = ref(null)

async function onWakeChange() {
  await wakeLock.toggle()
  wakeActive.value = wakeLock.isActive.value
}

function calc() {
  if (!form.angle || form.angle <= 0 || form.angle > 90) {
    return showToast('角度必须在 0 到 90 度之间')
  }
  if (!form.layerSpacing || form.layerSpacing <= 0) {
    return showToast('层间距必须大于 0')
  }
  if (!form.layerCount || form.layerCount < 1) {
    return showToast('层数必须大于等于 1')
  }
  try {
    result.value = multiLayerCalc(form.angle, form.layerSpacing, form.layerCount)
  } catch (e) {
    showToast(e.message)
  }
}

async function copy() {
  const text = result.value.map(r => `第${r.layer}层: 单层错位${r.staggerPerLayer}mm, 累计错位${r.staggerFromBase}mm`).join('\n')
  try {
    await navigator.clipboard.writeText(text)
    showToast('已复制')
  } catch (e) {
    showToast('复制失败')
  }
}
</script>

<style scoped>
.page { padding-bottom: 60px; }
.content { padding: 12px; }
.wake-lock { display: flex; justify-content: space-between; align-items: center; padding: 12px 0; margin-bottom: 8px; }
.result-card { background: #FFF3E0; border-radius: 8px; padding: 16px; margin: 16px 0; }
.layer-table { width: 100%; border-collapse: collapse; }
.layer-table th, .layer-table td { padding: 10px; text-align: center; border-bottom: 1px solid #FFE0B2; font-size: 16px; }
.layer-table th { color: #666; font-size: 14px; }
.layer-table td { font-weight: bold; color: #FF6B00; }
</style>
