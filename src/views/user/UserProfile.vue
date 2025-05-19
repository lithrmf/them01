<script setup>
import PageContainer from '@/components/PageContainer.vue'
import { ref } from 'vue'
import { useUserStore } from '@/stores'
import { userUpdateInfoService } from '@/api/user'
// 表单引用
const formRef = ref()
// 是在使用仓库中数据的初始值（无需响应式），可以直接解构
const {
  user: { email, id, nickname, username },
  getUser
} = useUserStore()

// 表单数据
const formData = ref({
  id,
  username, // 登录名称（示例数据）
  nickname, // 用户昵称
  email // 用户邮箱
})

// 表单校验规则
const formRules = ref({
  nickname: [
    { required: true, message: '请输入用户昵称', trigger: 'blur' },
    {
      pattern: /^\S{2,10}$/,
      message: '长度在2到10个非空字符',
      trigger: 'blur'
    },
    {
      validator: (rule, value, callback) => {
        if (value.trim() === '') {
          callback(new Error('昵称不能仅为空格'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ],
  email: [
    { required: true, message: '请输入邮箱地址', trigger: 'blur' },
    {
      type: 'email',
      message: '请输入正确的邮箱格式',
      trigger: ['blur', 'change']
    }
  ]
})

// 提交表单
const submitForm = () => {
  formRef.value.validate(async (valid) => {
    if (valid) {
      // 校验通过，这里可以执行提交操作
      await userUpdateInfoService(formData.value)
      // 通知 user 模块，进行数据的更新
      getUser()
      ElMessage.success('提交成功！')
      console.log('表单数据：', formData)
    } else {
      // 校验不通过
      ElMessage.warning('请检查表单填写是否正确')
      return false
    }
  })
}
</script>
<template>
  <PageContainer title="基本资料">
    <!-- 表单区域 -->
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      style="max-width: 600px"
    >
      <!-- 第一行：登录名称（禁用） -->
      <el-form-item label="登录名称" prop="username">
        <el-input v-model="formData.username" disabled />
      </el-form-item>

      <!-- 第二行：用户昵称（可输入，需校验） -->
      <el-form-item label="用户昵称" prop="nickname">
        <el-input v-model="formData.nickname" />
      </el-form-item>

      <!-- 第三行：用户邮箱（可输入，需校验） -->
      <el-form-item label="用户邮箱" prop="email">
        <el-input v-model="formData.email" />
      </el-form-item>

      <!-- 第四行：提交按钮 -->
      <el-form-item>
        <el-button type="primary" @click="submitForm">提交修改</el-button>
      </el-form-item>
    </el-form>
  </PageContainer>
</template>
<style scoped></style>
