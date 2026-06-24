# 桥架弯头计算器 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers-subagent-driven-development (recommended) or superpowers-executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a mobile-first, offline-capable Vue 3 + Vant 4 PWA that provides 5 bridge cable tray elbow calculation modules for electricians.

**Architecture:** Bottom Tabbar navigation (计算/特殊/说明) with Vue Router 4 (Hash mode). All calculation logic isolated in a pure function math library `src/math/trayMath.js`. Vue components consume the math library. PWA via vite-plugin-pwa with Cache First strategy.

**Tech Stack:** Vue 3 (Composition API, `<script setup>`), Vite, Vant 4, Vue Router 4, vite-plugin-pwa, Vitest, @vue/test-utils

---

## Task 1: Project Scaffolding

**Files:**
- Create: `package.json`
- Create: `vite.config.js`
- Create: `index.html`
- Create: `src/main.js`
- Create: `src/App.vue`
- Create: `src/router.js`

- [ ] **Step 1: Create package.json**

```json
{
  "name": "bridge-elbow-calculator",
  "version": "1.0.0",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "test": "vitest run",
    "test:watch": "vitest"
  },
  "dependencies": {
    "vue": "^3.4.0",
    "vue-router": "^4.3.0",
    "vant": "^4.8.0"
  },
  "devDependencies": {
    "@vitejs/plugin-vue": "^5.0.0",
    "vite": "^5.1.0",
    "vite-plugin-pwa": "^0.19.0",
    "vitest": "^1.3.0",
    "@vue/test-utils": "^2.4.0",
    "jsdom": "^24.0.0",
    "@vant/use": "^1.6.0"
  }
}
```

- [ ] **Step 2: Create vite.config.js**

```js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    vue(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: '桥架弯头计算器',
        short_name: '桥架计算器',
        theme_color: '#FF6B00',
        background_color: '#FFFFFF',
        display: 'standalone',
        icons: [
          { src: '/icons/icon-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icons/icon-512x512.png', sizes: '512x512', type: 'image/png' }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        runtimeCaching: [
          {
            urlPattern: ({ url }) => url.origin === self.location.origin,
            handler: 'CacheFirst',
            options: { cacheName: 'app-cache' }
          }
        ]
      }
    })
  ],
  test: {
    environment: 'jsdom',
    globals: true
  }
})
```

- [ ] **Step 3: Create index.html**

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
  <meta name="theme-color" content="#FF6B00" />
  <title>桥架弯头计算器</title>
</head>
<body>
  <div id="app"></div>
  <script type="module" src="/src/main.js"></script>
</body>
</html>
```

- [ ] **Step 4: Create src/main.js**

```js
import { createApp } from 'vue'
import App from './App.vue'
import router from './router.js'
import 'vant/lib/index.css'

createApp(App).use(router).mount('#app')
```

- [ ] **Step 5: Create src/router.js**

```js
import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  { path: '/', redirect: '/home' },
  { path: '/home', component: () => import('./views/Home.vue') },
  { path: '/climb', component: () => import('./views/ClimbCalc.vue') },
  { path: '/horizontal', component: () => import('./views/HorizontalCalc.vue') },
  { path: '/special', component: () => import('./views/Special.vue') },
  { path: '/multilayer', component: () => import('./views/MultiLayerCalc.vue') },
  { path: '/reducer', component: () => import('./views/ReducerCalc.vue') },
  { path: '/avoidance', component: () => import('./views/AvoidCalc.vue') },
  { path: '/about', component: () => import('./views/About.vue') }
]

const router = createRouter({ history: createWebHashHistory(), routes })
export default router
```

- [ ] **Step 6: Create minimal src/App.vue**

```vue
<template>
  <router-view />
</template>

<script setup>
</script>

<style>
body { margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
</style>
```

- [ ] **Step 7: Install dependencies and verify dev server**

Run: `npm install`
Run: `npm run dev`
Expected: Vite dev server starts without errors.

- [ ] **Step 8: Commit**

```bash
git add package.json vite.config.js index.html src/main.js src/App.vue src/router.js
git commit -m "feat: scaffold Vue 3 + Vite + Vant project"
```

---

## Task 2: trayMath.js Utility Functions (TDD)

**Files:**
- Create: `src/math/trayMath.js`
- Create: `src/__tests__/math/trayMath.test.js`

- [ ] **Step 1: Write the failing test**

Create `src/__tests__/math/trayMath.test.js`:

```js
import { describe, it, expect } from 'vitest'
import { toRadians, toDegrees, round2 } from '../../math/trayMath.js'

describe('utility functions', () => {
  it('toRadians(180) returns approximately PI', () => {
    expect(toRadians(180)).toBeCloseTo(Math.PI, 5)
  })

  it('toDegrees(PI) returns 180', () => {
    expect(toDegrees(Math.PI)).toBe(180)
  })

  it('round2(3.14159) returns 3.14', () => {
    expect(round2(3.14159)).toBe(3.14)
  })

  it('round2(2.567) returns 2.57', () => {
    expect(round2(2.567)).toBe(2.57)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/__tests__/math/trayMath.test.js`
Expected: FAIL — module not found / functions undefined.

- [ ] **Step 3: Write minimal implementation**

Create `src/math/trayMath.js`:

```js
// 角度转弧度
export function toRadians(degrees) {
  return degrees * Math.PI / 180
}

// 弧度转角度
export function toDegrees(radians) {
  return radians * 180 / Math.PI
}

// 结果取整到 2 位小数
export function round2(value) {
  return Math.round(value * 100) / 100
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/__tests__/math/trayMath.test.js`
Expected: PASS — all 4 tests pass.

- [ ] **Step 5: Commit**

```bash
git add src/math/trayMath.js src/__tests__/math/trayMath.test.js
git commit -m "feat: add trayMath utility functions with tests"
```

---

## Task 3: climbCalc (TDD)

**Files:**
- Modify: `src/math/trayMath.js` (add climbCalc)
- Modify: `src/__tests__/math/trayMath.test.js` (add climb tests)

- [ ] **Step 1: Write the failing tests**

Append to `src/__tests__/math/trayMath.test.js` (add import and tests):

```js
import { climbCalc } from '../../math/trayMath.js'

describe('climbCalc', () => {
  it('45° climb, height 100, sideHeight 100', () => {
    const r = climbCalc(45, 100, 100)
    expect(r.hypotenuse).toBeCloseTo(141.42, 1)
    expect(r.cutWidth).toBeCloseTo(82.84, 1)
  })

  it('90° climb, height 200, sideHeight 100', () => {
    const r = climbCalc(90, 200, 100)
    expect(r.hypotenuse).toBe(200)
    expect(r.cutWidth).toBe(200)
  })

  it('30° climb, height 150, sideHeight 80', () => {
    const r = climbCalc(30, 150, 80)
    expect(r.hypotenuse).toBe(300)
    expect(r.cutWidth).toBeCloseTo(42.87, 1)
  })

  it('throws when angle is 0', () => {
    expect(() => climbCalc(0, 100, 100)).toThrow()
  })

  it('throws when angle > 90', () => {
    expect(() => climbCalc(91, 100, 100)).toThrow()
  })

  it('throws when climbHeight is 0', () => {
    expect(() => climbCalc(45, 0, 100)).toThrow()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/__tests__/math/trayMath.test.js`
Expected: FAIL — climbCalc is not defined.

- [ ] **Step 3: Write minimal implementation**

Add to `src/math/trayMath.js`:

```js
// 万能爬坡计算
export function climbCalc(angle, climbHeight, sideHeight) {
  if (angle <= 0 || angle > 90) throw new Error('角度必须在 0 到 90 度之间')
  if (climbHeight <= 0 || sideHeight <= 0) throw new Error('尺寸必须大于 0')
  const R = toRadians(angle)
  const hypotenuse = round2(climbHeight / Math.sin(R))
  const cutWidth = round2(2 * sideHeight * Math.tan(R / 2))
  return { hypotenuse, cutWidth }
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/__tests__/math/trayMath.test.js`
Expected: PASS — all climb tests pass.

- [ ] **Step 5: Commit**

```bash
git add src/math/trayMath.js src/__tests__/math/trayMath.test.js
git commit -m "feat: add climbCalc with tests"
```

---

## Task 4: horizontalCalc (TDD)

**Files:**
- Modify: `src/math/trayMath.js`
- Modify: `src/__tests__/math/trayMath.test.js`

- [ ] **Step 1: Write the failing tests**

Append to test file:

```js
import { horizontalCalc } from '../../math/trayMath.js'

describe('horizontalCalc', () => {
  it('45° horizontal, shift 200, width 150', () => {
    const r = horizontalCalc(45, 200, 150)
    expect(r.hypotenuse).toBeCloseTo(282.84, 1)
    expect(r.cutWidth).toBeCloseTo(124.26, 1)
  })

  it('90° horizontal, shift 200, width 150', () => {
    const r = horizontalCalc(90, 200, 150)
    expect(r.hypotenuse).toBe(200)
    expect(r.cutWidth).toBe(300)
  })

  it('throws when angle is 0', () => {
    expect(() => horizontalCalc(0, 200, 150)).toThrow()
  })

  it('throws when shiftWidth is 0', () => {
    expect(() => horizontalCalc(45, 0, 150)).toThrow()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/__tests__/math/trayMath.test.js`
Expected: FAIL — horizontalCalc is not defined.

- [ ] **Step 3: Write minimal implementation**

Add to `src/math/trayMath.js`:

```js
// 水平弯计算
export function horizontalCalc(angle, shiftWidth, trayWidth) {
  if (angle <= 0 || angle > 90) throw new Error('角度必须在 0 到 90 度之间')
  if (shiftWidth <= 0 || trayWidth <= 0) throw new Error('尺寸必须大于 0')
  const R = toRadians(angle)
  const hypotenuse = round2(shiftWidth / Math.sin(R))
  const cutWidth = round2(2 * trayWidth * Math.tan(R / 2))
  return { hypotenuse, cutWidth }
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/__tests__/math/trayMath.test.js`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/math/trayMath.js src/__tests__/math/trayMath.test.js
git commit -m "feat: add horizontalCalc with tests"
```

---

## Task 5: multiLayerCalc (TDD)

**Files:**
- Modify: `src/math/trayMath.js`
- Modify: `src/__tests__/math/trayMath.test.js`

- [ ] **Step 1: Write the failing tests**

Append to test file:

```js
import { multiLayerCalc } from '../../math/trayMath.js'

describe('multiLayerCalc', () => {
  it('45°, spacing 100, 3 layers', () => {
    const r = multiLayerCalc(45, 100, 3)
    expect(r).toHaveLength(3)
    expect(r[0].layer).toBe(1)
    expect(r[0].staggerFromBase).toBe(0)
    expect(r[1].staggerFromBase).toBeCloseTo(41.42, 1)
    expect(r[2].staggerFromBase).toBeCloseTo(82.84, 1)
    expect(r[1].staggerPerLayer).toBeCloseTo(41.42, 1)
  })

  it('90°, spacing 200, 2 layers', () => {
    const r = multiLayerCalc(90, 200, 2)
    expect(r[0].staggerFromBase).toBe(0)
    expect(r[1].staggerFromBase).toBe(200)
  })

  it('60°, spacing 100, 1 layer', () => {
    const r = multiLayerCalc(60, 100, 1)
    expect(r).toHaveLength(1)
    expect(r[0].staggerFromBase).toBe(0)
  })

  it('throws when layerCount < 1', () => {
    expect(() => multiLayerCalc(45, 100, 0)).toThrow()
  })

  it('throws when angle is 0', () => {
    expect(() => multiLayerCalc(0, 100, 3)).toThrow()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/__tests__/math/trayMath.test.js`
Expected: FAIL — multiLayerCalc is not defined.

- [ ] **Step 3: Write minimal implementation**

Add to `src/math/trayMath.js`:

```js
// 多层过桥计算
export function multiLayerCalc(angle, layerSpacing, layerCount) {
  if (angle <= 0 || angle > 90) throw new Error('角度必须在 0 到 90 度之间')
  if (layerSpacing <= 0) throw new Error('层间距必须大于 0')
  if (layerCount < 1) throw new Error('层数必须大于等于 1')
  const R = toRadians(angle)
  const staggerPerLayer = round2(layerSpacing * Math.tan(R / 2))
  const result = []
  for (let n = 1; n <= layerCount; n++) {
    result.push({
      layer: n,
      staggerFromBase: round2((n - 1) * layerSpacing * Math.tan(R / 2)),
      staggerPerLayer
    })
  }
  return result
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/__tests__/math/trayMath.test.js`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/math/trayMath.js src/__tests__/math/trayMath.test.js
git commit -m "feat: add multiLayerCalc with tests"
```

---

## Task 6: reducerCalc (TDD)

**Files:**
- Modify: `src/math/trayMath.js`
- Modify: `src/__tests__/math/trayMath.test.js`

- [ ] **Step 1: Write the failing tests**

Append to test file:

```js
import { reducerCalc } from '../../math/trayMath.js'

describe('reducerCalc', () => {
  it('eccentric, widthDiff 100, length 200', () => {
    const r = reducerCalc(100, 200, 'eccentric')
    expect(r.diagonalCutLength).toBeCloseTo(223.61, 1)
    expect(r.cutAngle).toBeCloseTo(26.57, 1)
  })

  it('concentric, widthDiff 100, length 200', () => {
    const r = reducerCalc(100, 200, 'concentric')
    expect(r.diagonalCutLength).toBeCloseTo(206.16, 1)
    expect(r.cutAngle).toBeCloseTo(14.04, 1)
  })

  it('eccentric, widthDiff 0, length 100', () => {
    const r = reducerCalc(0, 100, 'eccentric')
    expect(r.diagonalCutLength).toBe(100)
    expect(r.cutAngle).toBe(0)
  })

  it('throws when transitionLength is 0', () => {
    expect(() => reducerCalc(100, 0, 'eccentric')).toThrow()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/__tests__/math/trayMath.test.js`
Expected: FAIL — reducerCalc is not defined.

- [ ] **Step 3: Write minimal implementation**

Add to `src/math/trayMath.js`:

```js
// 大小头变径计算
export function reducerCalc(widthDiff, transitionLength, reducerType) {
  if (transitionLength <= 0) throw new Error('过渡长度必须大于 0')
  if (widthDiff < 0) throw new Error('变化宽度不能为负')
  const effectiveDiff = reducerType === 'concentric' ? widthDiff / 2 : widthDiff
  const diagonalCutLength = round2(Math.sqrt(effectiveDiff ** 2 + transitionLength ** 2))
  const cutAngle = round2(toDegrees(Math.atan(effectiveDiff / transitionLength)))
  return { diagonalCutLength, cutAngle }
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/__tests__/math/trayMath.test.js`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/math/trayMath.js src/__tests__/math/trayMath.test.js
git commit -m "feat: add reducerCalc with eccentric/concentric support"
```

---

## Task 7: avoidanceCalc (TDD with 90° special case)

**Files:**
- Modify: `src/math/trayMath.js`
- Modify: `src/__tests__/math/trayMath.test.js`

- [ ] **Step 1: Write the failing tests**

Append to test file:

```js
import { avoidanceCalc } from '../../math/trayMath.js'

describe('avoidanceCalc', () => {
  it('45° avoidance, distance 100', () => {
    const r = avoidanceCalc(100, 45)
    expect(r.advanceDistance).toBe(100)
    expect(r.bypassLength).toBeCloseTo(141.42, 1)
  })

  it('90° avoidance, distance 100 (special case)', () => {
    const r = avoidanceCalc(100, 90)
    expect(r.advanceDistance).toBe(0)
    expect(r.bypassLength).toBe(100)
  })

  it('30° avoidance, distance 100', () => {
    const r = avoidanceCalc(100, 30)
    expect(r.advanceDistance).toBeCloseTo(173.21, 1)
    expect(r.bypassLength).toBe(200)
  })

  it('throws when angle is 0', () => {
    expect(() => avoidanceCalc(100, 0)).toThrow()
  })

  it('throws when angle > 90', () => {
    expect(() => avoidanceCalc(100, 91)).toThrow()
  })

  it('throws when avoidDistance is 0', () => {
    expect(() => avoidanceCalc(0, 45)).toThrow()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/__tests__/math/trayMath.test.js`
Expected: FAIL — avoidanceCalc is not defined.

- [ ] **Step 3: Write minimal implementation**

Add to `src/math/trayMath.js`:

```js
// 死角弯避让计算
export function avoidanceCalc(avoidDistance, angle) {
  if (angle <= 0 || angle > 90) throw new Error('角度必须在 0 到 90 度之间')
  if (avoidDistance <= 0) throw new Error('避让距离必须大于 0')
  if (angle === 90) {
    return { advanceDistance: 0, bypassLength: round2(avoidDistance) }
  }
  const R = toRadians(angle)
  const advanceDistance = round2(avoidDistance / Math.tan(R))
  const bypassLength = round2(avoidDistance / Math.sin(R))
  return { advanceDistance, bypassLength }
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/__tests__/math/trayMath.test.js`
Expected: PASS — all tests including 90° special case pass.

- [ ] **Step 5: Run full test suite**

Run: `npx vitest run`
Expected: ALL tests pass (utilities + climb + horizontal + multilayer + reducer + avoidance).

- [ ] **Step 6: Commit**

```bash
git add src/math/trayMath.js src/__tests__/math/trayMath.test.js
git commit -m "feat: add avoidanceCalc with 90° special case handling"
```

---

## Task 8: useWakeLock Composable

**Files:**
- Create: `src/composables/useWakeLock.js`

- [ ] **Step 1: Create the composable**

Create `src/composables/useWakeLock.js`:

```js
import { ref, onBeforeUnmount } from 'vue'

export function useWakeLock() {
  const isActive = ref(false)
  const isSupported = typeof navigator !== 'undefined' && 'wakeLock' in navigator
  let sentinel = null

  async function request() {
    if (!isSupported) return
    try {
      sentinel = await navigator.wakeLock.request('screen')
      isActive.value = true
      sentinel.addEventListener('release', () => {
        isActive.value = false
      })
    } catch (e) {
      isActive.value = false
    }
  }

  async function release() {
    if (sentinel) {
      await sentinel.release()
      sentinel = null
      isActive.value = false
    }
  }

  async function toggle() {
    if (isActive.value) {
      await release()
    } else {
      await request()
    }
  }

  onBeforeUnmount(() => {
    release()
  })

  return { isActive, isSupported, toggle }
}
```

- [ ] **Step 2: Commit**

```bash
git add src/composables/useWakeLock.js
git commit -m "feat: add useWakeLock composable for screen wake lock"
```

---

## Task 9: AngleQuickButtons Component

**Files:**
- Create: `src/components/AngleQuickButtons.vue`

- [ ] **Step 1: Create the component**

Create `src/components/AngleQuickButtons.vue`:

```vue
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
```

- [ ] **Step 2: Commit**

```bash
git add src/components/AngleQuickButtons.vue
git commit -m "feat: add AngleQuickButtons component"
```

---

## Task 10: ResultCard Component

**Files:**
- Create: `src/components/ResultCard.vue`

- [ ] **Step 1: Create the component**

Create `src/components/ResultCard.vue`:

```vue
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
```

- [ ] **Step 2: Commit**

```bash
git add src/components/ResultCard.vue
git commit -m "feat: add ResultCard component with copy functionality"
```

---

## Task 11: Home.vue and Special.vue Entry Pages

**Files:**
- Create: `src/views/Home.vue`
- Create: `src/views/Special.vue`

- [ ] **Step 1: Create Home.vue**

Create `src/views/Home.vue`:

```vue
<template>
  <div class="page">
    <van-nav-bar title="计算" />
    <div class="cards">
      <van-cell-group inset>
        <van-cell title="万能爬坡" label="上下弯 · 计算斜边长和切口尺寸" is-link @click="$router.push('/climb')" size="large" />
        <van-cell title="水平弯" label="左右弯 · 计算斜边长和切口尺寸" is-link @click="$router.push('/horizontal')" size="large" />
      </van-cell-group>
    </div>
  </div>
</template>

<script setup>
</script>

<style scoped>
.page { padding-bottom: 60px; }
.cards { margin-top: 16px; }
</style>
```

- [ ] **Step 2: Create Special.vue**

Create `src/views/Special.vue`:

```vue
<template>
  <div class="page">
    <van-nav-bar title="特殊计算" />
    <div class="cards">
      <van-cell-group inset>
        <van-cell title="多层过桥" label="多层排布 · 起弯点错位计算" is-link @click="$router.push('/multilayer')" size="large" />
        <van-cell title="大小头变径" label="偏心/同心变径 · 对角切割长度" is-link @click="$router.push('/reducer')" size="large" />
        <van-cell title="死角弯避让" label="障碍物避让 · 提前起弯距离" is-link @click="$router.push('/avoidance')" size="large" />
      </van-cell-group>
    </div>
  </div>
</template>

<script setup>
</script>

<style scoped>
.page { padding-bottom: 60px; }
.cards { margin-top: 16px; }
</style>
```

- [ ] **Step 3: Commit**

```bash
git add src/views/Home.vue src/views/Special.vue
git commit -m "feat: add Home and Special entry pages"
```

---

## Task 12: ClimbCalc.vue

**Files:**
- Create: `src/views/ClimbCalc.vue`

- [ ] **Step 1: Create ClimbCalc.vue**

Create `src/views/ClimbCalc.vue`:

```vue
<template>
  <div class="page">
    <van-nav-bar title="万能爬坡计算" left-arrow @click-left="$router.back()" />
    <div class="content">
      <div class="wake-lock" v-if="wakeLock.isSupported.value">
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

async function onWakeChange(val) {
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
```

- [ ] **Step 2: Commit**

```bash
git add src/views/ClimbCalc.vue
git commit -m "feat: add ClimbCalc calculation page"
```

---

## Task 13: HorizontalCalc.vue

**Files:**
- Create: `src/views/HorizontalCalc.vue`

- [ ] **Step 1: Create HorizontalCalc.vue**

Create `src/views/HorizontalCalc.vue`:

```vue
<template>
  <div class="page">
    <van-nav-bar title="水平弯计算" left-arrow @click-left="$router.back()" />
    <div class="content">
      <div class="wake-lock" v-if="wakeLock.isSupported.value">
        <span>保持常亮</span>
        <van-switch v-model="wakeActive" @change="onWakeChange" />
      </div>

      <van-field v-model.number="form.angle" type="number" label="角度" placeholder="输入角度（度）" size="large">
        <template #button>°</template>
      </van-field>
      <AngleQuickButtons v-model="form.angle" />

      <van-field v-model.number="form.shiftWidth" type="number" label="平移宽度" placeholder="毫米" size="large" />
      <van-field v-model.number="form.trayWidth" type="number" label="桥架宽度" placeholder="毫米" size="large" />

      <van-button type="primary" block @click="calc" style="margin-top: 16px;">计算</van-button>

      <ResultCard v-if="result" :results="result" />
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { showToast } from 'vant'
import { horizontalCalc } from '../math/trayMath.js'
import AngleQuickButtons from '../components/AngleQuickButtons.vue'
import ResultCard from '../components/ResultCard.vue'
import { useWakeLock } from '../composables/useWakeLock.js'

const wakeLock = useWakeLock()
const wakeActive = ref(false)
const form = reactive({ angle: null, shiftWidth: null, trayWidth: null })
const result = ref(null)

async function onWakeChange(val) {
  await wakeLock.toggle()
  wakeActive.value = wakeLock.isActive.value
}

function calc() {
  if (!form.angle || form.angle <= 0 || form.angle > 90) {
    return showToast('角度必须在 0 到 90 度之间')
  }
  if (!form.shiftWidth || form.shiftWidth <= 0) {
    return showToast('平移宽度必须大于 0')
  }
  if (!form.trayWidth || form.trayWidth <= 0) {
    return showToast('桥架宽度必须大于 0')
  }
  try {
    const r = horizontalCalc(form.angle, form.shiftWidth, form.trayWidth)
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
```

- [ ] **Step 2: Commit**

```bash
git add src/views/HorizontalCalc.vue
git commit -m "feat: add HorizontalCalc calculation page"
```

---

## Task 14: MultiLayerCalc.vue (two-column table)

**Files:**
- Create: `src/views/MultiLayerCalc.vue`

- [ ] **Step 1: Create MultiLayerCalc.vue**

Create `src/views/MultiLayerCalc.vue`:

```vue
<template>
  <div class="page">
    <van-nav-bar title="多层过桥计算" left-arrow @click-left="$router.back()" />
    <div class="content">
      <div class="wake-lock" v-if="wakeLock.isSupported.value">
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

async function onWakeChange(val) {
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
```

- [ ] **Step 2: Commit**

```bash
git add src/views/MultiLayerCalc.vue
git commit -m "feat: add MultiLayerCalc with two-column stagger table"
```

---

## Task 15: ReducerCalc.vue (van-radio-group)

**Files:**
- Create: `src/views/ReducerCalc.vue`

- [ ] **Step 1: Create ReducerCalc.vue**

Create `src/views/ReducerCalc.vue`:

```vue
<template>
  <div class="page">
    <van-nav-bar title="大小头变径计算" left-arrow @click-left="$router.back()" />
    <div class="content">
      <div class="wake-lock" v-if="wakeLock.isSupported.value">
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

async function onWakeChange(val) {
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
```

- [ ] **Step 2: Commit**

```bash
git add src/views/ReducerCalc.vue
git commit -m "feat: add ReducerCalc with eccentric/concentric radio selection"
```

---

## Task 16: AvoidCalc.vue

**Files:**
- Create: `src/views/AvoidCalc.vue`

- [ ] **Step 1: Create AvoidCalc.vue**

Create `src/views/AvoidCalc.vue`:

```vue
<template>
  <div class="page">
    <van-nav-bar title="死角弯避让计算" left-arrow @click-left="$router.back()" />
    <div class="content">
      <div class="wake-lock" v-if="wakeLock.isSupported.value">
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

async function onWakeChange(val) {
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
```

- [ ] **Step 2: Commit**

```bash
git add src/views/AvoidCalc.vue
git commit -m "feat: add AvoidCalc calculation page"
```

---

## Task 17: About.vue

**Files:**
- Create: `src/views/About.vue`

- [ ] **Step 1: Create About.vue**

Create `src/views/About.vue`:

```vue
<template>
  <div class="page">
    <van-nav-bar title="说明" />
    <div class="content">
      <van-cell-group inset title="使用说明">
        <van-cell title="1. 选择计算类型" label="在首页或特殊计算页选择需要的计算功能" />
        <van-cell title="2. 输入参数" label="输入角度（可用快捷按钮）和尺寸，单位为毫米" />
        <van-cell title="3. 点击计算" label="查看结果，可一键复制数据" />
        <van-cell title="4. 保持常亮" label="开启开关可防止屏幕自动息屏" />
      </van-cell-group>

      <van-cell-group inset title="公式参考" style="margin-top: 16px;">
        <van-cell title="爬坡" label="斜边 = 高度 / sin(角度)，切口 = 2 × 帮高 × tan(角度/2)" />
        <van-cell title="水平弯" label="斜边 = 平移 / sin(角度)，切口 = 2 × 桥宽 × tan(角度/2)" />
        <van-cell title="多层过桥" label="单层错位 = 间距 × tan(角度/2)" />
        <van-cell title="大小头" label="偏心: √(差²+长²)，同心: √((差/2)²+长²)" />
        <van-cell title="死角避让" label="提前起弯 = 距离 / tan(角度)，绕行 = 距离 / sin(角度)" />
      </van-cell-group>

      <van-cell-group inset title="添加到主屏幕" style="margin-top: 16px;">
        <van-cell title="Android Chrome" label="菜单 → 添加到主屏幕" />
        <van-cell title="iOS Safari" label="分享 → 添加到主屏幕" />
      </van-cell-group>

      <div class="about-footer">
        <p>桥架弯头计算器 v1.0.0</p>
        <p>开源免费 · 离线可用 · 无广告</p>
      </div>
    </div>
  </div>
</template>

<script setup>
</script>

<style scoped>
.page { padding-bottom: 60px; }
.content { padding: 12px 0; }
.about-footer { text-align: center; color: #999; font-size: 13px; margin-top: 24px; }
.about-footer p { margin: 4px 0; }
</style>
```

- [ ] **Step 2: Commit**

```bash
git add src/views/About.vue
git commit -m "feat: add About page with instructions and formula reference"
```

---

## Task 18: App.vue Tabbar + Routing Finalization

**Files:**
- Modify: `src/App.vue`

- [ ] **Step 1: Update App.vue with Tabbar**

Replace `src/App.vue`:

```vue
<template>
  <router-view />
  <van-tabbar v-model="active" route>
    <van-tabbar-item to="/home" icon="home-o">计算</van-tabbar-item>
    <van-tabbar-item to="/special" icon="apps-o">特殊</van-tabbar-item>
    <van-tabbar-item to="/about" icon="info-o">说明</van-tabbar-item>
  </van-tabbar>
</template>

<script setup>
import { ref } from 'vue'
import { Tabbar as VanTabbar, TabbarItem as VanTabbarItem } from 'vant'

const active = ref('')
</script>

<style>
body { margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #f7f8fa; }
#app { min-height: 100vh; }
</style>
```

- [ ] **Step 2: Verify dev server and navigation**

Run: `npm run dev`
Expected: App loads, 3 tabs visible at bottom, navigation works between tabs.

- [ ] **Step 3: Commit**

```bash
git add src/App.vue
git commit -m "feat: add bottom Tabbar navigation to App.vue"
```

---

## Task 19: PWA Icons and Final PWA Config

**Files:**
- Create: `public/icons/icon-192x192.png`
- Create: `public/icons/icon-512x512.png`

- [ ] **Step 1: Create icon placeholders**

Create the `public/icons/` directory. Generate or place 192x192 and 512x512 PNG icons (orange background with a simple bridge/calc icon). If no design tool available, create simple solid-color PNG placeholders named `icon-192x192.png` and `icon-512x512.png`.

- [ ] **Step 2: Verify build with PWA**

Run: `npm run build`
Expected: Build succeeds, generates `dist/` with service worker and manifest.

- [ ] **Step 3: Commit**

```bash
git add public/icons/
git commit -m "feat: add PWA icons"
```

---

## Task 20: Final Build Verification and Full Test Suite

- [ ] **Step 1: Run full test suite**

Run: `npx vitest run`
Expected: ALL unit tests pass.

- [ ] **Step 2: Run production build**

Run: `npm run build`
Expected: Build completes without errors, `dist/` folder generated.

- [ ] **Step 3: Preview production build**

Run: `npm run preview`
Expected: App loads correctly, all 5 calculation modules work, Tabbar navigation works.

- [ ] **Step 4: Manual verification of all modules**

Verify each calculation page:
- /climb: input 45°, height 100, sideHeight 100 → 斜边长 141.42, 切口宽度 82.84
- /horizontal: input 45°, shift 200, width 150 → 斜边长 282.84, 切口宽度 124.26
- /multilayer: input 45°, spacing 100, 3 layers → table with two columns
- /reducer: input 100, 200, eccentric → 223.61, 26.57°; concentric → 206.16, 14.04°
- /avoidance: input 100, 45° → 100, 141.42; 90° → 0, 100

- [ ] **Step 5: Final commit**

```bash
git add -A
git commit -m "chore: final build verification complete"
```

---

## Plan Summary

| Task | Description | Key Deliverable |
|------|-------------|-----------------|
| 1 | Project Scaffolding | Runnable Vue + Vite + Vant app |
| 2 | trayMath utilities | toRadians, toDegrees, round2 |
| 3 | climbCalc | 万能爬坡计算 |
| 4 | horizontalCalc | 水平弯计算 |
| 5 | multiLayerCalc | 多层过桥（两列表格） |
| 6 | reducerCalc | 大小头变径（偏心/同心） |
| 7 | avoidanceCalc | 死角弯避让（90°特判） |
| 8 | useWakeLock | 屏幕常亮 composable |
| 9 | AngleQuickButtons | 快捷角度按钮 |
| 10 | ResultCard | 结果卡片 + 复制 |
| 11 | Home + Special | 入口页面 |
| 12 | ClimbCalc | 爬坡计算页 |
| 13 | HorizontalCalc | 水平弯计算页 |
| 14 | MultiLayerCalc | 多层过桥计算页 |
| 15 | ReducerCalc | 变径计算页 |
| 16 | AvoidCalc | 避让计算页 |
| 17 | About | 说明页 |
| 18 | App.vue Tabbar | 底部导航 |
| 19 | PWA Icons | PWA 图标 |
| 20 | Final Verification | 全量测试 + 构建 |

**Total: 20 tasks**