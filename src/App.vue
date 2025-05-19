<script setup>
// 导入中文包
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
</script>
<template>
  <!-- 全局组件切换为中文 -->
  <el-config-provider :locale="zhCn">
    <router-view></router-view>
  </el-config-provider>
</template>
<style scoped></style>
