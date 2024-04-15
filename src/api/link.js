import request from '@/utils/request'

// get link
export function getList() {
  return request(({
    url: '/link/all',
    method: 'get'
  }))
}
