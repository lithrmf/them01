import { defineStore } from 'pinia'
import { ref } from 'vue'
import { userGetInfoService } from '@/api/user.js'

// 用户模块  token  setToken  removeToken
export const useUserStore = defineStore(
  'user',
  () => {
    const token = ref('')
    const setToken = (newToken) => {
      token.value = newToken
    }
    const removeToken = () => {
      token.value = ''
    }

    const user = ref({})
    // 调用请求接口，获取用户基本信息
    const getUser = async () => {
      const res = await userGetInfoService()
      // console.log(res)
      user.value = res.data.data
    }
    const setUser = (obj) => {
      user.value = obj
    }
    return {
      token,
      setToken,
      removeToken,
      user,
      getUser,
      setUser
    }
  },
  {
    persist: true
  }
)
