<script setup>
import ChannelSelect from './ChannelSelect.vue'
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import { Plus } from '@element-plus/icons-vue'
import { ref } from 'vue'
import {
  artPublishService,
  artGetProService,
  artSubmitService
} from '@/api/article'
import { baseURL } from '@/utils/request.js'
import axios from 'axios'
// 控制抽屉的显示与隐藏
const visibleDrawer = ref(false)
// 默认数据
const defaultForm = ref({
  title: '', // 标题
  cate_id: '', // 分类id
  cover_img: '', // 封面图片：file对象
  content: '', // string 内容
  state: '' // 状态
})
// 准备数据
const formModel = ref({
  title: '', // 标题
  cate_id: '', // 分类id
  cover_img: '', // 封面图片：file对象
  content: '', // string 内容
  state: '' // 状态
})
// 图片上传相关
const imageUrl = ref('')
// 监听文件变化on-change事件:第一个参数是选择的文件相关信息
const onSelectFile = (uploadFile) => {
  // 创建本地预览的地址
  imageUrl.value = URL.createObjectURL(uploadFile.raw)
  // 存储到表单对象
  formModel.value.cover_img = uploadFile.raw
}

// 提交表单
const editorRef = ref() // 用于获取富文本编辑器对象
const emit = defineEmits(['success'])
// 组件对外暴露一个方法 open,基于open传来的参数，区分添加还是编辑
// open({})  => 表单无需渲染，说明是添加
// open({id,...})  => 表单需要渲染，说明是编辑
// open调用后，显示弹层
const open = async (row) => {
  visibleDrawer.value = true // 显示抽屉
  // console.log(row)

  if (row.id) {
    // 编辑文章
    // --需要基于 row.id 发送请求，获取编辑对应的详情数据，进行回显
    const res = await artGetProService(row.id)
    formModel.value = res.data.data
    // 图片需要单独处理回显
    imageUrl.value = baseURL + formModel.value.cover_img

    // 注意：提交给后台，需要的数据格式，是file对象
    // 需要将网络图片地址 => 转换成 => file对象
    const file = await imageUrlToFile(imageUrl.value, formModel.value.cover_img)
    formModel.value.cover_img = file
  } else {
    // 添加文章
    // --重置表单内容
    formModel.value = { ...defaultForm }
    // 上面重置了表单内容，但是图片上传地址和富文本编辑器的内容 => 需要手动重置
    imageUrl.value = ''
    if (editorRef.value) {
      editorRef.value.setHTML('')
    }
  }
}

const onPublish = async (state) => {
  // 将选择的状态保存起来：已发布 / 草稿
  formModel.value.state = state
  // 注意：当前接口，需要的是 formData 对象
  // 将普通对象 => 转换成 => formData对象
  const fd = new FormData()
  for (let key in formModel.value) {
    fd.append(key, formModel.value[key])
  }

  // 发请求
  // 我们添加时虽然没有重新渲染表格，但是每一次点击页数或选择条数都会重新渲染一次
  if (formModel.value.id) {
    // 编辑文章
    const res = await artSubmitService(fd)
    console.log(res)
    ElMessage.success('修改成功！')
    visibleDrawer.value = false
    emit('success', 'edit')
  } else {
    // 发布文章
    await artPublishService(fd)
    ElMessage.success('添加成功！')
    visibleDrawer.value = false
    // 通知父组件添加成功
    emit('success', 'add')
  }
}

async function imageUrlToFile(url, fileName) {
  try {
    // 第一步：使用axios获取网络图片数据
    const response = await axios.get(url, { responseType: 'arraybuffer' })
    const imageData = response.data

    // 第二步：将图片数据转换为Blob对象
    const blob = new Blob([imageData], {
      type: response.headers['content-type']
    })

    // 第三步：创建一个新的File对象
    const file = new File([blob], fileName, { type: blob.type })

    return file
  } catch (error) {
    console.error('将图片转换为File对象时发生错误:', error)
    throw error
  }
}

// 向外暴露
defineExpose({
  open
})
</script>
<template>
  <!-- 抽屉 -->
  <!-- :title="formModel.cate_id ? '编辑文章' : '添加文章'" -->
  <el-drawer
    v-model="visibleDrawer"
    :title="formModel.cate_id ? '编辑文章' : '添加文章'"
    size="47%"
  >
    <!-- 表单内容 -->
    <el-form label-width="100px" :model="formModel">
      <el-form-item label="文章标题" prop="title">
        <el-input placeholder="请输入标题" v-model="formModel.title"></el-input>
      </el-form-item>

      <el-form-item label="文章分类" prop="cate_id">
        <ChannelSelect
          v-model="formModel.cate_id"
          style="width: 100%"
        ></ChannelSelect>
      </el-form-item>

      <el-form-item label="文章封面" prop="cover_img">
        <!-- 此处需要关闭 element-plus 的自动上传，不需要配置 action 等参数 -->
        <!-- 只需要做前端的本地预览图片即可，无需再提交前上传图标(关闭自动上传) -->
        <!-- 语法：URL.createObjectURL(...) 创建本地预览的地址，来预览 -->
        <el-upload
          class="avatar-uploader"
          :show-file-list="false"
          :auto-upload="false"
          :on-change="onSelectFile"
        >
          <img v-if="imageUrl" :src="imageUrl" class="avatar" />
          <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
        </el-upload>
      </el-form-item>

      <el-form-item label="文章内容" prop="content">
        <!-- 富文本编辑器 -->
        <div class="editor">
          <quill-editor
            ref="editorRef"
            v-model:content="formModel.content"
            content-type="html"
            theme="snow"
          />
        </div>
      </el-form-item>

      <el-form-item>
        <el-button @click="onPublish('已发布')" type="primary">发布</el-button>
        <el-button @click="onPublish('草稿')" type="info">草稿</el-button>
      </el-form-item>
    </el-form>
  </el-drawer>
</template>

<style lang="scss" scoped>
.avatar-uploader {
  :deep() {
    .avatar {
      width: 178px;
      height: 178px;
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
      width: 178px;
      height: 178px;
      text-align: center;
    }
  }
}
.editor {
  width: 100%;
  :deep(.ql-editor) {
    min-height: 200px;
  }
}
</style>
