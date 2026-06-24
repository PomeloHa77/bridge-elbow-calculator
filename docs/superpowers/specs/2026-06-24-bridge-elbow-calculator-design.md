# 桥架弯头计算器 设计规格文档

> 日期: 2026-06-24 | 状态: 已确认 | 版本: 1.0

---

## 1. Goal（目标）

开发一个**移动端优先、纯前端、无广告、可离线使用**的桥架弯头计算 Web 应用。为电工师傅提供万能爬坡、水平弯、多层过桥、大小头变径、死角弯避让等专业计算功能，全部免费开放，打破行业信息差。通过 PWA 技术实现离线可用、添加到主屏幕等原生 App 体验。

---

## 2. Non-Goals（非目标）

- **动态切口图（模块三）**：不在 MVP 阶段实现。预留架构占位，后续版本迭代。
- **后端服务与数据库**：纯前端架构，零后端依赖。不涉及用户注册、登录、数据同步。
- **国际化（i18n）**：仅支持简体中文，不做多语言适配。
- **iOS/Android 原生应用商店发布**：仅通过 PWA 的 "添加到主屏幕" 实现安装体验，不上架应用商店。
- **多单位系统**：仅支持毫米（mm）作为统一单位，不提供英寸/厘米切换。
- **历史记录/收藏功能**：不实现计算历史保存。用户可通过"一键复制"自行保存结果。

---

## 3. Context（背景）

### 3.1 产品背景

建筑工地电工在进行桥架（电缆托盘）敷设时，经常需要在垂直爬升、水平转向、过障碍物、变径过渡等场景下对桥架进行弯头加工。传统做法依赖工人经验估算或付费 App，存在以下痛点：

- 手工估算误差大，导致材料浪费和返工。
- 现有付费 App 将"多层过桥"、"死角弯避让"等高级功能设为 VIP 收费。
- 地下室等弱信号环境导致在线工具无法加载。

本工具旨在提供一个**完全免费、离线可用、精度可靠**的计算方案。

### 3.2 技术背景

项目从零开始初始化，当前仓库仅包含 `项目文档.md`（需求文档）。无已有代码。技术选型如下：

| 层面 | 选型 | 理由 |
|------|------|------|
| 框架 | Vue 3 (Composition API, `<script setup>`) | 主流前端框架，生态成熟，适合中型 SPA |
| 构建 | Vite | 快速 HMR，原生 ES 模块支持 |
| UI | Vant 4 | 移动端专用组件库，提供 Field、Button、Toast、Switch、Tabbar 等 |
| 路由 | Vue Router 4 (Hash 模式) | Hash 模式兼容 GitHub Pages 等静态托管，无服务端配置 |
| PWA | vite-plugin-pwa | 自动生成 Manifest + Service Worker，预缓存静态资源 |
| 测试 | Vitest + @vue/test-utils | 与 Vite 生态无缝集成 |
| 部署 | GitHub Pages / Vercel / Netlify | 静态托管，零成本 |

---

## 4. Proposed Architecture（架构设计）

### 4.1 整体架构

```
┌─────────────────────────────────────────────────────┐
│                    App.vue                          │
│  ┌───────────────┐  ┌──────────────────────────┐   │
│  │  <router-view> │  │  <van-tabbar> (底部导航)  │   │
│  │   计算页面区域  │  │   计算 | 特殊 | 说明       │   │
│  └───────────────┘  └──────────────────────────┘   │
└─────────────────────────────────────────────────────┘
```

应用采用**底部标签栏导航**（Approach A），三个主 Tab：

- **Tab 1 "计算"** → Home.vue → 两个大卡片入口：万能爬坡 / 水平弯
- **Tab 2 "特殊"** → Special.vue → 三个卡片入口：多层过桥 / 大小头变径 / 死角弯避让
- **Tab 3 "说明"** → About.vue → 使用说明 + 公式参考 + 关于信息

每个计算入口点击后通过 `router.push` 导航到对应的计算页面，页面顶部有返回按钮（通过路由 `back()` 或 `<van-nav-bar>` 实现）。

### 4.2 核心计算层：trayMath.js（纯函数库）

所有计算逻辑封装在 `src/math/trayMath.js` 中，作为**纯函数库**，无副作用、无 DOM 依赖、无 Vue 依赖。这是整个应用的心脏。

#### 4.2.1 通用工具函数

```js
// 角度转弧度
function toRadians(degrees) { return degrees * Math.PI / 180; }

// 弧度转角度
function toDegrees(radians) { return radians * 180 / Math.PI; }

// 结果取整到 2 位小数
function round2(value) { return Math.round(value * 100) / 100; }
```

#### 4.2.2 万能爬坡计算 (climbCalc)

- **输入**：`angle`（角度, °），`climbHeight`（爬坡高度, mm），`sideHeight`（桥架帮高, mm）
- **输出**：`{ hypotenuse, cutWidth }`
- **公式**：
  - 斜边长 `hypotenuse = climbHeight / sin(angle)` 
  - 切口宽度 `cutWidth = 2 × sideHeight × tan(angle / 2)`
- **边界处理**：angle ≤ 0 → 抛出错误；angle = 90° → hypotenuse = climbHeight（sin(90°) = 1）；结果调用 `round2` 取整。

#### 4.2.3 水平弯计算 (horizontalCalc)

- **输入**：`angle`（角度, °），`shiftWidth`（平移宽度, mm），`trayWidth`（桥架宽度, mm）
- **输出**：`{ hypotenuse, cutWidth }`
- **公式**：
  - 斜边长 `hypotenuse = shiftWidth / sin(angle)`
  - 切口宽度 `cutWidth = 2 × trayWidth × tan(angle / 2)`
- **边界处理**：同爬坡计算。

#### 4.2.4 多层过桥计算 (multiLayerCalc)

- **概念**：多层桥架同时弯折时，所有层的斜边长度相同。不同层需要错位起弯点以保持层间距。
- **输入**：`angle`（角度, °），`layerSpacing`（层间距 S, mm），`layerCount`（层数, 整数 ≥ 1）
- **输出**：`Array<{ layer: number, staggerFromBase: number }>` —— 每层相对于第 1 层（基准层）的累计错位距离。
- **公式**：
  - 单层错位量 `staggerPerLayer = layerSpacing × tan(angle / 2)`
  - 第 n 层累计错位 `(n - 1) × staggerPerLayer`
- **边界处理**：layerCount < 1 → 抛出错误；层数为 1 时返回 `[{layer: 1, staggerFromBase: 0}]`。

#### 4.2.5 大小头变径计算 (reducerCalc)

- **概念**：支持两种变径类型——单边变径（偏心/Eccentric）和双边对称变径（同心/Concentric）。
- **输入**：`widthDiff`（总变化宽度, mm），`transitionLength`（过渡长度 L, mm），`reducerType`（"eccentric" | "concentric"）
- **输出**：`{ diagonalCutLength, cutAngle }`
- **公式**：
  - **Eccentric（偏心）**：
    - 对角线切割长度 = `√(widthDiff² + transitionLength²)`
    - 切割角度 = `atan(widthDiff / transitionLength)`（度）
  - **Concentric（同心）**：
    - 单侧切割斜边长 = `√((widthDiff / 2)² + transitionLength²)`
    - 切割角度 = `atan((widthDiff / 2) / transitionLength)`（度）
- **边界处理**：transitionLength ≤ 0 → 抛出错误；widthDiff = 0 → diagonalCutLength = transitionLength, cutAngle = 0。

#### 4.2.6 死角弯避让计算 (avoidanceCalc)

- **输入**：`avoidDistance`（避让距离/障碍物突出深度, mm），`angle`（角度, °）
- **输出**：`{ advanceDistance, bypassLength }`
- **公式**：
  - 提前起弯距离 `advanceDistance = avoidDistance / tan(angle)`
  - 绕行斜边长 `bypassLength = avoidDistance / sin(angle)`
- **90° 特殊处理**：当 angle === 90 时，`Math.tan(90°)` 在 JavaScript 中返回极大浮点数（~1.6e16），必须强制 `advanceDistance = 0`。此时 `bypassLength = avoidDistance`（因为 sin(90°) = 1）。

### 4.3 组件树

```
App.vue
├── router-view
│   ├── Home.vue                              (Tab "计算" 首页)
│   ├── ClimbCalc.vue                         (万能爬坡计算页)
│   ├── HorizontalCalc.vue                    (水平弯计算页)
│   ├── Special.vue                           (Tab "特殊" 首页)
│   ├── MultiLayerCalc.vue                    (多层过桥计算页)
│   ├── ReducerCalc.vue                       (大小头变径计算页)
│   ├── AvoidCalc.vue                         (死角弯避让计算页)
│   └── About.vue                             (Tab "说明" 页)
├── van-tabbar                               (底部导航)
└── Shared Components:
    ├── AngleQuickButtons.vue                  (30°/45°/60°/90° 快速角度按钮)
    └── ResultCard.vue                         (醒目结果卡片 + 一键复制)
```

### 4.4 路由设计

| 路径 | 组件 | 说明 |
|------|------|------|
| `/` → 重定向到 `/home` | - | 默认进入计算 Tab |
| `/home` | Home.vue | 基础计算入口 |
| `/climb` | ClimbCalc.vue | 万能爬坡计算 |
| `/horizontal` | HorizontalCalc.vue | 水平弯计算 |
| `/special` | Special.vue | 特殊计算入口 |
| `/multilayer` | MultiLayerCalc.vue | 多层过桥计算 |
| `/reducer` | ReducerCalc.vue | 大小头变径计算 |
| `/avoidance` | AvoidCalc.vue | 死角弯避让计算 |
| `/about` | About.vue | 使用说明 |

路由模式：`createWebHashHistory()`，兼容 GitHub Pages。

### 4.5 数据流

```
用户输入 → van-field (v-model 双向绑定)
       ↓
  点击"计算"按钮
       ↓
  调用 trayMath.xxxCalc(inputs)  →  返回计算结果对象
       ↓
  展示在 ResultCard 组件中（大字号 + 橙色/黄色背景）
       ↓
  用户点击"复制数据" → navigator.clipboard.writeText() → Toast("已复制")
```

- **计算逻辑**完全在 `trayMath.js` 纯函数中执行，不涉及 Vue 响应式系统。
- **输入验证**在组件层执行（检查 angle 范围 0 < angle ≤ 90，尺寸 > 0），验证失败通过 Vant Toast 显示红色错误提示，不调用计算函数。
- **90° 特判**在 `avoidanceCalc` 内部处理，调用方无需感知。
- **小数精度**：所有返回结果由 `round2()` 统一处理，组件层不再重复取整。

### 4.6 屏幕常亮功能（Screen Wake Lock）

- 在每个计算页面的顶部放置一个 `van-switch` 开关，标注"保持常亮"。
- 开关打开时调用 `navigator.wakeLock.request('screen')`，获取 `WakeLockSentinel` 引用。
- 开关关闭或页面卸载（`onBeforeUnmount`）时调用 `sentinel.release()` 释放。
- 如果浏览器不支持 Wake Lock API（`navigator.wakeLock` 为 undefined），不渲染该开关（使用 `v-if` 条件隐藏）。
- 因为页面可能在后台失去焦点导致系统释放唤醒锁，需监听 `sentinel` 的 `release` 事件，自动同步开关状态。

### 4.7 PWA 配置

- **插件**：`vite-plugin-pwa`，在 `vite.config.js` 中配置。
- **Manifest**：
  - `name`: "桥架弯头计算器"
  - `short_name`: "桥架计算器"
  - `display`: "standalone"
  - `theme_color`: "#FF6B00"（橙色，与品牌色调一致）
  - `background_color`: "#FFFFFF"
  - `icons`: 从 `public/icons/` 目录加载（需提供 192x192 和 512x512 两种尺寸的 PNG 图标）。
- **Service Worker 缓存策略**：采用 **Cache First**（缓存优先）策略。
  - 核心 HTML/JS/CSS 资源预先缓存（precache）。
  - 首次访问后，后续加载直接命中缓存，加载时间 < 1 秒。
  - 处理"地下室弱信号"场景（不仅是完全离线，还包括极慢网络）。
- **添加到主屏幕提示**：在 About.vue 中提供图文说明，引导用户将 PWA 添加到手机主屏幕。

### 4.8 UI/UX 规范

| 规范项 | 具体值 |
|--------|--------|
| 输入框尺寸 | Vant Field `size="large"`，placeholder 标注"毫米" |
| 角度输入 | 支持手动输入 + AngleQuickButtons 快捷填入 |
| 结果字号 | 24–32px bold，搭配橙色 (#FFF3E0) 或黄色 (#FFFDE7) 背景卡片 |
| 复制按钮 | 每个 ResultCard 内嵌"复制数据"按钮，调用 clipboard API，Toast "已复制" |
| 错误提示 | 红色 Toast，2 秒自动消失 |
| 返回导航 | 计算页面顶部使用 `<van-nav-bar left-arrow @click-left="$router.back()">` |
| 颜色主题 | 以工地安全色系为基础：主色橙色 (#FF6B00)，辅色灰色背景，高对比度文字 |

---

## 5. Files To Change（文件清单）

### 5.1 新建文件

| 文件路径 | 说明 |
|----------|------|
| `index.html` | 入口 HTML，含 viewport meta 标签和 PWA 注册 |
| `package.json` | 项目依赖与脚本定义 |
| `vite.config.js` | Vite 构建配置 + vite-plugin-pwa 插件配置 |
| `src/main.js` | Vue 应用入口，注册 Router 和 Vant |
| `src/App.vue` | 根组件，含 `<router-view>` 和 `<van-tabbar>` |
| `src/router.js` | Vue Router 路由配置（Hash 模式） |
| `src/math/trayMath.js` | 核心计算纯函数库（见 4.2 节全部函数） |
| `src/views/Home.vue` | Tab "计算" 首页（两个大卡片入口） |
| `src/views/ClimbCalc.vue` | 万能爬坡计算页 |
| `src/views/HorizontalCalc.vue` | 水平弯计算页 |
| `src/views/Special.vue` | Tab "特殊" 首页（三个卡片入口） |
| `src/views/MultiLayerCalc.vue` | 多层过桥计算页（含结果表格） |
| `src/views/ReducerCalc.vue` | 大小头变径计算页（含类型选择） |
| `src/views/AvoidCalc.vue` | 死角弯避让计算页 |
| `src/views/About.vue` | 使用说明 + 公式参考 + 关于信息 + PWA 安装引导 |
| `src/components/AngleQuickButtons.vue` | 30°/45°/60°/90° 快捷角度按钮组 |
| `src/components/ResultCard.vue` | 醒目结果展示卡片（含"复制数据"按钮） |
| `public/icons/icon-192x192.png` | PWA 192px 图标 |
| `public/icons/icon-512x512.png` | PWA 512px 图标 |
| `src/__tests__/math/trayMath.test.js` | trayMath.js 单元测试（Vitest） |
| `src/__tests__/components/` | 组件测试目录（@vue/test-utils） |

### 5.2 修改文件

无——项目从零初始化，无已存在代码需修改。

---

## 6. Testing Strategy（测试策略）

### 6.1 单元测试：trayMath.js（最高优先级）

使用 **Vitest** 对所有纯函数进行全覆盖测试。

**必测用例**（由最终用户确认）：

| 函数 | 测试用例 | 预期结果 |
|------|----------|----------|
| `toRadians(180)` | 180° → π | ≈ 3.14159 |
| `toDegrees(Math.PI)` | π → 180° | 180 |
| `round2(3.14159)` | 精度取整 | 3.14 |
| `climbCalc(45, 100, 100)` | 45°爬坡，高100，帮高100 | hypotenuse ≈ 141.42, cutWidth ≈ 82.84 |
| `climbCalc(90, 200, 100)` | 90°爬坡，高200 | hypotenuse = 200, cutWidth = 200 |
| `climbCalc(30, 150, 80)` | 30°爬坡 | hypotenuse = 300, cutWidth ≈ 42.87 |
| `horizontalCalc(45, 200, 150)` | 45°水平弯，平移200，宽150 | hypotenuse ≈ 282.84, cutWidth ≈ 124.26 |
| `horizontalCalc(90, 200, 150)` | 90°水平弯 | hypotenuse = 200, cutWidth = 300 |
| `multiLayerCalc(45, 100, 3)` | 45°，间距100，共3层 | 层1:0, 层2:≈41.42, 层3:≈82.84 |
| `multiLayerCalc(90, 200, 2)` | 90°，间距200，共2层 | 层1:0, 层2:200 |
| `multiLayerCalc(60, 100, 1)` | 单层 | 层1:0 |
| `reducerCalc(100, 200, "eccentric")` | 偏心, 差100, 长200 | diagonal ≈ 223.61, angle ≈ 26.57° |
| `reducerCalc(100, 200, "concentric")` | 同心, 差100, 长200 | diagonal ≈ 206.16, angle ≈ 14.04° |
| `reducerCalc(0, 100, "eccentric")` | 宽度差0 | diagonal = 100, angle = 0 |
| `avoidanceCalc(100, 45)` | 45°避让100 | advance = 100, bypass ≈ 141.42 |
| `avoidanceCalc(100, 90)` | 90°避让100 | advance = 0 (强制), bypass = 100 |
| `avoidanceCalc(100, 30)` | 30°避让100 | advance ≈ 173.21, bypass = 200 |

**边界与错误测试**：

- `climbCalc(0, 100, 100)` → 抛出错误（角度为 0）。
- `climbCalc(91, 100, 100)` → 抛出错误（角度超过 90°）。
- `climbCalc(45, 0, 100)` → 抛出错误（尺寸为 0）。
- `reducerCalc(100, 0, "eccentric")` → 抛出错误（过渡长度 ≤ 0）。
- `multiLayerCalc(45, 100, 0)` → 抛出错误（层数 < 1）。
- `avoidanceCalc(100, 0)` → 抛出错误（角度为 0）。

### 6.2 组件测试

使用 **@vue/test-utils + Vitest** 对关键交互进行测试：

- **AngleQuickButtons**：点击 30° 按钮，触发 `update:modelValue` 事件，值为 30。
- **ResultCard**：传入 `hypotenuse=141.42`，渲染该数值；点击"复制数据"，验证 `navigator.clipboard.writeText` 被调用且 Toast 显示。
- **计算页面**（ClimbCalc / HorizontalCalc）：输入合法值 → 点击计算 → 渲染结果；输入非法值 → 显示红色 Toast 且不调用计算函数。
- **ReducerCalc**：切换 reducerType（偏心/同心），验证结果变化。

### 6.3 手工测试场景

- iOS Safari 和 Android Chrome 上 PWA 添加到主屏幕流程。
- 开启飞行模式 → 验证离线可用（Cache First 策略）。
- 屏幕旋转 → 验证布局自适应。
- 常亮开关实测（需真机验证 Wake Lock 行为）。

---

## 7. Risks And Mitigations（风险与缓解）

### 7.1 风险一：数学精度与边界值导致显示异常

- **描述**：JavaScript 浮点运算可能产生 `0.00000000000001` 这类精度误差，tan(90°) 返回极大值。
- **影响**：用户看到大量无效小数位，产生不信任感；90° 特判缺失会导致页面卡死。
- **缓解措施**：
  - 所有计算结果统一通过 `round2()` 取 2 位小数。
  - 在 `avoidanceCalc` 中显式判断 `angle === 90` 直接赋 0，不调用 `Math.tan`。
  - 在 `climbCalc` 和 `horizontalCalc` 中，`tan(angle/2)` 在角度 ≤ 90° 时最大为 `tan(45°)` = 1，安全。
  - 单元测试覆盖所有边界值（0° 错误、90° 特判、0 值错误）。

### 7.2 风险二：Screen Wake Lock API 兼容性与稳定性

- **描述**：Wake Lock API 仅 HTTPS 或 localhost 下可用，部分浏览器（如 Firefox Android）不支持；系统可能因省电策略自动释放唤醒锁。
- **影响**：部分用户无法使用"保持常亮"功能，手机在施工中可能锁屏。
- **缓解措施**：
  - 特性检测 `navigator.wakeLock`：不支持时用 `v-if` 隐藏开关，不显示错误。
  - 监听 `sentinel.onrelease` 事件，自动同步开关 UI 状态。
  - 页面可见性变化（`visibilitychange`）时尝试重新请求唤醒锁。
  - 在 About.vue 中说明该功能的前提条件（HTTPS + 支持的浏览器）。

### 7.3 风险三：PWA 缓存过期导致用户看到旧版本

- **描述**：Cache First 策略可能导致 Service Worker 缓存的旧版本代码一直不被更新。
- **影响**：用户始终使用旧版本，看不到 Bug 修复或新功能。
- **缓解措施**：
  - `vite-plugin-pwa` 默认在 SW 检测到新版本时弹出更新提示（`registerType: 'autoUpdate'`）。
  - 在 About.vue 的关于信息中显示当前版本号（从 `package.json` 注入）。
  - 发布新版本时修改 Service Worker 的缓存键（由 Vite 构建自动生成新的文件哈希）。

### 7.4 风险四：Hash 路由模式下页面刷新白屏

- **描述**：GitHub Pages 对 SPA 的路由 Fallback 支持不完美，可能导致直接访问子路径时 404。
- **影响**：用户分享链接或刷新页面时看到 GitHub 404 页面。
- **缓解措施**：
  - 使用 Hash 模式（URL 中带 `#/`），GitHub Pages 将其视为同一页面的锚点，不会触发 404。这是 Vite + GitHub Pages 的成熟方案。
  - 在 `public/` 目录添加 GitHub Pages 的 404 重定向页面作为兜底（可选，该方案已验证可行）。

---

## 8. Decision Summary（决策总结）

- **框架选型**：Vue 3 + Vite + Vant 4 + Vue Router 4（Hash 模式）。
- **架构模式**：底部 Tabbar 导航（Approach A），三个主 Tab："计算" / "特殊" / "说明"。
- **核心数学**：所有计算逻辑集中在 `src/math/trayMath.js` 纯函数库，无副作用，独立可测。
- **角度范围**：限定 0 < angle ≤ 90°，覆盖 99.9% 的施工场景。
- **90° 特判**：死角弯避让计算中 angle = 90 时强制 advanceDistance = 0，绕过 JavaScript `Math.tan` 精度问题。
- **小数精度**：所有结果统一 round2 取 2 位小数后展示。
- **单位**：统一使用毫米（mm），不做多单位。
- **PWA 缓存策略**：Cache First（缓存优先），确保弱信号场景下秒开。
- **屏幕常亮**：通过浏览器 Wake Lock API 实现，不支持时静默隐藏开关。
- **动态切口图**：不在 MVP 范围，后续版本实现。
- **测试优先顺序**：trayMath.js 单元测试 → 组件交互测试 → PWA 手工验收。
- **部署**：GitHub Pages 静态托管（Hash 路由模式天然兼容），备选 Vercel / Netlify。
- **语言**：界面使用简体中文，代码标识符使用英文。

---

## 9. Resolved Questions（已确认问题）

以下问题已由用户确认，作为最终设计决策：

1. **多层过桥的表格展示格式**：**两列都显示**——同时展示"相邻层单层错位量"列和"相对于第 1 层累计错位距离"列，增强可读性。

2. **角度快捷按钮的默认行为**：**仅填入角度**——点击快捷按钮后只填入角度值，用户确认其他输入后手动点击"计算"按钮。

3. **Reducer 类型选择器的 UI 形态**：**使用 `van-radio-group`**（单选按钮组），偏心/同心两个选项并排显示，直观明了。

---

*本文档由 superpowers-brainstorming 流程生成，已通过 spec self-review。*
