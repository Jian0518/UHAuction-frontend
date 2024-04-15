import request from '@/utils/request'

export function getFund() {
    return request({
      url: `/item/fund/all`,
      method: 'get',
    })
  }