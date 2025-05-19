import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/index.js'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/', // 首页架子
      component: () => import('@/views/layout/LayoutContainer.vue'),
      redirect: '/article/manage',
      children: [
        {
          path: '/article/manage',
          component: () => import('@/views/article/ArticleManage.vue')
        },
        {
          path: '/article/channel',
          component: () => import('@/views/article/ArticleChannel.vue')
        },
        {
          path: '/user/profile',
          component: () => import('@/views/user/UserProfile.vue')
        },
        {
          path: '/user/avatar',
          component: () => import('@/views/user/UserAvatar.vue')
        },
        {
          path: '/user/password',
          component: () => import('@/views/user/UserPassword.vue')
        }
      ]
    },
    { path: '/login', component: () => import('@/views/login/LoginPage.vue') } // 登录页
  ]
})

// 登录访问拦截 => 默认是直接放行 router.beforeEach((to,from)=>{})
// 根据返回值决定,是放行还是拦截
// 返回值:
// 1.undefined / true  直接放行
// 2.false 拦回from的地址页面
// 3.具体路径 或 路径对象  拦截到对应的地址
//    '/login'        {name:'login'}
router.beforeEach((to) => {
  const userStore = useUserStore()
  // 如果没有token权限且访问的是非登录页 => 拦截到登录页
  if (!userStore.token && to.path !== '/login') {
    return '/login'
  }
})

export default router
