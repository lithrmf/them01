import request from '@/utils/request.js'

// 分类： 获取文章分类
export const artGetChannelService = () => {
  return request.get('/my/cate/list')
}
// 分类： 添加文章分类
export const artAddChannelService = (data) => {
  return request.post('/my/cate/add', data)
}
// 分类： 编辑文章分类
export const artEditChannelService = (data) => {
  return request.put('/my/cate/info', data)
}
// 分类： 删除文章分类
export const artDelChannelService = (id) => {
  return request.delete('/my/cate/del', {
    params: { id }
  })
}

// 文章：获取文章列表
export const artGetListService = (params) => {
  return request.get('/my/article/list', {
    params
  })
}
// 文章：发布文章
// 注意：data需要是一个formData对象
export const artPublishService = (data) => {
  return request.post('/my/article/add', data)
}
// 文章：获取文章详情
export const artGetProService = (id) => {
  return request.get('/my/article/info', {
    params: {
      id
    }
  })
}
// 文章：更新文章详情
export const artSubmitService = (data) => {
  return request.put('/my/article/info', data)
}
