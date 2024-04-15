import request from '@/utils/request'

export function getCategory() {
  return request({
    url: '/category/list',
    method: 'get'
  })
}

export function getItemsByTag(paramMap) {
  return request({
    url: '/category/' + paramMap.name,
    method: 'get',
    params: {
      page: paramMap.page,
      size: paramMap.size
    }
  })
}
