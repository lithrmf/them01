<script setup>
import { artGetChannelService } from '@/api/article.js'
import { ref } from 'vue'
const channelList = ref([])
// 获取文章分类列表
const getChannelList = async () => {
  const res = await artGetChannelService()
  // console.log(res)
  channelList.value = res.data.data
}
getChannelList()

// 接收父组件传来的选择的id
defineProps({
  modelValue: {
    type: [Number, String]
  }
})
const emit = defineEmits(['update:modelValue'])
</script>
<template>
  <div>
    <!-- label 展示给用户看的，value 收集起来提交给后台的 -->
    <!-- Vue2: v-moedl => :value + @input -->
    <!-- Vue3: v-model => :modelValue + @update:modelValue -->
    <el-select
      :modelValue="modelValue"
      @update:modelValue="emit('update:modelValue', $event)"
      style="width: 100%"
    >
      <el-option
        v-for="item in channelList"
        :key="item.id"
        :label="item.cate_name"
        :value="item.id"
      />
    </el-select>
  </div>
</template>
<style scoped></style>
