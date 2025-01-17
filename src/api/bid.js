import request from '@/utils/request'

export function fetchBidsByItemId(item_Id) {
  return request({
    url: '/bid/get_bids',
    method: 'get',
    params: {
      itemid: item_Id
    }
  })
}

export function getBidder(item_Id) {
  return request({
    url: '/bid/bidders',
    method: 'get',
    params: {
      itemid: item_Id
    }
  })
}

export function pushBid(data) {
  return request({
    url: '/bid/add_bid',
    method: 'post',
    data: data
  })
}

export function updateBid(data) {
  return request({
    url: '/bid/update_bid',
    method: 'post',
    data: data
  })
}

export function getAllBid(){
  return request({
    url: '/bid/all',
    method: 'get',
  })
}

export function getAvgBid(){
  return request({
    url: '/bid/avgBid',
    method: 'get',
  })
}