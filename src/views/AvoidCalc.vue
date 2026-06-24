<template>
  <div class="page">
    <van-nav-bar title="死角弯避让计算" left-arrow @click-left="$router.back()" />
    <div class="content">
      <div class="wake-lock" v-if="wakeLock.isSupported">
        <span>保持常亮</span>
        <van-switch v-model="wakeActive" @change="onWakeChange" />
      </div>

      <van-field v-model.number="form.avoidDistance" type="number" label="避让距离" placeholder="障碍物突出深度（毫米）" size="large" />

      <van-field v-model.number="form.angle" type="number" label="角度" placeholder="输入角度（度）" size="large">
        <template #button>°</template>
      </van-field>
      <AngleQuickButtons v-model="form.angle" />

      <van-button type="primary" block @click="calc" style="margin-top: 16px;">计算</van-button>

      <ResultCard v-if="result" :results="result" />
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { showToast } from 'vant'
import { avoidanceCalc } from '../math/trayMath.js'
import AngleQuickButtons from '../components/AngleQuickButtons.vue'
import ResultCard from '../components/ResultCard.vue'
import { useWakeLock } from '../composables/useWakeLock.js'

const wakeLock = useWakeLock()
const wakeActive = ref(false)
const form = reactive({ avoidDistance: null, angle: null })
const result = ref(null)

async function onWakeChange() {
  await wakeLock.toggle()
  wakeActive.value = wakeLock.isActive.value
}

function calc() {
  if (!form.avoidDistance || form.avoidDistance <= 0) {
    return showToast('避让距离必须大于 0')
  }
  if (!form.angle || form.angle <= 0 || form.angle > 90) {
    return showToast('角度必须在 0 到 90 度之间')
  }
  try {
    const r = avoidanceCalc(form.avoidDistance, form.angle)
    result.value = [
      { label: '提前起弯距离', value: r.advanceDistance },
      { label: '绕行斜边长', value: r.bypassLength }
    ]
  } catch (e) {
    showToast(e.message)
  }
}
</script>

<style scoped>
.page { padding-bottom: 60px; }
.content { padding: 12px; }
.wake-lock { display: flex; justify-content: space-between; align-items: center; padding: 12px 0; margin-bottom: 8px; }
</style>
