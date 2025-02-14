import request from '@/utils/request'

// User Profile 
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

export function getBidPage(username, page, size) {
  return request({
    url: '/ums/user/bid' + username,
    method: 'get',
    params: {
      pageNo: page,
      size: size
    }
  })
}

//User Profile
export function getInfo() {
  return request({
    url: '/ums/user/info',
    method: 'get'
  })
}


export function update(user) {
  return request({
    url: '/ums/user/update',
    method: 'post',
    data: user
  })
}
