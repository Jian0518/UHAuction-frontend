import request from '@/utils/request'

// user main page
export function getInfoByName(username, page, size) {
  return request({
    url: '/ums/user/' + username,
    method: 'get',
    params: {
      pageNo: page,
      size: size
    }
  })
}

export function getInfo() {
  return request({
    url: '/ums/user/info',
    method: 'get'
  })
}

export function topup(userId,amount) {
  return request({
    url: '/ums/user/topup',
    method: 'get',
    params:{
      userId: userId, 
      amount: amount 
    } 
  })
}

export function getUserName(userid) {
  return request({
    url: '/ums/user/username',
    method: 'get',
    params: {
      userid: userid
    }
  })
}

export function update(user) {
  return request({
    url: '/ums/user/update',
    method: 'post',
    data: user
  })
}



