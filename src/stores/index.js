// 把所有与pinia(仓库)相关的代码抽离出来
// 实现pinia各模块独立维护，仓库统一导出
import { createPinia } from 'pinia'
import persist from 'pinia-plugin-persistedstate'

const pinia = createPinia()
pinia.use(persist)
export default pinia

// 统一导出
// import { useUserStore } from './modules/user'
// export {useUserStore}
export * from './modules/user' // 作用与上面等价
