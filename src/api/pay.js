import request from '@/utils/request'

export function postPay(pay) {
    return request({
      url: '/item/pay/add',
      method: 'post',
      data: pay
    })
  }
  
  
  export function paySuccess(sessionId,itemId) {
    return request({
      url: '/item/pay/success',
      method: 'get',
      params: {
        sessionId: sessionId,
        itemId: itemId
      }
    })
  }

  export function topupSuccess(amount,userId) {
    return request({
      url: '/ums/user/topup/success',
      method: 'get',
      params: {
        amount: amount,
        userId: userId
      }
    }
    )
  }
