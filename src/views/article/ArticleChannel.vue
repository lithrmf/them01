<script setup>
import { artGetChannelService, artDelChannelService } from '@/api/article.js'
import { Delete, Edit } from '@element-plus/icons-vue'
import ChannelEdit from '@/components/ChannelEdit.vue'
import PageContainer from '@/components/PageContainer.vue'
import { ref } from 'vue'

const channelList = ref([])
const loading = ref(false)
const dialog = ref() // 用于绑定元素，获取dom对象
// 调用接口获取文章分类
const getChannelList = async () => {
  loading.value = true
  const res = await artGetChannelService()
  channelList.value = res.data.data
  loading.value = false
}
getChannelList()

// 点击删除按钮
const onDelChannel = async (row) => {
  await ElMessageBox.confirm('你确认要删除吗?', '温馨提示', {
    type: 'warning',
    confirmButtonText: '确认',
    cancelButtonText: '取消'
  })
  await artDelChannelService(row.id)
  ElMessage.success('删除成功！')
  getChannelList()
}
// 点击编辑按钮
const onEditChannel = (row) => {
  // 调用子组件内部的方法
  dialog.value.open(row)
}
// 点击添加分类按钮
const onAddChannel = () => {
  // 显示弹层(调用组件内部向外暴露的方法)
  dialog.value.open({})
}
// 编辑/添加成功 => 出现获取文章分类
const onSuccess = () => {
  getChannelList()
}
</script>
<template>
  <PageContainer title="文章分类">
    <template #extra>
      <el-button type="primary" round @click="onAddChannel">添加分类</el-button>
    </template>

    <!-- 表格部分 -->
    <template #default>
      <el-table v-loading="loading" :data="channelList" style="width: 100%">
        <el-table-column
          type="index"
          label="序号"
          width="150"
        ></el-table-column>
        <el-table-column prop="cate_name" label="分类名称"></el-table-column>
        <el-table-column prop="cate_alias" label="分类别名"></el-table-column>
        <el-table-column label="操作" width="100">
          <!-- 自定义表格内容 --使用el-element插槽 -->
          <!-- row就是channelList的一项(一行的内容)    $index 下标 -->
          <template #default="{ row, $index }">
            <el-button
              :icon="Edit"
              circle
              plain
              type="primary"
              @click="onEditChannel(row, $index)"
            >
            </el-button>
            <el-button
              :icon="Delete"
              circle
              plain
              type="danger"
              @click="onDelChannel(row, $index)"
            ></el-button>
          </template>
        </el-table-column>

        <!-- 定制空表格 -->
        <template #empty>
          <el-empty description="空空如也~"></el-empty>
        </template>
      </el-table>
    </template>
  </PageContainer>

  <ChannelEdit ref="dialog" @success="onSuccess"></ChannelEdit>
</template>
<style scoped></style>
