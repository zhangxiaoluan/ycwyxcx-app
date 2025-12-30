import { sendRequest } from '../request'

//
export function getCategories() {
  const json = {
    url: '/app/points/mall/categories',
    method: 'get'
  }
  return sendRequest(json)
}


export function getProducts(params) {
  const json = {
    url: '/app/points/mall/products',
    method: 'get',
    data: params
  }
  return sendRequest(json)
}


export function exchangeProduct(params) {
  const json = {
    url: '/app/points/mall/exchange',
    method: 'post',
    data: params
  }
  return sendRequest(json)
}


export function getExchangeRecords(params) {
  const json = {
    url: '/app/points/mall/exchange/records',
    method: 'get',
    data: params
  }
  return sendRequest(json)
}
