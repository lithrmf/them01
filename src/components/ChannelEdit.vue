<script setup>
import { ref } from 'vue'
import { artEditChannelService, artAddChannelService } from '@/api/article'
// 控制弹层的显示与隐藏
const dialogVisible = ref(false)
const formRef = ref()
// 表单数据对象
const formModel = ref({
  cate_name: '',
  cate_alias: ''
})
// 表单规则对象
const rules = {
  cate_name: [
    { required: true, message: '请输入分类名称', trigger: 'blur' },
    {
      pattern: /^\S{1,10}$/,
      message: '分类名必须是 1-10位 的非空字符',
      trigger: 'blur'
    }
  ],
  cate_alias: [
    { required: true, message: '请输入分类别名', trigger: 'blur' },
    {
      pattern: /^[a-zA-Z0-9]{1,15}$/,
      message: '分类别名必须是 1-15位 的字母或数字',
      trigger: 'blur'
    }
  ]
}

const emit = defineEmits(['success'])
// 点击确认
const onSubmit = async () => {
  // 表单的整体校验
  await formRef.value.validate()
  // 判断是添加分类还是编辑分类的标识
  const isEdit = formModel.value.id
  if (isEdit) {
    await artEditChannelService(formModel.value)
    ElMessage.success('编辑成功！')
  } else {
    await artAddChannelService(formModel.value)
    ElMessage.success('添加成功！')
  }
  dialogVisible.value = false
  // 通知父组件更新表格内容
  emit('success')
}

// 组件对外暴露一个方法 open,基于open传来的参数，区分添加还是编辑
// open({})  => 表单无需渲染，说明是添加
// open({id,cate_name,...})  => 表单需要渲染，说明是编辑
// open调用后，显示弹层
const open = (row) => {
  console.log(row)
  dialogVisible.value = true
  // 回显表单内容
  formModel.value = { ...row } // 添加 => 重置了表单内容，编辑 =>存储了需要回显的数据
}
// 向外暴露
defineExpose({
  open
})
</script>
<template>
  <!-- 弹层 -->
  <el-dialog
    v-model="dialogVisible"
    :title="formModel.id ? '编辑分类' : '添加分类'"
    width="500"
  >
    <!-- 表单 -->
    <el-form
      ref="formRef"
      :model="formModel"
      :rules="rules"
      label-width="100px"
      style="padding-right: 30px"
    >
      <el-form-item label="分类名称" prop="cate_name">
        <el-input
          v-model="formModel.cate_name"
          placeholder="请输入分类名称"
        ></el-input>
      </el-form-item>
      <el-form-item label="分类别名" prop="cate_alias">
        <el-input
          v-model="formModel.cate_alias"
          placeholder="请输入分类别名"
        ></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="onSubmit"> 确认 </el-button>
      </div>
    </template>
  </el-dialog>
</template>
<style scoped></style>
