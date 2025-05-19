<script setup>
defineProps({
  title: {
    required: true,
    type: String
  }
})
</script>
<script setup></script>
<template>
  <el-card class="page-container">
    <template #header>
      <div class="header">
        <span>{{ title }}</span>
        <div class="extra">
          <slot name="extra"></slot>
        </div>
      </div>
    </template>

    <!-- 内容部分 -->
    <slot></slot>
  </el-card>
</template>
<style lang="scss" scoped>
.page-container {
  min-height: 100%;
  box-sizing: border-box;
  .header {
    display: flex;
    justify-content: space-between;
    align-content: center;
  }
}
</style>
