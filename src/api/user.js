import request from '@/utils/request.js'

// 注册请求
export const userRegisterService = ({ username, password, repassword }) => {
  return request.post('/api/reg', { username, password, repassword })
}

// 登录请求
export const userLoginService = ({ username, password }) => {
  return request.post('/api/login', { username, password })
}

// 获取用户基本信息
export const userGetInfoService = () => {
  return request.get('/my/userinfo')
}

// 更新用户基本信息
export const userUpdateInfoService = (data) => {
  return request.put('/my/userinfo', data)
}

// 更新用户头像
export const userUpdateAvatarService = (avatar) => {
  return request.patch('/my/update/avatar', { avatar })
}

// 更新用户密码
export const userUpdatePasswordService = (data) => {
  return request.patch('/my/updatepwd', data)
}
