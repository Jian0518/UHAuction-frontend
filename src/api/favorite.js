import request from '@/utils/request'


export function favorite(user_id,item) {
  return request(({
    url: `/favorite/add/${user_id}`,
    method: 'post',
    data: item
  }))
}


export function getFavoriteItem(username, page, size) {
  return request({
    url: '/favorite/list/' + username,
    method: 'get',
    params: {
      pageNo: page,
      size: size
    }
  })
}

export function removeFavorite(userId,itemId){
  return request({
    url: `/favorite/remove/${userId}/${itemId}`,
    method: 'delete'
  })
}