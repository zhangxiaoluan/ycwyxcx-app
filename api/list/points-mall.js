import { sendRequest } from '../request'

// ·ÖFÁ{¥ã
export function getCategories() {
  const json = {
    url: '/app/points/mall/categories',
    method: 'get'
  }
  return sendRequest(json)
}

// ·ÖFÁh¥ã
export function getProducts(params) {
  const json = {
    url: '/app/points/mall/products',
    method: 'get',
    data: params
  }
  return sendRequest(json)
}

// QbFÁ
export function exchangeProduct(params) {
  const json = {
    url: '/app/points/mall/exchange',
    method: 'post',
    data: params
  }
  return sendRequest(json)
}

// ·ÖQb°U
export function getExchangeRecords(params) {
  const json = {
    url: '/app/points/mall/exchange/records',
    method: 'get',
    data: params
  }
  return sendRequest(json)
}