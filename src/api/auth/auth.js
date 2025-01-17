//import the service instance from /utils/request.js
import request from '@/utils/request'


export function userRegister(userDTO) {
  return request({
    url: '/ums/user/register',
    method: 'post',
    data: userDTO
  })
}


export function login(data) {
  return request({
    url: '/ums/user/login',
    method: 'post',
    data
  })
}

export function getUserInfo() {
  return request({
    url: '/ums/user/info',
    method: 'get'
  })
}

export function logout() {
  return request({
    url: '/ums/user/logout'
  })
}