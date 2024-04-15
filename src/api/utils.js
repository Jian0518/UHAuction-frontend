import request from '@/utils/request'

export function deleteImage(data) {
    return request({
      url: '/minio/deleteImage',
      data: data,
      method: 'delete'
    })
  }