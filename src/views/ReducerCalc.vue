<template>
  <div class="page">
    <van-nav-bar title="大小头变径计算" left-arrow @click-left="$router.back()" />
    <div class="content">
      <div class="wake-lock" v-if="wakeLock.isSupported">
        <span>保持常亮</span>
        <van-switch v-model="wakeActive" @change="onWakeChange" />
      </div>

      <van-field v-model.number="form.widthDiff" type="number" label="变化宽度" placeholder="大小头宽度差（毫米）" size="large" />
      <van-field v-model.number="form.transitionLength" type="number" label="过渡长度" placeholder="毫米" size="large" />

      <div class="type-select">
        <span class="label">变径类型</span>
        <van-radio-group v-model="form.reducerType" direction="horizontal">
          <van-radio name="eccentric">偏心（单边）</van-radio>
          <van-radio name="concentric">同心（双边）</van-radio>
        </van-radio-group>
      </div>

      <van-button type="primary" block @click="calc" style="margin-top: 16px;">计算</van-button>

      <ResultCard v-if="result" :results="result" />
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { showToast } from 'vant'
import { reducerCalc } from '../math/trayMath.js'
import ResultCard from '../components/ResultCard.vue'
import { useWakeLock } from '../composables/useWakeLock.js'

const wakeLock = useWakeLock()
const wakeActive = ref(false)
const form = reactive({ widthDiff: null, transitionLength: null, reducerType: 'eccentric' })
const result = ref(null)

async function onWakeChange() {
  await wakeLock.toggle()
  wakeActive.value = wakeLock.isActive.value
}

function calc() {
  if (form.widthDiff === null || form.widthDiff < 0) {
    return showToast('变化宽度不能为负')
  }
  if (!form.transitionLength || form.transitionLength <= 0) {
    return showToast('过渡长度必须大于 0')
  }
  try {
    const r = reducerCalc(form.widthDiff, form.transitionLength, form.reducerType)
    result.value = [
      { label: '对角切割长度', value: r.diagonalCutLength },
      { label: '切割角度', value: r.cutAngle, unit: '°' }
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
.type-select { padding: 12px 0; }
.type-select .label { font-size: 14px; color: #666; display: block; margin-bottom: 8px; }
</style>
