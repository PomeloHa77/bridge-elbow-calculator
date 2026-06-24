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
