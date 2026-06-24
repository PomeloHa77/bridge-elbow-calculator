<template>
  <div class="page">
    <van-nav-bar title="万能爬坡计算" left-arrow @click-left="$router.back()" />
    <div class="content">
      <div class="wake-lock" v-if="wakeLock.isSupported">
        <span>保持常亮</span>
        <van-switch v-model="wakeActive" @change="onWakeChange" />
      </div>

      <van-field v-model.number="form.angle" type="number" label="角度" placeholder="输入角度（度）" size="large">
        <template #button>°</template>
      </van-field>
      <AngleQuickButtons v-model="form.angle" />

      <van-field v-model.number="form.climbHeight" type="number" label="爬坡高度" placeholder="毫米" size="large" />
      <van-field v-model.number="form.sideHeight" type="number" label="桥架帮高" placeholder="毫米" size="large" />

      <van-button type="primary" block @click="calc" style="margin-top: 16px;">计算</van-button>

      <ResultCard v-if="result" :results="result" />
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { showToast } from 'vant'
import { climbCalc } from '../math/trayMath.js'
import AngleQuickButtons from '../components/AngleQuickButtons.vue'
import ResultCard from '../components/ResultCard.vue'
import { useWakeLock } from '../composables/useWakeLock.js'

const wakeLock = useWakeLock()
const wakeActive = ref(false)
const form = reactive({ angle: null, climbHeight: null, sideHeight: null })
const result = ref(null)

async function onWakeChange() {
  await wakeLock.toggle()
  wakeActive.value = wakeLock.isActive.value
}

function calc() {
  if (!form.angle || form.angle <= 0 || form.angle > 90) {
    return showToast('角度必须在 0 到 90 度之间')
  }
  if (!form.climbHeight || form.climbHeight <= 0) {
    return showToast('爬坡高度必须大于 0')
  }
  if (!form.sideHeight || form.sideHeight <= 0) {
    return showToast('桥架帮高必须大于 0')
  }
  try {
    const r = climbCalc(form.angle, form.climbHeight, form.sideHeight)
    result.value = [
      { label: '斜边长', value: r.hypotenuse },
      { label: '切口宽度', value: r.cutWidth }
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
