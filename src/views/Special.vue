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
