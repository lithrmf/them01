<script setup>
import PageContainer from '@/components/PageContainer.vue'
import { userUpdatePasswordService } from '@/api/user'
import { useUserStore } from '@/stores'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter() // 引入路由
const formModel = ref({
  old_pwd: '', // 旧密码
  new_pwd: '', // 新密码
  re_pwd: '' // 新密码-确认
})
const userStore = useUserStore() // 引入用户模块
const formRef = ref() // 用于获取表单实例

// 校验规则
const rules = ref({
  old_pwd: [
    { required: true, message: '请输入原始密码', trigger: 'blur' },
    {
      pattern: /^\S{6,15}$/,
      message: '请输入6-15位的非空字符',
      trigger: 'blur'
    }
  ],
  new_pwd: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    {
      pattern: /^\S{6,15}$/,
      message: '请输入6-15位的非空字符',
      trigger: 'blur'
    },
    {
      validator: (rule, value, callback) => {
        if (value === formModel.value.old_pwd) {
          callback(new Error('新密码不能和旧密码一致'))
        } else {
          callback() // 校验成功
        }
      }
    }
  ],
  re_pwd: [
    { required: true, message: '请再次输入新密码', trigger: 'blur' },
    {
      pattern: /^\S{6,15}$/,
      message: '请输入6-15位的非空字符',
      trigger: 'blur'
    },
    {
      validator: (rule, value, callback) => {
        if (value !== formModel.value.new_pwd) {
          callback(new Error('两次输入的密码不一致'))
        } else {
          callback()
        }
      }
    }
  ]
})

// 提交修改
const onClick = async (type) => {
  if (type === '重置') {
    // 重置表单
    formRef.value.resetFields()
  } else {
    // 提交表单
    await formRef.value.validate()
    await userUpdatePasswordService(formModel.value)
    ElMessage.success('更新密码成功！')

    // 密码修改成功后，退出重新登录
    // 清空本地存储的 token 和 个人信息
    userStore.setToken('')
    userStore.setUser({})

    // 拦截到登录页
    router.push('/login')
  }
}
</script>
<template>
  <PageContainer title="重置密码">
    <!-- 让三个输入框对齐 -->

    <el-form
      ref="formRef"
      :rules="rules"
      :model="formModel"
      label-width="100px"
    >
      <el-form-item label="原密码" prop="old_pwd" style="width: 50%">
        <el-input v-model="formModel.old_pwd" show-password />
      </el-form-item>
      <el-form-item label="新密码" prop="new_pwd" style="width: 50%">
        <el-input v-model="formModel.new_pwd" show-password />
      </el-form-item>
      <el-form-item label="确认新密码" prop="re_pwd" style="width: 50%">
        <el-input v-model="formModel.re_pwd" show-password />
      </el-form-item>
      <el-form-item>
        <el-button @click="onClick('修改')" type="primary">修改</el-button>
        <el-button @click="onClick('重置')" type="info">重置</el-button>
      </el-form-item>
    </el-form>
  </PageContainer>
</template>
<style scoped></style>
