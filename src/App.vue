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
