import axios from 'axios'
import { useUserStore } from '@/stores'
import { ElMessage } from 'element-plus'
import router from '@/router'

const baseURL = 'http://big-event-vue-api-t.itheima.net'

// 创建axios实例
const request = axios.create({
  // 1.基地址、超时时间
  baseURL,
  timeout: 10000
})
// 添加请求拦截器
request.interceptors.request.use(
  function (config) {
    // 2.携带token
    const usetore = useUserStore()
    // 判断token是否存在
    if (usetore.token) {
      // 设置对应的请求头（查看接口文档）
      config.headers.Authorization = usetore.token
    }
    return config
  },
  function (error) {
    return Promise.reject(error)
  }
)

// 添加响应拦截器
request.interceptors.response.use(
  function (response) {
    // 4.摘取核心响应数据
    if (response.data.code === 0) {
      return response
    }
    // 3.处理业务失败,给错误提示，抛出错误
    ElMessage.error(response.data.message || '服务器异常')
    return Promise.reject(response.data)
  },
  function (error) {
    // 5.处理401错误
    // 错误的特殊情况 => 401 权限不足 或 token 过期 => 拦截到登录页
    if (error.response?.status === 401) {
      router.push('/login')
    }

    // 错误的默认情况 => 只要给提示
    ElMessage.error(error.message || '服务器异常')
    return Promise.reject(error)
  }
)

// 默认导出和按需导出是互不冲突的，需要哪个就按对应导入方法导入
export default request
export { baseURL }
