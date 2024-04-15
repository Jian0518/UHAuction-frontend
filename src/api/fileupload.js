import request from '@/utils/request'

export function uploadFile(filename) {
    return request({
      url: '/file/upload',
      method: 'post',
      data: filename
    })
  }