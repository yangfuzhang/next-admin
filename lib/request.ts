import axios from 'axios'
import {
  getClientAuthToken,
  getClientRefreshToken,
  removeClientAuthToken,
  removeClientRefreshToken,
  setClientAuthToken,
  setClientRefreshToken
} from '@/lib/client'
import { setUser } from '@/store/app'
import { clearCookie } from '@/lib/utils'
import { API_PREFIX, AUTH_SUCCESS } from '@/lib/constants'
import { AdminRoutesEnum } from '@/types/enums'

function request(options: Record<string, any>) {
  const instance = axios.create({
    baseURL: `${process.env.NEXT_PUBLIC_API_URL}${API_PREFIX}`,
    timeout: 5000
  })

  // 请求拦截器
  instance.interceptors.request.use(config => {
    const token = getClientAuthToken()

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    if (options.headers) {
      config.headers = {
        ...config.headers,
        ...options.headers
      }
    }

    return config
  }, err => {
    console.log(err)
  })

  // 响应拦截器
  instance.interceptors.response.use(response => {
    return response
  }, async (err) => {
    // 请求服务器失败，err: {code: 'ERR_NETWORK', message: 'Network Error'}
    if (!err.response) {
      return Promise.reject({
        code: 500,
        message: "服务器状态异常，请尝试刷新页面"
      })
    }

    if (err.response && err.response.status === 401 && window.location.pathname !== AdminRoutesEnum.LOGIN) {
      // 刷新token
      try {
        const res = await refreshToken()

        if (res.status === 200) {
          setClientAuthToken(res.data.token)
          setClientRefreshToken(res.data.refresh_token)
          return instance(err.config)
        } else {
          return clearAndRedirect()
        }
      } catch (err) {
        return clearAndRedirect()
      }      
    }

    return Promise.reject({
      code: err.response.status,
      message: err.response.data.message
    })
  })

  return new Promise((resolve, reject) => {
    instance(options).then(res => {
      resolve(res.data)
    }).catch(err => {
      reject(err)
    })
  })
}

async function refreshToken() {
  const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`, {
    params: {
      refreshToken: getClientRefreshToken()
    },
    headers: {
      'Content-Type': 'application/json'
    }
  })

  return res
}

async function clearAndRedirect() {
  setUser(null)
  removeClientAuthToken()
  removeClientRefreshToken()
  clearCookie(AUTH_SUCCESS)

  if (window.location.pathname !== AdminRoutesEnum.LOGIN) {
    window.location.href = AdminRoutesEnum.LOGIN
    return Promise.reject({
      code: 401,
      message: '登录过期，请重新登录',
    })
  }
}

const get = (url: string, params?: Record<string, any>, headers?: Record<string, any>): Promise<any> => {
  const searchParams = new URLSearchParams()

  if (params) {
    Object.keys(params).forEach(key => {
      searchParams.append(key, JSON.stringify(params[key]))
    })
  }

  return request({
    method: 'GET',
    url: params ? `${url}?${searchParams}` : url,
    headers,
  })
}

const post = (url: string, data: Record<string, any>, headers?: Record<string, any>): Promise<any> => {
  return request({
    method: 'POST',
    url,
    data,
    headers,
  })
}

const patch = (url: string, data: Record<string, any>, headers?: Record<string, any>): Promise<any> => {
  return request({
    method: 'PATCH',
    url,
    data,
    headers,
  })
}

const del = (url: string, data?: Record<string, any>, headers?: Record<string, any>): Promise<any> => {
  return request({
    method: 'DELETE',
    url,
    data,
    headers,
  })
}

export {
  request,
  get,
  post,
  patch,
  del,
}