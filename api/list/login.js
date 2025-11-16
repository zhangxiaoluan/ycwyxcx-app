import { sendRequest, sendUpload } from '../request'

// 登录
export function Login(params) {
  const json = {
    url: '/app/auth/wechat/login',
    method: 'post',
    data: params
  }
  return sendRequest(json)
}

// 登出
export function authLogin() {
  const json = {
    url: '/app/auth/logout',
    method: 'post'
  }
  return sendRequest(json)
}

// 修改登录密码
export function setPassword(params) {
  const json = {
    url: '/app/auth/change/password',
    method: 'post',
    data: params
  }
  return sendRequest(json)
}

// 查询当前登录用户信息
export function userMe() {
  const json = {
    url: '/app/system/user/me',
    method: 'get'
  }
  return sendRequest(json)
}

// 修改用户信息
export function setUser(params) {
  const json = {
    url: '/app/system/user/',
    method: 'put',
    data: params
  }
  return sendRequest(json)
}

// 对接电信单点登录
export function loginWithoutPwd(params) {
  const json = {
    url: '/app/auth/loginWithoutPwd',
    method: 'get',
    data: params
  }
  return sendRequest(json)
}

