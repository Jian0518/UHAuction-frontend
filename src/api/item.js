import request from '@/utils/request'
import qs from 'qs'; // Import the 'qs' library for encoding query parameters

export function getList(pageNo, size, tab) {
  const encodedTab = qs.stringify(tab, { encodeValuesOnly: true }); // Encode the 'tab' object
  const params = { pageNo, size, tab: encodedTab }; // Use the encoded 'tab' value

  return request({
    url: '/item/list',
    method: 'get',
    params,
  });
}


export function post(item) {
  return request({
    url: '/item/create',
    method: 'post',
    data: item
  })
}

export function notify(item) {
  return request({
    url: '/item/sendMail',
    method: 'post',
    data: item
  })
}


export function getItem(id) {
  return request({
    url: `/item`,
    method: 'get',
    params: {
      id: id
    }
  })
}

export function deliver(id){
  return request({
    url: `item/deliver`,
    method: `get`,
    params: {
      id: id
    }
  })
}

export function receive(id){
  return request({
    url: `item/receive`,
    method: `get`,
    params: {
      id: id
    }
  })
}

export function getAllItem() {
  return request({
    url: `/item/all`,
    method: 'get',
  })
}

export function getRecommendItems(id) {
  return request({
    url: '/item/recommend',
    method: 'get',
    params: {
      itemId: id
    }
  })
}

export function updateItem(item) {
  return request({
    url: '/item/update',
    method: 'post',
    data: item
  })
}

export function deleteItem(id) {
  return request({
    url: `/item/delete/${id}`,
    method: 'delete'
  })
}


export function setEnd(item) {
  return request({
    url: `item/setEnd`,
    method: `post`,
    data: item
  })
}

export function getTopBidder(){
  return request({
    url:`item/topBidder`,
    method: `get`,
  })
}

export function getTopDonor(){
  return request({
    url:`item/topDonor`,
    method: `get`,
  })
}

export function getFundByMonth(){
  return request({
    url:`item/fundMonth`,
    method: `get`,
  })
}

export function getTrend(){
  return request({
    url: `/item/trend`,
    method: `get`,
  })
}

export function getItemByMonth(){
  return request({
    url: `item/itemMonth`,
    method: `get`,
  })
}