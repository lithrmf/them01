<script setup>
import PageContainer from '@/components/PageContainer.vue'
import { useUserStore } from '@/stores'
import { userUpdateAvatarService } from '@/api/user'
import { Plus, Upload } from '@element-plus/icons-vue'
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
const userStore = useUserStore()
const uploadRef = ref()
// 基于store的数据，初始化imgUrl的初始值
const imgUrl = ref(userStore.user.user_pic)
const onSelectFile = (uploadFile) => {
  // 创建本地预览的地址
  // imgUrl.value = URL.createObjectURL(uploadFile.raw)

  // 基于 FileReader 读取图片做预览 ---图片格式是base64字符串
  const reader = new FileReader()
  reader.readAsDataURL(uploadFile.raw)
  reader.onload = () => {
    imgUrl.value = reader.result
    // console.log(imgUrl.value)
  }
}

// 上传头像
const onSubmit = async () => {
  await userUpdateAvatarService(imgUrl.value)
  ElMessage.success('头像上传成功')
  // 通知 user 模块，进行数据的更新
  userStore.getUser()
}
</script>

<template>
  <PageContainer title="更换头像">
    <el-upload
      ref="uploadRef"
      class="avatar-uploader"
      :show-file-list="false"
      :auto-upload="false"
      :on-change="onSelectFile"
    >
      <img v-if="imgUrl" :src="imgUrl" class="avatar" />
      <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
    </el-upload>
    <!-- 点击与upload元素的点击事件绑定 -->
    <el-button
      @click="uploadRef.$el.querySelector('input').click()"
      type="primary"
      :icon="Plus"
      size="large"
      >选择图片</el-button
    >
    <el-button @click="onSubmit" type="success" :icon="Upload" size="large"
      >上传头像</el-button
    >
  </PageContainer>
</template>
<style lang="scss" scoped>
.avatar-uploader {
  :deep() {
    .avatar {
      width: 200px;
      height: 200px;
      display: block;
    }
    .el-upload {
      border: 1px dashed var(--el-border-color);
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      transition: var(--el-transition-duration-fast);
    }
    .el-upload:hover {
      border-color: var(--el-color-primary);
    }
    .el-icon.avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 200px;
      height: 200px;
      text-align: center;
    }
  }
}
.el-button {
  margin-top: 20px;
}
</style>
