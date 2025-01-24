/**
 * request interceptor
 * sets up an Axios instance for making HTTP requests
 */
import axios from 'axios'
import { Message, MessageBox } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'

// 1.create axios instance 
const service = axios.create({
  // public interface, url = base url + request url
  baseURL: process.env.VUE_APP_SERVER_URL,

  // The timeout unit is ms. A timeout of 5s is set here.
  timeout: 30 * 1000
})

// 2.request interceptor
// modify request configuration before sending the request
service.interceptors.request.use(
  config => {
    // check if a token is available in the application's state
    if (store.getters.token) {
      // adds an authorization header to the request
      // Bearer token: a common way for passing authentication tokens in HTTP requests
      config.headers['Authorization'] = 'Bearer ' + getToken()
    }
    return config
  },
  error => {
    // do something with request error
    // console.log(error) // for debug
    return Promise.reject(error)
  }
)

// when set to true, it allows the browser to include credentials 
// (cookies, HTTP authentication, etc.) in requests to a different domain
// by setting this to false, we prevent unauthorized access to resources on another domain
service.defaults.withCredentials = false


// will be executed whenever a response is received from a request made by this Axios instance
service.interceptors.response.use(

  response => {
    const res = response.data
    // wrong if customize code is not 200
    if (res.code !== 200) {
      // 50008: illegal Token; 50012: Remote login; 50014: Token invalid;
      if (res.code === 401 || res.code === 50012 || res.code === 50014) {
        // Relogin
        MessageBox.confirm('Session invalid, you can stay at current page or login again', 'Permission denied', {
          confirmButtonText: 'Confirm',
          cancelButtonText: 'Cancel',
          type: 'warning',
          center: true
        }).then(() => {
          window.location.href = '#/login'
        })
      } else { // prompt directly for other errors
        Message({
          showClose: true,
          message: '⚠' + res.message || 'Error',
          type: 'error',
          duration: 3 * 1000
        })
      }
      return Promise.reject(new Error(res.message || 'Error'))
    } else {
      return res
    }
  },
  error => {

    // console.log('err' + error) // for debug
    Message({
      showClose: true,
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)
export default service