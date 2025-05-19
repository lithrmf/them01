<script setup>
import { ref } from 'vue'
import PageContainer from '@/components/PageContainer.vue'
import ChannelSelect from '@/components/ChannelSelect.vue'
import ArticleEdit from '@/components/ArticleEdit.vue'
import { Delete, Edit } from '@element-plus/icons-vue'
import { artGetListService } from '@/api/article'
import { formatTime } from '@/utils/format.js'
const articleList = ref([]) // 文章列表
const total = ref(0) // 文章总条数
const loading = ref(false)
// 定义请求参数对象
const params = ref({
  pagenum: 1, // 当前页
  pagesize: 3, // 当前生效的每页条数
  cate_id: '',
  state: ''
})

// 调用接口获取文章列表
const getList = async () => {
  loading.value = true
  const res = await artGetListService(params.value)
  // console.log(res)
  articleList.value = res.data.data
  total.value = res.data.total
  loading.value = false
}
getList()

// 处理分页逻辑 ---参数就是选择的当前每页条数、当前页
const onSizeChange = (size) => {
  // console.log('当前每页条数', size)
  // 只要是每页条数变化了，那么原本正在访问的当前页意义不大了，数据大概率不在原来那一页了
  // 重新从第一页渲染即可
  params.value.pagenum = 1
  params.value.pagesize = size
  getList()
}
const onCurrentChange = (page) => {
  // console.log('当前页数', page)
  // 更新当前页
  params.value.pagenum = page
  // 基于最新的当前页，重新渲染数据
  getList()
}

// 分类搜索逻辑 => 按照最新的条件，重新检索，从第一页开始展示
// params中的state和id已经和输入框的选项双向绑定好了，传给服务器的参数是基于选项的
const onSearch = () => {
  params.value.pagenum = 1
  getList()
}

// 重置搜索逻辑 =>state和cate_id置为空字符串，从第一页开始重新渲染
const onReset = () => {
  params.value.state = ''
  params.value.cate_id = ''
  params.value.pagenum = 1 // 重置页面 1
  getList()
}

// 获取抽屉组件dom对象
const drawerRef = ref()
// 添加文章
const onAddArticle = () => {
  // 调用抽屉组件内部向外暴露的方法
  // 我们添加时虽然没有重新渲染表格，但是每一次点击页数或选择条数都会重新渲染一次
  drawerRef.value.open({})
}

// 编辑文章
const onEditArticle = (row) => {
  drawerRef.value.open(row)
}

//添加 / 编辑 成功的回调函数
const onSuccess = (type) => {
  if (type === 'add') {
    // 如果是添加，最好渲染最后一页
    const lastpage = Math.ceil((total.value + 1) / params.value.pagesize)
    // 更新成最大页码数，再渲染
    params.value.pagenum = lastpage
  }
  // 如果是编辑，直接渲染
  getList()
}

// 删除文章
const onDelArticle = (row) => {
  console.log(row)
}
</script>
<template>
  <PageContainer title="文章管理">
    <template #extra>
      <el-button type="primary" round @click="onAddArticle">添加文章</el-button>
    </template>

    <!-- 表单区域 -->
    <!-- inline 让表单元素在一行显示 -->
    <el-form inline>
      <el-form-item label="文章分类：">
        <!-- Vue2: v-moedl => :value + @input -->
        <!-- Vue3: v-model => :modelValue + @update:modelValue -->
        <ChannelSelect
          v-model="params.cate_id"
          style="width: 200px"
        ></ChannelSelect>
      </el-form-item>
      <el-form-item label="发布状态：">
        <!-- 这里后台标记发布状态，就是通过中文标记的，已发布 / 草稿 -->
        <el-select style="width: 200px" v-model="params.state">
          <el-option label="已发布" value="已发布"></el-option>
          <el-option label="草稿" value="草稿"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSearch">搜索</el-button>
        <el-button @click="onReset">重置</el-button>
      </el-form-item>
    </el-form>

    <!-- 表格区域 -->
    <el-table v-loading="loading" :data="articleList" style="width: 100%">
      <el-table-column label="文章标题" prop="title">
        <!-- 链接  使用作用域插槽拿到一行的数据对象，去填充自定义的数据 -->
        <template #default="{ row }">
          <el-link type="primary" underline="false">{{ row.title }}</el-link>
        </template>
      </el-table-column>
      <el-table-column label="分类" prop="cate_name"></el-table-column>
      <el-table-column label="发表时间" prop="pub_date">
        <template #default="{ row }">
          <!-- 格式化时间 -->
          {{ formatTime(row.pub_date) }}
        </template>
      </el-table-column>
      <el-table-column label="状态" prop="state"></el-table-column>
      <el-table-column label="操作">
        <!-- 利用作用域插槽 row 可以获取当前行的数据 => 就相当于v-for遍历时的每一项item -->
        <template #default="{ row }">
          <el-button
            size="small"
            type="primary"
            circle
            plain
            :icon="Edit"
            @click="onEditArticle(row)"
          ></el-button>
          <el-button
            size="small"
            type="danger"
            circle
            plain
            :icon="Delete"
            @click="onDelArticle(row)"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页区域 -->
    <el-pagination
      v-model:current-page="params.pagenum"
      v-model:page-size="params.pagesize"
      :page-sizes="[2, 3, 5, 10]"
      :background="background"
      layout="jumper,total, sizes, prev, pager, next "
      :total="total"
      @size-change="onSizeChange"
      @current-change="onCurrentChange"
      style="margin-top: 20px; justify-content: flex-end"
    />

    <!-- 抽屉组件 -->
    <ArticleEdit ref="drawerRef" @success="onSuccess"></ArticleEdit>
  </PageContainer>
</template>
<style scoped></style>
