import request from '@/utils/request'


export function follow(id) {
  return request(({
    url: `/relationship/subscribe/${id}`,
    method: 'get'
  }))
}


export function unFollow(id) {
  return request(({
    url: `/relationship/unsubscribe/${id}`,
    method: 'get'
  }))
}

// validate if follow 
export function hasFollow(itemUserId) {
  return request(({
    url: `/relationship/validate/${itemUserId}`,
    method: 'get'
  }))
}
