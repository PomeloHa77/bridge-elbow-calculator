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
