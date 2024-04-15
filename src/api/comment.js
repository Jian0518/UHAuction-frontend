import request from '@/utils/request'

export function fetchCommentsByItemId(item_Id) {
  return request({
    url: '/comment/get_comments',
    method: 'get',
    params: {
      itemid: item_Id
    }
  })
}

export function pushComment(data) {
  return request({
    url: '/comment/add_comment',
    method: 'post',
    data: data
  })
}

